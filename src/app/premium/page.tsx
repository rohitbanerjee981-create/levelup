"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { 
  Check, X, Sparkles, ArrowUpRight, Crown, 
  Shield 
} from "lucide-react";
import Link from "next/link";

export default function PremiumPage() {
  const { settings, user } = useApp();

  const freeFeatures = [
    { label: "Daily Motivation & Quotes", available: true },
    { label: "Morning Routine Checklist", available: true },
    { label: "Basic Habit Tracker", available: true },
    { label: "Cellular Water Tracker", available: true },
    { label: "Limited AI Productivity Assistant", available: true, note: "Basic" },
    { label: "Community Brand Advertisements displayed", available: true, note: "Contains Ads" },
    { label: "Goal Tracker & Milestones", available: false },
    { label: "Progress Analytics", available: false },
    { label: "Premium Articles & Deep Dive Library", available: false },
    { label: "Downloadable Resources (PDFs)", available: false },
    { label: "Priority Support", available: false },
    { label: "Ad-Free Experience", available: false }
  ];

  const premiumFeatures = [
    { label: "100% Ad-Free Dashboard Sanctuary", available: true, highlighted: true },
    { label: "Unlimited AI Productivity Assistant Coach", available: true, highlighted: true },
    { label: "Premium Habit Tracker (Unlimited)", available: true, highlighted: true },
    { label: "Goal Tracker & Target Dates", available: true },
    { label: "Progress Analytics & Weekly Reports", available: true },
    { label: "Full Access to Premium Articles", available: true },
    { label: "Unlimited Downloadable PDF Resources", available: true },
    { label: "Priority Support Access", available: true }
  ];

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 font-extrabold text-xs uppercase tracking-widest">
          <Crown className="w-4 h-4 text-amber-400" />
          <span>LevelUp Premium Edition</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
          Invest In Your Discipline For Just <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-blue-400 bg-clip-text text-transparent">₹200</span>
        </h1>
        <p className="text-slate-300 text-lg sm:text-xl font-medium leading-relaxed">
          One transparent price for <strong className="text-white underline decoration-amber-500 underline-offset-4">3 Full Months</strong>. Unlock unlimited AI tools and an ad-free experience.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">
        
        <div className="lg:col-span-5 p-8 rounded-3xl bg-[#081220] border border-slate-800 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
              <div>
                <h3 className="text-2xl font-black text-white">Free Plan</h3>
                <p className="text-sm text-slate-400">Foundational morning tracking</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-extrabold text-white">₹0</span>
                <span className="text-xs text-slate-400 block">Forever free</span>
              </div>
            </div>

            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Free Plan includes:
            </p>
            
            <ul className="space-y-3.5 mb-8 text-sm">
              {freeFeatures.map((item, index) => (
                <li key={index} className="flex items-start gap-3 text-slate-300">
                  {item.available ? (
                    <Check className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-slate-600 shrink-0 mt-0.5" />
                  )}
                  <span className={!item.available ? "text-slate-600 line-through" : ""}>
                    {item.label}
                    {item.note && (
                      <span className="ml-2 text-[10px] uppercase px-1.5 py-0.5 rounded bg-slate-800 text-amber-400 font-bold border border-slate-700">
                        {item.note}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <Link
            href={user ? "/dashboard" : (settings.linkSignUp || "/signup")}
            className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-center text-base border border-slate-600 transition-all duration-200 block"
          >
            {user ? "Go to Dashboard" : "Start With Free Plan"}
          </Link>
        </div>

        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0D223E] to-[#0A1628] border-2 border-amber-500/70 shadow-2xl flex flex-col justify-between relative overflow-hidden">
          
          <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
            ★ Best Value
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-amber-500/30 gap-4">
              <div>
                <h3 className="text-3xl font-black text-amber-300 flex items-center gap-2">
                  <span>Premium Plan</span>
                  <Sparkles className="w-6 h-6 text-amber-400 fill-amber-400" />
                </h3>
                <p className="text-sm text-slate-300 font-medium">Unleash total consistency & focus</p>
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black text-white">{settings.premiumPrice || "₹200"}</span>
                  <span className="text-sm font-bold text-amber-400">/ {settings.premiumDuration || "3 Months"}</span>
                </div>
              </div>
            </div>

            <p className="text-xs font-extrabold text-amber-300 uppercase tracking-widest mb-4">
              Premium unlock includes:
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8 text-sm">
              {premiumFeatures.map((item, index) => (
                <li key={index} className={`flex items-start gap-3 ${item.highlighted ? "text-white font-bold bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/30" : "text-slate-200"}`}>
                  <div className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 font-extrabold mt-0.5">
                    ✓
                  </div>
                  <span>{item.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-800">
            <a
              href={settings.premiumPaymentLink || "https://razorpay.com/demo-premium-link-levelup-200"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-xl text-center shadow-xl shadow-amber-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group block"
            >
              <span>Buy Premium ({settings.premiumPrice || "₹200"})</span>
              <ArrowUpRight className="w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>

            <div className="p-3.5 rounded-xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-between text-xs text-slate-300">
              <span className="font-medium flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-blue-400 shrink-0" />
                Verified Payment Link
              </span>
              <span className="text-blue-300 font-bold shrink-0">Secure Checkout</span>
            </div>

            <div className="pt-2 text-center">
              {user?.isPremium && (
                <div className="p-4 rounded-xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-extrabold text-sm flex items-center justify-center gap-2">
                  <span>🎉 LevelUp Premium is active on your account!</span>
                  <Link href="/dashboard" className="underline font-bold text-white hover:text-amber-400 ml-2">Go to Dashboard →</Link>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
