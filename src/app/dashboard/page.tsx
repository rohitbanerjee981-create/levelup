"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Sun, CheckCircle, Circle, Plus, Trash2, Flame, Droplet, Bot, 
  Target, FileText, Download, Sparkles, Shield, User as UserIcon, 
  Settings, Award, AlertCircle, ExternalLink, RefreshCw, ArrowUpRight, Check 
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function DashboardContent() {
  const { user, settings, refreshUser } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [tab, setTab] = useState<"routine" | "habits" | "water" | "goals" | "ai" | "resources" | "settings">("routine");
  const [loading, setLoading] = useState(true);
  
  const [habits, setHabits] = useState<any[]>([]);
  const [routines, setRoutines] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [water, setWater] = useState<any>({ glasses: 3, goal: 8 });
  const [ads, setAds] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  
  // Form modal states
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const [newHabitCategory, setNewHabitCategory] = useState("Mindset");
  const [newRoutineTitle, setNewRoutineTitle] = useState("");
  const [newRoutineTime, setNewRoutineTime] = useState("06:30 AM");
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [newGoalDate, setNewGoalDate] = useState("2026-08-31");
  
  // AI Assistant states
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiHistory, setAiHistory] = useState<{ sender: "user" | "ai", text: string, time?: string }[]>([
    { sender: "ai", text: "Hello! I am your LevelUp Productivity & Habit Assistant. What habits or routines can we structure and refine today?" }
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Profile update state
  const [profileName, setProfileName] = useState("");
  const [profileBio, setProfileBio] = useState("");
  const [profileAvatar, setProfileAvatar] = useState("");
  const [profileSaved, setProfileSaved] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setHabits(data.habits || []);
        setRoutines(data.routines || []);
        setGoals(data.goals || []);
        if (data.water) setWater(data.water);
        setAds(data.advertisements || []);
        setResources(data.resources || []);
        setAnnouncements(data.announcements || []);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlTab = searchParams ? searchParams.get("tab") : null;
    if (urlTab && ["routine", "habits", "water", "goals", "ai", "resources", "settings"].includes(urlTab)) {
      setTab(urlTab as any);
    }
    fetchDashboard();
  }, [searchParams]);

  useEffect(() => {
    if (user) {
      setProfileName(user.name || "");
      setProfileBio(user.bio || "");
      setProfileAvatar(user.avatar || "");
    }
  }, [user]);

  // Action Handlers
  const toggleHabit = async (id: number) => {
    await fetch("/api/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_habit", id })
    });
    fetchDashboard();
  };

  const toggleRoutine = async (id: number) => {
    await fetch("/api/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_routine", id })
    });
    fetchDashboard();
  };

  const updateWater = async (newGlasses: number) => {
    const nextGlasses = Math.max(0, Math.min(12, newGlasses));
    setWater({ ...water, glasses: nextGlasses });
    await fetch("/api/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_water", data: { glasses: nextGlasses } })
    });
  };

  const updateGoalProgress = async (id: number, val: number) => {
    await fetch("/api/dashboard", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "update_goal", id, data: { progress: val } })
    });
    fetchDashboard();
  };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle) return;
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_habit", item: { title: newHabitTitle, category: newHabitCategory } })
    });
    setNewHabitTitle("");
    fetchDashboard();
  };

  const addRoutine = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoutineTitle) return;
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_routine", item: { title: newRoutineTitle, time: newRoutineTime, duration: "10 mins" } })
    });
    setNewRoutineTitle("");
    fetchDashboard();
  };

  const addGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle) return;
    await fetch("/api/dashboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_goal", item: { title: newGoalTitle, targetDate: newGoalDate, progress: 0 } })
    });
    setNewGoalTitle("");
    fetchDashboard();
  };

  const deleteItem = async (id: number, type: string) => {
    await fetch(`/api/dashboard?id=${id}&type=${type}`, { method: "DELETE" });
    fetchDashboard();
  };

  const handleAiSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim() || aiLoading) return;
    
    const userText = aiPrompt;
    setAiHistory(prev => [...prev, { sender: "user", text: userText }]);
    setAiPrompt("");
    setAiLoading(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userText })
      });
      const data = await res.json();
      if (res.ok) {
        setAiHistory(prev => [...prev, { sender: "ai", text: data.response || data.message }]);
      } else {
        setAiHistory(prev => [...prev, { sender: "ai", text: "I encountered a processing error. Please check your network connection." }]);
      }
    } catch (err) {
      setAiHistory(prev => [...prev, { sender: "ai", text: "Network error. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/auth/upgrade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, bio: profileBio, avatar: profileAvatar })
      });
      await refreshUser();
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e) {
      alert("Error saving profile.");
    }
  };



  const activeRoutinesDone = routines.filter(r => r.isCompleted).length;
  const activeHabitsDone = habits.filter(h => h.completedToday).length;
  const isPremium = user?.isPremium || false;

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Welcome Header & Announcements banner */}
      <div className="space-y-6">
        {announcements.length > 0 && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/40 via-blue-800/20 to-amber-900/30 border border-amber-500/40 shadow-lg flex items-center justify-between gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-black text-[11px] uppercase tracking-wider">
                Broadcast
              </span>
              <span className="text-white font-bold">{announcements[0].title}:</span>
              <span className="text-slate-300 hidden md:inline">{announcements[0].content}</span>
            </div>
            <Link href={settings.linkGetPremium || "/premium"} className="text-amber-400 font-extrabold hover:underline shrink-0">
              Upgrade Now →
            </Link>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 sm:p-8 rounded-3xl bg-[#091526] border border-slate-800 shadow-xl">
          <div className="flex items-center gap-4">
            <img 
              src={user?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
              alt="User Avatar" 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500/50 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{user?.name || "Member Account"}</h1>
                <span className={`text-[11px] uppercase font-black px-2.5 py-1 rounded-full border ${
                  isPremium 
                    ? "bg-gradient-to-r from-amber-500/20 to-blue-500/20 text-amber-400 border-amber-500/40 shadow" 
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}>
                  {isPremium ? "⚡ Premium Active" : "Free Plan Member"}
                </span>
                {user?.role === "admin" && (
                  <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.5 rounded uppercase">
                    Admin Owner
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">{user?.bio || "Using LevelUp to organize daily routines and self-discipline."}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {!isPremium ? (
              <a
                href={settings.premiumPaymentLink || "https://razorpay.com/demo-premium-link-levelup-200"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-105 transition-all flex items-center justify-center gap-2 shrink-0"
              >
                <Sparkles className="w-4 h-4 fill-slate-950" />
                <span>Buy Premium ({settings.premiumPrice || "₹200"} / {settings.premiumDuration || "3 Mo"})</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            ) : (
              <div className="px-5 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Premium Sanctuary Active & 100% Ad-Free</span>
              </div>
            )}


          </div>
        </div>
      </div>

      {/* DASHBOARD TAB NAVIGATION BAR */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 scrollbar-none text-sm font-extrabold">
        <button
          onClick={() => setTab("routine")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "routine" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <Sun className="w-4 h-4 text-amber-400" />
          <span>Morning Routine ({activeRoutinesDone}/{routines.length})</span>
        </button>

        <button
          onClick={() => setTab("habits")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "habits" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          <span>Habits Tracker ({activeHabitsDone}/{habits.length})</span>
        </button>

        <button
          onClick={() => setTab("water")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "water" ? "bg-cyan-600 text-white shadow-lg shadow-cyan-600/20" : "bg-[#091526] text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <Droplet className="w-4 h-4 text-cyan-400 fill-cyan-400/30" />
          <span>Water ({water.glasses * 250} ml)</span>
        </button>

        <button
          onClick={() => setTab("goals")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "goals" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <Target className="w-4 h-4 text-blue-400" />
          <span>Goals & Milestones</span>
        </button>

        <button
          onClick={() => setTab("ai")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "ai" ? "bg-gradient-to-r from-amber-500 to-blue-600 text-slate-950 font-black shadow-lg shadow-amber-500/20" : "bg-[#091526] text-amber-300 border border-amber-500/30 hover:bg-slate-800"}`}
        >
          <Bot className="w-4 h-4 text-slate-950" />
          <span>AI Productivity Assistant {isPremium && "★ PRO"}</span>
        </button>

        <button
          onClick={() => setTab("resources")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "resources" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Downloadable Resources</span>
        </button>

        <button
          onClick={() => setTab("settings")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "settings" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-400 hover:bg-slate-800 hover:text-white"}`}
        >
          <Settings className="w-4 h-4 text-slate-300" />
          <span>Profile & Settings</span>
        </button>
      </div>

      {/* MAIN DASHBOARD WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-8 space-y-8">
          
          {tab === "routine" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#081220] border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Sun className="w-6 h-6 text-amber-400" />
                    <span>Morning Routine Checklist</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Complete each activity upon waking to maintain daily rhythm.</p>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-sm">
                  {Math.round((activeRoutinesDone / (routines.length || 1)) * 100)}% Complete
                </div>
              </div>

              <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div 
                  className="h-full bg-gradient-to-r from-blue-600 via-amber-500 to-emerald-400 transition-all duration-500" 
                  style={{ width: `${(activeRoutinesDone / (routines.length || 1)) * 100}%` }} 
                />
              </div>

              <div className="space-y-3">
                {routines.map((r: any) => (
                  <div 
                    key={r.id} 
                    onClick={() => toggleRoutine(r.id)}
                    className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                      r.isCompleted 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-slate-300 font-semibold" 
                        : "bg-[#0B182B] border-slate-700/80 hover:border-blue-500/50 text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-xl">
                        {r.isCompleted ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <Circle className="w-6 h-6 text-slate-500" />}
                      </div>
                      <div>
                        <p className={`font-bold text-base ${r.isCompleted ? "line-through text-slate-400" : "text-white"}`}>
                          {r.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1 text-[11px] font-mono text-slate-400">
                          <span className="text-amber-400">⏰ {r.time}</span>
                          <span>⏳ {r.duration}</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteItem(r.id, "routine"); }}
                      className="text-slate-500 hover:text-red-400 p-2 transition-colors"
                      title="Delete routine"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <form onSubmit={addRoutine} className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Add new morning routine activity..."
                  value={newRoutineTitle}
                  onChange={(e) => setNewRoutineTitle(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <input
                  type="text"
                  value={newRoutineTime}
                  onChange={(e) => setNewRoutineTime(e.target.value)}
                  className="w-28 px-3 py-3 rounded-xl bg-[#0E1B2E] border border-slate-700 text-amber-400 font-mono text-sm text-center focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Step</span>
                </button>
              </form>
            </div>
          )}

          {tab === "habits" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#081220] border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
                    <span>Daily Habit Tracker</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Check off habits daily to build and preserve your streaks.</p>
                </div>
                <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-bold text-xs border border-amber-500/30">
                  {habits.length} Active Habits
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {habits.map((h: any) => (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all flex flex-col justify-between ${
                      h.completedToday 
                        ? "bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5" 
                        : "bg-[#0C192C] border-slate-700 hover:border-slate-500"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-blue-300 font-bold uppercase tracking-wider">
                          {h.category}
                        </span>
                        <div className="flex items-center gap-1 font-mono font-extrabold text-amber-400 bg-slate-900 px-2.5 py-1 rounded-full border border-amber-500/30">
                          <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{h.streak} Day Streak</span>
                        </div>
                      </div>

                      <h4 className={`text-base font-bold mb-2 ${h.completedToday ? "text-amber-300" : "text-white"}`}>
                        {h.title}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-xs font-bold">
                      <div className="flex items-center gap-2">
                        {h.completedToday ? (
                          <span className="text-emerald-400 flex items-center gap-1"><CheckCircle className="w-4 h-4" /> Completed Today</span>
                        ) : (
                          <span className="text-slate-400 flex items-center gap-1"><Circle className="w-4 h-4" /> Tap to Complete</span>
                        )}
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteItem(h.id, "habit"); }}
                        className="text-slate-500 hover:text-red-400 p-1 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addHabit} className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Enter new habit name (e.g. Read 15 mins before bed)..."
                  value={newHabitTitle}
                  onChange={(e) => setNewHabitTitle(e.target.value)}
                  className="flex-grow px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <select
                  value={newHabitCategory}
                  onChange={(e) => setNewHabitCategory(e.target.value)}
                  className="px-4 py-3.5 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white font-medium text-sm focus:outline-none"
                >
                  <option value="Mindset">Mindset</option>
                  <option value="Health">Health</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Fitness">Fitness</option>
                </select>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm shrink-0"
                >
                  + Create Habit
                </button>
              </form>
            </div>
          )}

          {tab === "water" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-[#08182D] to-[#0A1628] border border-cyan-500/40 shadow-2xl space-y-8 text-center">
              <div className="max-w-md mx-auto space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-2">
                  <Droplet className="w-8 h-8 fill-cyan-400/30" />
                </div>
                <h2 className="text-3xl font-black text-white">Water Consumption Monitor</h2>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Proper physical rehydration upon waking supports sustained daily energy. Tap below to log your water glasses today.
                </p>
              </div>

              <div className="py-6 bg-[#061220] rounded-3xl border border-slate-800 max-w-lg mx-auto p-6 shadow-inner space-y-6">
                <div className="flex items-baseline justify-center gap-2 font-mono">
                  <span className="text-6xl font-black text-cyan-400">{water.glasses * 250}</span>
                  <span className="text-2xl font-bold text-slate-400">/ 2,000 ml</span>
                </div>
                <p className="text-sm font-extrabold text-white">
                  ({water.glasses} of {water.goal} Glasses Consumed Today)
                </p>

                <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 justify-center">
                  {[...Array(8)].map((_, idx) => {
                    const filled = idx < water.glasses;
                    return (
                      <button
                        key={idx}
                        onClick={() => updateWater(idx + 1)}
                        className={`py-6 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-2 ${
                          filled 
                            ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-lg shadow-cyan-500/30 scale-105" 
                            : "bg-slate-900 border-slate-700 text-slate-600 hover:border-cyan-500/50"
                        }`}
                        title={`Log ${idx + 1} glasses`}
                      >
                        <Droplet className={`w-6 h-6 ${filled ? "fill-slate-950" : ""}`} />
                        <span className="text-[10px] font-extrabold font-mono">#{idx + 1}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-slate-800">
                  <button
                    onClick={() => updateWater(water.glasses + 1)}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-sm shadow-md"
                  >
                    + Log 1 Glass (250ml)
                  </button>
                  <button
                    onClick={() => updateWater(0)}
                    className="px-4 py-3 rounded-xl bg-slate-800 text-slate-400 hover:text-white font-bold text-xs"
                  >
                    Reset Counter
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === "goals" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#081220] border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    <Target className="w-6 h-6 text-blue-400" />
                    <span>Long-Term Goal Milestones</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">Track larger quarterly objectives alongside your daily habit checklist.</p>
                </div>
              </div>

              <div className="space-y-4">
                {goals.map((g: any) => (
                  <div key={g.id} className="p-5 rounded-2xl bg-[#0C1A2C] border border-slate-700 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-600/30 text-blue-300 border border-blue-500/30">
                          {g.category}
                        </span>
                        <h4 className="text-lg font-bold text-white mt-1.5">{g.title}</h4>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-400 bg-slate-900 px-3 py-1 rounded-lg border border-slate-800">
                        Target: {g.targetDate}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-300">Progress: {g.progress}%</span>
                        {g.progress >= 100 ? (
                          <span className="text-emerald-400 flex items-center gap-1">🏆 Goal Completed!</span>
                        ) : (
                          <span className="text-slate-400">In Progress</span>
                        )}
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={g.progress}
                        onChange={(e) => updateGoalProgress(g.id, Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addGoal} className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="New goal milestone..."
                  value={newGoalTitle}
                  onChange={(e) => setNewGoalTitle(e.target.value)}
                  className="flex-grow px-4 py-3 rounded-xl bg-[#0E1B2E] border border-slate-700 text-white text-sm focus:outline-none focus:border-amber-400"
                />
                <input
                  type="date"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-[#0E1B2E] border border-slate-700 text-amber-400 text-sm focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shrink-0"
                >
                  + Add Goal
                </button>
              </form>
            </div>
          )}

          {tab === "ai" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#091526] border-2 border-amber-500/50 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
                    <Bot className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white flex items-center gap-2">
                      <span>AI Productivity Assistant</span>
                      <span className="text-[11px] uppercase bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded">
                        {isPremium ? "VIP UNLIMITED" : "FREE PLAN"}
                      </span>
                    </h2>
                    <p className="text-xs text-slate-300">Ask for advice on schedule planning, breaking down tasks, or routine consistency.</p>
                  </div>
                </div>
              </div>

              <div className="h-80 overflow-y-auto space-y-4 pr-2 border border-slate-800 rounded-2xl p-4 bg-[#050D18]">
                {aiHistory.map((m, idx) => (
                  <div key={idx} className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-md p-4 rounded-2xl text-sm leading-relaxed ${
                      m.sender === "user" 
                        ? "bg-blue-600 text-white font-medium rounded-br-none" 
                        : "bg-[#0F233E] border border-amber-500/30 text-slate-200 rounded-bl-none"
                    }`}>
                      {m.sender === "ai" && <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider mb-1">LevelUp Assistant:</p>}
                      {m.text}
                    </div>
                  </div>
                ))}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-[#0F233E] border border-amber-500/30 p-3 rounded-2xl text-xs text-amber-400 animate-pulse">
                      Generating suggestions...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleAiSend} className="flex gap-2">
                <input
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. Help me arrange an evening routine to prepare for early rising..."
                  className="flex-grow px-5 py-4 rounded-2xl bg-[#0D1E34] border border-slate-700 text-white placeholder-slate-400 font-medium focus:outline-none focus:border-amber-400"
                />
                <button
                  type="submit"
                  disabled={aiLoading}
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-lg shrink-0"
                >
                  Consult AI ⚡
                </button>
              </form>
            </div>
          )}

          {tab === "resources" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#081220] border border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Download className="w-6 h-6 text-emerald-400" />
                  <span>Downloadable Resources & PDF Guides</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Printable checklists and guidebooks to support your daily planning.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {resources.map((res: any) => {
                  const locked = res.isPremiumOnly && !isPremium;
                  return (
                    <div key={res.id} className="p-5 rounded-2xl bg-[#0C1A2B] border border-slate-700 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-emerald-400 font-extrabold uppercase">
                            {res.fileType} • {res.size}
                          </span>
                          {res.isPremiumOnly && (
                            <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] uppercase">
                              ★ Premium Only
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-extrabold text-white mb-2">{res.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">{res.description}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-slate-800">
                        {locked ? (
                          <a
                            href={settings.premiumPaymentLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500 text-amber-300 font-extrabold text-xs text-center block hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          >
                            🔒 Unlock with Premium (₹200 / 3 Mo)
                          </a>
                        ) : (
                          <a
                            href={res.fileUrl || "/logo.svg"}
                            download
                            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs text-center flex items-center justify-center gap-2 transition-colors"
                          >
                            <Download className="w-4 h-4" />
                            <span>Download Resource</span>
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "settings" && (
            <div className="p-6 sm:p-8 rounded-3xl bg-[#081220] border border-slate-800 shadow-xl space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-2">
                  <Settings className="w-6 h-6 text-slate-400" />
                  <span>Account Settings & Profile Management</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Update your display name and personal preferences.</p>
              </div>

              {profileSaved && (
                <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 font-extrabold text-sm">
                  ✓ Your profile settings have been successfully saved!
                </div>
              )}

              <form onSubmit={handleProfileSave} className="space-y-4 max-w-xl">
                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="text"
                    value={profileAvatar}
                    onChange={(e) => setProfileAvatar(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-1.5">
                    Personal Bio
                  </label>
                  <textarea
                    rows={3}
                    value={profileBio}
                    onChange={(e) => setProfileBio(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-base shadow-lg"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

        </div>

        {/* Right Column: ADVERTISEMENTS & SIDEBAR (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {!isPremium ? (
            <div className="p-5 rounded-3xl bg-[#091526] border border-amber-500/40 shadow-2xl space-y-4 relative">
              <div className="flex items-center justify-between text-[11px] font-black text-slate-400 border-b border-slate-800 pb-2">
                <span className="uppercase tracking-widest text-amber-400">⚡ Community Advertisements</span>
                <Link href="/premium" className="text-blue-400 hover:underline">Remove Ads →</Link>
              </div>

              {ads && ads.length > 0 ? (
                ads.slice(0, 2).map((ad: any) => (
                  <div key={ad.id} className="p-4 rounded-2xl bg-[#0D1B2E] border border-slate-700 hover:border-amber-500/40 transition-colors space-y-3">
                    <div className="h-36 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 relative">
                      <img src={ad.imageUrl || "/images/demo-ad.jpg"} alt={ad.brandName} className="w-full h-full object-cover" />
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] font-extrabold text-amber-400 uppercase">
                        {ad.category}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-extrabold text-white text-base flex items-center justify-between">
                        <span>{ad.brandName}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 leading-relaxed line-clamp-2">
                        {ad.details}
                      </p>
                    </div>
                    <Link
                      href={ad.websiteLink || "/advertisement"}
                      className="w-full py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white font-extrabold text-xs text-center block transition-colors border border-blue-500/40"
                    >
                      View Ad Details →
                    </Link>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4">No community ads running at this moment.</p>
              )}

              <div className="p-4 rounded-2xl bg-[#060E1A] border border-slate-800 text-center space-y-2">
                <p className="text-xs font-bold text-white">Want to advertise your brand here?</p>
                <Link
                  href={settings.linkAdvertisement || "/advertisement"}
                  className="inline-block px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-extrabold text-xs hover:bg-amber-400"
                >
                  Advertise for ₹100 / Mo 🚀
                </Link>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/15 via-[#0D1F36] to-blue-600/10 border-2 border-amber-500/50 shadow-xl text-center space-y-3">
              <Sparkles className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-lg font-extrabold text-white">Ad-Free Dashboard Sanctuary</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                As a LevelUp Premium member, advertisements have been hidden from your dashboard to support an uncluttered routine space.
              </p>
            </div>
          )}

          {/* Daily Routine Principle Card */}
          <div className="p-6 rounded-3xl bg-[#081220] border border-slate-800 space-y-4">
            <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest border-l-2 border-amber-500 pl-2.5">
              Habit Building Principle
            </h3>
            <p className="text-sm text-slate-200 italic leading-relaxed font-normal">
              "When forming a new habit, consistency matters far more than intensity. Performing a small action every day builds lasting stability."
            </p>
            <span className="text-xs font-bold text-slate-500 block text-right">— LevelUp Editorial Team</span>
          </div>

        </div>

      </div>

    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-slate-400 font-bold">Loading LevelUp Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
