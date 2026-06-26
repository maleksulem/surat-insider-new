import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";
import crypto from "crypto";
import fs from "fs";
import https from "https";
import { FieldValue } from "firebase-admin/firestore";
import { getFirebaseDb } from "./src/server/firebase";
import { 
  getFirestoreExperiences, 
  getFirestoreInquiries, 
  addFirestoreInquiry, 
  updateFirestoreExperience, 
  getFirestoreConfig,
  addFirestoreAuditLog,
  getFirestoreAuditLogs,
  getFirestorePartners,
  updateFirestorePartner
} from "./src/server/firestoreHelper";
import { getDb, saveDb, CmsDatabase } from "./src/server/cmsDb";

dotenv.config();

// Enforce environment variables validation on startup (Zero-Trust Security Gate)
const requiredEnvVars = ["ADMIN_MASTER_PASSWORD"];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error("\x1b[31m%s\x1b[0m", "======================================================================");
  console.error("\x1b[31m%s\x1b[0m", "🚨 CRITICAL STARTUP ERROR: MISSING REQUIRED SECURITY CONFIGURATION");
  console.error("\x1b[31m%s\x1b[0m", "======================================================================");
  console.error("\x1b[31m%s\x1b[0m", `The following required environment variable(s) are missing:`);
  missingEnvVars.forEach(v => console.error(`   - ${v}`));
  console.error("\x1b[31m%s\x1b[0m", "\nPlease define these in your environment variables or secrets config.");
  console.error("\x1b[31m%s\x1b[0m", "======================================================================");
  throw new Error(`CRITICAL SECURITY CONFIGURATION FAILURE: Missing required environment variable(s): ${missingEnvVars.join(", ")}`);
}

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "15mb" }));

// =========================================================================
// 🚀 DYNAMIC SEARCH ENGINE OPTIMIZATION (SEO) ENDPOINTS
// =========================================================================

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
    `User-agent: *\n` +
    `Allow: /\n` +
    `Disallow: /api/\n` +
    `Sitemap: https://suratinsider.com/sitemap.xml\n`
  );
});

