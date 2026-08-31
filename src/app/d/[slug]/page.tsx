"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatBytes, formatDate, parseResponseJson } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { AdPlacementSlot } from "@/components/monetization/AdPlacementSlot";
import {
  Download,
  File,
  Lock,
  Calendar,
  Layers,
  User,
  AlertTriangle,
  Flag,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function DownloadPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Password state
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Timer & Download state
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [canDownload, setCanDownload] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadCompleted, setDownloadCompleted] = useState(false);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    if (!slug) return;

    // 1. Fetch file details
    fetch(`/api/v1/files/${slug}`)
      .then(async (res) => {
        const { ok, data, error } = await parseResponseJson(res);
        if (!ok || !data?.file) {
          throw new Error(error || "File not found");
        }
        return data;
      })
      .then((data) => {
        setFile(data.file);
        if (!data.file.hasPassword) {
          setIsUnlocked(true);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load file");
      })
      .finally(() => setLoading(false));

    // 2. Record visitor event
    fetch("/api/v1/events/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pagePath: `/d/${slug}` }),
    }).catch(() => {});
  }, [slug]);

  // Countdown timer for download qualification
  useEffect(() => {
    if (!isUnlocked || timerSeconds <= 0) {
      if (timerSeconds <= 0) setCanDownload(true);
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanDownload(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isUnlocked, timerSeconds]);

  const handleUnlockPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");

    try {
      const res = await fetch(`/api/v1/files/${slug}/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const { ok, data } = await parseResponseJson(res);
      if (ok && data?.valid) {
        setIsUnlocked(true);
      } else {
        setPasswordError("Incorrect password");
      }
    } catch {
      setPasswordError("Failed to verify password");
    }
  };

  const handleDownload = async () => {
    if (!canDownload || downloading) return;
    setDownloading(true);

    try {
      const dwellTimeSeconds = Math.max(
        1,
        Math.floor((Date.now() - startTime) / 1000)
      );

      const res = await fetch(`/api/v1/files/${slug}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dwellTimeSeconds }),
      });

      const { ok, data, error: dlErr } = await parseResponseJson(res);

      if (!ok || !data?.downloadUrl) {
        throw new Error(dlErr || "Download generation failed");
      }

      setDownloadCompleted(true);

      // Trigger file download
      const link = document.createElement("a");
      link.href = data.downloadUrl;
      link.download = file.originalName || file.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err: any) {
      setError(err.message || "Failed to trigger download");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading secure file details...</p>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-3xl glass-card p-8 text-center border-red-500/20 shadow-2xl space-y-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-500 mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">File Unavailable</h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            {error || "This file does not exist, has expired, or has reached its download quota."}
          </p>
          <Link href="/">
            <Button size="sm">Return to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Ad Placement */}
      <div className="mb-6">
        <AdPlacementSlot location="DOWNLOAD_TOP" format="horizontal" />
      </div>

      {/* Main Content + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main File Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl glass-card p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-2xl relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800/80">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                  <File className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {file.title}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2 font-medium">
                    <span>{file.originalName}</span>
                    <span>•</span>
                    <span>{formatBytes(file.sizeBytes)}</span>
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="info">{file.category}</Badge>
                {file.hasPassword && <Badge variant="warning">Password Protected</Badge>}
              </div>
            </div>

            {/* File Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                  <User className="w-3.5 h-3.5" /> Uploader
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-200 truncate block">
                  {file.uploader?.displayName || "Anonymous Creator"}
                </span>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                  <Download className="w-3.5 h-3.5" /> Downloads
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-200">
                  {file.downloadCount} {file.downloadCount === 1 ? "download" : "downloads"}
                </span>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                  <Calendar className="w-3.5 h-3.5" /> Upload Date
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-200">
                  {formatDate(file.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" /> Status
                </span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Verified Safe
                </span>
              </div>
            </div>

            {file.description && (
              <div className="py-6 border-b border-slate-200 dark:border-slate-800/80">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  File Description
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {file.description}
                </p>
              </div>
            )}

            {/* Middle In-Content Ad Placement */}
            <div className="my-6">
              <AdPlacementSlot location="DOWNLOAD_MIDDLE" format="rectangle" />
            </div>

            {/* Password Prompt (if locked) */}
            {!isUnlocked && (
              <div className="py-8 text-center max-w-md mx-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Password Required</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
                  The uploader protected this file with a password. Enter it below to unlock the download.
                </p>

                {passwordError && (
                  <p className="text-xs text-red-500 mb-3 font-semibold">{passwordError}</p>
                )}

                <form onSubmit={handleUnlockPassword} className="flex gap-2">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                  <Button type="submit" size="sm">
                    Unlock
                  </Button>
                </form>
              </div>
            )}

            {/* Download Action Area (if unlocked) */}
            {isUnlocked && (
              <div className="pt-6 text-center">
                {downloadCompleted ? (
                  <div className="space-y-6">
                    <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-fade-in max-w-md mx-auto">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">Download Started!</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-4">
                        Your download should begin immediately. If it did not start, click below.
                      </p>
                      <Button size="sm" onClick={handleDownload} variant="secondary">
                        Download Again
                      </Button>
                    </div>

                    {/* Post-Download Sponsored Ad Placement */}
                    <div className="pt-2">
                      <AdPlacementSlot location="DOWNLOAD_COMPLETED" format="rectangle" />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-4">
                    {!canDownload ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-medium">
                          <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                          <span>
                            Generating download link in{" "}
                            <strong className="text-slate-900 dark:text-white font-mono">{timerSeconds}s</strong>...
                          </span>
                        </div>

                        {/* Countdown Ad Placement */}
                        <AdPlacementSlot location="DOWNLOAD_COUNTDOWN" format="rectangle" />
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        onClick={handleDownload}
                        loading={downloading}
                        className="w-full shadow-xl shadow-blue-600/30 text-base font-bold py-4"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        <span>Download Now ({formatBytes(file.sizeBytes)})</span>
                      </Button>
                    )}
                  </div>
                )}

                {/* Report Link */}
                <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    <span>Verified virus-free & secure</span>
                  </span>
                  <Link
                    href={`/report/${file.slug}`}
                    className="flex items-center gap-1 hover:text-red-500 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Abuse / DMCA</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Sticky Right Sidebar Ad */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl glass-card p-6 border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                Sponsored Partner
              </h3>
              <AdPlacementSlot location="DOWNLOAD_SIDEBAR" format="vertical" />
            </div>

            <div className="rounded-2xl glass-card p-5 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-2 shadow-md">
              <span className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Earn With DropEarn</span>
              </span>
              <p className="leading-relaxed">
                Upload your files and get paid up to $18 per 1,000 qualified downloads with instant daily payouts.
              </p>
              <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-bold inline-block pt-1 hover:underline">
                Create Free Creator Account →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Placement */}
      <div className="mt-8">
        <AdPlacementSlot location="DOWNLOAD_BOTTOM" format="horizontal" />
      </div>
    </div>
  );
}
