"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { StatCard } from "@/components/ui/StatCard";
import { formatCurrency } from "@/lib/utils";
import {
  DollarSign,
  Users,
  FolderOpen,
  Download,
  Eye,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  AlertTriangle,
  Loader2,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/v1/admin/dashboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setMetrics(data);
      })
      .catch((err) => console.error("Admin dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const rev = metrics?.revenue || {
    today: "0.00",
    yesterday: "0.00",
    last7Days: "0.00",
    last30Days: "0.00",
    lifetime: "0.00",
  };

  const vis = metrics?.visitors || {
    today: 0,
    yesterday: 0,
    last7Days: 0,
    last30Days: 0,
    uniqueSessionsToday: 0,
    downloadStartsToday: 0,
  };

  const fil = metrics?.files || {
    total: 0,
    uploadedToday: 0,
    uploadedThisWeek: 0,
    uploadedThisMonth: 0,
    active: 0,
    disabled: 0,
  };

  const down = metrics?.downloads || {
    total: 0,
    qualified: 0,
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
  };

  const usr = metrics?.users || {
    total: 0,
    newToday: 0,
    newThisWeek: 0,
    newThisMonth: 0,
    active: 0,
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Executive Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time business intelligence calculated directly from database records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400 font-medium">Live PostgreSQL Data</span>
        </div>
      </div>

      {/* 1. REVENUE SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
            <DollarSign className="w-4 h-4" />
            <span>Platform Revenue Metrics</span>
          </h2>
          <Link
            href="/admin/revenue"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Detailed Analytics →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <StatCard
            title="Revenue Today"
            value={formatCurrency(rev.today)}
            subtitle="Recorded today"
            icon={<DollarSign className="w-4 h-4 text-emerald-400" />}
            highlight={true}
          />
          <StatCard
            title="Yesterday"
            value={formatCurrency(rev.yesterday)}
            subtitle="Prior day total"
            icon={<DollarSign className="w-4 h-4 text-slate-400" />}
          />
          <StatCard
            title="Last 7 Days"
            value={formatCurrency(rev.last7Days)}
            subtitle="Trailing 7d revenue"
            icon={<TrendingUp className="w-4 h-4 text-blue-400" />}
          />
          <StatCard
            title="Last 30 Days"
            value={formatCurrency(rev.last30Days)}
            subtitle="Trailing 30d revenue"
            icon={<TrendingUp className="w-4 h-4 text-indigo-400" />}
          />
          <StatCard
            title="Lifetime Revenue"
            value={formatCurrency(rev.lifetime)}
            subtitle="All-time confirmed"
            icon={<ShieldCheck className="w-4 h-4 text-purple-400" />}
          />
        </div>
      </div>

      {/* 2. VISITORS SECTION */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <Eye className="w-4 h-4" />
            <span>Visitor Activity</span>
          </h2>
          <Link
            href="/admin/visitors"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Visitor Funnel →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Visitors Today</span>
            <h4 className="text-xl font-bold text-white mt-1">{vis.today}</h4>
            <p className="text-[11px] text-slate-500 mt-1">{vis.uniqueSessionsToday} unique sessions</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Yesterday</span>
            <h4 className="text-xl font-bold text-white mt-1">{vis.yesterday}</h4>
            <p className="text-[11px] text-slate-500 mt-1">Recorded page views</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Last 7 Days</span>
            <h4 className="text-xl font-bold text-white mt-1">{vis.last7Days}</h4>
            <p className="text-[11px] text-slate-500 mt-1">7d cumulative</p>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Last 30 Days</span>
            <h4 className="text-xl font-bold text-white mt-1">{vis.last30Days}</h4>
            <p className="text-[11px] text-slate-500 mt-1">30d cumulative</p>
          </div>
        </div>
      </div>

      {/* 3. FILES & DOWNLOADS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Files Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-blue-400" />
              <span>Files Repository</span>
            </h3>
            <Link
              href="/admin/files"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              Manage Files →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block">Total Files</span>
              <span className="text-lg font-bold text-white">{fil.total}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block">Active</span>
              <span className="text-lg font-bold text-emerald-400">{fil.active}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block">Disabled</span>
              <span className="text-lg font-bold text-amber-400">{fil.disabled}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span>Uploaded Today:</span>
              <strong className="text-slate-200">{fil.uploadedToday}</strong>
            </div>
            <div className="flex justify-between">
              <span>Uploaded This Week:</span>
              <strong className="text-slate-200">{fil.uploadedThisWeek}</strong>
            </div>
            <div className="flex justify-between">
              <span>Uploaded This Month:</span>
              <strong className="text-slate-200">{fil.uploadedThisMonth}</strong>
            </div>
          </div>
        </div>

        {/* Downloads Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Download Traffic</span>
            </h3>
            <span className="text-xs text-slate-500">Anti-fraud verified</span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block">Total Downloads</span>
              <span className="text-lg font-bold text-white">{down.total}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 block">Qualified Downloads</span>
              <span className="text-lg font-bold text-emerald-400">{down.qualified}</span>
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between">
              <span>Downloads Today:</span>
              <strong className="text-slate-200">{down.today}</strong>
            </div>
            <div className="flex justify-between">
              <span>Downloads This Week:</span>
              <strong className="text-slate-200">{down.thisWeek}</strong>
            </div>
            <div className="flex justify-between">
              <span>Downloads This Month:</span>
              <strong className="text-slate-200">{down.thisMonth}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* 4. USERS OVERVIEW */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>User Accounts</span>
          </h3>
          <Link
            href="/admin/users"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Manage Users →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-center text-xs">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Total Registered</span>
            <span className="text-lg font-bold text-white">{usr.total}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">New Today</span>
            <span className="text-lg font-bold text-blue-400">{usr.newToday}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">New This Week</span>
            <span className="text-lg font-bold text-indigo-400">{usr.newThisWeek}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">New This Month</span>
            <span className="text-lg font-bold text-purple-400">{usr.newThisMonth}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-[11px] text-slate-500 block">Active Status</span>
            <span className="text-lg font-bold text-emerald-400">{usr.active}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
