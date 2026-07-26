import React from "react";
import Link from "next/link";

export default function RefundPolicyPage() {
  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <h1 className="text-4xl font-black text-white">Refund & Cancellation Policy</h1>
      <p className="text-sm text-slate-400">Effective for 2026 Operations</p>
      
      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <h3 className="text-xl font-bold text-white">1. Premium Subscription Refunds (₹200 / 3 Months)</h3>
        <p>
          We are committed to delivering immediate executive value through our Ad-Free sanctuary and unlimited AI Productivity Assistant. If you experience technical incompatibility within the first 7 days of activating your ₹200 Premium plan, you may submit a review inquiry to <strong className="text-amber-400">levelup2026@gmail.com</strong> for resolution or pro-rated consideration.
        </p>
        <h3 className="text-xl font-bold text-white">2. Advertisement Slot Policy (₹100 / Month)</h3>
        <p>
          Once an advertisement spot is submitted and approved by our admin, display rotation initiates across Free user dashboards. If an advertisement application is rejected by our Admin for incompatibility, a full replacement or refund consideration will be arranged via direct correspondence.
        </p>
      </div>
      <Link href="/" className="inline-block text-amber-400 font-bold hover:underline">← Return to Homepage</Link>
    </div>
  );
}
