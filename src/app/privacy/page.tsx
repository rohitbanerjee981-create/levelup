import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-4xl font-black text-white">Privacy Policy</h1>
      <p className="text-sm text-slate-400">Last Updated: January 2026</p>
      
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <p>
          At LevelUp (operated via levelup2026@gmail.com), safeguarding your daily cognitive habit logs, routine checklists, and email credentials is our fundamental priority. This Privacy Policy outlines how we collect, store, and utilize your personal information.
        </p>
        <h3 className="text-xl font-bold text-white mt-6">1. Information We Collect</h3>
        <p>
          When you register for a Free or Premium account, we store your full name, email address, password hash (encrypted via bcrypt), and the custom habit sequences you create within our database.
        </p>
        <h3 className="text-xl font-bold text-white mt-6">2. Payment Security & Links</h3>
        <p>
          We utilize external admin-configured Payment Links (such as Razorpay). We do not directly capture or store credit card, banking, or UPI PIN data on LevelUp servers. All transactional processing occurs across certified financial gateways.
        </p>
        <h3 className="text-xl font-bold text-white mt-6">3. Direct Contact</h3>
        <p>
          For any data deletion requests or privacy inquiries, contact our leadership directly at <strong className="text-amber-400">levelup2026@gmail.com</strong>.
        </p>
      </div>
      
      <Link href="/" className="inline-block text-amber-400 font-bold hover:underline">← Return to Homepage</Link>
    </div>
  );
}