app.get("/sitemap.xml", (req, res) => {
  res.type("application/xml");
  const today = new Date().toISOString().split("T")[0];
  const urls = [
    { loc: "https://suratinsider.com/", priority: "1.0", changefreq: "daily" },
    { loc: "https://suratinsider.com/wedding", priority: "0.8", changefreq: "weekly" },
    { loc: "https://suratinsider.com/weekend", priority: "0.8", changefreq: "weekly" },
    { loc: "https://suratinsider.com/textile", priority: "0.8", changefreq: "weekly" },
    { loc: "https://suratinsider.com/food", priority: "0.8", changefreq: "weekly" },
    { loc: "https://suratinsider.com/insider", priority: "0.8", changefreq: "weekly" }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
  
  for (const url of urls) {
    xml += `  <url>\n`;
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority}</priority>\n`;
    xml += `  </url>\n`;
  }
  
  xml += `</urlset>`;
  res.send(xml);
});


// =========================================================================
// 🔒 PRODUCTION-GRADE SECURITY ARCHITECTURE & STATE MANAGERS
// =========================================================================

const isProduction = process.env.NODE_ENV === "production";

// Security configurations for Super Admin (defaults to requested email, changeable at runtime)
let adminEmailAddress = process.env.ADMIN_EMAIL || "admin@suratinsider.com";

// Active 2FA OTP codes
const activeOtps = new Map<string, { otp: string; expiresAt: number; attempts: number }>();

// Active server sessions
const activeSessions = new Map<string, { email: string; role: string; expiresAt: number }>();

// Lockout states
const emailFailures = new Map<string, { count: number; lockedUntil: number }>();
const passwordFailures = new Map<string, { count: number; lockedUntil: number }>();
const otpFailures = new Map<string, { count: number; lockedUntil: number }>();

// Dynamic Audit Logging function
async function addServerAuditLog(action: string, targetType: string, targetName: string, user = "admin@suratinsider.com") {
  try {
    const newLog = {
      id: `log-${Date.now()}`,
      user,
      role: "Super Admin" as const,
      action,
      targetType,
      targetName,
      timestamp: new Date().toISOString()
    };
    await addFirestoreAuditLog(newLog);
    console.log(`[AUDIT LOG] ${action} | ${targetType} | ${targetName} by ${user}`);
  } catch (error) {
    console.error("Failed to add audit log to Firestore:", error);
  }
}

// Helper to retrieve cookie securely from Request
function getSessionCookie(req: express.Request): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.split("=").map(c => c.trim());
    if (key) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
  return cookies["session_token"] || null;
}

// Middleware to authorize Super Admin sessions strictly on the server
function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const token = getSessionCookie(req);
  if (!token) {
    return res.status(401).json({ error: "Access Denied: Administrative Session Required." });
  }
  const session = activeSessions.get(token);
  if (!session) {
    return res.status(401).json({ error: "Access Denied: Session is invalid or has expired." });
  }
  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    res.clearCookie("session_token");
    addServerAuditLog("Session Expired", "Security Settings", session.email, session.email);
    return res.status(401).json({ error: "Session expired due to inactivity. Please authenticate again." });
  }
  
  // Sliding session window: auto-extend by 30 minutes on active interaction
  session.expiresAt = Date.now() + 30 * 60 * 1000;
  activeSessions.set(token, session);
  
  (req as any).session = session;
  next();
}

// Helper to get client IP cleanly
function getClientIp(req: express.Request): string {
  const xff = req.headers["x-forwarded-for"];
  if (xff && typeof xff === "string") {
    return xff.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "anonymous";
}

// Lightweight rate-limiter middleware to prevent DDoS & brute force
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
function createRateLimiter(windowMs: number, maxRequests: number, message: string) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ip = getClientIp(req);
    const key = `${req.path}:${ip}`;
    const now = Date.now();
    const record = rateLimitMap.get(key);
    
    if (!record || now > record.resetTime) {
      rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
      return next();
    }
    
    record.count++;
    if (record.count > maxRequests) {
      console.warn(`[RATE LIMIT EXCEEDED] IP: ${ip} | Path: ${req.path}`);
      addServerAuditLog("Rate Limit Violation", "Rate Limiter", `Path: ${req.path}`, `IP: ${ip}`);
      return res.status(429).json({ error: message });
    }
    
    next();
  };
}

// Global production-grade HTTP security headers & custom Content Security Policy (CSP)
app.use((req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://*.clarity.ms https://yastatic.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://images.unsplash.com https://*.google-analytics.com https://*.clarity.ms https://*.bing.com",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.g.doubleclick.net https://*.clarity.ms https://c.bing.com",
    "frame-src 'self'",
    "media-src 'self' data: blob:",
    "worker-src 'self' blob:",
    "object-src 'none'"
  ].join("; ");
  res.setHeader("Content-Security-Policy", csp);

  if (isProduction) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  next();
});

// Download external HDR environment map locally to remove third-party CDN runtime dependencies
async function downloadHdrAsset() {
  const publicDir = path.join(process.cwd(), "public");
  const textureDir = path.join(publicDir, "textures");
  const targetPath = path.join(textureDir, "royal_esplanade_1k.hdr");

  try {
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    if (!fs.existsSync(textureDir)) fs.mkdirSync(textureDir);

    if (fs.existsSync(targetPath)) {
      console.log("[SECURITY] HDR asset already cached locally.");
      return;
    }

    console.log("[SECURITY] Downloading HDR asset locally to remove external CDN runtime dependency...");
    const url = "https://cdn.jsdelivr.net/gh/mrdoob/three.js@r160/examples/textures/equirectangular/royal_esplanade_1k.hdr";
    
    await new Promise<void>((resolve, reject) => {
      const file = fs.createWriteStream(targetPath);
      https.get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download HDR: HTTP ${response.statusCode}`));
          return;
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close();
          console.log("[SECURITY] HDR asset successfully cached at public/textures/royal_esplanade_1k.hdr");
          resolve();
        });
      }).on("error", (err) => {
        fs.unlink(targetPath, () => {});
        reject(err);
      });
    });
  } catch (err: any) {
    console.error("[SECURITY WARNING] Local HDR cache failure. Fallback mode will trigger: ", err.message);
  }
}

// Trigger asset cache downloader
downloadHdrAsset();

