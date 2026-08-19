"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { AdPlacementSlot } from "@/components/monetization/AdPlacementSlot";
import {
  DollarSign,
  Globe,
  TrendingUp,
  ShieldCheck,
  Zap,
  ArrowRight,
} from "lucide-react";

export default function RatesPage() {
  const TIERS = [
    {
      tier: "Tier 1",
      rate: "$18.00",
      countries: "United States, United Kingdom, Canada, Australia, Germany",
      description: "Highest CPM traffic from high-converting advertising markets",
    },
    {
      tier: "Tier 2",
      rate: "$12.00",
      countries: "France, Italy, Spain, Netherlands, Sweden, Japan, South Korea",
      description: "Strong European and Asian high-engagement markets",
    },
    {
      tier: "Tier 3",
      rate: "$7.50",
      countries: "Brazil, Mexico, Poland, Turkey, South Africa, UAE, Saudi Arabia",
      description: "Growing high-volume global markets",
    },
    {
      tier: "Tier 4",
      rate: "$3.50",
      countries: "India, Indonesia, Vietnam, Philippines, Egypt, Rest of World",
      description: "High-volume worldwide download traffic",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* 1. Top Ad Placement */}
      <div>
        <AdPlacementSlot location="RATES_TOP" format="horizontal" />
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Transparent <span className="gradient-text">Payout Rates</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-400">
          Earn competitive rates for every 1,000 qualified file downloads. All earnings are verified with double-entry ledger accounting.
        </p>
      </div>

      {/* Rates Table Card */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Tier Breakdown (per 1,000 Downloads)</h2>
          </div>
          <span className="text-xs text-slate-400">Rates updated weekly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {t.tier}
                </span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {t.rate}
                </span>
              </div>
              <p className="text-xs font-semibold text-white">{t.countries}</p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Anti-fraud verification ensures clean CPM</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400 shrink-0" />
            <span>$10 Minimum Withdrawal Threshold</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
            <span>10% Lifetime Referral Commission</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="rounded-3xl glass-panel p-8 text-center border border-blue-500/20 bg-gradient-to-b from-blue-950/30 to-slate-900 space-y-4">
        <h3 className="text-2xl font-bold text-white">Start Earning Today</h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
          Sign up for free, upload your content, and share your links to begin accumulating revenue.
        </p>
        <Link href="/signup">
          <Button size="lg">
            <span>Create Creator Account</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* 2. Bottom Ad Placement */}
      <div>
        <AdPlacementSlot location="RATES_BOTTOM" format="horizontal" />
      </div>
    </div>
  );
}
