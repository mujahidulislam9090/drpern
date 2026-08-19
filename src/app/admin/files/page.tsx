"use client";

import React, { useEffect, useState } from "react";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  FolderOpen,
  Search,
  Power,
  Trash2,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminFilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchFiles = (page = 1, searchQuery = search, statusQuery = status) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
    });
    if (searchQuery) params.append("search", searchQuery);
    if (statusQuery && statusQuery !== "all") params.append("status", statusQuery);

    fetch(`/api/v1/admin/files?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setFiles(data.files || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      })
      .catch((err) => console.error("Admin files fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles(1, search, status);
  }, [status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(1, search, status);
  };

  const handleAction = async (
    fileId: string,
    action: "DISABLE" | "ENABLE" | "DELETE" | "RESTORE"
  ) => {
    setActionLoadingId(fileId);
    try {
      const res = await fetch(`/api/v1/admin/files/${fileId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchFiles(currentPage, search, status);
      }
    } catch (err) {
      console.error("Admin file action error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          File Catalog & Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Inspect, moderate, disable, or delete uploaded files across the platform.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug, uploader email..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500 w-full sm:w-auto"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Only</option>
            <option value="disabled">Disabled Only</option>
            <option value="deleted">Deleted Only</option>
          </select>
        </div>
      </div>

      {/* Files Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : files.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-6 h-6" />}
            title="No files match criteria"
            description="No files in the repository match your current filter settings."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">File Title / Slug</th>
                    <th className="py-3 px-3">Uploader</th>
                    <th className="py-3 px-3">Size</th>
                    <th className="py-3 px-3">Downloads</th>
                    <th className="py-3 px-3">Qualified</th>
                    <th className="py-3 px-3">Reports</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Moderation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {files.map((f) => (
                    <tr
                      key={f.id}
                      className={`hover:bg-slate-800/40 ${
                        f.isDeleted ? "opacity-40" : !f.isEnabled ? "opacity-70" : ""
                      }`}
                    >
                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="font-semibold text-white block truncate">
                          {f.title}
                        </span>
                        <span className="text-[10px] text-blue-400 font-mono">
                          /d/{f.slug}
                        </span>
                      </td>

                      <td className="py-3 px-3 max-w-[150px] truncate text-slate-400">
                        {f.uploader?.email || "Unknown"}
                      </td>

                      <td className="py-3 px-3 font-mono">{formatBytes(f.sizeBytes)}</td>

                      <td className="py-3 px-3 font-semibold">{f.downloadCount}</td>

                      <td className="py-3 px-3 font-semibold text-emerald-400">
                        {f.qualifiedDownloadCount || 0}
                      </td>

                      <td className="py-3 px-3">
                        {f.reportCount > 0 ? (
                          <Badge variant="danger">{f.reportCount} reports</Badge>
                        ) : (
                          <span className="text-slate-500">0</span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {f.isDeleted ? (
                          <Badge variant="danger">Deleted</Badge>
                        ) : f.isEnabled ? (
                          <Badge variant="success">Active</Badge>
                        ) : (
                          <Badge variant="warning">Disabled</Badge>
                        )}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <a
                            href={`/d/${f.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                            title="Inspect Download Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {!f.isDeleted ? (
                            <>
                              {f.isEnabled ? (
                                <button
                                  onClick={() => handleAction(f.id, "DISABLE")}
                                  disabled={actionLoadingId === f.id}
                                  className="p-1.5 rounded-lg text-amber-400 hover:bg-slate-800"
                                  title="Disable File"
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction(f.id, "ENABLE")}
                                  disabled={actionLoadingId === f.id}
                                  className="p-1.5 rounded-lg text-emerald-400 hover:bg-slate-800"
                                  title="Enable File"
                                >
                                  <Power className="w-4 h-4" />
                                </button>
                              )}

                              <button
                                onClick={() => handleAction(f.id, "DELETE")}
                                disabled={actionLoadingId === f.id}
                                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10"
                                title="Delete File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleAction(f.id, "RESTORE")}
                              disabled={actionLoadingId === f.id}
                              className="p-1.5 rounded-lg text-blue-400 hover:bg-slate-800"
                              title="Restore File"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
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
                    onClick={() => fetchFiles(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchFiles(currentPage + 1)}
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
