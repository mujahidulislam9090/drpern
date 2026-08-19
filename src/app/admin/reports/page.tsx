"use client";

import React, { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Flag,
  CheckCircle,
  XCircle,
  ExternalLink,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchReports = (page = 1, statusFilter = status) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
    });
    if (statusFilter && statusFilter !== "all") params.append("status", statusFilter);

    fetch(`/api/v1/admin/reports?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setReports(data.reports || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      })
      .catch((err) => console.error("Admin reports fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReports(1, status);
  }, [status]);

  const handleAction = async (
    reportId: string,
    action: "RESOLVE" | "DISMISS" | "DISABLE_FILE"
  ) => {
    setActionLoadingId(reportId);
    try {
      const res = await fetch(`/api/v1/admin/reports/${reportId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchReports(currentPage, status);
      }
    } catch (err) {
      console.error("Report action error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Content Moderation & DMCA Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review user and copyright holder reports, inspect files, and disable malicious content.
        </p>
      </div>

      {/* Status filter */}
      <div className="flex items-center gap-2">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Reports</option>
          <option value="PENDING">Pending Review</option>
          <option value="INVESTIGATING">Investigating</option>
          <option value="RESOLVED">Resolved</option>
          <option value="DISMISSED">Dismissed</option>
        </select>
      </div>

      {/* Reports Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : reports.length === 0 ? (
          <EmptyState
            icon={<Flag className="w-6 h-6" />}
            title="No reports submitted"
            description="The platform has no open content or DMCA reports matching this filter."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">Reported File</th>
                    <th className="py-3 px-3">Reason</th>
                    <th className="py-3 px-3">Reporter</th>
                    <th className="py-3 px-3">Details</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {reports.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 text-slate-400">
                        {formatDate(r.createdAt)}
                      </td>

                      <td className="py-3 px-3 max-w-[180px]">
                        <span className="font-semibold text-white block truncate">
                          {r.file?.title || "Deleted File"}
                        </span>
                        {r.file?.slug && (
                          <a
                            href={`/d/${r.file.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] text-blue-400 hover:underline flex items-center gap-1 font-mono mt-0.5"
                          >
                            <span>/d/{r.file.slug}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        <Badge variant="danger">{r.reason}</Badge>
                      </td>

                      <td className="py-3 px-3 text-slate-400 max-w-[140px] truncate">
                        {r.reporterEmail || "Anonymous"}
                      </td>

                      <td className="py-3 px-3 max-w-[200px] truncate text-slate-300">
                        {r.details || "No details provided"}
                      </td>

                      <td className="py-3 px-3">
                        {r.status === "PENDING" ? (
                          <Badge variant="warning">Pending</Badge>
                        ) : r.status === "RESOLVED" ? (
                          <Badge variant="success">Resolved</Badge>
                        ) : (
                          <Badge variant="default">Dismissed</Badge>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {r.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => handleAction(r.id, "DISABLE_FILE")}
                                disabled={actionLoadingId === r.id || !r.file?.isEnabled}
                                className="px-2 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 font-medium"
                                title="Disable File & Mark Resolved"
                              >
                                Disable File
                              </button>
                              <button
                                onClick={() => handleAction(r.id, "RESOLVE")}
                                disabled={actionLoadingId === r.id}
                                className="px-2 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-medium"
                              >
                                Resolve
                              </button>
                              <button
                                onClick={() => handleAction(r.id, "DISMISS")}
                                disabled={actionLoadingId === r.id}
                                className="px-2 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white font-medium"
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {currentPage} of {totalPages} ({totalCount} total)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => fetchReports(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchReports(currentPage + 1)}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
