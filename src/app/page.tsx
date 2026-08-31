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
  Zap,
  CheckCircle2,
  Gamepad2,
  Code2,
  Palette,
  BookOpen,
  Sparkles,
  Layers,
  Globe,
  Sliders,
} from "lucide-react";

export default function HomePage() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Interactive Earnings Calculator State
  const [calcDownloads, setCalcDownloads] = useState<number>(25000);
  const [calcTierRate, setCalcTierRate] = useState<number>(12); // $12 per 1k (Tier 1)
  const [calcTierName, setCalcTierName] = useState<string>("Tier 1 (US, UK, CA, AU)");

  useEffect(() => {
    // Record visitor event
    fetch("/api/v1/events/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: "/" }),
    }).catch(() => {});
  }, []);

  const estimatedMonthlyEarnings = ((calcDownloads / 1000) * calcTierRate * 0.7).toFixed(2);
  const estimatedAnnualEarnings = (Number(estimatedMonthlyEarnings) * 12).toFixed(2);

  return (
    <div className="relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-blue-600/10 dark:bg-blue-600/15 blur-[160px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[450px] h-[300px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top AdSense Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdPlacementSlot location="BANNER" format="horizontal" />
      </div>

      {/* Hero Section */}
      <section className="relative pt-12 pb-16 md:pt-24 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Creator Trust Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-500/30 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>70% Direct Revenue Share • Instant Payouts via PayPal & Crypto</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-[1.1] mb-6">
          Upload files. Share links. <br />
          <span className="gradient-text">Get paid every download.</span>
        </h1>

        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          The honest file-sharing platform designed for creators, developers, and modders. Zero storage fees, verified download monetization, and daily transparent payouts.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <Link href="/upload" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-blue-600/25 px-8 py-3.5 text-sm font-bold">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Your Files Now</span>
            </Button>
          </Link>

          {user ? (
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold">
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          ) : (
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setAuthModalOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold"
            >
              <span>Create Free Account</span>
            </Button>
          )}
        </div>

        {/* Live Features Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-6 border-t border-slate-200 dark:border-slate-800 text-left text-xs">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <DollarSign className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">$10.00 Min Payout</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Instant withdrawals</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Up to $12.00 CPM</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Top tier ad rates</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Anti-Fraud Engine</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Clean visitor verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/60 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">10% Lifetime Ref</p>
              <p className="text-slate-500 dark:text-slate-400 text-[11px]">Earn by referring creators</p>
            </div>
          </div>
        </div>

        {/* Ad Placement Below Hero */}
        <div className="max-w-4xl mx-auto mt-12">
          <AdPlacementSlot location="HOME_HERO_BOTTOM" format="horizontal" />
        </div>
      </section>

      {/* Interactive Earnings Calculator */}
      <section className="py-16 bg-slate-100/70 dark:bg-slate-950/40 border-y border-slate-200 dark:border-slate-800/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
              Live Estimator
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              Calculate Your Creator Earnings
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
              See how much you can earn every month with your download volume and audience demographics.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-xl">
            {/* Left Controls */}
            <div className="md:col-span-7 space-y-6">
              {/* Monthly Downloads Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Monthly Downloads
                  </label>
                  <span className="font-mono text-base font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-xl border border-blue-200 dark:border-blue-500/20">
                    {calcDownloads.toLocaleString()} downloads
                  </span>
                </div>
                <input
                  type="range"
                  min={1000}
                  max={250000}
                  step={1000}
                  value={calcDownloads}
                  onChange={(e) => setCalcDownloads(Number(e.target.value))}
                  className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1.5 font-medium">
                  <span>1,000</span>
                  <span>50,000</span>
                  <span>100,000</span>
                  <span>250,000+</span>
                </div>
              </div>

              {/* Geographic Tier Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Primary Visitor Country Tier
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCalcTierRate(12);
                      setCalcTierName("Tier 1 (US, UK, CA, AU)");
                    }}
                    className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                      calcTierRate === 12
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    <span className="block font-bold">Tier 1 • $12 CPM</span>
                    <span className="text-[11px] opacity-80">US, UK, CA, AU, NZ</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalcTierRate(8);
                      setCalcTierName("Tier 2 (Western Europe & Japan)");
                    }}
                    className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                      calcTierRate === 8
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    <span className="block font-bold">Tier 2 • $8 CPM</span>
                    <span className="text-[11px] opacity-80">DE, FR, JP, IT, ES</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setCalcTierRate(4.5);
                      setCalcTierName("Tier 3 (Worldwide Mix)");
                    }}
                    className={`p-3 rounded-2xl text-left border text-xs font-semibold transition-all cursor-pointer ${
                      calcTierRate === 4.5
                        ? "border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-400"
                    }`}
                  >
                    <span className="block font-bold">Tier 3 • $4.50 CPM</span>
                    <span className="text-[11px] opacity-80">Global / Rest of World</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Output Box */}
            <div className="md:col-span-5 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-center shadow-xl space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200">
                Your Estimated Payout (70% Share)
              </span>

              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight font-mono">
                  ${estimatedMonthlyEarnings}
                </span>
                <span className="text-sm font-semibold text-blue-200 block mt-1">/ month</span>
              </div>

              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-xs text-blue-100 flex items-center justify-between">
                <span>Annual Projection:</span>
                <span className="font-bold font-mono text-white text-sm">${estimatedAnnualEarnings} / yr</span>
              </div>

              <Link href="/upload" className="block pt-2">
                <Button size="md" className="w-full bg-white text-blue-700 hover:bg-blue-50 font-bold shadow-lg">
                  <span>Start Earning Now</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
            Simple 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            How You Turn Downloads into Cash
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-3">
            No complex contracts or hidden tiers. Upload your file, share the link, and watch your balance grow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative hover:border-blue-500/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-4 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Step 01
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
              Upload Files
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Drag & drop software, media, game mods, archives, or PDFs up to 100 MB each with optional password protection.
            </p>
          </div>

          {/* Step 2 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative hover:border-indigo-500/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 dark:text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <Share2 className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Step 02
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
              Share Short Link
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Copy your branded, high-converting slug link (<code className="text-blue-500 font-mono text-[11px]">/d/8KxP2mQ</code>) to share on YouTube, Discord, or your website.
            </p>
          </div>

          {/* Step 3 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative hover:border-purple-500/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 mb-4 group-hover:scale-105 transition-transform">
              <FileCheck className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Step 03
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
              Visitor Downloads
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Visitors pass the clean 5-second countdown with Google AdSense placements. Every genuine download qualifies instantly.
            </p>
          </div>

          {/* Step 4 */}
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 relative hover:border-emerald-500/50 transition-all group">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
              <DollarSign className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Step 04
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1 mb-2">
              Withdraw Earnings
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              70% revenue is instantly added to your ledger balance. Request payouts anytime to PayPal, USDT, Bitcoin, or Bank Wire.
            </p>
          </div>
        </div>
      </section>

      {/* Supported Payment Rails */}
      <section className="py-12 bg-slate-100/50 dark:bg-slate-950/60 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6">
            Supported Payout Methods • Processed Within 24-48 Hours
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black">P</span>
              <span>PayPal USD</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black">₮</span>
              <span>USDT (TRC-20)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <span className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black">₿</span>
              <span>Bitcoin (BTC)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold text-sm">
              <span className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black">🏦</span>
              <span>Direct Bank Wire</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-Section Ad Placement */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <AdPlacementSlot location="HOME_MID_SECTION" format="horizontal" />
      </div>

      {/* Who Is DropEarn Built For? (Real Human Use Cases) */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-xs font-bold uppercase tracking-wider">
            Built for Real Creators
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
            What Creators Are Hosting on DropEarn
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Game Modders & Devs</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Distribute custom maps, skins, Skyrim/Minecraft mods, and Unity packages while monetizing every fan download.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Software Developers</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Host Windows installers, macOS DMG packages, Linux scripts, and utilities with zero bandwidth bills.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Palette className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Digital Artists & 3D</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Share Blender 3D models, Photoshop brushes, Lightroom presets, and icon packs with your design community.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Writers & Educators</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Deliver course templates, study guides, cheat sheets, and eBook chapters directly to students and readers.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-panel p-8 sm:p-12 border border-blue-500/30 text-center relative overflow-hidden bg-gradient-to-br from-blue-600/10 via-indigo-600/10 to-purple-600/10 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">
            Ready to turn your files into income?
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base max-w-xl mx-auto mb-8 font-medium">
            Join thousands of creators who share files and get paid with 100% transparent accounting.
          </p>
          <Link href="/upload">
            <Button size="lg" className="shadow-xl shadow-blue-600/30 px-8 py-3.5 text-sm font-bold">
              <Upload className="w-5 h-5 mr-2" />
              <span>Upload Your First File Free</span>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer Ad Placement */}
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
