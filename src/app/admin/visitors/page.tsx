"use client";

import React, { useEffect, useState } from "react";
import { StatCard } from "@/components/ui/StatCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Eye, Users, Download, CheckCircle2, TrendingUp, Loader2 } from "lucide-react";

export default function AdminVisitorsPage() {
  const [period, setPeriod] = useState<"today" | "7d" | "30d" | "all">("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = (selectedPeriod = period) => {
    setLoading(true);
    fetch(`/api/v1/admin/visitors?period=${selectedPeriod}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((resData) => {
        if (resData) setData(resData);
      })
      .catch((err) => console.error("Admin visitors error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVisitors(period);
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
            Visitor & Traffic Analytics
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track real site visits, unique sessions, download intents, and qualification conversion.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          {(["today", "7d", "30d", "all"] as const).map((p) => (
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

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard
          title="Total Page Views"
          value={data?.totalPageViews || 0}
          subtitle={`Views in ${period}`}
          icon={<Eye className="w-5 h-5 text-blue-400" />}
        />

        <StatCard
          title="Unique Sessions"
          value={data?.uniqueSessions || 0}
          subtitle="Distinct visitor sessions"
          icon={<Users className="w-5 h-5 text-indigo-400" />}
        />

        <StatCard
          title="Download Starts"
          value={data?.downloadStarts || 0}
          subtitle="Initiated downloads"
          icon={<Download className="w-5 h-5 text-purple-400" />}
        />

        <StatCard
          title="Qualified Traffic"
          value={data?.qualifiedDownloads || 0}
          subtitle={`Conversion rate: ${data?.conversionRate || 0}%`}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          highlight={true}
        />
      </div>

      {/* Daily Breakdown Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">
          Daily Visitor Activity ({period.toUpperCase()})
        </h3>

        {timeSeries.length === 0 ? (
          <EmptyState
            icon={<Eye className="w-6 h-6" />}
            title="No visitor events recorded"
            description="Visitor events and download traffic will be logged here as users browse the site."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Page Views</th>
                  <th className="py-3 px-3">Download Page Visits</th>
                  <th className="py-3 px-3">Download Starts</th>
                  <th className="py-3 px-3 text-right">Qualified Downloads</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {timeSeries.map((row: any) => (
                  <tr key={row.date} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 font-mono text-white">{row.date}</td>
                    <td className="py-3 px-3 font-semibold text-blue-400">{row.pageViews}</td>
                    <td className="py-3 px-3 text-indigo-400">{row.downloadVisits}</td>
                    <td className="py-3 px-3 text-purple-400">{row.downloads}</td>
                    <td className="py-3 px-3 font-semibold text-emerald-400 text-right">
                      {row.qualified}
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
