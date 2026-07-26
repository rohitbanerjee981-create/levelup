"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowUpRight, Lock, Mail, User, Shield, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const { refreshUser } = useApp();
  const router = useRouter();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await refreshUser();
        router.push("/dashboard");
      } else {
        setError(data.error || "Registration failed. Please verify inputs.");
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 sm:py-24 px-4 sm:px-6 max-w-lg mx-auto">
      <div className="p-8 sm:p-10 rounded-3xl bg-[#081322] border border-slate-700/80 shadow-2xl relative overflow-hidden">
        
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 flex items-center justify-center shrink-0">
            <div className="w-full h-full bg-[#0A1628] rounded-[10px] flex items-center justify-center p-1">
              <img src="/logo.svg" alt="LevelUp" className="w-6 h-6 object-contain" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Create Free Account</h1>
        </div>

        <p className="text-xs text-slate-300 mb-6 leading-relaxed">
          Get immediate access to our Morning Routine Checklist, Basic Habit Tracker, daily hydration counter, and community motivation!
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-500/50 text-red-300 text-sm font-semibold flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-400" />
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="e.g. Rahul Varma"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

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
              placeholder="you@domain.com"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-blue-400" />
              Choose Password <span className="text-slate-500 font-normal text-[11px]">(min 6 chars)</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="••••••••"
              className="w-full px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-lg shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? "Registering..." : "Start Free 5 AM Journey"}</span>
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            Already have an account?{" "}
            <Link href="/login" className="text-amber-400 font-bold hover:underline ml-1">
              Sign In Here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
