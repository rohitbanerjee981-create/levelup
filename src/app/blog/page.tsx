"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { Sparkles, BookOpen, Clock, User, ArrowUpRight, ChevronRight } from "lucide-react";

export default function BlogPage() {
  const { user, settings } = useApp();
  const [articles, setArticles] = useState<any[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  useEffect(() => {
    fetch("/api/dashboard").then(res => res.json()).then(data => {
      if (data.articles) {
        setArticles(data.articles);
        setSelectedArticle(data.articles[0] || null);
      }
    });
  }, []);

  return (
    <div className="py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
          Neuroscience & Mastery
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
          The <span className="bg-gradient-to-r from-blue-400 via-amber-300 to-amber-400 bg-clip-text text-transparent">LevelUp Wisdom</span> Library
        </h1>
        <p className="text-slate-300 text-base sm:text-lg">
          Actionable findings on dopamine regulation, 20-second activation habits, and defending attention in the distraction economy.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: Article Reader (7 cols) */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#091526] border border-slate-700/80 shadow-2xl space-y-6">
          {selectedArticle ? (
            <div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate-400 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-blue-600/30 text-blue-300 border border-blue-500/30 uppercase">
                  {selectedArticle.category}
                </span>
                <span>• {selectedArticle.readTime}</span>
                {selectedArticle.isPremium && (
                  <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black text-[10px] uppercase">
                    ★ Premium Article
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-4">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-800 text-xs text-slate-300">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <span>By {selectedArticle.author}</span>
              </div>

              {selectedArticle.isPremium && (!user || !user.isPremium) ? (
                <div className="p-8 rounded-2xl bg-[#0D1F38] border-2 border-amber-500/60 text-center space-y-4">
                  <Sparkles className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
                  <h3 className="text-2xl font-black text-white">VIP Premium Article Locked</h3>
                  <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
                    This detailed deep dive into cognitive discipline is exclusively available to LevelUp Premium subscribers (just <strong className="text-amber-300">₹200 for 3 Months</strong>).
                  </p>
                  <a
                    href={settings.premiumPaymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-base shadow-xl"
                  >
                    <span>Unlock Premium Access</span>
                    <ArrowUpRight className="w-5 h-5" />
                  </a>
                </div>
              ) : (
                <div className="text-slate-200 space-y-6 text-base leading-relaxed whitespace-pre-line font-normal">
                  {selectedArticle.content}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-400 text-center py-12">Select an article from the right to read...</p>
          )}
        </div>

        {/* Right Col: Articles List (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest border-l-2 border-amber-500 pl-2">
            Available Guides & Articles ({articles.length})
          </h3>

          {articles.map((art: any) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                selectedArticle?.id === art.id 
                  ? "bg-[#0E223D] border-amber-500/60 shadow-lg shadow-amber-500/10" 
                  : "bg-[#081220] border-slate-800 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 mb-2">
                <span className="text-blue-400 uppercase">{art.category}</span>
                <span>{art.readTime}</span>
              </div>
              <h4 className="font-extrabold text-white text-base leading-snug flex items-center justify-between gap-2">
                <span>{art.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-500 shrink-0" />
              </h4>
              <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                {art.excerpt}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
