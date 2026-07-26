import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ensureSeeded } from "@/lib/db-seed";

export const metadata: Metadata = {
  title: "LevelUp | Level Up Your Life Every Single Day",
  description: "Build better habits, improve your morning routine, and unlock your best self with LevelUp's modern discipline and habit tracking tools.",
  icons: {
    icon: "/favicon.svg",
  }
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  await ensureSeeded();

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-[#060D1A] text-slate-100 antialiased min-h-screen flex flex-col selection:bg-amber-500 selection:text-slate-950">
        <AppProvider>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
