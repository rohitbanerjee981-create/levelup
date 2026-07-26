"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { 
  Menu, X, Sun, Moon, ArrowUpRight, Shield, User as UserIcon, 
  LogOut, Sparkles, LayoutDashboard, Settings, Crown 
} from "lucide-react";

export function Navbar() {
  const { user, settings, theme, toggleTheme, logout } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Features", href: "/#features" },
    { label: "Premium", href: settings.linkGetPremium !== "/premium" && settings.linkGetPremium.startsWith("http") ? settings.linkGetPremium : "/premium" },
    { label: "Advertisement", href: settings.linkAdvertisement || "/advertisement" },
    { label: "About", href: "/about" },
    { label: "Contact", href: settings.linkContact || "/contact" },
  ];

  return (
    <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-[#0A1628]/90 border-slate-800/80 text-white shadow-lg shadow-black/20' 
        : 'bg-white/90 border-slate-200 text-slate-900 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-amber-500 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full bg-[#0A1628] rounded-[10px] flex items-center justify-center p-1.5 overflow-hidden">
              <img src="/logo.svg" alt="LevelUp Lion Logo" className="w-8 h-8 object-contain" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-0.5 rounded-full shadow-sm">
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-blue-400 via-blue-300 to-amber-400 bg-clip-text text-transparent drop-shadow-sm">
                LevelUp
              </span>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                SaaS
              </span>
            </div>
            <span className="text-[11px] text-slate-400 -mt-1 tracking-wide hidden sm:block font-medium">
              Daily Habit Revolution
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 hover:text-amber-400 ${
                link.label === "Premium" ? "flex items-center gap-1 bg-gradient-to-r from-amber-500/10 to-blue-500/10 border border-amber-500/30 text-amber-400 hover:border-amber-400 shadow-xs" : ""
              }`}
            >
              {link.label === "Premium" && <Crown className="w-4 h-4 text-amber-400 animate-pulse" />}
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-xl border transition-all duration-200 hover:scale-105 ${
              theme === 'dark' 
                ? 'bg-slate-800/80 border-slate-700 text-amber-400 hover:bg-slate-800' 
                : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
            }`}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdown(!userDropdown)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-amber-500/20 border border-blue-500/30 hover:border-amber-400/50 transition-all font-semibold text-sm"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.name.charAt(0)}
                </div>
                <span className="max-w-[110px] truncate">{user.name.split(" ")[0]}</span>
                {user.isPremium && <Sparkles className="w-4 h-4 text-amber-400" />}
                {user.role === "admin" && <Shield className="w-4 h-4 text-blue-400" />}
              </button>

              {userDropdown && (
                <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-xl border p-2 backdrop-blur-xl transition-all duration-200 ${
                  theme === 'dark' ? 'bg-[#0D1B2A] border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-slate-300/50'
                }`}>
                  <div className="px-3 py-2 border-b border-slate-700/40 mb-1">
                    <p className="font-bold text-sm truncate">{user.name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1.5 flex gap-1.5">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        user.isPremium ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-slate-700 text-slate-300"
                      }`}>
                        {user.isPremium ? "Premium Active" : "Free Member"}
                      </span>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-600/20 hover:text-amber-400 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-blue-400" />
                    User Dashboard
                  </Link>

                  {user.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdown(false)}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-colors my-1"
                    >
                      <Shield className="w-4 h-4 text-amber-400" />
                      Owner Admin Panel
                    </Link>
                  )}

                  <Link
                    href="/dashboard?tab=settings"
                    onClick={() => setUserDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-blue-600/20 transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Account Settings
                  </Link>

                  <button
                    onClick={() => { setUserDropdown(false); logout(); }}
                    className="w-full mt-1 pt-1 border-t border-slate-700/40 flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={settings.linkLogin || "/login"}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 border ${
                  theme === 'dark' ? 'border-slate-700 hover:border-blue-500 hover:bg-blue-500/10' : 'border-slate-300 hover:border-blue-600 hover:bg-slate-100'
                }`}
              >
                Login
              </Link>
              <Link
                href={settings.linkSignUp || "/signup"}
                className="px-4 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-amber-500 text-white shadow-md shadow-blue-500/20 hover:shadow-amber-500/30 hover:scale-105 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-amber-400"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-200"
            aria-label="Open mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className={`md:hidden border-t px-4 pt-3 pb-6 space-y-3 ${
          theme === 'dark' ? 'bg-[#0B1729] border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
        }`}>
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2.5 rounded-xl font-bold text-base transition-colors ${
                  link.label === "Premium" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "hover:bg-slate-800/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 rounded-xl font-bold text-blue-400 bg-blue-500/10 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  Dashboard
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2.5 rounded-xl font-bold text-amber-400 bg-amber-500/10 flex items-center gap-2"
                  >
                    <Shield className="w-5 h-5" />
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={() => { setMobileMenuOpen(false); logout(); }}
                  className="w-full text-left px-3 py-2.5 rounded-xl font-bold text-red-400 flex items-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <Link
                  href={settings.linkLogin || "/login"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center font-bold border border-slate-600 hover:bg-slate-800"
                >
                  Login
                </Link>
                <Link
                  href={settings.linkSignUp || "/signup"}
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 rounded-xl text-center font-bold bg-gradient-to-r from-blue-600 to-amber-500 text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
