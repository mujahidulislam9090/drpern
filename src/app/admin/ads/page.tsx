"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { parseResponseJson } from "@/lib/utils";
import {
  Megaphone,
  Save,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  DollarSign,
  Info,
  RefreshCw,
  Sliders,
  Sparkles,
  Layers,
  Zap,
  CheckCheck,
  XCircle,
} from "lucide-react";

interface AdPlacementItem {
  id: string;
  name: string;
  location: string;
  isEnabled: boolean;
  providerId?: string | null;
  provider?: {
    id: string;
    name: string;
    providerKey: string;
    adSlotId?: string | null;
  } | null;
  slotId?: string;
}

export default function AdminAdsPage() {
  const [adSensePublisherId, setAdSensePublisherId] = useState("");
  const [adProviderEnabled, setAdProviderEnabled] = useState(false);
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(true);
  const [placements, setPlacements] = useState<AdPlacementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchConfig = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/ads");
      const { ok, data, error: loadErr } = await parseResponseJson(res);
      if (!ok || !data) {
        throw new Error(loadErr || "Unable to load advertisement settings from database.");
      }
      setAdSensePublisherId(data.adSensePublisherId || "");
      setAdProviderEnabled(Boolean(data.adProviderEnabled));
      setAutoAdsEnabled(Boolean(data.autoAdsEnabled ?? true));
      setPlacements(
        (data.placements || []).map((p: any) => ({
          ...p,
          slotId: p.provider?.adSlotId || "",
        }))
      );
    } catch (err: any) {
      console.error("[AdminAdsPage] Load error:", err);
      setError(err.message || "Failed to load advertising configuration.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleTogglePlacement = (id: string) => {
    setPlacements((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isEnabled: !p.isEnabled } : p))
    );
  };

  const handleSlotIdChange = (id: string, slotId: string) => {
    setPlacements((prev) =>
      prev.map((p) => (p.id === id ? { ...p, slotId } : p))
    );
  };

  const handleEnableAll = () => {
    setPlacements((prev) => prev.map((p) => ({ ...p, isEnabled: true })));
    setAdProviderEnabled(true);
  };

  const handleDisableAll = () => {
    setPlacements((prev) => prev.map((p) => ({ ...p, isEnabled: false })));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/v1/admin/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adSensePublisherId,
          adProviderEnabled,
          autoAdsEnabled,
          placements: placements.map((p) => ({
            id: p.id,
            name: p.name,
            location: p.location,
            isEnabled: p.isEnabled,
            slotId: p.slotId || p.provider?.adSlotId || null,
          })),
        }),
      });

      const { ok, error: saveErr } = await parseResponseJson(res);
      if (!ok) {
        throw new Error(saveErr || "Failed to save ad configuration");
      }

      setSuccess("Advertisement placements and monetization settings saved successfully!");
      setTimeout(() => setSuccess(""), 4000);
      fetchConfig();
    } catch (err: any) {
      setError(err.message || "Error saving ad configuration");
    } finally {
      setSaving(false);
    }
  };

  const isConfigured = Boolean(
    adSensePublisherId.trim().startsWith("ca-pub-") && adProviderEnabled
  );

  const downloadPlacements = placements.filter((p) =>
    p.location.startsWith("DOWNLOAD")
  );
  const landingPlacements = placements.filter(
    (p) =>
      p.location.startsWith("HOME") ||
      p.location.startsWith("RATES") ||
      p.location.startsWith("FAQ") ||
      p.location.startsWith("REPORT")
  );
  const universalPlacements = placements.filter(
    (p) => p.location === "SIDEBAR" || p.location === "BANNER"
  );

  const activePlacementsCount = placements.filter((p) => p.isEnabled).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-purple-400" />
            <span>Monetization & Ad Center</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Maximize platform revenue with Google AdSense, Auto Ads, and high-converting ad units
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={fetchConfig} loading={loading}>
            <RefreshCw className="w-4 h-4 mr-1.5" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Monetization Overview KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Active Placements
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {activePlacementsCount} / {placements.length}
          </div>
          <span className="text-[11px] text-purple-400 mt-0.5 block">
            {activePlacementsCount > 0 ? "Monetization Active" : "No Active Slots"}
          </span>
        </div>

        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Auto Ads Status
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            {autoAdsEnabled && isConfigured ? "Enabled" : "Disabled"}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Google AI Optimization
          </span>
        </div>

        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Publisher Verified
          </span>
          <div className="text-2xl font-black text-white mt-1">
            {isConfigured ? "Connected" : "Pending"}
          </div>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
            {adSensePublisherId || "Not configured"}
          </span>
        </div>

        <div className="rounded-2xl glass-card p-5 border border-slate-800">
          <span className="text-xs text-slate-400 font-semibold uppercase">
            Estimated Ad RPM
          </span>
          <div className="text-2xl font-black text-emerald-400 mt-1">$4.50 - $18.00</div>
          <span className="text-[11px] text-slate-400 mt-0.5 block">
            Based on Tier 1 Geo
          </span>
        </div>
      </div>

      {/* Main Configuration Form */}
      <form onSubmit={handleSave} className="space-y-8">
        {/* Global Settings & Auto Ads Card */}
        <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>AdSense Account & Global Settings</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Google AdSense Publisher ID
                </label>
                <input
                  type="text"
                  value={adSensePublisherId}
                  onChange={(e) => setAdSensePublisherId(e.target.value)}
                  placeholder="ca-pub-1234567890123456"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Paste your publisher ID from Google AdSense $\rightarrow$ Account $\rightarrow$ Account information.
                </p>
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                <div>
                  <span className="text-sm font-semibold text-white block">
                    Global Ad Rendering
                  </span>
                  <span className="text-xs text-slate-400">
                    Master switch for all public ads across the website
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={adProviderEnabled}
                  onChange={(e) => setAdProviderEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-purple-950/20 border border-purple-500/30">
                <div>
                  <span className="text-sm font-semibold text-purple-200 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>AdSense Auto Ads (Recommended)</span>
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Automatically injects Google AI Anchor, Vignette, and In-Feed high-paying ads.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoAdsEnabled}
                  onChange={(e) => setAutoAdsEnabled(e.target.checked)}
                  className="h-5 w-5 rounded border-slate-700 text-purple-600 focus:ring-purple-500 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs text-slate-400 space-y-2">
                <span className="font-semibold text-white block">Quick Action Presets</span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={handleEnableAll}
                  >
                    <CheckCheck className="w-4 h-4 mr-1 text-emerald-400" />
                    <span>Enable All Slots</span>
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleDisableAll}
                  >
                    <XCircle className="w-4 h-4 mr-1 text-slate-400" />
                    <span>Disable All Slots</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 1: Download Gateway Placements */}
        <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>High-Converting Download Gateway Placements (/d/[slug])</span>
            </h3>
            <Badge variant="info">{downloadPlacements.length} Placements</Badge>
          </div>
          <p className="text-xs text-slate-400">
            These placements display directly to visitors downloading files. Optimized for maximum CPM.
          </p>

          <div className="divide-y divide-slate-800/80">
            {downloadPlacements.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                    <Badge variant={p.isEnabled ? "success" : "default"}>
                      {p.location}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 block">
                    {p.location === "DOWNLOAD_TOP" && "Renders at the very top of download page"}
                    {p.location === "DOWNLOAD_MIDDLE" && "Renders right between file details and download action"}
                    {p.location === "DOWNLOAD_COUNTDOWN" && "Renders inside card during the 5s unlock countdown"}
                    {p.location === "DOWNLOAD_COMPLETED" && "Renders immediately after visitor triggers download"}
                    {p.location === "DOWNLOAD_BOTTOM" && "Renders below file metadata and report link"}
                    {p.location === "DOWNLOAD_SIDEBAR" && "Renders as sticky vertical ad on desktop screens"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={p.slotId || ""}
                    onChange={(e) => handleSlotIdChange(p.id, e.target.value)}
                    placeholder="Ad Slot ID (Optional if Auto Ads)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 w-52"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePlacement(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      p.isEnabled
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {p.isEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Public Landing & Information Placements */}
        <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>Public Landing & Informational Pages</span>
            </h3>
            <Badge variant="info">{landingPlacements.length} Placements</Badge>
          </div>
          <p className="text-xs text-slate-400">
            Monetize high-traffic discovery pages including Homepage, Rates, FAQs, and Abuse Reporting.
          </p>

          <div className="divide-y divide-slate-800/80">
            {landingPlacements.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                    <Badge variant={p.isEnabled ? "success" : "default"}>
                      {p.location}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 block">
                    {p.location === "HOME_HERO_BOTTOM" && "Renders right below quick upload on landing page"}
                    {p.location === "HOME_MID_SECTION" && "Renders between feature cards and rates showcase"}
                    {p.location === "HOME_FOOTER" && "Renders above the main site footer on landing page"}
                    {p.location === "RATES_TOP" && "Renders above payout tiers on /rates page"}
                    {p.location === "RATES_BOTTOM" && "Renders below payout table on /rates page"}
                    {p.location === "FAQ_BOTTOM" && "Renders below questions on /faq page"}
                    {p.location === "REPORT_BOTTOM" && "Renders below report abuse form"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={p.slotId || ""}
                    onChange={(e) => handleSlotIdChange(p.id, e.target.value)}
                    placeholder="Ad Slot ID (Optional if Auto Ads)"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 w-52"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePlacement(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      p.isEnabled
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {p.isEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Universal Layout Placements */}
        <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-purple-400" />
              <span>Universal Navigation & Layout Placements</span>
            </h3>
            <Badge variant="info">{universalPlacements.length} Placements</Badge>
          </div>

          <div className="divide-y divide-slate-800/80">
            {universalPlacements.map((p) => (
              <div
                key={p.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-white">{p.name}</span>
                    <Badge variant={p.isEnabled ? "success" : "default"}>
                      {p.location}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400 block">
                    {p.location === "BANNER" && "Header top banner across public pages"}
                    {p.location === "SIDEBAR" && "Sidebar placement across desktop layouts"}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={p.slotId || ""}
                    onChange={(e) => handleSlotIdChange(p.id, e.target.value)}
                    placeholder="Ad Slot ID"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 w-52"
                  />
                  <button
                    type="button"
                    onClick={() => handleTogglePlacement(p.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                      p.isEnabled
                        ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {p.isEnabled ? "Enabled" : "Disabled"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <Button type="submit" loading={saving} size="lg" className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            <span>Save All Ad Placements</span>
          </Button>
        </div>
      </form>

      {/* Ad Revenue Reconciliation Card */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400" />
          <span>Advertising Payouts & Settlement Balance</span>
        </h3>
        <p className="text-xs text-slate-400">
          Showing real verified balances from connected ad networks (AdSense net-30 settlements).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">
              Estimated Ad Revenue
            </span>
            <div className="text-xl font-bold text-white mt-1">Not available yet</div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Awaiting next reporting sync
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">
              Confirmed Ad Revenue
            </span>
            <div className="text-xl font-bold text-emerald-400 mt-1">$0.00</div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Settled net payouts
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
            <span className="text-xs text-slate-400 font-semibold uppercase">
              Pending Ad Revenue
            </span>
            <div className="text-xl font-bold text-amber-400 mt-1">$0.00</div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              30-day payout schedule
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
