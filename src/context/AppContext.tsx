"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string; // "user" | "admin"
  isPremium: boolean;
  premiumExpiry?: string;
  isVerified: boolean;
  avatar?: string;
  bio?: string;
}

export interface SiteSettings {
  id: number;
  homepageTitle: string;
  homepageSubtitle: string;
  premiumPaymentLink: string;
  adPaymentLink: string;
  premiumPrice: string;
  premiumDuration: string;
  adPrice: string;
  linkGetPremium: string;
  linkContact: string;
  linkAdvertisement: string;
  linkDownload: string;
  linkBlog: string;
  linkLogin: string;
  linkSignUp: string;
  statsUsersCount: number;
  statsHabitsTracked: number;
  statsRoutinesDone: number;
  statsSatisfactionRate: string;
  customFooterText: string;
}

interface AppContextType {
  user: User | null;
  settings: SiteSettings;
  theme: "dark" | "light";
  toggleTheme: () => void;
  refreshUser: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const defaultSettings: SiteSettings = {
  id: 1,
  homepageTitle: "Level Up Your Life Every Single Day",
  homepageSubtitle: "Build better habits, improve your morning routine, and unlock your best self.",
  premiumPaymentLink: "https://razorpay.com/demo-premium-link-levelup-200",
  adPaymentLink: "https://razorpay.com/demo-ad-link-levelup-100",
  premiumPrice: "₹200",
  premiumDuration: "3 Months",
  adPrice: "₹100 for 1 Month",
  linkGetPremium: "/premium",
  linkContact: "/contact",
  linkAdvertisement: "/advertisement",
  linkDownload: "/dashboard?tab=resources",
  linkBlog: "/blog",
  linkLogin: "/login",
  linkSignUp: "/signup",
  statsUsersCount: 0,
  statsHabitsTracked: 0,
  statsRoutinesDone: 0,
  statsSatisfactionRate: "100%",
  customFooterText: "© 2026 LevelUp. All Rights Reserved."
};

const AppContext = createContext<AppContextType>({
  user: null,
  settings: defaultSettings,
  theme: "dark",
  toggleTheme: () => {},
  refreshUser: async () => {},
  refreshSettings: async () => {},
  logout: async () => {},
  isLoading: true
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      }
    } catch (e) {
      console.error("Error fetching user session:", e);
    }
  };

  const refreshSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data.settings) setSettings(data.settings);
      }
    } catch (e) {
      console.error("Error fetching settings:", e);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      window.location.href = "/";
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      if (typeof window !== "undefined") {
        localStorage.setItem("levelup_theme", next);
        if (next === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("levelup_theme") as "dark" | "light";
    const initialTheme = storedTheme || "dark";
    setTheme(initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    Promise.all([refreshUser(), refreshSettings()]).finally(() => {
      setIsLoading(false);
    });
  }, []);

  return (
    <AppContext.Provider value={{
      user,
      settings,
      theme,
      toggleTheme,
      refreshUser,
      refreshSettings,
      logout,
      isLoading
    }}>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${theme === 'dark' ? 'bg-[#060D1A] text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
