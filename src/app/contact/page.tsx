"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, MapPin, Clock, Shield, Sparkles, MessageSquare } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setSubmitted(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        alert("Failed to send message. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting message.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-5xl mx-auto">
        
        {/* Left Col: Contact Details & Direct Email */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/40 text-amber-400 font-bold text-xs uppercase tracking-wider block w-fit mb-4">
              Get In Touch
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              We Are Here To Help You <span className="text-blue-400">LevelUp</span>
            </h1>
            <p className="text-slate-300 text-base leading-relaxed">
              Have a question about our ₹200 Premium plan, advertising spots, or AI Productivity Assistant? Reach out directly to our support leadership.
            </p>
          </div>

          {/* Primary Email Card */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0D1F38] to-[#0A1628] border-2 border-amber-500/50 shadow-2xl space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Official Support & Business Email:
            </span>
            <a 
              href="mailto:levelup2026@gmail.com"
              className="text-xl sm:text-2xl font-black text-amber-400 hover:underline flex items-center gap-3 break-all"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <span>levelup2026@gmail.com</span>
            </a>
            <p className="text-xs text-slate-400 font-medium pt-2 border-t border-slate-800">
              ⚡ Guaranteed response time within 12 hours for all user inquiries and advertisement proposals.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <span>Support Hours: Monday to Sunday (24/7 Priority Support for Premium)</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-300">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <span>Secure communication directly with LevelUp Founders</span>
            </div>
          </div>
        </div>

        {/* Right Col: Contact Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#081220] border border-slate-800 shadow-2xl">
          <h2 className="text-2xl font-black text-white mb-6 pb-4 border-b border-slate-800 flex items-center gap-2.5">
            <MessageSquare className="w-6 h-6 text-blue-400" />
            <span>Send A Message</span>
          </h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-center space-y-4 animate-in fade-in">
              <CheckCircle2 className="w-14 h-14 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-black text-white">Message Sent Successfully!</h3>
              <p className="text-slate-300 text-sm">
                Thank you for contacting LevelUp. Our support staff at <strong className="text-amber-400">levelup2026@gmail.com</strong> has received your transmission and will respond shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 text-white font-extrabold text-sm hover:bg-slate-700 mt-2"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  placeholder="e.g. Vikram Sharma"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0C192C] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  placeholder="you@domain.com"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0C192C] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-300 uppercase tracking-wider mb-2">
                  Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  placeholder="How can we help you level up today?"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0C192C] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-lg shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2.5 transition-transform active:scale-95"
              >
                <span>{loading ? "Sending..." : "Send Message"}</span>
                <Send className="w-5 h-5" />
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
