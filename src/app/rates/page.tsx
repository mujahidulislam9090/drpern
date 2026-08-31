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
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function RatesPage() {
  const TIERS = [
    {
      tier: "Tier 1",
      rate: "$18.00",
      countries: "United States, United Kingdom, Canada, Australia, Germany",
      description: "Highest CPM traffic from high-converting advertising markets",
      highlight: true,
    },
    {
      tier: "Tier 2",
      rate: "$12.00",
      countries: "France, Italy, Spain, Netherlands, Sweden, Japan, South Korea",
      description: "Strong European and Asian high-engagement markets",
      highlight: false,
    },
    {
      tier: "Tier 3",
      rate: "$7.50",
      countries: "Brazil, Mexico, Poland, Turkey, South Africa, UAE, Saudi Arabia",
      description: "Growing high-volume global markets",
      highlight: false,
    },
    {
      tier: "Tier 4",
      rate: "$3.50",
      countries: "India, Indonesia, Vietnam, Philippines, Egypt, Rest of World",
      description: "High-volume worldwide download traffic",
      highlight: false,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Ad Placement */}
      <div>
        <AdPlacementSlot location="RATES_TOP" format="horizontal" />
      </div>

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
          Transparent CPM Payouts
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
          How Much <span className="gradient-text">Will You Earn?</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Earn guaranteed, competitive revenue for every 1,000 qualified file downloads. All earnings are calculated transparently with a 70% direct creator share.
        </p>
      </div>

      {/* Rates Table Card */}
      <div className="rounded-3xl glass-card p-6 sm:p-10 border border-slate-200 dark:border-slate-800 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Payout Rate Table (per 1,000 Downloads)
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">Rates updated & calibrated weekly</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.tier}
              className={`p-6 rounded-2xl border space-y-3 transition-all ${
                t.highlight
                  ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-500/30 shadow-sm"
                  : "bg-slate-50/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  {t.highlight && <Sparkles className="w-3.5 h-3.5" />}
                  {t.tier}
                </span>
                <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  {t.rate}
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{t.countries}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{t.description}</p>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" />
            <span>Anti-fraud verification ensures clean visitor counts</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span>$10 Minimum Withdrawal Threshold</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500 shrink-0" />
            <span>10% Lifetime Referral Program</span>
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="text-center pt-4">
        <Link href="/upload">
          <Button size="lg" className="px-8 py-3.5 text-sm font-bold shadow-xl shadow-blue-600/25">
            <DollarSign className="w-4 h-4 mr-1.5" />
            <span>Start Uploading & Earning</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Bottom Ad Placement */}
      <div className="pt-6">
        <AdPlacementSlot location="RATES_BOTTOM" format="horizontal" />
      </div>
    </div>
  );
}
