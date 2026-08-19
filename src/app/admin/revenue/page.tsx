"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { DollarSign, TrendingUp, PieChart, ShieldCheck, Clock, Loader2 } from "lucide-react";

export default function AdminRevenuePage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "90d" | "all">("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = (selectedPeriod = period) => {
    setLoading(true);
    fetch(`/api/v1/admin/revenue?period=${selectedPeriod}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData) setData(resData);
      })
      .catch((err) => console.error("Admin revenue error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRevenue(period);
  }, [period]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  const timeSeries = data?.timeSeries || [];

  return (
    <div className="space-y-8">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Revenue Analytics & Ledger
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Auditable gross and net revenue generated through verified monetization events.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(["today", "7d", "30d", "90d", "all"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                period === p
                  ? "bg-purple-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Gross Revenue"
          value={formatCurrency(data?.grossRevenue || "0.00")}
          subtitle={`Total revenue in ${period}`}
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
          highlight={true}
        />

        <StatCard
          title="Uploader Share"
          value={formatCurrency(data?.uploaderShare || "0.00")}
          subtitle="Distributed to creators"
          icon={<TrendingUp className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          title="Platform Share"
          value={formatCurrency(data?.platformShare || "0.00")}
          subtitle="Platform retained share"
          icon={<PieChart className="w-5 h-5 text-purple-400" />}
        />

        <StatCard
          title="Pending Revenue"
          value={formatCurrency(data?.pendingRevenue || "0.00")}
          subtitle="Awaiting clearance"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
        />
      </div>

      {/* Time Series Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">
          Daily Revenue Breakdown ({period.toUpperCase()})
        </h3>

        {timeSeries.length === 0 ? (
          <EmptyState
            icon={<DollarSign className="w-6 h-6" />}
            title="No revenue records found"
            description="There are no confirmed revenue events recorded in the database for this timeframe."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Gross Revenue</th>
                  <th className="py-3 px-3">Uploader Share</th>
                  <th className="py-3 px-3">Platform Share</th>
                  <th className="py-3 px-3 text-right">Events Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {timeSeries.map((row: any) => (
                  <tr key={row.date} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-white">{row.date}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400">
                      {formatCurrency(row.gross)}
                    </td>
                    <td className="py-3 px-3 text-blue-400 font-medium">
                      {formatCurrency(row.uploaderShare)}
                    </td>
                    <td className="py-3 px-3 text-purple-400 font-medium">
                      {formatCurrency(row.platformShare)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold text-slate-300">
                      {row.eventCount}
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
