"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { CopyButton } from "@/components/ui/CopyButton";
import { FILE_CATEGORIES } from "@/lib/constants";
import { formatBytes, parseResponseJson } from "@/lib/utils";
import {
  Upload,
  File,
  CheckCircle2,
  Lock,
  Layers,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  HardDrive,
} from "lucide-react";

export default function DashboardUploadPage() {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<globalThis.File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("General");
  const [tags, setTags] = useState("");
  const [enablePassword, setEnablePassword] = useState(false);
  const [password, setPassword] = useState("");
  const [downloadLimit, setDownloadLimit] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  const [quota, setQuota] = useState<{
    usedMb: number;
    limitMb: number;
    count: number;
    maxCount: number;
  } | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [uploadedResult, setUploadedResult] = useState<{
    slug: string;
    title: string;
    sizeBytes: string;
    shareUrl: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchQuota = async () => {
    try {
      const res = await fetch("/api/v1/files/quota");
      if (res.ok) {
        const data = await res.json();
        setQuota(data);
      }
    } catch {
      // Non-blocking quota fetch
    }
  };

  useEffect(() => {
    fetchQuota();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setSelectedFile(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ""));
      }
      setError("");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const f = e.dataTransfer.files[0];
      setSelectedFile(f);
      if (!title) {
        setTitle(f.name.replace(/\.[^/.]+$/, ""));
      }
      setError("");
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file to upload");
      return;
    }

    setUploading(true);
    setUploadProgress(20);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("title", title || selectedFile.name);
      if (description) formData.append("description", description);
      formData.append("category", category);
      if (tags) formData.append("tags", tags);
      if (enablePassword && password) formData.append("password", password);
      if (downloadLimit) formData.append("downloadLimit", downloadLimit);
      if (expiresAt) formData.append("expiresAt", expiresAt);
      formData.append("isPublic", String(isPublic));

      setUploadProgress(60);

      const res = await fetch("/api/v1/files", {
        method: "POST",
        body: formData,
      });

      const { ok, data, error: apiErr } = await parseResponseJson(res);

      if (!ok) {
        throw new Error(apiErr || "Upload failed. Please check file size and storage quota.");
      }

      setUploadProgress(100);

      const fileData = data?.file || data;
      setUploadedResult({
        slug: fileData.slug,
        title: fileData.title,
        sizeBytes: fileData.sizeBytes,
        shareUrl: `/d/${fileData.slug}`,
      });

      fetchQuota();
    } catch (err: any) {
      console.error("[DashboardUploadPage] Upload error:", err);
      setError(err.message || "An unexpected error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setTitle("");
    setDescription("");
    setPassword("");
    setEnablePassword(false);
    setDownloadLimit("");
    setExpiresAt("");
    setUploadedResult(null);
    setUploadProgress(0);
    setError("");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Upload New File
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Upload your software, mod, video, or documents to generate a monetized share link.
        </p>
      </div>

      {/* Quota Card */}
      {quota && (
        <div className="p-4 rounded-3xl glass-card border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs shadow-md">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">Storage Quota Status</p>
              <p className="text-slate-500 dark:text-slate-400">
                {quota.usedMb} MB used of {quota.limitMb} MB ({quota.count} files hosted)
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="font-bold font-mono text-purple-600 dark:text-purple-400 text-sm">
              {Math.max(0, quota.limitMb - quota.usedMb)} MB Available
            </span>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs sm:text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {uploadedResult ? (
        <div className="rounded-3xl glass-card p-8 sm:p-12 text-center border-emerald-500/30 animate-fade-in shadow-2xl space-y-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">Upload Complete!</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Your file <span className="font-bold text-slate-900 dark:text-slate-200">{uploadedResult.title}</span> is live.
          </p>

          <div className="max-w-xl mx-auto p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={
                typeof window !== "undefined"
                  ? `${window.location.origin}${uploadedResult.shareUrl}`
                  : uploadedResult.shareUrl
              }
              className="flex-1 bg-transparent text-xs sm:text-sm text-blue-600 dark:text-blue-400 font-mono px-3 py-1 outline-none truncate font-bold"
            />
            <CopyButton
              text={
                typeof window !== "undefined"
                  ? `${window.location.origin}${uploadedResult.shareUrl}`
                  : uploadedResult.shareUrl
              }
              label="Copy Link"
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href={uploadedResult.shareUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-1.5" />
                <span>Visit Download Page</span>
              </Button>
            </a>
            <Button size="sm" onClick={resetForm}>
              <Upload className="w-4 h-4 mr-1.5" />
              <span>Upload Another File</span>
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleUploadSubmit} className="space-y-6">
          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200 ${
              selectedFile
                ? "border-blue-500/60 bg-blue-50/50 dark:bg-blue-500/5 shadow-inner"
                : "border-slate-300 dark:border-slate-800 hover:border-blue-500 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-slate-900/40"
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 mb-3">
                  <File className="w-7 h-7" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white truncate max-w-md">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {formatBytes(selectedFile.size)} • Click or drop another to replace
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-200/80 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <p className="text-base font-bold text-slate-900 dark:text-white">
                  Drop your file here, or <span className="text-blue-600 dark:text-blue-400">browse</span>
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Supports all formats up to 100 MB per file • Max 1 GB free quota
                </p>
              </div>
            )}
          </div>

          {/* Upload Progress Bar */}
          {uploading && (
            <div className="rounded-2xl glass-card p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 font-medium">
                <span>Uploading to storage...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Metadata Form */}
          <div className="rounded-3xl glass-card p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-500" />
              <span>File Details & Access Options</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  File Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mod Pack Release v2.4"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
                >
                  {FILE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add brief details about this download..."
                className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="game, mod, skin"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Download Limit (Optional)
                </label>
                <input
                  type="number"
                  min="1"
                  value={downloadLimit}
                  onChange={(e) => setDownloadLimit(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Optional Password Protection */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Password Protection
                  </span>
                </div>
                <input
                  type="checkbox"
                  id="enablePassword"
                  checked={enablePassword}
                  onChange={(e) => setEnablePassword(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </div>

              {enablePassword && (
                <div className="animate-fade-in">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter file unlock password"
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                loading={uploading}
                size="lg"
                className="w-full py-3.5 text-sm font-bold shadow-lg shadow-blue-600/20"
              >
                <span>Upload & Generate Link</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
