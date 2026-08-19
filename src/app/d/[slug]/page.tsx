"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { formatBytes, formatDate } from "@/lib/utils";
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
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "File not found");
        }
        return res.json();
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
      const data = await res.json();
      if (data.valid) {
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
      const dwellSeconds = Math.max(
        Math.floor((Date.now() - startTime) / 1000),
        5
      );

      const res = await fetch(`/api/v1/files/${slug}/download`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: file?.hasPassword ? password : undefined,
          timeOnPage: dwellSeconds,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Download failed");
      }

      const data = await res.json();
      setDownloadCompleted(true);

      // Trigger download
      if (data.downloadUrl) {
        const a = document.createElement("a");
        a.href = data.downloadUrl;
        a.download = data.originalName || file.originalName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initiate download");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
        <p className="text-sm text-slate-400">Loading file details...</p>
      </div>
    );
  }

  if (error || !file) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl glass-card p-8 border border-red-500/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 text-red-400 mx-auto mb-4">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">File Unavailable</h2>
          <p className="text-sm text-slate-400 mb-6">
            {error || "The file you are looking for does not exist or has been disabled."}
          </p>
          <Link href="/">
            <Button size="sm">Go to Homepage</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Top Ad Placement */}
      <div className="mb-6">
        <AdPlacementSlot location="DOWNLOAD_TOP" format="horizontal" />
      </div>

      {/* Main Content + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main File Column */}
        <div className="lg:col-span-8 space-y-6">
          <div className="rounded-3xl glass-card p-6 sm:p-10 border border-slate-800 shadow-2xl relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-800/80">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <File className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {file.title}
                  </h1>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-2">
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
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-800/80 text-xs">
              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <User className="w-3.5 h-3.5" /> Uploader
                </span>
                <span className="font-semibold text-slate-200 truncate block">
                  {file.uploader?.displayName || "Anonymous"}
                </span>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <Download className="w-3.5 h-3.5" /> Downloads
                </span>
                <span className="font-semibold text-slate-200">
                  {file.downloadCount} {file.downloadCount === 1 ? "download" : "downloads"}
                </span>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <Calendar className="w-3.5 h-3.5" /> Upload Date
                </span>
                <span className="font-semibold text-slate-200">
                  {formatDate(file.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-slate-500 flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Status
                </span>
                <span className="font-semibold text-emerald-400">
                  Verified & Safe
                </span>
              </div>
            </div>

            {file.description && (
              <div className="py-6 border-b border-slate-800/80">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Description
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {file.description}
                </p>
              </div>
            )}

            {/* 2. Middle In-Content Ad Placement */}
            <div className="my-6">
              <AdPlacementSlot location="DOWNLOAD_MIDDLE" format="rectangle" />
            </div>

            {/* Password Prompt (if locked) */}
            {!isUnlocked && (
              <div className="py-8 text-center max-w-md mx-auto">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto mb-3">
                  <Lock className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">Password Required</h3>
                <p className="text-xs text-slate-400 mb-4">
                  The uploader protected this file with a password. Enter it below to unlock.
                </p>

                {passwordError && (
                  <p className="text-xs text-red-400 mb-3">{passwordError}</p>
                )}

                <form onSubmit={handleUnlockPassword} className="flex gap-2">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password..."
                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
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
                      <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <h4 className="text-base font-bold text-white">Download In Progress!</h4>
                      <p className="text-xs text-slate-400 mt-1 mb-4">
                        Your file download has started. If it didn&apos;t trigger automatically, click below.
                      </p>
                      <Button size="sm" onClick={handleDownload} variant="secondary">
                        Download Again
                      </Button>
                    </div>

                    {/* 3. Post-Download Sponsored Ad Placement */}
                    <div className="pt-2">
                      <AdPlacementSlot location="DOWNLOAD_COMPLETED" format="rectangle" />
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md mx-auto space-y-4">
                    {!canDownload ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-center justify-center gap-3 text-sm text-slate-400">
                          <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                          <span>
                            Generating secure download link in{" "}
                            <strong className="text-white font-mono">{timerSeconds}s</strong>...
                          </span>
                        </div>

                        {/* 4. Countdown Ad Placement */}
                        <AdPlacementSlot location="DOWNLOAD_COUNTDOWN" format="rectangle" />
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        onClick={handleDownload}
                        loading={downloading}
                        className="w-full shadow-xl shadow-blue-600/30 text-base font-bold"
                      >
                        <Download className="w-5 h-5 mr-2" />
                        <span>Download File ({formatBytes(file.sizeBytes)})</span>
                      </Button>
                    )}
                  </div>
                )}

                {/* Report Link */}
                <div className="mt-8 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-slate-400" />
                    <span>Verified secure download</span>
                  </span>
                  <Link
                    href={`/report/${file.slug}`}
                    className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>Report Abuse / DMCA</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 5. Desktop Sticky Right Sidebar Ad */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-3xl glass-card p-6 border border-slate-800">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Sponsored Partner
              </h3>
              <AdPlacementSlot location="DOWNLOAD_SIDEBAR" format="vertical" />
            </div>

            <div className="rounded-2xl glass-card p-5 border border-slate-800 text-xs text-slate-400 space-y-2">
              <span className="font-semibold text-white flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" />
                <span>Earn With DropEarn</span>
              </span>
              <p>
                Upload your files and get paid up to $18 per 1,000 qualified downloads.
              </p>
              <Link href="/signup" className="text-blue-400 font-semibold inline-block pt-1 hover:underline">
                Create Free Creator Account →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Bottom Ad Placement */}
      <div className="mt-8">
        <AdPlacementSlot location="DOWNLOAD_BOTTOM" format="horizontal" />
      </div>
    </div>
  );
}