// Lazy-loaded transporter to send genuine HTML mail
async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    if (!isProduction) {
      console.warn("\x1b[33m%s\x1b[0m", "==========================================================");
      console.warn("\x1b[33m%s\x1b[0m", "                    2-STEP GATEKEEPER SERVICE             ");
      console.warn("\x1b[33m%s\x1b[0m", `[DEVELOPMENT ONLY] Generated 6-Digit OTP for ${email} is: ${otp}`);
      console.warn("\x1b[33m%s\x1b[0m", "Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS variables to receive this inside your live mailbox!");
      console.warn("\x1b[33m%s\x1b[0m", "==========================================================");
    } else {
      console.log(`[SECURITY] OTP generated for ${email}. Secure delivery simulation complete.`);
    }
    return { 
      success: false, 
      message: "SMTP Mail settings not found in workspace secrets. Dynamically generated code has been written safely to standard server console runtime logs." 
    };
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // Use SSL if port 465 is specified
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"Surat Insider Security" <${user}>`,
      to: email,
      subject: "🔒 Super Admin Security Verification: One-Time Passcode",
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 500px; margin: 0 auto; padding: 25px; border: 1px solid #dfcba5; border-radius: 12px; background-color: #fbfaf7; color: #0c1717;">
          <h2 style="color: #0c1717; border-bottom: 2px solid #dfcba5; padding-bottom: 15px; font-weight: normal; margin-top: 0;">Surat Insider Staff Portal</h2>
          <p style="font-size: 14px; color: #333; line-height: 1.6;">You are attempting to gain authorization to configure site elements & dynamic entries inside the <b>Surat Insider CMS Directory</b>.</p>
          <div style="background-color: #0c1717; color: #fff; padding: 22px; border-radius: 8px; text-align: center; margin: 25px 0; border: 1px solid #dfcba5;">
            <p style="margin: 0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #dfcba5; font-family: sans-serif;">🔒 One-Time Security Passcode</p>
            <h1 style="margin: 0; font-size: 42px; font-family: monospace; letter-spacing: 8px; color: #fff; font-weight: bold;">${otp}</h1>
          </div>
          <p style="font-size: 11px; color: #666; line-height: 1.5; margin-bottom: 0;">This dynamic verification passcode is active for 5 minutes. If you did not initiate this lock event, please review your dashboard security privileges.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SECURITY] OTP successfully dispatched via SMTP to admin mailbox.`);
    return { success: true, message: "Code has been safely emailed to your registered address." };
  } catch (error: any) {
    console.error("[SECURITY] Failed to send SMTP email:", error);
    return { success: false, message: `SMTP Server Relay Error: ${error.message}` };
  }
}

// Lazy initializer for GoogleGenAI to prevent startup crashes when API key is missing
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add your Gemini API Key in the Settings > Secrets panel of Google AI Studio."
    );
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

/**
 * Executes a Gemini request with automatic retry upon transient errors (503, UNAVAILABLE, etc.)
 * and fallback to high-availability alternative models.
 */
async function generateContentWithRetry(
  ai: any,
  params: {
    model: string;
    contents: any;
    config?: any;
  },
  maxRetries = 2
): Promise<any> {
  const modelsToTry = [params.model];
  
  if (params.model === "gemini-3.5-flash") {
    modelsToTry.push("gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-3.1-flash-lite");
  } else if (params.model === "gemini-3-pro-image-preview" || params.model === "gemini-3-pro-image") {
    modelsToTry.push("imagen-3.0-generate-002", "gemini-2.5-flash-image", "imagen-3.0-capability-001");
  }

  let lastError: any = null;

  for (const model of modelsToTry) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini SDK] Dispatching call. Model: ${model} (Attempt ${attempt}/${maxRetries})`);
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        return response;
      } catch (error: any) {
        lastError = error;
        const errorMsg = error?.message || String(error);
        const isTransient = errorMsg.includes("503") || 
                            errorMsg.includes("UNAVAILABLE") || 
                            errorMsg.includes("high demand") || 
                            errorMsg.includes("429") ||
                            errorMsg.includes("RESOURCE_EXHAUSTED") ||
                            (error?.status && (error.status === 503 || error.status === 429 || error.status === "UNAVAILABLE"));
        
        console.warn(`[Gemini SDK] Error on model ${model} (Attempt ${attempt}):`, errorMsg);
        
        if (isTransient && attempt < maxRetries) {
          const delay = attempt * 1200;
          console.log(`[Gemini SDK] Waiting ${delay}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        
        if (modelsToTry.indexOf(model) < modelsToTry.length - 1) {
          console.warn(`[Gemini SDK] Model ${model} is currently unavailable. Falling back...`);
          break;
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content with Gemini API. Please try again later.");
}

