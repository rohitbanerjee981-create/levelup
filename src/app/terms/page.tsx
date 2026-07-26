import React from "react";
import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-4xl font-black text-white">Terms of Service</h1>
      <p className="text-sm text-slate-400">Effective Date: 2026</p>
      
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <p>
          By creating an account or advertising on LevelUp, you agree to abide by these Terms of Service.
        </p>
        <h3 className="text-xl font-bold text-white mt-6">1. Subscriptions & Advertisements</h3>
        <p>
          LevelUp offers a 3-Month Premium subscription for ₹200 and community advertisement slots for ₹100 per Month. Pricing is transparently presented before redirection to our payment gateways.
        </p>
        <h3 className="text-xl font-bold text-white mt-6">2. Acceptable Advertising Content</h3>
        <p>
          All submitted brand advertisements must promote lawful, high-quality products or services. Our Admin reserves the authority to approve, reject, or remove advertisements that violate ethical standards.
        </p>
        <h3 className="text-xl font-bold text-white mt-6">3. Contact Information</h3>
        <p>
          Questions regarding these terms should be addressed to <strong className="text-amber-400">levelup2026@gmail.com</strong>.
        </p>
      </div>
      <Link href="/" className="inline-block text-amber-400 font-bold hover:underline">← Return to Homepage</Link>
    </div>
  );
}
