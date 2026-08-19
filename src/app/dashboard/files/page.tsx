"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatBytes, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { FILE_CATEGORIES } from "@/lib/constants";
import {
  FolderOpen,
  Search,
  Upload,
  Copy,
  Check,
  ExternalLink,
  Trash2,
  Lock,
  Power,
  Loader2,
  ChevronLeft,
  ChevronRight,
  HardDrive,
} from "lucide-react";

export default function MyFilesPage() {
  const [files, setFiles] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [storageUsage, setStorageUsage] = useState<{
    usedMb: number;
    limitMb: number;
    count: number;
  } | null>(null);

  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchFiles = (page = 1, searchQuery = search, catQuery = category) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
    });
    if (searchQuery) params.append("search", searchQuery);
    if (catQuery && catQuery !== "All") params.append("category", catQuery);

    fetch(`/api/v1/files?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setFiles(data.files || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
          if (data.storageUsage) {
            setStorageUsage(data.storageUsage);
          }
        }
      })
      .catch((err) => console.error("Fetch files error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchFiles(1, search, category);
  }, [category]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchFiles(1, search, category);
  };

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/d/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  const handleToggleStatus = async (slug: string) => {
    setActionLoadingId(slug);
    try {
      const res = await fetch(`/api/v1/files/${slug}/toggle`, {
        method: "PATCH",
      });
      if (res.ok) {
        const data = await res.json();
        setFiles((prev) =>
          prev.map((f) =>
            f.slug === slug ? { ...f, isEnabled: data.isEnabled } : f
          )
        );
      }
    } catch (err) {
      console.error("Toggle status error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this file? Download links will stop working.")) {
      return;
    }
    setActionLoadingId(slug);
    try {
      const res = await fetch(`/api/v1/files/${slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setFiles((prev) => prev.filter((f) => f.slug !== slug));
        setTotalCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Delete file error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Uploaded Files
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your files, copy public download links, and monitor download counts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {storageUsage && (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Storage:</span>
              <strong className="text-white font-mono">
                {storageUsage.usedMb} MB / {storageUsage.limitMb} MB
              </strong>
            </div>
          )}
          <Link href="/dashboard/upload">
            <Button size="sm">
              <Upload className="w-4 h-4 mr-1.5" />
              <span>Upload New File</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by file title or original name..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500 w-full sm:w-auto"
          >
            <option value="All">All Categories</option>
            {FILE_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : files.length === 0 ? (
          <EmptyState
            icon={<FolderOpen className="w-6 h-6" />}
            title="No files found"
            description={
              search || category !== "All"
                ? "No uploaded files match your search criteria."
                : "You haven't uploaded any files yet."
            }
            actionLabel={search || category !== "All" ? "Clear Filters" : "Upload File"}
            onAction={() => {
              if (search || category !== "All") {
                setSearch("");
                setCategory("All");
                fetchFiles(1, "", "All");
              } else {
                window.location.href = "/dashboard/upload";
              }
            }}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Title / Name</th>
                    <th className="py-3 px-3">Size</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Downloads</th>
                    <th className="py-3 px-3">Qualified</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Uploaded</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {files.map((f) => (
                    <tr
                      key={f.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        !f.isEnabled ? "opacity-60" : ""
                      }`}
                    >
                      <td className="py-3 px-3 font-medium text-white max-w-[200px]">
                        <div className="flex items-center gap-1.5">
                          {f.hasPassword && (
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                          <span className="truncate" title={f.title}>
                            {f.title}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {f.originalName}
                        </span>
                      </td>

                      <td className="py-3 px-3 font-mono">{formatBytes(f.sizeBytes)}</td>

                      <td className="py-3 px-3">
                        <Badge variant="default">{f.category}</Badge>
                      </td>

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

                      <td className="py-3 px-3 text-slate-400">
                        {formatDate(f.createdAt)}
                      </td>

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

                          <button
                            onClick={() => handleToggleStatus(f.slug)}
                            disabled={actionLoadingId === f.slug}
                            className={`p-1.5 rounded-lg hover:bg-slate-800 ${
                              f.isEnabled ? "text-amber-400" : "text-emerald-400"
                            }`}
                            title={f.isEnabled ? "Disable File" : "Enable File"}
                          >
                            <Power className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleDelete(f.slug)}
                            disabled={actionLoadingId === f.slug}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            title="Delete File"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
                  Showing page {currentPage} of {totalPages} ({totalCount} total files)
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
