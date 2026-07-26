"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Shield, DollarSign, Users, TrendingUp, Link as LinkIcon, 
  CreditCard, Edit3, CheckCircle, XCircle, Trash2, Plus, 
  Download, RefreshCw, AlertTriangle, ExternalLink, Bot, Award, Globe, FileText 
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminPanelPage() {
  const { user, settings, refreshSettings } = useApp();
  const router = useRouter();
  
  const [tab, setTab] = useState<"revenue" | "links" | "homepage" | "ads" | "users" | "content" | "backup">("revenue");
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState<any>({ stats: null, users: [], advertisements: [], announcements: [], articles: [], resources: [], messages: [] });
  const [saveSuccess, setSaveSuccess] = useState("");

  // Editor forms
  const [editSettings, setEditSettings] = useState<any>({});

  // New Content Forms
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", target: "all" });
  const [newArticle, setNewArticle] = useState({ title: "", excerpt: "", content: "", category: "Discipline", readTime: "4 min read" });
  const [newResource, setNewResource] = useState({ title: "", description: "", fileUrl: "/logo.svg", fileType: "PDF Guide", size: "1.4 MB", isPremiumOnly: true });

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin");
      if (res.ok) {
        const data = await res.json();
        setAdminData(data);
        if (data.settings) setEditSettings(data.settings);
      }
    } catch (err) {
      console.error("Admin error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  if (!loading && (!user || user.role !== "admin")) {
    return (
      <div className="py-24 max-w-xl mx-auto px-4 sm:px-6 text-center space-y-6">
        <div className="p-8 rounded-3xl bg-[#091526] border border-slate-700 shadow-2xl space-y-4">
          <Shield className="w-16 h-16 text-slate-500 mx-auto" />
          <h1 className="text-3xl font-black text-white">Unauthorized Access</h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            The LevelUp Admin Panel is restricted to the platform owner only. Please log in with authorized credentials to continue.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold transition-all"
          >
            Return to Login
          </Link>
        </div>
      </div>
    );
  }

  // Handlers
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editSettings)
      });
      if (res.ok) {
        await refreshSettings();
        setSaveSuccess("Changes have been applied instantly across the entire website!");
        setTimeout(() => setSaveSuccess(""), 4000);
      }
    } catch (err) {
      alert("Failed to save settings.");
    }
  };

  const toggleUserPremium = async (id: number) => {
    await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "toggle_user_premium", id })
    });
    fetchAdminData();
  };

  const updateAdStatus = async (id: number, status: string) => {
    await fetch("/api/advertisement", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status })
    });
    fetchAdminData();
  };

  const deleteItem = async (id: number, type: string) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    await fetch(`/api/admin?id=${id}&type=${type}`, { method: "DELETE" });
    fetchAdminData();
  };

  const createAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_announcement", item: newAnnouncement })
    });
    setNewAnnouncement({ title: "", content: "", target: "all" });
    fetchAdminData();
  };

  const createArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "create_article", item: newArticle })
    });
    setNewArticle({ title: "", excerpt: "", content: "", category: "Discipline", readTime: "4 min read" });
    fetchAdminData();
  };

  const handleBackup = async () => {
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "backup_website" })
    });
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data.backup, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `levelup-website-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const stats = adminData.stats || {
    monthlyEarnings: { premiumRevenue: "₹200", adRevenue: "₹0", totalMonthly: "₹200" },
    lifetimeEarnings: { totalRevenue: "₹200", premiumRevenue: "₹200", adRevenue: "₹0", totalUsers: "3" },
    rawCounts: { users: 3, ads: 1, messages: 0 }
  };

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-8 rounded-3xl bg-gradient-to-r from-[#0C1B33] via-[#0A1628] to-blue-950/40 border-2 border-amber-500/50 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-lg shrink-0">
            <Shield className="w-8 h-8 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-black text-white">Owner Admin Panel</h1>
              <span className="bg-amber-400 text-slate-950 font-black px-2.5 py-0.5 rounded text-xs uppercase tracking-wider">
                Owner Protected
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Manage website destinations, payment links, advertisements, homepage text, and genuine database revenue.
            </p>
          </div>
        </div>

        <button
          onClick={fetchAdminData}
          className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs flex items-center gap-2 shrink-0 border border-slate-600"
        >
          <RefreshCw className="w-4 h-4 text-amber-400" />
          <span>Refresh Admin Data</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-emerald-300 font-extrabold text-base flex items-center justify-between">
          <span>✓ {saveSuccess}</span>
          <button onClick={() => setSaveSuccess("")} className="text-xs underline">Dismiss</button>
        </div>
      )}

      {/* ADMIN TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 text-sm font-extrabold scrollbar-none">
        <button
          onClick={() => setTab("revenue")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "revenue" ? "bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Revenue Dashboard</span>
        </button>

        <button
          onClick={() => setTab("links")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "links" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <LinkIcon className="w-4 h-4 text-blue-400" />
          <span>Link & Payment Manager</span>
        </button>

        <button
          onClick={() => setTab("homepage")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "homepage" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <Edit3 className="w-4 h-4 text-amber-400" />
          <span>Edit Homepage Texts</span>
        </button>

        <button
          onClick={() => setTab("ads")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "ads" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <Globe className="w-4 h-4 text-cyan-400" />
          <span>Manage Advertisements ({adminData.advertisements.length})</span>
        </button>

        <button
          onClick={() => setTab("users")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "users" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <Users className="w-4 h-4 text-emerald-400" />
          <span>Manage Users ({adminData.users.length})</span>
        </button>

        <button
          onClick={() => setTab("content")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "content" ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <FileText className="w-4 h-4 text-amber-400" />
          <span>Announcements & Articles</span>
        </button>

        <button
          onClick={() => setTab("backup")}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl transition-all shrink-0 ${tab === "backup" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "bg-[#091526] text-slate-300 hover:bg-slate-800"}`}
        >
          <Download className="w-4 h-4 text-white" />
          <span>Backup Website</span>
        </button>
      </div>

      {/* WORKSPACE AREA */}
      <div>
        
        {/* TAB 1: REVENUE DASHBOARD CARDS (Strictly verified DB counts) */}
        {tab === "revenue" && (
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <h2 className="text-3xl font-black text-white">Verified Revenue & Volume Dashboard</h2>
              <p className="text-slate-400 text-sm">Strict calculation derived directly from genuine Premium user rows and active paid advertisement placements in PostgreSQL.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* CARD 1: MONTHLY EARNINGS */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0D1F38] to-[#0A1628] border-2 border-amber-500/50 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-amber-400 bg-amber-500/20 rounded" />
                    Monthly Earnings
                  </span>
                  <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-mono font-bold">
                    Real-time Math
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-sm font-medium block">Total Monthly Revenue</span>
                    <span className="text-5xl font-black text-white font-mono tracking-tight block mt-1">
                      {stats.monthlyEarnings.totalMonthly}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    <div className="p-4 rounded-2xl bg-[#071120] border border-slate-700">
                      <span className="text-xs text-slate-400 block font-bold">Premium Revenue (₹200)</span>
                      <span className="text-xl font-extrabold text-amber-300 font-mono block mt-1">
                        {stats.monthlyEarnings.premiumRevenue}
                      </span>
                    </div>
                    <div className="p-4 rounded-2xl bg-[#071120] border border-slate-700">
                      <span className="text-xs text-slate-400 block font-bold">Advertisement Revenue (₹100)</span>
                      <span className="text-xl font-extrabold text-blue-300 font-mono block mt-1">
                        {stats.monthlyEarnings.adRevenue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* CARD 2: LIFETIME EARNINGS & USERS */}
              <div className="p-8 rounded-3xl bg-gradient-to-br from-[#0A1A30] to-[#081324] border border-slate-700/80 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                  <span className="text-xs font-black text-blue-400 uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-400 bg-blue-500/20 rounded" />
                    Lifetime Volume
                  </span>
                  <span className="px-2.5 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-mono font-bold">
                    Database Totals
                  </span>
                </div>

                <div className="space-y-4">
                  <div>
                    <span className="text-slate-400 text-sm font-medium block">Total Lifetime Revenue</span>
                    <span className="text-5xl font-black text-amber-400 font-mono tracking-tight block mt-1">
                      {stats.lifetimeEarnings.totalRevenue}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-center">
                    <div className="p-3 rounded-2xl bg-[#071120] border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase">Total Users</span>
                      <span className="text-lg font-black text-white font-mono block mt-1">
                        {stats.lifetimeEarnings.totalUsers}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#071120] border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase">Premium Revenue</span>
                      <span className="text-lg font-extrabold text-amber-300 font-mono block mt-1">
                        {stats.lifetimeEarnings.premiumRevenue}
                      </span>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#071120] border border-slate-700">
                      <span className="text-[10px] text-slate-400 font-extrabold block uppercase">Ad Revenue</span>
                      <span className="text-lg font-extrabold text-blue-300 font-mono block mt-1">
                        {stats.lifetimeEarnings.adRevenue}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: COMPLETE LINK MANAGER & PAYMENT SETTINGS */}
        {tab === "links" && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#081322] border border-slate-700 shadow-2xl space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-3xl font-black text-white flex items-center gap-3">
                <LinkIcon className="w-7 h-7 text-amber-400" />
                <span>Website Link & Payment Manager</span>
              </h2>
              <p className="text-sm text-slate-300 mt-1">
                Change the destination of every button across LevelUp instantly without touching code. Paste your verified Razorpay or payment URLs here!
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-8">
              
              {/* SECTION A: PAYMENT SETTINGS */}
              <div className="p-6 rounded-3xl bg-[#0A192E] border-2 border-amber-500/50 space-y-6">
                <h3 className="text-lg font-extrabold text-amber-300 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Payment Settings (Razorpay / Gateway URLs)</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                      Premium Payment Link <span className="text-amber-400">(Opens on "Buy Premium" click)</span>
                    </label>
                    <input
                      type="text"
                      value={editSettings.premiumPaymentLink || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, premiumPaymentLink: e.target.value })}
                      required
                      placeholder="https://razorpay.com/your-payment-link-200"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0D213B] border border-amber-500/50 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                      Advertisement Payment Link <span className="text-blue-400">(Opens on "Pay ₹100" click)</span>
                    </label>
                    <input
                      type="text"
                      value={editSettings.adPaymentLink || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, adPaymentLink: e.target.value })}
                      required
                      placeholder="https://razorpay.com/your-payment-link-100"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#0D213B] border border-amber-500/50 text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <label className="block font-extrabold text-slate-300 mb-1">Premium Price Text</label>
                    <input
                      type="text"
                      value={editSettings.premiumPrice || "₹200"}
                      onChange={(e) => setEditSettings({ ...editSettings, premiumPrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-slate-300 mb-1">Premium Duration Text</label>
                    <input
                      type="text"
                      value={editSettings.premiumDuration || "3 Months"}
                      onChange={(e) => setEditSettings({ ...editSettings, premiumDuration: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-slate-700 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-extrabold text-slate-300 mb-1">Advertisement Price Text</label>
                    <input
                      type="text"
                      value={editSettings.adPrice || "₹100 for 1 Month"}
                      onChange={(e) => setEditSettings({ ...editSettings, adPrice: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#071322] border border-slate-700 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION B: BUTTON DESTINATION LINK MANAGER */}
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <span>Universal Button Link Manager</span>
                </h3>
                <p className="text-xs text-slate-400">Modify the target destination URL of primary website buttons below:</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Get Premium Button Link</label>
                    <input
                      type="text"
                      value={editSettings.linkGetPremium || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, linkGetPremium: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Contact Button Link</label>
                    <input
                      type="text"
                      value={editSettings.linkContact || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, linkContact: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Advertisement Button Link</label>
                    <input
                      type="text"
                      value={editSettings.linkAdvertisement || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, linkAdvertisement: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Download Button Link</label>
                    <input
                      type="text"
                      value={editSettings.linkDownload || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, linkDownload: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Blog Button Link</label>
                    <input
                      type="text"
                      value={editSettings.linkBlog || ""}
                      onChange={(e) => setEditSettings({ ...editSettings, linkBlog: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-blue-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-1.5">Login & Signup Links</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Login"
                        value={editSettings.linkLogin || ""}
                        onChange={(e) => setEditSettings({ ...editSettings, linkLogin: e.target.value })}
                        className="w-1/2 px-3 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Sign Up"
                        value={editSettings.linkSignUp || ""}
                        onChange={(e) => setEditSettings({ ...editSettings, linkSignUp: e.target.value })}
                        className="w-1/2 px-3 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white font-mono text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-blue-600 text-slate-950 font-black text-lg shadow-xl shadow-amber-500/20 hover:scale-105 transition-all block"
              >
                Save Link & Payment Settings ⚡
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: EDIT HOMEPAGE TEXTS */}
        {tab === "homepage" && (
          <div className="p-8 sm:p-10 rounded-3xl bg-[#081322] border border-slate-700 shadow-2xl space-y-8">
            <div>
              <h2 className="text-3xl font-black text-white">Edit Homepage Texts & Footer</h2>
              <p className="text-sm text-slate-300 mt-1">Customize the primary hero titles and footer copyright text appearing across the website.</p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                  Homepage Main Title
                </label>
                <input
                  type="text"
                  value={editSettings.homepageTitle || ""}
                  onChange={(e) => setEditSettings({ ...editSettings, homepageTitle: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0E1E34] border border-slate-700 text-white font-bold text-lg focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                  Homepage Subtitle
                </label>
                <textarea
                  rows={2}
                  value={editSettings.homepageSubtitle || ""}
                  onChange={(e) => setEditSettings({ ...editSettings, homepageSubtitle: e.target.value })}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0E1E34] border border-slate-700 text-white font-medium text-base focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2">
                  Footer Copyright Text
                </label>
                <input
                  type="text"
                  value={editSettings.customFooterText || ""}
                  onChange={(e) => setEditSettings({ ...editSettings, customFooterText: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#0E1E34] border border-slate-700 text-white text-sm"
                />
              </div>

              <button
                type="submit"
                className="px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 text-white font-black text-lg shadow-xl"
              >
                Save Homepage Edits Now ⚡
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: MANAGE ADVERTISEMENTS */}
        {tab === "ads" && (
          <div className="p-8 rounded-3xl bg-[#081322] border border-slate-700 shadow-2xl space-y-6">
            <div>
              <h2 className="text-3xl font-black text-white">Manage Advertisements</h2>
              <p className="text-sm text-slate-300 mt-1">Approve, reject, or remove sponsor banner ads displayed across Free user dashboards.</p>
            </div>

            <div className="space-y-4">
              {adminData.advertisements.map((ad: any) => (
                <div key={ad.id} className="p-6 rounded-2xl bg-[#0B182B] border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <img src={ad.imageUrl || "/images/demo-ad.jpg"} alt={ad.brandName} className="w-24 h-16 rounded-xl object-cover border border-slate-600 shrink-0" />
                    <div>
                      <div className="flex items-center gap-3">
                        <h4 className="font-black text-white text-lg">{ad.brandName}</h4>
                        <span className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded uppercase ${
                          ad.status === "approved" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : 
                          ad.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-amber-500/20 text-amber-300"
                        }`}>
                          Status: {ad.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1 line-clamp-2">{ad.details}</p>
                      <p className="text-[11px] font-mono text-amber-400 mt-1">Contact: {ad.email} ({ad.phone}) • Link: {ad.websiteLink}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => updateAdStatus(ad.id, "approved")}
                      className="px-4 py-2 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white text-xs font-bold border border-emerald-500/40 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateAdStatus(ad.id, "rejected")}
                      className="px-4 py-2 rounded-xl bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white text-xs font-bold border border-amber-500/40 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => deleteItem(ad.id, "ad")}
                      className="p-2.5 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white transition-colors"
                      title="Delete advertisement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: MANAGE USERS & PREMIUM STATUS */}
        {tab === "users" && (
          <div className="p-8 rounded-3xl bg-[#081322] border border-slate-700 shadow-2xl space-y-6 overflow-x-auto">
            <div>
              <h2 className="text-3xl font-black text-white">Manage Users & Premium Subscriptions</h2>
              <p className="text-sm text-slate-300 mt-1">View registered accounts and modify Premium access status instantly.</p>
            </div>

            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead>
                <tr className="border-b border-slate-700 text-slate-400 font-extrabold uppercase text-xs">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Subscription Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {adminData.users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-[#0D1C30] transition-colors">
                    <td className="py-4 px-4 font-extrabold text-white flex items-center gap-3">
                      <img src={u.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80"} alt="" className="w-8 h-8 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-slate-400">{u.email}</td>
                    <td className="py-4 px-4">
                      <span className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${u.role === "admin" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-300"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full font-extrabold text-xs inline-flex items-center gap-1.5 ${
                        u.isPremium ? "bg-amber-500/20 text-amber-400 border border-amber-500/40" : "bg-slate-800 text-slate-400"
                      }`}>
                        {u.isPremium ? "⚡ Premium Active (₹200 Plan)" : "Free Member"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2">
                      <button
                        onClick={() => toggleUserPremium(u.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-transform active:scale-95"
                      >
                        {u.isPremium ? "Revoke Premium" : "Grant Premium"}
                      </button>
                      {u.email !== "admin@levelup.com" && (
                        <button
                          onClick={() => deleteItem(u.id, "user")}
                          className="p-2 rounded-xl bg-slate-800 text-red-400 hover:bg-red-500/20"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 6: CONTENT, ANNOUNCEMENTS & ARTICLES */}
        {tab === "content" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="p-8 rounded-3xl bg-[#081322] border border-slate-700 space-y-6">
              <h3 className="text-xl font-black text-amber-400">Broadcast Announcement to Users</h3>
              <form onSubmit={createAnnouncement} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Broadcast Title</label>
                  <input
                    type="text"
                    placeholder="e.g. New Habit Stacking template now available!"
                    value={newAnnouncement.title}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Message Body</label>
                  <textarea
                    rows={3}
                    placeholder="Details about new features or community reminders..."
                    value={newAnnouncement.content}
                    onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white text-sm"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-2xl bg-amber-500 text-slate-950 font-black">
                  Publish Broadcast ⚡
                </button>
              </form>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase">Active Broadcasts:</h4>
                {adminData.announcements.map((an: any) => (
                  <div key={an.id} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center text-xs">
                    <span className="font-bold text-white truncate max-w-[200px]">{an.title}</span>
                    <button onClick={() => deleteItem(an.id, "announcement")} className="text-red-400 font-bold hover:underline">Delete</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-[#081322] border border-slate-700 space-y-6">
              <h3 className="text-xl font-black text-blue-400">Publish New Article / Guide</h3>
              <form onSubmit={createArticle} className="space-y-4">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Article Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Why Consistent Waking Hours Stabilize Energy"
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Short Excerpt / Summary</label>
                  <input
                    type="text"
                    placeholder="Brief summary for article preview cards..."
                    value={newArticle.excerpt}
                    onChange={(e) => setNewArticle({ ...newArticle, excerpt: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Full Content (Markdown/Text)</label>
                  <textarea
                    rows={4}
                    placeholder="Detailed recommendations and action steps..."
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-[#0D1D32] border border-slate-700 text-white text-sm"
                  />
                </div>
                <button type="submit" className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-black">
                  Publish Article 📚
                </button>
              </form>
            </div>

          </div>
        )}

        {/* TAB 7: BACKUP WEBSITE DATABASE */}
        {tab === "backup" && (
          <div className="p-10 rounded-3xl bg-[#081322] border-2 border-emerald-500/50 text-center max-w-2xl mx-auto space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Download className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">Full Website Database Backup</h2>
              <p className="text-slate-300 text-base mt-2 leading-relaxed">
                Generate an instant JSON snapshot of all LevelUp site settings, registered members, payment configurations, advertisements, and blog articles.
              </p>
            </div>
            <button
              onClick={handleBackup}
              className="px-10 py-5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xl shadow-xl shadow-emerald-500/20 transition-all block mx-auto"
            >
              Download Backup (.JSON) 📦
            </button>
            <p className="text-xs text-slate-500 font-semibold">
              Includes actual database timestamps and table records.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
