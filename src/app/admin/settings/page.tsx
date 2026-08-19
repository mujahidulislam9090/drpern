"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Settings,
  DollarSign,
  Upload,
  Layers,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Shield,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = () => {
    setLoading(true);
    fetch("/api/v1/admin/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.settings) {
          setSettings(data.settings);
        }
      })
      .catch((err) => console.error("Admin settings error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSaved(false);

    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save settings");
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save platform settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Platform Configuration & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure financial revenue shares, upload boundaries, ad network connections, and system controls.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Platform settings updated successfully and cached.</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. FINANCIAL & REVENUE SETTINGS */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Revenue Sharing & Payouts</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Uploader Revenue Share (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings["revenue.uploaderSharePercent"] || "70"}
                onChange={(e) =>
                  handleChange("revenue.uploaderSharePercent", e.target.value)
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Default: 70% to uploader
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Referral Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={settings["revenue.referralCommissionPercent"] || "10"}
                onChange={(e) =>
                  handleChange("revenue.referralCommissionPercent", e.target.value)
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Percentage of platform share
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Minimum Withdrawal ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={settings["withdrawal.minAmount"] || "10.00"}
                onChange={(e) =>
                  handleChange("withdrawal.minAmount", e.target.value)
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Minimum threshold for requests
              </span>
            </div>
          </div>
        </div>

        {/* 2. AD NETWORK & MONETIZATION SETTINGS */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
            <Layers className="w-4 h-4" />
            <span>Monetization & Ad Network Configuration</span>
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div>
              <span className="text-xs font-semibold text-white block">
                Enable Monetization Ads
              </span>
              <span className="text-[11px] text-slate-400">
                When disabled, download pages display honest unconfigured state with zero fake ads.
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings["adNetwork.enabled"] === "true"}
              onChange={(e) =>
                handleChange("adNetwork.enabled", e.target.checked ? "true" : "false")
              }
              className="h-4 w-4 rounded border-slate-700 text-purple-600 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ad Network Provider
              </label>
              <select
                value={settings["adNetwork.provider"] || "CUSTOM"}
                onChange={(e) => handleChange("adNetwork.provider", e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              >
                <option value="GOOGLE_ADSENSE">Google AdSense</option>
                <option value="PROPELLER_ADS">PropellerAds</option>
                <option value="ADSTERRA">Adsterra</option>
                <option value="CUSTOM">Custom HTML / Script</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Publisher / Account ID
              </label>
              <input
                type="text"
                value={settings["adNetwork.publisherId"] || ""}
                onChange={(e) =>
                  handleChange("adNetwork.publisherId", e.target.value)
                }
                placeholder="pub-xxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        </div>

        {/* 3. FILE UPLOAD & SYSTEM LIMITS */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <Upload className="w-4 h-4" />
            <span>Upload Boundaries & Limits</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Max Upload File Size (MB)
              </label>
              <input
                type="number"
                min="10"
                max="5000"
                value={settings["upload.maxSizeBytes"] ? String(Number(settings["upload.maxSizeBytes"]) / (1024 * 1024)) : "500"}
                onChange={(e) =>
                  handleChange(
                    "upload.maxSizeBytes",
                    String(Number(e.target.value) * 1024 * 1024)
                  )
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Standard max: 500 MB
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Link Expiration (Days)
              </label>
              <input
                type="number"
                min="0"
                max="365"
                value={settings["upload.defaultExpiryDays"] || "0"}
                onChange={(e) =>
                  handleChange("upload.defaultExpiryDays", e.target.value)
                }
                className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                0 = No automatic expiration
              </span>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-2">
          <Button type="submit" loading={saving} size="md">
            <span>Save Platform Settings</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
