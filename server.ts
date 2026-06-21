import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Simple in-memory database for active 2FA OTP codes
const activeOtps = new Map<string, { otp: string; expiresAt: number }>();

// Security configurations for Super Admin (defaults to requested email, changeable at runtime)
let adminEmailAddress = process.env.ADMIN_EMAIL || "itxghost111@gmail.com";

// Lazy-loaded transporter to send genuine HTML mail
async function sendOtpEmail(email: string, otp: string): Promise<{ success: boolean; message: string }> {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    const fallbackMsg = `[SECURITY INTRUSION GATEKEEPER] Generated 4-Digit OTP for ${email} is: ${otp}`;
    console.warn("\x1b[33m%s\x1b[0m", "==========================================================");
    console.warn("\x1b[33m%s\x1b[0m", "                    2-STEP GATEKEEPER SERVICE             ");
    console.warn("\x1b[33m%s\x1b[0m", fallbackMsg);
    console.warn("\x1b[33m%s\x1b[0m", "Please configure SMTP_HOST, SMTP_USER, and SMTP_PASS variables to receive this inside your live mailbox!");
    console.warn("\x1b[33m%s\x1b[0m", "==========================================================");
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
          <p style="font-size: 11px; color: #666; line-height: 1.5; margin-bottom: 0;">This dynamic verification passcode is active for 10 minutes. If you did not initiate this lock event, please review your dashboard security privileges.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[SECURITY] OTP successfully dispatched via SMTP directly to admin mailbox: ${email}`);
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
  
  // If requesting gemini-3.5-flash which might hit high demand, declare multiple highly stable, high-availability fallback models
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
        
        // If this model is exhausted, but we have fallbacks defined, break loop to try next model
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
// ADMINISTRATIVE GATEKEEPER 2FA ENDPOINTS
// =========================================================================

// Request One-Time Passcode (OTP)
app.post("/api/auth/request-otp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Registered Security Email address is required." });
    }

    if (email.toLowerCase().trim() !== adminEmailAddress.toLowerCase().trim()) {
      // Discretely reject unauthorized email combinations to prevent probing
      return res.status(403).json({ error: "The entered email address is not catalogued in our secure Active Directory system." });
    }

    // Generate dynamic secure 4-digit code
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes lifespan

    activeOtps.set(email.toLowerCase().trim(), { otp, expiresAt });

    // Try to email or output logs
    const deliveryResult = await sendOtpEmail(email.toLowerCase().trim(), otp);

    res.json({
      success: true,
      emailSent: deliveryResult.success,
      message: deliveryResult.message,
    });
  } catch (error: any) {
    console.error("OTP requests core failure:", error);
    res.status(500).json({ error: "Failed to dispatch dynamic OTP security payload: " + error.message });
  }
});

// Verify 2-Step Credentials
app.post("/api/auth/verify-otp", (req, res) => {
  try {
    const { email, password, otp } = req.body;
    if (!email || !password || !otp) {
      return res.status(400).json({ error: "All 2FA fields (Email, Passcode, and OTP) must be completely filled." });
    }

    // Check passcode first from environmental secrets
    const masterPassword = process.env.ADMIN_MASTER_PASSWORD || "surat2026";
    if (password !== masterPassword) {
      return res.status(401).json({ error: "Invalid master administrator passcode!" });
    }

    const trimmedEmail = email.toLowerCase().trim();
    // Check email
    if (trimmedEmail !== adminEmailAddress.toLowerCase().trim()) {
      return res.status(403).json({ error: "Access Denied: Unregistered email identity." });
    }

    const savedOtpRecord = activeOtps.get(trimmedEmail);
    if (!savedOtpRecord) {
      return res.status(400).json({ error: "No active verification sessions found for this email address. Please request a code." });
    }

    if (Date.now() > savedOtpRecord.expiresAt) {
      activeOtps.delete(trimmedEmail);
      return res.status(400).json({ error: "Your 4-digit security code has expired! Please click Back and request a new code." });
    }

    if (savedOtpRecord.otp !== otp) {
      return res.status(400).json({ error: "The typed One-Time Passcode (OTP) is incorrect. Access Denied." });
    }

    // Passed all authentication steps!
    activeOtps.delete(trimmedEmail);
    console.log(`[SECURITY] Super Admin role unlocked for successfully verified session: ${trimmedEmail}`);
    res.json({ success: true, role: "Super Admin" });
  } catch (error: any) {
    console.error("Verification core failure:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update Authorized Super Admin Email (Requires Super Admin Role Validation)
app.post("/api/auth/update-email", (req, res) => {
  try {
    const { newEmail, currentUserRole } = req.body;
    if (currentUserRole !== "Super Admin") {
      return res.status(403).json({ error: "Unauthorized: Super Admin access is required to change enrollment records." });
    }

    if (!newEmail || !newEmail.includes("@")) {
      return res.status(400).json({ error: "Please provide a valid fully qualified email address." });
    }

    adminEmailAddress = newEmail.toLowerCase().trim();
    console.warn(`[SECURITY LOCKDOWN] Admin registry updated. Authorized security email is now: ${adminEmailAddress}`);
    res.json({ success: true, newEmail: adminEmailAddress });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Current Active Admin Email
app.get("/api/auth/current-email", (req, res) => {
  res.json({ email: adminEmailAddress });
});

// Endpoint to verify and test SMTP configuration manually
app.get("/api/test-email", async (req, res) => {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return res.status(400).json({
      success: false,
      error: "Missing SMTP Credentials",
      message: "SMTP settings not fully configured in your environmental variables. Ensure SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS are set in your Google AI Studio Secrets/Environment page.",
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
      to: "itxghost111@gmail.com",
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
    console.log("[SMTP TEST] Success sending mail to itxghost111@gmail.com");
    res.json({
      success: true,
      message: "SMTP integration is working successfully. Test email sent to itxghost111@gmail.com.",
      config: { host, port, user }
    });
  } catch (error: any) {
    console.error("[SMTP TEST] Failed sending mail:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to deliver email through SMTP server.",
      details: error
    });
  }
});

// 1. API: AI Chat Assistant with multiple Surat Expert Personas
app.post("/api/chatbot", async (req, res) => {
  try {
    const { message, history = [], persona = "heritage" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const ai = getGeminiClient();

    // Define specific local expert system instructions
    let systemInstruction = "";
    if (persona === "shopping") {
      systemInstruction =
        "You are Radhika, Surat Insider's elite Wedding Shopping & Textile Market Expert. " +
        "You have deep knowledge of Ring Road's wholesale hubs, STM, Ghod Dod Road's diamond jewelery boutiques, " +
        "and where to secure authentic Tanchoi, Gaji Silk, and high-end embroidered work. Keep your tone " +
        "extremely premium, insider-focused, elegant, and helpful. Guide users with budget wisdom, secret shopping " +
        "hubs, and tips to avoid commission middlemen.";
    } else if (persona === "food") {
      systemInstruction =
        "You are Jignesh, Surat Insider's passionate Culinary Historian and Street Food Guide. " +
        "Surat's food represents luxury through street feast. You know everything about Locho (butter, garlic, Schezwan), " +
        "Khaman, Ghari, Undhiyu, and the local street-faring culture. Your tone is warm, enthusiastic, slightly mouth-watering, " +
        "and full of pride for Surati food treasures.";
    } else {
      systemInstruction =
        "You are Jayesh, Surat Insider's Head of Cultural Heritage and Local Travel Guide. " +
        "You represent the historical, architectural, and tourism heartbeat of Surat and South Gujarat (including Saputara " +
        "and Statue of Unity). You explain Surat Castle's defense walls, Dutch/Armenian monuments, Tapi River mysteries, " +
        "and general itinerary guides with historical flair. Keep your tone polished, scholarly yet accessible, and deeply welcoming.";
    }

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

    // Request response from gemini-3.5-flash for friendly, extremely fast local Q&A
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
});

// 2. API: Postcard and Content Image Generator (supporting size 1K/2K/4K)
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt, size = "1K", aspectRatio = "16:9" } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required to generate an image" });
    }

    const ai = getGeminiClient();

    // Enhance prompt to match our luxury, premium travel magazine aesthetic
    const enhancedPrompt = `${prompt}, editorial high-end travel postcard photography, national geographic style, highly detailed, realistic lighting, premium look`;

    console.log(`Generating image. Model: gemini-3-pro-image-preview. Size: ${size}. Aspect: ${aspectRatio}`);

    // Call gemini-3-pro-image-preview (or falls back automatically to gemini-2.5-flash-image) with retry support
    const response = await generateContentWithRetry(ai, {
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: enhancedPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio, // "1:1" | "3:4" | "4:3" | "9:16" | "16:9"
          imageSize: size, // "1K" | "2K" | "4K"
        }
      }
    });

    let base64Image = "";
    
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          base64Image = part.inlineData.data;
          break;
        }
      }
    }

    if (!base64Image) {
      throw new Error("No image data could be extracted from the model response. Try a different prompt style.");
    }

    res.json({
      imageUrl: `data:image/png;base64,${base64Image}`,
      enhancedPrompt,
    });
  } catch (error: any) {
    console.error("Image generation API error:", error);
    res.status(500).json({ error: error.message || "Failed to generate custom postcard image." });
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
