"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import {
  DollarSign,
  Clock,
  TrendingUp,
  CreditCard,
  ArrowDownLeft,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface EarningsOverview {
  balances: {
    availableBalance: string;
    pendingBalance: string;
    lifetimeEarnings: string;
    totalWithdrawn: string;
    currency: string;
  };
}

interface LedgerEntry {
  id: string;
  type: string;
  amount: string;
  runningBalance: string;
  status: string;
  description: string;
  fileTitle: string | null;
  fileSlug: string | null;
  createdAt: string;
}

export default function EarningsPage() {
  const { user } = useAuth();
  const [data, setData] = useState<EarningsOverview | null>(null);
  const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchEarningsData = async (targetPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const [earningsRes, ledgerRes] = await Promise.all([
        fetch("/api/v1/earnings"),
        fetch(`/api/v1/earnings/ledger?page=${targetPage}&limit=15`),
      ]);

      if (!earningsRes.ok) {
        throw new Error("Unable to load verified balance data.");
      }
      if (!ledgerRes.ok) {
        throw new Error("Unable to load earnings ledger history.");
      }

      const earningsJson = await earningsRes.json();
      const ledgerJson = await ledgerRes.json();

      setData(earningsJson);
      setLedgerEntries(ledgerJson.entries || []);
      setTotalPages(ledgerJson.totalPages || 1);
      setPage(ledgerJson.currentPage || 1);
    } catch (err: any) {
      console.error("[EarningsPage] Load error:", err);
      setError(err.message || "Failed to load financial records.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarningsData(1);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Financial Ledger & Earnings
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time verified creator balances and immutable revenue event entries
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchEarningsData(page)}
            loading={loading}
          >
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>Refresh</span>
          </Button>

          <Link href="/dashboard/withdraw">
            <Button size="sm">
              <CreditCard className="w-4 h-4 mr-1.5" />
              <span>Withdraw Funds</span>
            </Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Balance Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Available Balance */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Available Balance
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? (
                <div className="h-8 w-28 bg-slate-800 rounded animate-pulse" />
              ) : (
                `$${data?.balances.availableBalance || "0.00"}`
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Ready for payout withdrawal</p>
          </div>
        </div>

        {/* Pending Balance */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Pending Balance
            </span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? (
                <div className="h-8 w-28 bg-slate-800 rounded animate-pulse" />
              ) : (
                `$${data?.balances.pendingBalance || "0.00"}`
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Awaiting qualification clearance</p>
          </div>
        </div>

        {/* Lifetime Earnings */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Lifetime Earnings
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? (
                <div className="h-8 w-28 bg-slate-800 rounded animate-pulse" />
              ) : (
                `$${data?.balances.lifetimeEarnings || "0.00"}`
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Total revenue generated</p>
          </div>
        </div>

        {/* Total Paid Out */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Withdrawn
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl sm:text-3xl font-black text-white">
              {loading ? (
                <div className="h-8 w-28 bg-slate-800 rounded animate-pulse" />
              ) : (
                `$${data?.balances.totalWithdrawn || "0.00"}`
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">Processed payouts</p>
          </div>
        </div>
      </div>

      {/* Ledger Entries Table */}
      <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Earnings History</h2>
          </div>
          <span className="text-xs text-slate-400">
            Immutable Double-Entry Ledger
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-blue-400" />
            <p className="text-sm font-medium">Loading ledger entries...</p>
          </div>
        ) : ledgerEntries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No earnings yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Your earnings will appear here when qualified visitors download your files.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Date & Time</th>
                  <th className="px-6 py-3.5">Source / Type</th>
                  <th className="px-6 py-3.5">Description / Target</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5 text-right">Running Balance</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {ledgerEntries.map((entry) => {
                  const isCredit =
                    entry.type.startsWith("CREDIT") || parseFloat(entry.amount) > 0;
                  const dateStr = new Date(entry.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  return (
                    <tr key={entry.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {isCredit ? (
                            <ArrowDownLeft className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4 text-rose-400" />
                          )}
                          <span
                            className={
                              isCredit ? "text-emerald-400 font-semibold" : "text-rose-400 font-semibold"
                            }
                          >
                            {entry.type.replace(/_/g, " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-300 max-w-xs truncate">
                        {entry.fileTitle ? (
                          <span>File: {entry.fileTitle}</span>
                        ) : (
                          entry.description
                        )}
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap font-mono">
                        <span
                          className={
                            isCredit
                              ? "text-emerald-400 font-bold"
                              : "text-rose-400 font-bold"
                          }
                        >
                          {isCredit ? `+$${entry.amount}` : `-$${entry.amount}`}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right whitespace-nowrap font-mono text-slate-200">
                        ${entry.runningBalance}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            entry.status === "AVAILABLE"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : entry.status === "PENDING"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : "bg-slate-800 text-slate-400 border border-slate-700"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1 || loading}
                onClick={() => fetchEarningsData(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => fetchEarningsData(page + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