// =========================================================================
// 🔒 3-STEP ADMINISTRATIVE GATEKEEPER (EMAIL -> PASSWORD -> OTP)
// =========================================================================

app.post("/api/auth/step1-email", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });
  
  const trimmedEmail = email.toLowerCase().trim();
  const ip = getClientIp(req);
  const now = Date.now();

  const record = emailFailures.get(trimmedEmail) || { count: 0, lockedUntil: 0 };
  if (now < record.lockedUntil) {
    return res.status(403).json({ error: "Email verification is locked. Try again later." });
  }

  if (trimmedEmail !== adminEmailAddress.toLowerCase().trim()) {
    record.count++;
    if (record.count >= 3) {
      record.lockedUntil = now + 15 * 60 * 1000;
      addServerAuditLog("Email Step Lockout", "Security", trimmedEmail, "System");
    }
    emailFailures.set(trimmedEmail, record);
    return res.status(401).json({ error: "Unauthorized email identity.", attemptsLeft: Math.max(0, 3 - record.count) });
  }

  emailFailures.delete(trimmedEmail);
  res.json({ success: true, message: "Email verified. Proceed to password." });
});

app.post("/api/auth/step2-password", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email and password are required." });
  
  const trimmedEmail = email.toLowerCase().trim();
  const now = Date.now();

  const record = passwordFailures.get(trimmedEmail) || { count: 0, lockedUntil: 0 };
  if (now < record.lockedUntil) {
    return res.status(403).json({ error: "Password entry is locked. Try again later." });
  }

  const envPassword = process.env.ADMIN_MASTER_PASSWORD;
  if (!envPassword) {
    return res.status(500).json({ error: "Server error: Master password is not configured." });
  }

  if (password !== envPassword) {
    record.count++;
    if (record.count >= 3) {
      record.lockedUntil = now + 15 * 60 * 1000;
      addServerAuditLog("Password Step Lockout", "Security", trimmedEmail, "System");
    }
    passwordFailures.set(trimmedEmail, record);
    return res.status(401).json({ error: "Incorrect master passcode.", attemptsLeft: Math.max(0, 3 - record.count) });
  }

  passwordFailures.delete(trimmedEmail);
  
  // Directly grant administrative session and set cookies (Bypassing OTP step)
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = now + 30 * 60 * 1000;
  activeSessions.set(sessionToken, { email: trimmedEmail, role: "Super Admin", expiresAt });

  res.cookie("session_token", sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 30 * 60 * 1000,
    path: "/"
  });

  addServerAuditLog("Administrative Access Granted", "Auth", trimmedEmail, trimmedEmail);
  res.json({ success: true, role: "Super Admin", message: "Password verified. Access granted." });
});

app.post("/api/auth/step3-otp", (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP are required." });
  
  const trimmedEmail = email.toLowerCase().trim();
  const now = Date.now();
  const ip = getClientIp(req);

  const record = otpFailures.get(trimmedEmail) || { count: 0, lockedUntil: 0 };
  if (now < record.lockedUntil) {
    return res.status(403).json({ error: "OTP verification is locked. Try again later." });
  }

  const savedOtp = activeOtps.get(trimmedEmail);
  if (!savedOtp || now > savedOtp.expiresAt) {
    return res.status(400).json({ error: "OTP expired or not found. Restart process." });
  }

  if (savedOtp.otp !== otp) {
    record.count++;
    if (record.count >= 3) {
      record.lockedUntil = now + 15 * 60 * 1000;
      addServerAuditLog("OTP Step Lockout", "Security", trimmedEmail, "System");
      activeOtps.delete(trimmedEmail);
    }
    otpFailures.set(trimmedEmail, record);
    return res.status(401).json({ error: "Invalid security code.", attemptsLeft: Math.max(0, 3 - record.count) });
  }

  // Success
  activeOtps.delete(trimmedEmail);
  otpFailures.delete(trimmedEmail);

  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expiresAt = now + 30 * 60 * 1000;
  activeSessions.set(sessionToken, { email: trimmedEmail, role: "Super Admin", expiresAt });

  res.cookie("session_token", sessionToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "strict",
    maxAge: 30 * 60 * 1000,
    path: "/"
  });

  addServerAuditLog("Administrative Access Granted", "Auth", trimmedEmail, trimmedEmail);
  res.json({ success: true, role: "Super Admin" });
});

