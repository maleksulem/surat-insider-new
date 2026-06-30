import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { KeyRound, ShieldCheck, ArrowRight, Loader2, RefreshCw, Mail } from "lucide-react";

interface AdminLoginPageProps {
  onLoginSuccess: (role: string) => void;
}

export function AdminLoginPage({ onLoginSuccess }: AdminLoginPageProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState<number | null>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/auth/status");
        const data = await res.json();
        if (data.loggedIn && data.role === "Super Admin") {
          onLoginSuccess("Super Admin");
        }
      } catch (e) {
        console.error("Status check failed", e);
      }
    }
    checkStatus();
  }, [onLoginSuccess]);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");
    setAttemptsLeft(null);

    try {
      const response = await fetch("/api/auth/step1-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Verification failed.");
        if (data.attemptsLeft !== undefined) setAttemptsLeft(data.attemptsLeft);
        return;
      }

      setStep(2);
      setSuccessMessage("Email identity confirmed.");
    } catch (err: any) {
      setError("Communication failure: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError("");
    setAttemptsLeft(null);

    try {
      const response = await fetch("/api/auth/step2-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Password incorrect.");
        if (data.attemptsLeft !== undefined) setAttemptsLeft(data.attemptsLeft);
        return;
      }

      setSuccessMessage("Access granted. Redirecting...");
      setTimeout(() => onLoginSuccess(data.role), 1000);
    } catch (err: any) {
      setError("Communication failure: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return;

    setLoading(true);
    setError("");
    setAttemptsLeft(null);

    try {
      const response = await fetch("/api/auth/step3-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Invalid passcode.");
        if (data.attemptsLeft !== undefined) setAttemptsLeft(data.attemptsLeft);
        return;
      }

      setSuccessMessage("Access granted. Redirecting...");
      setTimeout(() => onLoginSuccess(data.role), 1000);
    } catch (err: any) {
      setError("Verification failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#081912] bg-radial-at-t from-[#022c22] to-[#040e0a] text-brand-sand-50 flex flex-col justify-center items-center p-4">
      
      {/* Background abstract layout */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f241a_1px,transparent_1px),linear-gradient(to_bottom,#0f241a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-[#B8860B]/60 backdrop-blur-xl border border-[#B8860B]/25 p-8 rounded-3xl shadow-2xl relative z-10 space-y-8"
      >
        {/* Logo and header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-brand-gold-600 to-brand-gold-400 rounded-2xl flex items-center justify-center shadow-lg border border-brand-gold-300/30">
            {step === 1 ? (
              <Mail className="w-6 h-6 text-[#1A1614]" />
            ) : step === 2 ? (
              <KeyRound className="w-6 h-6 text-[#1A1614]" />
            ) : (
              <ShieldCheck className="w-6 h-6 text-[#1A1614]" />
            )}
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-wider text-brand-sand-50">
            SURAT INSIDER
          </h1>
          <p className="text-xs uppercase tracking-[0.3em] font-mono text-brand-gold-400 font-bold">
            {step === 1 ? "Staff ID Verification" : step === 2 ? "Master Credentials" : "Secure Passcode"}
          </p>
        </div>

        {/* Error or warning boxes */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-rose-950/50 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-mono leading-relaxed"
          >
            ⚠️ {error}
          </motion.div>
        )}

        {/* Success message */}
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-4 bg-emerald-950/50 border border-[#B8860B] rounded-xl text-[#4A423D] text-xs font-mono leading-relaxed"
          >
            🔒 {successMessage}
          </motion.div>
        )}

        {/* Remaining attempts counter */}
        {attemptsLeft !== null && (
          <div className="text-center">
            <span className="text-[11px] font-mono uppercase bg-[#B8860B]/10 text-brand-gold-400 border border-[#B8860B]/20 px-3 py-1 rounded-full">
              Attempts remaining: {attemptsLeft} of 3
            </span>
          </div>
        )}

        {/* Dynamic login screens */}
        {step === 1 ? (
          <form onSubmit={handleVerifyEmail} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A423D] font-bold">
                Registered Security Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@suratinsider.com"
                required
                className="w-full bg-[#B8860B] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-sm text-[#4A423D] placeholder:text-[#4A423D]/30 outline-none focus:border-[#B8860B] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#B8860B] hover:bg-brand-gold-600 text-[#1A1614] font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-xs"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Verifying Identity...
                </>
              ) : (
                <>
                  Verify Email
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : step === 2 ? (
          <form onSubmit={handleVerifyPassword} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A423D] font-bold">
                Master Passcode
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-[#B8860B] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-sm text-[#4A423D] placeholder:text-[#4A423D]/30 outline-none focus:border-[#B8860B] transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white/5 text-[#4A423D] font-bold uppercase tracking-widest py-3.5 rounded-xl text-xs"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-[#B8860B] hover:bg-brand-gold-600 text-[#1A1614] font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Password"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <p className="text-center text-xs text-[#4A423D]/80 leading-relaxed">
                Passcode sent to <span className="text-brand-gold-400 font-bold">{email}</span>.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-widest text-[#4A423D] font-bold block text-center">
                6-Digit Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                className="w-full bg-[#B8860B] border border-[#B8860B]/20 rounded-xl px-4 py-3 text-center text-xl font-mono tracking-[0.5em] text-[#4A423D] placeholder:text-[#4A423D]/20 outline-none focus:border-[#B8860B] transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 bg-white/5 text-[#4A423D] font-bold uppercase tracking-widest py-3.5 rounded-xl text-xs"
              >
                Restart
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-[#B8860B] hover:bg-brand-gold-600 text-[#1A1614] font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 text-xs"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Access"}
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
