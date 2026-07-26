"use client";

import React from "react";
import { Sparkles, Shield, Target, Sun, Heart, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="py-16 md:py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-widest">
          <Award className="w-4 h-4 text-amber-400" />
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-none">
          Focused On <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400 bg-clip-text text-transparent">Steady Improvement</span>
        </h1>
        <p className="text-slate-300 text-lg leading-relaxed font-normal">
          LevelUp was created with a clear objective: to support personal discipline through straightforward, structured tracking and helpful daily routines without unnecessary complexity.
        </p>
      </div>

      {/* Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-[#091424] border border-slate-800 space-y-4 hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xl">
            1
          </div>
          <h3 className="text-xl font-extrabold text-white">The Morning Shield</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            Your waking hours set the tone for the day. By attending to hydration, quiet planning, and steady routines before diving into distractions, you preserve focus.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#091424] border border-slate-800 space-y-4 hover:border-amber-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl">
            2
          </div>
          <h3 className="text-xl font-extrabold text-white">AI Support</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            When you need ideas for structuring your schedule or breaking tasks down into simpler actions, our AI Coach provides prompt suggestions to help keep momentum.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#091424] border border-slate-800 space-y-4 hover:border-blue-500/40 transition-all">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl">
            3
          </div>
          <h3 className="text-xl font-extrabold text-white">Transparent Pricing</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            We operate with simple, transparent terms: ₹200 for 3 full Months of ad-free Premium access, and ₹100 per month for community brand advertisement placements.
          </p>
        </div>
      </div>

      {/* Philosophy Quote */}
      <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-950/60 via-[#0A1628] to-amber-950/40 border-2 border-amber-500/40 text-center max-w-4xl mx-auto space-y-6 shadow-2xl">
        <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
        <p className="text-xl sm:text-2xl font-black text-white leading-relaxed italic">
          "Consistent daily systems are the reliable foundation for meaningful self-improvement and steady discipline over time."
        </p>
        <div>
          <h4 className="font-black text-amber-300 text-lg">LevelUp Editorial Team</h4>
          <p className="text-xs text-slate-400 mt-0.5">Committed to honest tools for daily productivity</p>
        </div>
      </div>

      {/* Call to action */}
      <div className="text-center pt-8">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 text-white font-extrabold text-lg shadow-xl shadow-blue-500/20 hover:scale-105 transition-all"
        >
          <span>Start Your Free Journey Today</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

    </div>
  );
}
