"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Sparkles, Shield, ArrowUpRight, CheckCircle, ExternalLink, 
  Image as ImageIcon, Building, Globe, Mail, Phone, Tag, AlignLeft, Send 
} from "lucide-react";

export default function AdvertisementPage() {
  const { settings } = useApp();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const [form, setForm] = useState({
    brandName: "",
    category: "Health & Supplements",
    details: "",
    websiteLink: "",
    imageUrl: "/images/demo-ad.jpg",
    email: "",
    phone: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/advertisement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      
      if (res.ok) {
        const data = await res.json();
        setSubmitted(true);
        setTimeout(() => {
          window.location.href = data.redirectUrl || settings.adPaymentLink || "https://razorpay.com/demo-ad-link-levelup-100";
        }, 2500);
      } else {
        alert("Failed to submit advertisement. Please check your inputs.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      window.location.href = settings.adPaymentLink;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start max-w-6xl mx-auto">
        
        <div className="lg:col-span-5 space-y-8">
          <div>
            <span className="px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold text-xs uppercase tracking-wider block w-fit mb-4">
              Community Advertising
            </span>
            <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
              Advertise With <span className="bg-gradient-to-r from-blue-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">LevelUp</span>
            </h1>
            <p className="text-slate-300 text-lg sm:text-xl font-medium leading-relaxed">
              Want to advertise your Brand or Something? <br/>
              <strong className="text-amber-400 text-2xl block mt-2 font-extrabold">Advertise on LevelUp for just ₹100 for 1 Month.</strong>
            </p>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Fill out the form below. Once submitted and paid, your banner will appear directly across Free user dashboards and available ad placements.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#091424] border border-slate-700/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 pb-2 border-b border-slate-800">
              <span>Banner Advertisement Preview</span>
              <span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded border border-amber-500/40">
                Sponsor Spot
              </span>
            </div>
            
            <div className="rounded-2xl overflow-hidden h-44 bg-slate-900 border border-slate-800 relative">
              <img 
                src={form.imageUrl || "/images/demo-ad.jpg"} 
                alt="Brand Preview" 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 left-2 px-2 py-1 rounded bg-slate-950/80 text-[10px] text-amber-400 font-extrabold uppercase tracking-wider border border-amber-400/30">
                {form.category || "Sponsored"}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-black text-white mb-1 flex items-center justify-between">
                <span>{form.brandName || "Your Brand Name"}</span>
                <ExternalLink className="w-4 h-4 text-blue-400" />
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {form.details || "Your advertisement description will be displayed here for users viewing the free dashboard."}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-xs text-slate-300 space-y-1.5">
            <div className="font-bold text-blue-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Managed Payment Links:</span>
            </div>
            <p>
              When you click <strong className="text-amber-300">Pay ₹100</strong>, you are directed straight to the payment URL currently maintained in the Admin Panel (<code className="text-amber-400 bg-slate-900 px-1 rounded">{settings.adPaymentLink}</code>).
            </p>
          </div>
        </div>

        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0A1628] border border-slate-700/80 shadow-2xl relative">
          
          <h2 className="text-2xl font-black text-white mb-6 pb-4 border-b border-slate-800 flex items-center gap-2.5">
            <Building className="w-6 h-6 text-amber-400" />
            <span>Advertisement Application Form</span>
          </h2>

          {submitted ? (
            <div className="p-8 rounded-2xl bg-emerald-500/20 border-2 border-emerald-400 text-center space-y-4">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto" />
              <h3 className="text-2xl font-extrabold text-white">Application Logged!</h3>
              <p className="text-slate-200 font-medium text-base">
                Your advertisement application has been recorded. Redirecting you now to our payment checkout link (<strong className="text-amber-300">₹100 for 1 Month</strong>)...
              </p>
              <div className="pt-4">
                <a
                  href={settings.adPaymentLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 text-slate-950 font-black text-base hover:bg-amber-400"
                >
                  <span>Click here if not redirected automatically</span>
                  <ArrowUpRight className="w-5 h-5" />
                </a>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-400" />
                  Brand Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  name="brandName"
                  value={form.brandName}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Acme Productivity Tools"
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Tag className="w-4 h-4 text-blue-400" />
                    Advertisement Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white font-medium focus:outline-none focus:border-amber-400"
                  >
                    <option value="Health & Fitness">Health & Fitness</option>
                    <option value="Education & Books">Education & Books</option>
                    <option value="Productivity Tools">Productivity Tools</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Coaching & Services">Coaching & Services</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-blue-400" />
                    Website Link <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="url"
                    name="websiteLink"
                    value={form.websiteLink}
                    onChange={handleChange}
                    required
                    placeholder="https://yourwebsite.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-blue-400" />
                  Advertisement Details <span className="text-amber-400">*</span>
                </label>
                <textarea
                  name="details"
                  value={form.details}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Summarize your brand or product benefits simply in 2 to 3 sentences..."
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-amber-400" />
                  Banner Image URL <span className="text-slate-400 font-normal">(Default image selected)</span>
                </label>
                <input
                  type="text"
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  placeholder="/images/demo-ad.jpg or https://..."
                  className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-400" />
                    Email Address <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="contact@yourbrand.com"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-400" />
                    Phone Number <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3.5 rounded-xl bg-[#0F1E36] border border-slate-700 text-white placeholder-slate-500 font-medium focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 hover:from-blue-500 hover:to-amber-400 text-white font-black text-2xl shadow-2xl shadow-blue-500/25 hover:shadow-amber-500/30 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span>{loading ? "Submitting Application..." : "Pay ₹100"}</span>
                  <ArrowUpRight className="w-7 h-7" />
                </button>
                <p className="text-center text-xs text-slate-400 mt-3 font-semibold">
                  Clicking Pay ₹100 saves your application for admin verification and opens the saved payment link.
                </p>
              </div>

            </form>
          )}

        </div>
      </div>
    </div>
  );
}
