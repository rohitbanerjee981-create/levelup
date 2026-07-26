"use client";

import React from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { ArrowUpRight, Mail, Shield, Award, CheckCircle2, Heart } from "lucide-react";

export function Footer() {
  const { settings, theme } = useApp();

  return (
    <footer className={`border-t transition-colors duration-300 ${
      theme === 'dark' ? 'bg-[#040914] border-slate-800/80 text-slate-300' : 'bg-slate-900 text-slate-200 border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1: Logo & Vision */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-amber-500 p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#0A1628] rounded-[10px] flex items-center justify-center p-1">
                  <img src="/logo.svg" alt="LevelUp" className="w-7 h-7 object-contain" />
                </div>
              </div>
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-blue-200 to-amber-400 bg-clip-text text-transparent">
                LevelUp
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              LevelUp is designed to support daily habits, thoughtful morning routines, and sustained self-discipline with straightforward digital tracking and optional AI assistance.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Dedicated to Transparent Routine & Habit Formation</span>
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-4 border-l-2 border-amber-500 pl-2.5">
              Platform
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
              <li><Link href="/#features" className="hover:text-amber-400 transition-colors">Features & Tools</Link></li>
              <li><Link href={settings.linkGetPremium || "/premium"} className="text-amber-400 hover:underline flex items-center gap-1 font-semibold">Premium (₹200 / 3 Mo) <ArrowUpRight className="w-3 h-3" /></Link></li>
              <li><Link href={settings.linkAdvertisement || "/advertisement"} className="hover:text-amber-400 transition-colors">Advertisement (₹100 / Mo)</Link></li>
              <li><Link href="/blog" className="hover:text-amber-400 transition-colors">Articles & Wisdom</Link></li>
            </ul>
          </div>

          {/* Col 3: Company & About */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-4 border-l-2 border-blue-500 pl-2.5">
              Company
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/about" className="hover:text-amber-400 transition-colors">About Us</Link></li>
              <li><Link href={settings.linkContact || "/contact"} className="hover:text-amber-400 transition-colors">Contact Support</Link></li>
              <li><Link href="/dashboard" className="hover:text-amber-400 transition-colors">User Dashboard</Link></li>
              <li><Link href="/admin" className="hover:text-amber-400 transition-colors flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-blue-400" /> Owner Admin Panel</Link></li>
              <li><Link href={settings.linkDownload || "/dashboard"} className="hover:text-amber-400 transition-colors">Downloadable Resources</Link></li>
            </ul>
          </div>

          {/* Col 4: Legal & Contact Email */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase text-sm mb-4 border-l-2 border-amber-500 pl-2.5">
              Legal & Support
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund" className="hover:text-amber-400 transition-colors">Refund & Cancellation Policy</Link></li>
            </ul>
            <div className="mt-6 p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80">
              <span className="text-xs text-slate-400 block mb-1">Direct Support Email:</span>
              <a 
                href="mailto:levelup2026@gmail.com" 
                className="text-sm font-semibold text-amber-400 hover:underline flex items-center gap-1.5 break-all"
              >
                <Mail className="w-4 h-4 shrink-0" />
                levelup2026@gmail.com
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p className="font-medium text-slate-400">
            {settings.customFooterText || "© 2026 LevelUp. All Rights Reserved."}
          </p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> for steady self-improvement
            </span>
            <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full border border-slate-700 font-bold uppercase tracking-wider text-[10px]">
              Ready for Launch
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
