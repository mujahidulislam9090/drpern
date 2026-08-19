"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatBytes } from "@/lib/utils";
import {
  Download,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Globe,
  FileText,
} from "lucide-react";

interface DownloadItem {
  id: string;
  fileTitle: string;
  fileSlug: string;
  fileSizeBytes: string;
  ipAddress: string;
  country: string;
  isQualified: boolean;
  qualificationReason: string;
  createdAt: string;
}

export default function DownloadsHistoryPage() {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const fetchDownloads = async (targetPage = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/downloads?page=${targetPage}&limit=15`);
      if (!res.ok) {
        throw new Error("Unable to load file downloads activity.");
      }
      const data = await res.json();
      setDownloads(data.downloads || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
      setPage(data.currentPage || 1);
    } catch (err: any) {
      console.error("[DownloadsHistoryPage] Error:", err);
      setError(err.message || "Failed to load download activity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDownloads(1);
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Download Activity Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real visitor download events, geolocation tracking, and anti-fraud qualification audits
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => fetchDownloads(page)}
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

      {/* Downloads Table */}
      <div className="rounded-2xl glass-card border border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Recent File Downloads</h2>
          </div>
          <span className="text-xs text-slate-400">
            {totalCount} Total Recorded Events
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-3 text-blue-400" />
            <p className="text-sm font-medium">Loading download events...</p>
          </div>
        ) : downloads.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-500">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">No downloads yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              When visitors download your uploaded files, their activity and qualification will be recorded here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">Timestamp</th>
                  <th className="px-6 py-3.5">Target File</th>
                  <th className="px-6 py-3.5">File Size</th>
                  <th className="px-6 py-3.5">Visitor Location</th>
                  <th className="px-6 py-3.5 text-center">Monetized Qualification</th>
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
                      <td className="px-6 py-4 font-semibold text-white max-w-xs truncate">
                        <a
                          href={`/d/${d.fileSlug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span className="truncate">{d.fileTitle}</span>
                        </a>
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-300 whitespace-nowrap">
                        {formatBytes(d.fileSizeBytes)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Globe className="w-3.5 h-3.5 text-blue-400" />
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
                onClick={() => fetchDownloads(page - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || loading}
                onClick={() => fetchDownloads(page + 1)}
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
