"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatBytes, formatDate } from "@/lib/utils";
import {
  DollarSign,
  Download,
  FolderOpen,
  Upload,
  TrendingUp,
  CreditCard,
  ExternalLink,
  Copy,
  Check,
  Clock,
  Loader2,
  Activity,
  CheckCircle2,
  HardDrive,
  Sparkles,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const [earningsData, setEarningsData] = useState<any>(null);
  const [recentFiles, setRecentFiles] = useState<any[]>([]);
  const [fileStats, setFileStats] = useState<{ total: number; active: number; disabled: number }>({
    total: 0,
    active: 0,
    disabled: 0,
  });
  const [storageUsage, setStorageUsage] = useState<{
    usedMb: number;
    limitMb: number;
    count: number;
  } | null>(null);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/v1/earnings").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/v1/files?limit=5").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/v1/earnings/ledger?limit=5").then((res) => (res.ok ? res.json() : null)),
      fetch("/api/v1/files/quota").then((res) => (res.ok ? res.json() : null)),
    ])
      .then(([earnings, filesRes, ledgerRes, quotaRes]) => {
        if (earnings) setEarningsData(earnings);
        if (filesRes) {
          setRecentFiles(filesRes.files || []);
          const active = (filesRes.files || []).filter((f: any) => f.isEnabled).length;
          const disabled = (filesRes.files || []).filter((f: any) => !f.isEnabled).length;
          setFileStats({
            total: filesRes.totalCount || 0,
            active,
            disabled,
          });
        }
        if (ledgerRes) {
          setRecentActivity(ledgerRes.entries || []);
        }
        if (quotaRes) {
          setStorageUsage(quotaRes);
        }
      })
      .catch((err) => console.error("Dashboard fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/d/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const balances = earningsData?.balances || {
    availableBalance: "0.00",
    pendingBalance: "0.00",
    lifetimeEarnings: "0.00",
  };

  const downloads = earningsData?.downloads || {
    today: 0,
    last7Days: 0,
    last30Days: 0,
    lifetime: 0,
  };

  const quotaPercent =
    storageUsage && storageUsage.limitMb > 0
      ? Math.min(100, Math.round((storageUsage.usedMb / storageUsage.limitMb) * 100))
      : 0;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Creator Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time verified creator metrics, revenue balances, and file activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/upload">
            <Button size="sm" className="shadow-md shadow-blue-600/20">
              <Upload className="w-4 h-4 mr-1.5" />
              <span>Upload File</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Revenue Section */}
      <div>
        <h2 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          Revenue Balances
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Available Balance"
            value={formatCurrency(balances.availableBalance)}
            subtitle={
              Number(balances.availableBalance) > 0
                ? "Ready for payout withdrawal"
                : "No available balance yet"
            }
            icon={<DollarSign className="w-5 h-5 text-emerald-500" />}
            highlight={true}
          />

          <StatCard
            title="Pending Earnings"
            value={formatCurrency(balances.pendingBalance)}
            subtitle="Awaiting qualification review"
            icon={<Clock className="w-5 h-5 text-amber-500" />}
          />

          <StatCard
            title="Lifetime Earnings"
            value={formatCurrency(balances.lifetimeEarnings)}
            subtitle="Total all-time earned revenue"
            icon={<TrendingUp className="w-5 h-5 text-purple-500" />}
          />
        </div>
      </div>

      {/* Downloads, Files & Storage Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Downloads */}
        <div className="rounded-3xl glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-500" />
              <span>Download Activity</span>
            </h3>
            <Link
              href="/dashboard/downloads"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
            >
              View logs →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Today</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{downloads.today}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">7 Days</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{downloads.last7Days}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">30 Days</span>
              <span className="text-base font-black text-slate-900 dark:text-white">{downloads.last30Days}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Lifetime</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400">{downloads.lifetime}</span>
            </div>
          </div>
        </div>

        {/* Files Overview */}
        <div className="rounded-3xl glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-500" />
              <span>Files Status</span>
            </h3>
            <Link
              href="/dashboard/files"
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
            >
              Manage all →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Total</span>
              <span className="text-base font-black text-slate-900 dark:text-white mt-0.5">{fileStats.total}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Active</span>
              <span className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">{fileStats.active}</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">Disabled</span>
              <span className="text-base font-black text-amber-600 dark:text-amber-400 mt-0.5">{fileStats.disabled}</span>
            </div>
          </div>
        </div>

        {/* Storage Quota Usage */}
        <div className="rounded-3xl glass-card p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-500" />
              <span>Storage Quota</span>
            </h3>
            <span className="text-xs font-mono font-bold text-purple-600 dark:text-purple-400">
              {storageUsage ? `${storageUsage.usedMb} MB / ${storageUsage.limitMb} MB` : "0 MB / 1024 MB"}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-2.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  quotaPercent > 80 ? "bg-amber-500" : "bg-purple-600"
                }`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1 font-medium">
              <span>{quotaPercent}% quota used</span>
              <span>Free creator tier (1 GB)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 shadow-md">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-500" />
            <span>Recent Financial & Download Activity</span>
          </h3>
          <Link
            href="/dashboard/earnings"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Full ledger →
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center font-medium">
            No activity yet. Upload a file and share your link to start generating earnings.
          </p>
        ) : (
          <div className="divide-y divide-slate-200 dark:divide-slate-800/60 text-xs">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-100 dark:hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {act.fileTitle ? `Download for ${act.fileTitle}` : act.description}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {new Date(act.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    +${act.amount}
                  </span>
                  <span className="text-[10px] text-slate-500 block">
                    Bal: ${act.runningBalance}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Files Table */}
      <div className="rounded-3xl glass-card p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Uploads</h3>
          <Link
            href="/dashboard/files"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            View all files →
          </Link>
        </div>

        {recentFiles.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-6 h-6" />}
            title="No files uploaded yet"
            description="Upload your first file to generate a shareable download link and start earning revenue."
            actionLabel="Upload File"
            actionHref="/dashboard/upload"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">File Title</th>
                  <th className="py-3 px-3">Size</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Downloads</th>
                  <th className="py-3 px-3">Qualified</th>
                  <th className="py-3 px-3">Uploaded</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {recentFiles.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white max-w-[200px] truncate">
                      {f.title}
                    </td>
                    <td className="py-3 px-3 font-mono font-medium">{formatBytes(f.sizeBytes)}</td>
                    <td className="py-3 px-3">
                      <Badge variant="default">{f.category}</Badge>
                    </td>
                    <td className="py-3 px-3 font-bold">{f.downloadCount}</td>
                    <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">
                      {f.qualifiedDownloadCount || 0}
                    </td>
                    <td className="py-3 px-3 text-slate-500 dark:text-slate-400">{formatDate(f.createdAt)}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopy(f.slug)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                          title="Copy Link"
                        >
                          {copiedSlug === f.slug ? (
                            <Check className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={`/d/${f.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                          title="Open Download Page"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
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
