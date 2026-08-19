"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatBytes } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  TrendingUp,
  Download,
  CheckCircle2,
  DollarSign,
  Calendar,
  Loader2,
  RefreshCw,
  FolderOpen,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  FileText,
} from "lucide-react";

export default function UserAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [ledgerEntries, setLedgerEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [earningsRes, ledgerRes] = await Promise.all([
        fetch("/api/v1/earnings"),
        fetch("/api/v1/earnings/ledger?limit=10"),
      ]);

      if (!earningsRes.ok) {
        throw new Error("Unable to load performance analytics data.");
      }
      if (!ledgerRes.ok) {
        throw new Error("Unable to load verified ledger records.");
      }

      const earningsJson = await earningsRes.json();
      const ledgerJson = await ledgerRes.json();

      setData(earningsJson);
      setLedgerEntries(ledgerJson.entries || []);
    } catch (err: any) {
      console.error("[AnalyticsPage] Error:", err);
      setError(err.message || "Failed to load analytics records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const balances = data?.balances || {
    availableBalance: "0.00",
    pendingBalance: "0.00",
    lifetimeEarnings: "0.00",
  };

  const earnings = data?.earnings || {
    today: "0.00",
    last7Days: "0.00",
    last30Days: "0.00",
    lifetime: "0.00",
  };

  const downloads = data?.downloads || {
    today: 0,
    last7Days: 0,
    last30Days: 0,
    lifetime: 0,
    totalQualified: 0,
  };

  const files = data?.files || {
    total: 0,
    active: 0,
    disabled: 0,
    topFiles: [],
  };

  const qualifiedRate =
    downloads.lifetime > 0
      ? ((downloads.totalQualified / downloads.lifetime) * 100).toFixed(1)
      : "0";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Performance Analytics
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real metrics computed directly from immutable event logs and download audits
          </p>
        </div>

        <Button variant="ghost" size="sm" onClick={fetchData} loading={loading}>
          <RefreshCw className="w-4 h-4 mr-1.5" />
          <span>Refresh Analytics</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lifetime Revenue"
          value={formatCurrency(balances.lifetimeEarnings)}
          subtitle="Confirmed platform earnings"
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
          highlight={true}
        />

        <StatCard
          title="Total Downloads"
          value={downloads.lifetime}
          subtitle="All-time file downloads"
          icon={<Download className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          title="Qualified Downloads"
          value={downloads.totalQualified}
          subtitle="Monetized download events"
          icon={<CheckCircle2 className="w-5 h-5 text-purple-400" />}
        />

        <StatCard
          title="Traffic Conversion"
          value={`${qualifiedRate}%`}
          subtitle="Verified qualification rate"
          icon={<TrendingUp className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Timeframe Breakdowns: Earnings vs Downloads */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings by Timeframe */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Earnings by Timeframe</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Today</span>
              <span className="text-lg font-bold text-white">${earnings.today}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">7 Days</span>
              <span className="text-lg font-bold text-white">${earnings.last7Days}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">30 Days</span>
              <span className="text-lg font-bold text-white">${earnings.last30Days}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Lifetime</span>
              <span className="text-lg font-bold text-emerald-400">${earnings.lifetime}</span>
            </div>
          </div>
        </div>

        {/* Downloads by Timeframe */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Download className="w-4 h-4 text-blue-400" />
            <span>Downloads by Timeframe</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Today</span>
              <span className="text-lg font-bold text-white">{downloads.today}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">7 Days</span>
              <span className="text-lg font-bold text-white">{downloads.last7Days}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">30 Days</span>
              <span className="text-lg font-bold text-white">{downloads.last30Days}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Lifetime</span>
              <span className="text-lg font-bold text-blue-400">{downloads.lifetime}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Files Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-indigo-400" />
            <span>Top-Performing Files</span>
          </h3>
          <Link
            href="/dashboard/files"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Manage files →
          </Link>
        </div>

        {files.topFiles.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-6 h-6" />}
            title="No top files yet"
            description="When visitors begin downloading your files, your highest-earning content will be ranked here."
            actionLabel="Upload Files"
            actionHref="/dashboard/upload"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">File Title</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Total Downloads</th>
                  <th className="py-3 px-3">Qualified Downloads</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {files.topFiles.map((f: any) => (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                      {f.title}
                    </td>
                    <td className="py-3 px-3">
                      <Badge variant="default">{f.category}</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono">{formatBytes(f.sizeBytes)}</td>
                    <td className="py-3 px-3 font-semibold">{f.downloadCount}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">
                      {f.qualifiedDownloadCount || 0}
                    </td>
                    <td className="py-3 px-3">
                      {f.isEnabled ? (
                        <Badge variant="success">Active</Badge>
                      ) : (
                        <Badge variant="warning">Disabled</Badge>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <a
                        href={`/d/${f.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