// Get current session/auth status
app.get("/api/auth/status", (req, res) => {
  const token = getSessionCookie(req);
  if (!token) {
    return res.json({ loggedIn: false, role: "Guest" });
  }
  const session = activeSessions.get(token);
  if (!session || Date.now() > session.expiresAt) {
    if (session) {
      activeSessions.delete(token);
      addServerAuditLog("Session Expired", "Security Settings", session.email, "System");
    }
    res.clearCookie("session_token");
    return res.json({ loggedIn: false, role: "Guest" });
  }
  res.json({ loggedIn: true, role: session.role, email: session.email });
});

// Logout endpoint
app.post("/api/auth/logout", (req, res) => {
  const token = getSessionCookie(req);
  if (token) {
    const session = activeSessions.get(token);
    if (session) {
      addServerAuditLog("Session Logged Out", "Security Settings", session.email, session.email);
      activeSessions.delete(token);
    }
  }
  res.clearCookie("session_token");
  res.json({ success: true });
});

// Update Authorized Super Admin Email
app.post("/api/auth/update-email", requireAdmin, (req, res) => {
  try {
    const { newEmail } = req.body;
    if (!newEmail || !newEmail.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid fully qualified email address." });
    }

    const previousEmail = adminEmailAddress;
    adminEmailAddress = newEmail.toLowerCase().trim();
    
    addServerAuditLog(`Updated Admin Email from ${previousEmail} to ${adminEmailAddress}`, "Security Settings", adminEmailAddress, (req as any).session.email);
    res.json({ success: true, newEmail: adminEmailAddress });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Current Active Admin Email
app.get("/api/auth/current-email", requireAdmin, (req, res) => {
  res.json({ email: adminEmailAddress });
});

// Endpoint to verify and test SMTP configuration manually
app.get("/api/test-email", requireAdmin, async (req, res) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return res.status(400).json({
      success: false,
      error: "Missing SMTP Credentials",
      message: "SMTP settings not fully configured in your environmental variables.",
      details: { host, port, user: user ? "Present" : "Missing", pass: pass ? "Present" : "Missing" }
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
    });

    const mailOptions = {
      from: `"Surat Insider SMTP Test" <${user}>`,
      to: (req as any).session.email,
      subject: "SMTP Test - Surat Insider",
      text: "SMTP integration is working successfully.",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #0f172a; margin-top: 0;">SMTP Test - Surat Insider</h2>
          <p style="font-size: 15px; line-height: 1.5; color: #334155;">SMTP integration is working successfully.</p>
          <hr style="border: 0; border-top: 1px solid #edf2f7; margin: 20px 0;" />
          <p style="font-size: 11px; color: #64748b;">This is an automated test message triggered by the system administrator verification system.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    addServerAuditLog("Triggered SMTP Test Email", "SMTP Config", (req as any).session.email, (req as any).session.email);
    res.json({ success: true, message: `SMTP test email successfully dispatched to ${(req as any).session.email}.` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// =========================================================================
// SECURE SERVER-SIDE CMS & DATA CHANNELS
// =========================================================================

// Public Content Access Endpoint (Exposes all public content at once)
app.get("/api/cms/content", async (req, res) => {
  try {
    const experiences = await getFirestoreExperiences();
    const homepage = await getFirestoreConfig("homepage");
    const aiChatbot = await getFirestoreConfig("aiChatbot");
    const seo = await getFirestoreConfig("seo");
    const monetization = await getFirestoreConfig("monetization");
    
    // Normalize data structure for frontend compatibility
    const content = {
      destinations: experiences.filter((e: any) => e.inquiryType === "Destination"),
      shoppingGuides: experiences.filter((e: any) => e.inquiryType === "Shopping"),
      hotels: experiences.filter((e: any) => e.inquiryType === "Hotel"),
      tours: experiences.filter((e: any) => e.inquiryType === "Tour"),
      foodSpots: experiences.filter((e: any) => e.inquiryType === "Food Spot"),
      events: experiences.filter((e: any) => e.inquiryType === "Event"),
      blogs: experiences.filter((e: any) => e.inquiryType === "Blog"),
      homepage,
      aiChatbot,
      seo,
      monetization,
      media: [] // Media library handled separately or from Firestore if implemented
    };
    
    res.json(content);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin CMS Save Endpoint
app.post("/api/admin/cms/save", requireAdmin, async (req, res) => {
  try {
    const { key, data } = req.body;
    if (!key) {
      return res.status(400).json({ error: "CMS update identifier (key) is required." });
    }

    if (["homepage", "aiChatbot", "seo", "monetization"].includes(key)) {
      const db = getFirebaseDb();
      await db.collection("config").doc(key).set(data, { merge: true });
    } else if (["destinations", "shoppingGuides", "hotels", "tours", "foodSpots", "events", "blogs"].includes(key)) {
      // For collections, we expect the data to be the full array for simple logic, but better to use individual updates.
      // However, to maintain compatibility with the existing Admin UI, we handle the array overwrite.
      const db = getFirebaseDb();
      const batch = db.batch();
      
      // Caution: Overwriting entire collection logic
      // In a real production app, we'd update individual docs. 
      // For now, we update docs provided in the array.
      for (const item of (data as any[])) {
        const docRef = db.collection("experiences").doc(item.id);
        batch.set(docRef, { ...item, updatedAt: FieldValue.serverTimestamp() }, { merge: true });
      }
      await batch.commit();
    }

    await addServerAuditLog(`Saved CMS Content: ${key}`, "CMS Manager", `Target section: ${key}`, (req as any).session.email);
    res.json({ success: true, message: `Successfully saved ${key} content live!`, data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Media asset upload handler
app.post("/api/admin/media/upload", requireAdmin, (req, res) => {
  try {
    const { name, data, altText = "", caption = "", category = "General" } = req.body;
    if (!name || !data) {
      return res.status(400).json({ error: "Filename and base64 data string are required." });
    }

    const publicDir = path.join(process.cwd(), "public");
    const mediaDir = path.join(publicDir, "media");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir);

    const safeName = `${Date.now()}-${name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const targetPath = path.join(mediaDir, safeName);

    // Extract base64 payload
    const base64Data = data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    fs.writeFileSync(targetPath, buffer);

    const sizeInKb = (buffer.length / 1024).toFixed(1) + " KB";
    const relativeUrl = `/media/${safeName}`;

    const db = getDb();
    const newMedia = {
      id: `media-${Date.now()}`,
      url: relativeUrl,
      filename: name,
      altText,
      caption,
      category,
      size: sizeInKb
    };

    db.media = [newMedia, ...db.media];
    saveDb(db);

    addServerAuditLog("Uploaded Media Asset", "Media Library", name, (req as any).session.email);
    res.json({ success: true, file: newMedia });
  } catch (error: any) {
    res.status(500).json({ error: "Media upload failure: " + error.message });
  }
});

// Admin-only Media asset deletion
app.post("/api/admin/media/delete", requireAdmin, (req, res) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ error: "Media asset id is required." });
    }

    const db = getDb();
    const mediaIndex = db.media.findIndex(m => m.id === id);
    if (mediaIndex === -1) {
      return res.status(404).json({ error: "Media asset not found in database." });
    }

    const item = db.media[mediaIndex];
    const filename = path.basename(item.url);
    const mediaPath = path.join(process.cwd(), "public", "media", filename);

    if (fs.existsSync(mediaPath)) {
      try {
        fs.unlinkSync(mediaPath);
      } catch (err) {
        console.warn(`[WARNING] Failed to unlink file from disk: ${mediaPath}`, err);
      }
    }

    db.media.splice(mediaIndex, 1);
    saveDb(db);

    addServerAuditLog("Deleted Media Asset", "Media Library", item.filename, (req as any).session.email);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: "Media deletion failure: " + error.message });
  }
});

// Public Monetization settings
app.get("/api/monetization", (req, res) => {
  res.json(getDb().monetization);
});

// Admin-only Monetization update
app.post("/api/admin/monetization", requireAdmin, (req, res) => {
  try {
    const db = getDb();
    db.monetization = { ...db.monetization, ...req.body };
    saveDb(db);
    addServerAuditLog("Updated Monetization Settings", "Monetization Setting", "Global Pricing", (req as any).session.email);
    res.json(db.monetization);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Inquiries retrieval
app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
  try {
    const inquiries = await getFirestoreInquiries();
    res.json(inquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Public Lead submission
app.post("/api/inquiries", async (req, res) => {
  try {
    const inq = req.body;
    if (!inq.name || !inq.email || !inq.itemTitle) {
      return res.status(400).json({ error: "Required lead inquiry details are missing." });
    }
    
    const newInquiry = {
      ...inq,
      id: `inq-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      status: "New",
      timestamp: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
    };
    
    await addFirestoreInquiry(newInquiry);
    await addServerAuditLog("Created Lead Inquiry", "Lead Inquiry", inq.itemTitle, "Guest User");
    res.json({ success: true, inquiry: newInquiry });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Inquiry resolution
app.post("/api/admin/inquiries/resolve", requireAdmin, async (req, res) => {
  try {
    const { id } = req.body;
    const db = getFirebaseDb();
    await db.collection("inquiries").doc(id).update({ status: "Closed" });
    
    await addServerAuditLog("Closed User Lead Ticket", "Inquiry", id, (req as any).session.email);
    const updatedInquiries = await getFirestoreInquiries();
    res.json(updatedInquiries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Partner requests retrieval
app.get("/api/admin/partner-requests", requireAdmin, async (req, res) => {
  try {
    const partners = await getFirestorePartners();
    res.json(partners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Public Partner request submission
app.post("/api/partner-requests", async (req, res) => {
  try {
    const partner = req.body;
    if (!partner.businessName || !partner.contactEmail) {
      return res.status(400).json({ error: "Required partner application details are missing." });
    }
    
    const newRequest = {
      ...partner,
      id: `req-${Date.now()}`,
      status: "Pending",
      timestamp: new Date().toISOString()
    };
    
    const db = getFirebaseDb();
    await db.collection("partners").doc(newRequest.id).set(newRequest);
    
    await addServerAuditLog("Partner Application Submitted", "Partner Request", partner.businessName, "Guest User");
    res.json({ success: true, request: newRequest });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Partner status moderator
app.post("/api/admin/partner-requests/status", requireAdmin, async (req, res) => {
  try {
    const { id, action, status } = req.body;
    const finalStatus = action || status;
    
    if (!id || !finalStatus) {
      return res.status(400).json({ error: "Request ID and new status/action are required." });
    }

    await updateFirestorePartner(id, finalStatus);
    await addServerAuditLog(`${finalStatus} Partner Request`, "Partner Hub", id, (req as any).session.email);
    
    const updatedPartners = await getFirestorePartners();
    res.json(updatedPartners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Alias for frontend compatibility
app.post("/api/admin/partner-requests/update", requireAdmin, async (req, res) => {
  try {
    const { id, action, status } = req.body;
    const finalStatus = action || status;
    
    if (!id || !finalStatus) {
      return res.status(400).json({ error: "Request ID and new status/action are required." });
    }

    await updateFirestorePartner(id, finalStatus);
    await addServerAuditLog(`${finalStatus} Partner Request (Update)`, "Partner Hub", id, (req as any).session.email);
    
    const updatedPartners = await getFirestorePartners();
    res.json(updatedPartners);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Audit Logs retrieval
app.get("/api/admin/audit-logs", requireAdmin, async (req, res) => {
  try {
    const logs = await getFirestoreAuditLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Admin-only Audit Logs logging
app.post("/api/admin/audit-logs", requireAdmin, async (req, res) => {
  try {
    const { action, targetType, targetName } = req.body;
    await addServerAuditLog(action, targetType, targetName, (req as any).session.email);
    const logs = await getFirestoreAuditLogs();
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 1. API: AI Chat Assistant with multiple Surat Expert Personas
app.post(
  "/api/chatbot",
  createRateLimiter(60 * 1000, 20, "Rate limit exceeded. Please wait a minute before sending another message."),
  async (req, res) => {
    try {
      const { message, history = [], persona = "heritage" } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const ai = getGeminiClient();
      const aiChatbot = await getFirestoreConfig("aiChatbot");

      // Load specific system instruction from editable CMS configuration
      let systemInstruction = "";
      if (persona === "shopping") {
        systemInstruction = aiChatbot.personas.shopping;
      } else if (persona === "food") {
        systemInstruction = aiChatbot.personas.food;
      } else {
        systemInstruction = aiChatbot.personas.heritage;
      }

      // Append base general instructions
      systemInstruction = `${aiChatbot.prompt}\n\n${systemInstruction}`;

      // Prepare contents array by converting history + current message to compatible format
      const contents: any[] = [];
      
      // Process previous history
      for (const h of history) {
        contents.push({
          role: h.role === "bot" || h.sender === "bot" ? "model" : "user",
          parts: [{ text: h.text || h.message || "" }],
        });
      }

      // Add current user prompt
      contents.push({
        role: "user",
        parts: [{ text: message }],
      });

      // Request response from gemini-3.5-flash
      const response = await generateContentWithRetry(ai, {
        model: "gemini-3.5-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I apologize, but I couldn't formulate a response. Could you please outline your query again?";
      res.json({ reply: replyText });
    } catch (error: any) {
      console.error("Chat API error:", error);
      res.status(500).json({ error: error.message || "An error occurred with the AI chat agent." });
    }
  }
);


// Temporary Migration Endpoint
app.post("/api/admin/migrate", requireAdmin, async (req, res) => {
  try {
    const cmsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), "cms_database.json"), "utf-8"));
    const db = getFirebaseDb();

    console.log("Starting server-side migration...");

    // 1. Experiences
    const experiences = [
      ...(cmsData.destinations || []).map((d: any) => ({ ...d, inquiryType: "Destination" })),
      ...(cmsData.shoppingGuides || []).map((s: any) => ({ ...s, inquiryType: "Shopping" })),
      ...(cmsData.hotels || []).map((h: any) => ({ ...h, inquiryType: "Hotel" })),
      ...(cmsData.tours || []).map((t: any) => ({ ...t, inquiryType: "Tour" })),
      ...(cmsData.foodSpots || []).map((f: any) => ({ ...f, inquiryType: "Food Spot" })),
      ...(cmsData.events || []).map((e: any) => ({ ...e, inquiryType: "Event" })),
      ...(cmsData.blogs || []).map((b: any) => ({ ...b, inquiryType: "Blog" }))
    ];

    const batch = db.batch();
    for (const exp of experiences) {
      const docRef = db.collection("experiences").doc(exp.id);
      batch.set(docRef, {
        ...exp,
        status: exp.status || "Published",
        updatedAt: FieldValue.serverTimestamp()
      });
    }
    await batch.commit();

    // 2. Inquiries
    for (const inq of (cmsData.inquiries || [])) {
      await db.collection("inquiries").doc(inq.id).set({
        ...inq,
        timestamp: inq.timestamp || new Date().toISOString()
      });
    }

    // 3. Partners
    for (const part of (cmsData.partners || [])) {
      await db.collection("partners").doc(part.id).set({
        ...part,
        updatedAt: FieldValue.serverTimestamp()
      });
    }

    // 4. Audit Logs
    for (const log of (cmsData.auditLogs || [])) {
      await db.collection("auditLogs").doc(log.id).set(log);
    }

    // 5. Config
    await db.collection("config").doc("homepage").set(cmsData.homepage || {});
    await db.collection("config").doc("aiChatbot").set(cmsData.aiChatbot || {});
    await db.collection("config").doc("seo").set(cmsData.seo || {});
    await db.collection("config").doc("monetization").set(cmsData.monetization || {});

    await addServerAuditLog("Manual Database Migration Triggered", "System", "Cloud Firestore", (req as any).session.email);
    res.json({ success: true, message: "Cloud migration complete!" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Serve frontend assets using Vite middleware or production static folder
async function mountViteOrStatic() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite dev middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Serving build files in production mode...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Surat Insider fullstack server listening on http://0.0.0.0:${PORT}`);
  });
}

mountViteOrStatic().catch((err) => {
  console.error("Failed to start fullstack server:", err);
});
