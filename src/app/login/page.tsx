"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowUpRight, Lock, Mail, Sparkles, AlertCircle, Key } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { refreshUser } = useApp();
  const router = useRouter();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // First refresh the global state so Navbar etc updates
        await refreshUser();
        
        // Force navigate based on the role returned from the server
        if (data.user.role === "admin" || data.user.email === "levelupmind2026@gmail.com") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      } else {
        setError(data.error || "Login failed. Please verify credentials.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (userType: "user" | "premium") => {
    if (userType === "premium") {
      setEmail("premium@levelup.com");
      setPassword("user123");
    } else {
      setEmail("user@levelup.com");
      setPassword("user123");
    }
    setError("");
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-lg mx-auto">
      <div className="p-8 sm:p-10 rounded-3xl bg-[#081322] border border-slate-700/80 shadow-2xl relative overflow-hidden">
        
        {/* Glowing badge */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0A1628] rounded-[10px] flex items-center justify-center p-1">
              <img src="/logo.svg" alt="LevelUp" className="w-6 h-6 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Welcome Back to LevelUp</h1>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-300 text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Mail className="w-4 h-4 text-blue-400" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@levelup.com"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-400" />
                Password
              </label>
              <Link href="/forgot-password" className="text-xs font-bold text-amber-400 hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Signing In..." : "Sign In to Dashboard"}</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Don't have an account yet?{" "}
            <Link href="/signup" className="text-amber-400 font-bold hover:underline ml-1">
              Sign Up for Free
            </Link>
          </p>
        </div>

        {/* Demo Credentials Shortcuts */}
        <div className="mt-8 p-4 rounded-2xl bg-[#050D18] border border-slate-800 space-y-3">
          <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider text-center">
            ⚡ Quick Test Autofill Shortcuts:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemo("premium")}
              className="p-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-[11px] font-bold text-amber-300 flex flex-col items-center gap-1 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Premium Member</span>
            </button>

            <button
              type="button"
              onClick={() => fillDemo("user")}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-[11px] font-bold text-slate-400 flex flex-col items-center gap-1 transition-colors"
            >
              <Key className="w-4 h-4 text-slate-400" />
              <span>Free Account</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
