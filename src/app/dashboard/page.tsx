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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Creator Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time verified creator metrics, revenue balances, and file activity
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/dashboard/upload">
            <Button size="sm">
              <Upload className="w-4 h-4 mr-1.5" />
              <span>Upload File</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Revenue Section */}
      <div>
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
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
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            highlight={true}
          />

          <StatCard
            title="Pending Earnings"
            value={formatCurrency(balances.pendingBalance)}
            subtitle="Awaiting qualification review"
            icon={<Clock className="w-5 h-5 text-amber-400" />}
          />

          <StatCard
            title="Lifetime Earnings"
            value={formatCurrency(balances.lifetimeEarnings)}
            subtitle="Total all-time earned revenue"
            icon={<TrendingUp className="w-5 h-5 text-purple-400" />}
          />
        </div>
      </div>

      {/* Downloads, Files & Storage Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Downloads */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-blue-400" />
              <span>Download Activity</span>
            </h3>
            <Link
              href="/dashboard/downloads"
              className="text-xs text-blue-400 hover:text-blue-300 font-medium"
            >
              View logs →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Today</span>
              <span className="text-base font-bold text-white">{downloads.today}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">7 Days</span>
              <span className="text-base font-bold text-white">{downloads.last7Days}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">30 Days</span>
              <span className="text-base font-bold text-white">{downloads.last30Days}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-[11px] text-slate-400 block">Lifetime</span>
              <span className="text-base font-bold text-emerald-400">{downloads.lifetime}</span>
            </div>
          </div>
        </div>

        {/* Files Overview */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-indigo-400" />
              <span>Files Status</span>
            </h3>
            <Link
              href="/dashboard/files"
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Manage all →
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Total</span>
              <span className="text-base font-bold text-white mt-0.5">{fileStats.total}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Active</span>
              <span className="text-base font-bold text-emerald-400 mt-0.5">{fileStats.active}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800 text-center">
              <span className="text-[11px] text-slate-400 block">Disabled</span>
              <span className="text-base font-bold text-amber-400 mt-0.5">{fileStats.disabled}</span>
            </div>
          </div>
        </div>

        {/* Storage Quota Usage */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span>Storage Used</span>
            </h3>
            <span className="text-xs font-mono text-purple-300">
              {storageUsage ? `${storageUsage.usedMb} MB / ${storageUsage.limitMb} MB` : "0 MB / 1024 MB"}
            </span>
          </div>

          <div className="space-y-2 pt-2">
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  quotaPercent > 80 ? "bg-amber-500" : "bg-purple-500"
                }`}
                style={{ width: `${quotaPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
              <span>{quotaPercent}% quota used</span>
              <span>Free tier quota (1 GB)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Recent Financial & Download Activity</span>
          </h3>
          <Link
            href="/dashboard/earnings"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
          >
            Full ledger →
          </Link>
        </div>

        {recentActivity.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">
            No activity yet. Upload a file and share your link to start generating earnings.
          </p>
        ) : (
          <div className="divide-y divide-slate-800/60 text-xs">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/20 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">
                      {act.fileTitle ? `Download for ${act.fileTitle}` : act.description}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(act.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="font-bold text-emerald-400">
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
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">Recent Uploads</h3>
          <Link
            href="/dashboard/files"
            className="text-xs text-blue-400 hover:text-blue-300 font-medium"
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
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
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
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {recentFiles.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3 font-medium text-white max-w-[200px] truncate">
                      {f.title}
                    </td>
                    <td className="py-3 px-3 font-mono">{formatBytes(f.sizeBytes)}</td>
                    <td className="py-3 px-3">
                      <Badge variant="default">{f.category}</Badge>
                    </td>
                    <td className="py-3 px-3 font-semibold">{f.downloadCount}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">
                      {f.qualifiedDownloadCount || 0}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{formatDate(f.createdAt)}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleCopy(f.slug)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Copy Link"
                        >
                          {copiedSlug === f.slug ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <a
                          href={`/d/${f.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
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
