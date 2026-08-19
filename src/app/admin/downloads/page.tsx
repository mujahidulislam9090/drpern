"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatBytes } from "@/lib/utils";
import {
  DownloadCloud,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileText,
  Filter,
} from "lucide-react";

interface DownloadItem {
  id: string;
  fileTitle: string;
  fileSlug: string;
  fileSizeBytes: string;
  uploaderName: string;
  ipAddress: string;
  country: string;
  isQualified: boolean;
  qualificationReason: string;
  createdAt: string;
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [qualifiedCount, setQualifiedCount] = useState(0);
  const [totalToday, setTotalToday] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDownloads = async (targetPage = 1, currentFilter = filter) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/v1/admin/downloads?page=${targetPage}&limit=20&filter=${currentFilter}`
      );
      if (!res.ok) {
        throw new Error("Unable to load platform download audit logs.");
      }
      const data = await res.json();
      setDownloads(data.downloads || []);
      setTotalCount(data.totalCount || 0);
      setQualifiedCount(data.qualifiedCount || 0);
      setTotalToday(data.totalToday || 0);
      setTotalPages(data.totalPages || 1);
      setPage(data.currentPage || 1);
    } catch (err: any) {
      console.error("[AdminDownloadsPage] Error:", err);
      setError(err.message || "Failed to load download logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads(1, filter);
  }, [filter]);

  const conversionRate =
    totalCount > 0 ? ((qualifiedCount / totalCount) * 100).toFixed(1) : "0.0";

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <DownloadCloud className="w-7 h-7 text-purple-400" />
            <span>Platform Downloads Audit</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time download verification, anti-fraud evaluation logs, and visitor dwell metrics
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchDownloads(page, filter)}
          loading={loading}
        >
          <RefreshCw className="w-4 h-4 mr-1.5" />
          <span>Refresh</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Total Downloads
          </span>
          <div className="text-2xl font-black text-white mt-1">{totalCount}</div>
        </div>

        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Qualified (Monetized)
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {qualifiedCount}
          </div>
        </div>

        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Today&apos;s Downloads
          </span>
          <div className="text-2xl font-black text-blue-400 mt-1">{totalToday}</div>
        </div>

        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Qualification Rate
          </span>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {conversionRate}%
          </div>
        </div>
      </div>

      {/* Downloads Table */}
      <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Event Log</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === "all"
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter("qualified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === "qualified"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Qualified Only
            </button>
            <button
              onClick={() => setFilter("unqualified")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                filter === "unqualified"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-slate-900 text-slate-400 hover:text-white"
              }`}
            >
              Unqualified Only
            </button>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-purple-400" />
            <p className="text-sm font-medium">Loading platform download logs...</p>
          </div>
        ) : downloads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <DownloadCloud className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No downloads recorded yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Real downloads and qualification assessments will appear here as visitors access files.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">File & Creator</th>
                  <th className="px-6 py-3.5">File Size</th>
                  <th className="px-6 py-3.5">Visitor IP & Location</th>
                  <th className="px-6 py-3.5 text-center">Monetized</th>
                  <th className="px-6 py-3.5">Qualification Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {downloads.map((d) => {
                  const dateStr = new Date(d.createdAt).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  });

                  return (
                    <tr key={d.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {dateStr}
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <a
                          href={`/d/${d.fileSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-white hover:text-purple-400 transition-colors block truncate"
                        >
                          {d.fileTitle}
                        </a>
                        <span className="text-[11px] text-slate-400 block truncate">
                          by {d.uploaderName}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300 whitespace-nowrap">
                        {formatBytes(d.fileSizeBytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Globe className="w-3.5 h-3.5 text-purple-400" />
                          <span>{d.country}</span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            ({d.ipAddress})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        {d.isQualified ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Qualified</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                            <XCircle className="w-3 h-3" />
                            <span>Unqualified</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                        {d.qualificationReason}
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
                onClick={() => fetchDownloads(page - 1, filter)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => fetchDownloads(page + 1, filter)}
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
