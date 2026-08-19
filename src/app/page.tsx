"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { AuthModal } from "@/components/auth/AuthModal";
import { AdPlacementSlot } from "@/components/monetization/AdPlacementSlot";
import {
  Upload,
  ArrowRight,
  ShieldCheck,
  DollarSign,
  Share2,
  FileCheck,
  TrendingUp,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    // Record visitor event
    fetch("/api/v1/events/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: "/" }),
    }).catch(() => {});
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[300px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Universal Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdPlacementSlot location="BANNER" format="horizontal" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-28 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass-card border-blue-500/30 text-blue-400 text-xs font-medium mb-8 animate-fade-in shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Real Data Only • Transparent Revenue Sharing</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Upload. Share. <br />
          <span className="gradient-text">Earn Real Revenue.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          DropEarn is a transparent, high-performance file sharing platform.
          Upload your files, generate secure share links, and earn a
          guaranteed share from verified monetization revenue.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link href="/upload" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-blue-600/25">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Your Files</span>
            </Button>
          </Link>

          {user ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <span>View Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setAuthModalOpen(true)}
              className="w-full sm:w-auto"
            >
              <span>Get Started</span>
            </Button>
          )}
        </div>

        {/* 1. Below Hero Ad Placement */}
        <div className="max-w-4xl mx-auto mt-12">
          <AdPlacementSlot location="HOME_HERO_BOTTOM" format="horizontal" />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-blue-400 mb-2">
              Transparent Architecture
            </h2>
            <p className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              How DropEarn Works
            </p>
            <p className="text-slate-400 text-sm mt-3">
              Every step is backed by real database records, immutable ledger entries, and anti-fraud validation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4">
                <Upload className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Step 1
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                1. Upload File
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Files are uploaded and stored securely with custom privacy and password protection options.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 mb-4">
                <Share2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Step 2
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                2. Share Unique URL
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Generate a fast, public slug URL (e.g. <code className="text-blue-400">/d/8KxP2mQ</code>) to share with your audience or community.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-4">
                <FileCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Step 3
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                3. Qualified Download
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                When visitors download your file, our anti-fraud engine verifies the request to ensure legitimate, qualified engagement.
              </p>
            </div>

            {/* Step 4 */}
            <div className="glass-card rounded-2xl p-6 border border-slate-800 relative hover:border-slate-700 transition-colors">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-4">
                <DollarSign className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Step 4
              </span>
              <h3 className="text-lg font-bold text-white mt-1 mb-2">
                4. Real Payout
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Earned revenue is credited to your immutable earnings ledger. Request real payouts whenever you reach the minimum balance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Mid-Section Ad Placement */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AdPlacementSlot location="HOME_MID_SECTION" format="horizontal" />
      </div>

      {/* Feature Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-2xl p-8 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-5">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Encrypted File Delivery
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Files are securely processed and stored using high-speed storage with secure download streams and optional password locks.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-5">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Immutable Revenue Ledger
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Zero floating-point rounding errors. Every penny earned or withdrawn is traceable with decimal-safe double-entry ledger records.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-8 border border-slate-800">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Strict Anti-Fraud Protection
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated rate limiting, session verification, and dwell checks ensure advertisers and creators operate in a clean, legitimate ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-blue-500/20 text-center relative overflow-hidden bg-gradient-to-b from-blue-950/40 to-slate-900">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-4">
            Ready to monetize your file downloads?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8">
            Create an account in seconds with Google or email, upload your files, and start generating shareable links.
          </p>
          <Link href="/upload">
            <Button size="lg" className="shadow-lg shadow-blue-600/30">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Your First File</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* 3. Footer Ad Placement */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <AdPlacementSlot location="HOME_FOOTER" format="horizontal" />
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultMode="register"
      />
    </div>
  );
}
