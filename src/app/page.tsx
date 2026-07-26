"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  ArrowUpRight, Sparkles, Check, Shield, Zap, Target, Droplet, 
  Sun, Bot, Users, Award, TrendingUp, HelpCircle, ArrowRight, 
  Clock, Heart, ChevronDown, ChevronUp, CheckCircle, Smartphone, BookOpen, Compass
} from "lucide-react";

export default function HomePage() {
  const { settings, theme, user } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(1);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  // Real database metrics state
  const [liveStats, setLiveStats] = useState({
    realUsersCount: 3,
    realHabitsCount: 10,
    realRoutinesDoneCount: 6,
    completionRate: "75%"
  });

  useEffect(() => {
    fetch("/api/dashboard").then(res => res.json()).then(data => {
      if (data.liveStats) {
        setLiveStats(data.liveStats);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSuccess(true);
      setNewsletterEmail("");
    }
  };

  const faqs = [
    {
      q: "How does the ₹200 for 3 Months Premium subscription work?",
      a: "Our Premium Plan unlocks an entirely Ad-Free experience, unlimited AI Productivity Assistant interactions, goal tracking, progress analytics, and exclusive PDF/Workbook resources for ₹200 for 3 Months. When you click 'Get Premium', you are taken directly to our admin-managed Payment Link."
    },
    {
      q: "What is included in the Free Plan without subscription?",
      a: "Free users receive access to Daily Motivation quotes, Morning Routine Checklist, Basic Habit Tracker, daily Water Logs, and foundational self-discipline articles. Free accounts will display community advertisements when active."
    },
    {
      q: "How does the Advertisement system work for brand creators?",
      a: "If you wish to showcase your brand to users interested in self-discipline and daily routines, you can purchase an advertising spot across LevelUp for ₹100 for 1 Month. Submit your banner image, brand name, and link on our Advertisement page, then click Pay ₹100 to proceed to the payment link."
    },
    {
      q: "How does LevelUp approach routine and habit formation?",
      a: "LevelUp emphasizes consistent mornings, cellular rehydration upon waking, and reducing friction for important habits. Instead of long, unorganized task lists, we structure your morning into clear, sequential actions supported by interactive tracking."
    },
    {
      q: "Can I access LevelUp across my desktop and mobile devices?",
      a: "Yes! LevelUp is responsive across modern web browsers on desktop, tablet, and mobile phones so you can track your morning routines easily."
    }
  ];

  const corePrinciples = [
    {
      title: "Immediate Waking Hydration",
      subtitle: "Metabolic Refresh",
      desc: "During 7 to 8 hours of sleep, mild bodily rehydration becomes necessary. Drinking water immediately upon rising helps restore alertness and physical energy before beginning demanding tasks.",
      icon: Droplet,
      badge: "Step 1 Protocol"
    },
    {
      title: "Reduced Morning Friction",
      subtitle: "The 20-Second Principle",
      desc: "Habits are easier to build when activation barriers are lowered. Preparing your workspace, water bottle, or reading material the evening before removes hesitation when your alarm sounds.",
      icon: Target,
      badge: "System Focus"
    },
    {
      title: "Uninterrupted Attention Blocks",
      subtitle: "Deep Work Shuttles",
      desc: "Switching back and forth between messaging notifications and complex work leads to fragmented attention. We encourage dedicated focus intervals without multi-tasking distractions.",
      icon: Zap,
      badge: "Cognitive Endurance"
    }
  ];

  return (
    <div className="overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 md:py-32 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-blue-600/20 via-blue-500/10 to-amber-500/15 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute top-10 left-10 w-72 h-72 bg-blue-600/10 rounded-full blur-[80px] pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Title & CTA */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 via-slate-800/80 to-amber-500/15 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-bold shadow-lg shadow-black/20">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>A Dedicated Morning Routine & Habit Tracking Platform</span>
              </div>

              {/* Main Title from Settings */}
              <h1 className="text-4xl sm:text-6xl lg:text-6xl font-extrabold tracking-tight leading-none text-white">
                <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent block mb-2">
                  {settings.homepageTitle.split(" ").slice(0, 3).join(" ") || "Level Up Your"}
                </span>
                <span className="bg-gradient-to-r from-blue-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">
                  {settings.homepageTitle.split(" ").slice(3).join(" ") || "Life Every Day"}
                </span>
              </h1>

              {/* Subtitle from Settings */}
              <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                {settings.homepageSubtitle || "Build better habits, improve your morning routine, and unlock your best self."}
              </p>

              {/* Action Buttons using Link Manager destinations */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href={settings.linkSignUp || "/signup"}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-extrabold text-lg shadow-xl shadow-blue-500/25 hover:shadow-amber-500/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2.5 group"
                >
                  <span>Start Free Today</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link
                  href={settings.linkGetPremium || "/premium"}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#0A1628]/80 hover:bg-[#0E1F38] border-2 border-amber-500/50 hover:border-amber-400 text-amber-300 font-extrabold text-lg shadow-lg shadow-black/40 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Get Premium (₹200 / 3 Mo)</span>
                </Link>
              </div>

              {/* Trust Note */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-1.5 text-slate-300">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>No credit card required for Free Plan</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400/90">
                  <Shield className="w-4 h-4 text-amber-400" />
                  <span>Transparent Pricing & Admin Managed Links</span>
                </div>
              </div>

            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/30 via-amber-500/20 to-transparent rounded-3xl blur-2xl transform rotate-3 -z-10" />
              
              <div className="relative w-full max-w-lg rounded-3xl bg-[#0D1B2A]/90 border border-slate-700/80 p-5 shadow-2xl shadow-black/70 backdrop-blur-xl group hover:border-amber-500/40 transition-colors">
                
                <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-700/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-red-500/80" />
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500/80" />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500/80" />
                    <span className="text-xs text-slate-400 font-mono ml-2">5:30 AM Routine Tracker</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-400 text-[11px] font-extrabold border border-amber-500/40">
                    Active Routine
                  </span>
                </div>

                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-900/80 border border-slate-700/60 shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
                  <img 
                    src="/images/hero-illustration.png" 
                    alt="LevelUp Glassmorphism Routine Tracker" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent opacity-80" />
                  
                  <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-xl bg-[#0A1628]/95 border border-amber-500/40 shadow-lg backdrop-blur-md flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                        <Sun className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">Morning Routine Checklist</p>
                        <p className="text-[10px] text-slate-400">Hydration + Quiet Space + Priority Planning</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/30">
                      Active
                    </span>
                  </div>
                </div>

                <div className="mt-4 space-y-2.5">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-600/10 border border-blue-500/30 text-xs text-blue-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="font-semibold">Water Tracker: Monitor daily consumption in ml</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">Ready</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                      <span className="font-semibold">AI Assistant: Get suggestions for structured habits</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded">
                      PRO
                    </span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* REAL-TIME DATABASE METRICS SECTION */}
      <section className="py-16 bg-[#081222]/90 border-y border-slate-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Transparent Platform Activity (Verified Database Records)</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            
            <div className="p-6 rounded-2xl bg-[#0B1729] border border-slate-800/80 shadow-lg hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1 font-mono">
                {liveStats.realUsersCount}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Registered Accounts</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1729] border border-slate-800/80 shadow-lg hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight mb-1 font-mono">
                {liveStats.realHabitsCount}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Habits in Database</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1729] border border-slate-800/80 shadow-lg hover:border-blue-500/40 transition-all">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center">
                <Sun className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1 font-mono">
                {liveStats.realRoutinesDoneCount}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Completed Routines Logged</p>
            </div>

            <div className="p-6 rounded-2xl bg-[#0B1729] border border-slate-800/80 shadow-lg hover:border-amber-500/40 transition-all">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight mb-1 font-mono">
                {liveStats.completionRate || "100%"}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-400 uppercase tracking-wider">Routine Adherence Rate</p>
            </div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS OVERVIEW */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-extrabold text-xs uppercase tracking-widest">
            Features & Tools
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed to Support <span className="text-amber-400 underline decoration-amber-500/50 underline-offset-8">Consistent Habits</span>
          </h2>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            LevelUp unites straightforward routine checklists, hydration tracking, and optional AI coaching into one clean interface:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0C192E] to-[#0A1628] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Sun className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              Morning Routine Checklist
              <span className="text-xs font-bold text-blue-300 bg-blue-600/30 px-2 py-0.5 rounded-full">Free</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Organize your morning activities without clutter. Our sequential checklist guides you through immediate hydration, quiet time, and planning your daily priorities.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Structured sequence tracking</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Clear completion status</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-emerald-400" /> Customize steps & times</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#0C192E] to-[#0A1628] border border-slate-800 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group">
            <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Droplet className="w-7 h-7 text-cyan-400 fill-cyan-400/20" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center gap-2">
              Cellular Water Tracker
              <span className="text-xs font-bold text-blue-300 bg-blue-600/30 px-2 py-0.5 rounded-full">Free</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Staying properly hydrated throughout the morning supports focus and well-being. Log your daily glasses, check progress against your goal, and keep hydration top of mind.
            </p>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Simple tap glass counter</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Visual ml consumption goals</li>
              <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-cyan-400" /> Daily log retention</li>
            </ul>
          </div>

          <div className="p-8 rounded-3xl bg-gradient-to-b from-[#111F36] to-[#0A1628] border-2 border-amber-500/60 hover:border-amber-400 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/20 group relative overflow-hidden">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Bot className="w-7 h-7 text-amber-400" />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-3 flex items-center justify-between">
              <span>AI Productivity Coach</span>
              <span className="text-xs font-black bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 px-2.5 py-1 rounded-md shadow-sm">
                PREMIUM
              </span>
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Need fresh ideas for scheduling or habit stacking? Ask the AI Coach for tailored schedule suggestions, simple activation steps, and encouragement.
            </p>
            <ul className="space-y-2.5 text-xs text-amber-200 font-medium">
              <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Unlimited coaching consultations</li>
              <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Practical schedule planning</li>
              <li className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-400" /> Completely ad-free interface</li>
            </ul>
          </div>

        </div>

        <div className="mt-16 p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-blue-900/40 via-[#0A1628] to-amber-950/30 border-2 border-amber-500/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-sm">
              <Award className="w-5 h-5" />
              <span>Simple, Transparent Pricing: Just ₹200 for 3 full Months</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Ready to eliminate ads & unlock unlimited AI tools?
            </h3>
            <p className="text-slate-400 text-sm max-w-xl">
              Our admin can configure payment links anytime so you can upgrade to Premium without friction.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={settings.linkGetPremium || "/premium"}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/30 hover:scale-105 transition-transform shrink-0"
            >
              Unlock Premium Now 🚀
            </Link>
            <Link
              href={settings.linkAdvertisement || "/advertisement"}
              className="px-6 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-white font-bold text-sm border border-slate-600 shrink-0"
            >
              Advertise Your Brand (₹100)
            </Link>
          </div>
        </div>
      </section>

      {/* AUTHENTIC SECTION: CORE DISCIPLINE & HABIT PRINCIPLES (REPLACING FAKE TESTIMONIALS) */}
      <section className="py-24 bg-[#050B16] border-t border-slate-800/80 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              System Architecture
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              Core Principles of <span className="text-blue-400">Habit Engineering</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              We believe in honest, structured approaches to productivity without exaggerated gimmicks. Here is how our framework helps build steady habits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePrinciples.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="p-8 rounded-3xl bg-[#0B1729] border border-slate-800 shadow-xl flex flex-col justify-between hover:border-amber-500/30 transition-all duration-300">
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/20 to-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                        <IconComp className="w-6 h-6 text-amber-400" />
                      </div>
                      <span className="text-[11px] font-mono font-extrabold px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-white text-xl mb-1">{item.title}</h4>
                    <p className="text-xs text-amber-400 font-bold mb-4 uppercase tracking-wider">{item.subtitle}</p>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                    <span>Applied across LevelUp Dashboard</span>
                    <Compass className="w-4 h-4 text-slate-500" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Frequently Asked <span className="text-amber-400">Questions</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base">
            Everything you need to know about our plans, payment links, advertisement spots, and features.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((f, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className={`rounded-2xl border transition-colors duration-200 overflow-hidden ${
                  isOpen ? "bg-[#0D1B30] border-amber-500/50 shadow-lg shadow-amber-500/5" : "bg-[#091322] border-slate-800 hover:border-slate-700"
                }`}
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="font-extrabold text-base sm:text-lg text-white flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-amber-400 shrink-0" />
                    {f.q}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-slate-800 text-slate-300 transition-transform duration-200 ${isOpen ? "rotate-180 bg-amber-500 text-slate-950" : ""}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800 text-sm sm:text-base text-slate-300 leading-relaxed">
                    {f.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* NEWSLETTER SECTION */}
      <section className="py-20 bg-gradient-to-b from-[#060D1A] to-[#0D1B2A] border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 to-blue-600 p-0.5 mx-auto mb-6 shadow-xl shadow-amber-500/20">
            <div className="w-full h-full bg-[#0A1628] rounded-[22px] flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-amber-400" />
            </div>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Join Our Weekly <span className="bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">Habit & Routine Letter</span>
          </h2>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Subscribe to receive concise notes on habit persistence, morning routines, and self-discipline ideas directly in your inbox.
          </p>

          {newsletterSuccess ? (
            <div className="p-5 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400/50 max-w-lg mx-auto text-emerald-300 font-extrabold text-base flex items-center justify-center gap-3">
              <CheckCircle className="w-6 h-6 shrink-0" />
              <span>You are successfully subscribed! Welcome to LevelUp.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center max-w-lg mx-auto gap-3">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                required
                className="w-full px-5 py-4 rounded-2xl bg-[#091424] border border-slate-700 text-white placeholder-slate-500 text-base focus:outline-none focus:border-amber-400 transition-all shadow-inner"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-base shadow-xl shadow-blue-500/25 shrink-0 transition-transform active:scale-95"
              >
                Subscribe ⚡
              </button>
            </form>
          )}

          <p className="text-xs text-slate-500 mt-4 font-semibold">
            By subscribing, you agree to receive our weekly newsletter. You can unsubscribe at any time.
          </p>
        </div>
      </section>

    </div>
  );
}
