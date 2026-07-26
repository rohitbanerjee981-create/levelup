"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mail, Lock, CheckCircle2, ArrowLeft, KeyRound, ShieldCheck } from "lucide-react";

export default function ForgotPasswordPage() {
  const [activeTab, setActiveTab] = useState<"forgot" | "verify">("forgot");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);
    try {
      const action = activeTab === "forgot" ? "forgot" : "verify_email";
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, email, newPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessage(data.message || "Operation successful!");
      } else {
        setError(data.error || "Operation failed.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-lg mx-auto">
      <div className="p-8 sm:p-10 rounded-3xl bg-[#081322] border border-slate-700/80 shadow-2xl space-y-6">
        
        {/* Tabs for Forgot Password / Email Verification */}
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#0E1B2E] border border-slate-700 font-bold text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab("forgot"); setMessage(""); setError(""); }}
            className={`py-2.5 rounded-xl transition-all ${activeTab === "forgot" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}
          >
            Reset Password
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("verify"); setMessage(""); setError(""); }}
            className={`py-2.5 rounded-xl transition-all ${activeTab === "verify" ? "bg-amber-500 text-slate-950 font-black shadow" : "text-slate-400 hover:text-white"}`}
          >
            Verify Email Address
          </button>
        </div>

        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            {activeTab === "forgot" ? <KeyRound className="w-6 h-6 text-blue-400" /> : <ShieldCheck className="w-6 h-6 text-amber-400" />}
            <span>{activeTab === "forgot" ? "Forgot Your Password?" : "1-Click Email Verification"}</span>
          </h1>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {activeTab === "forgot" 
              ? "Enter your account email and choose a new password. Our secure system will reset your credentials immediately."
              : "Enter your account email to verify your address and unlock your verified badge inside LevelUp."}
          </p>
        </div>

        {message && (
          <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 text-sm font-bold flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-300 text-sm font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              Account Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@levelup.com"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
            />
          </div>

          {activeTab === "forgot" && (
            <div>
              <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-400" />
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Enter new strong password"
                className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-black text-base shadow-xl transition-all ${
              activeTab === "forgot"
                ? "bg-gradient-to-r from-blue-600 to-amber-500 text-white hover:opacity-95"
                : "bg-amber-500 hover:bg-amber-400 text-slate-950"
            }`}
          >
            {loading ? "Processing..." : (activeTab === "forgot" ? "Update & Reset Password" : "Verify Email Now ⚡")}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-amber-400 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Login Screen</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
