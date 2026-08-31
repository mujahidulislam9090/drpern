"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { X, ShieldCheck, Check, Info } from "lucide-react";

export interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  functional: boolean;
  marketing: boolean;
  consentGiven: boolean;
  timestamp: string;
}

interface CookiePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prefs: CookiePreferences) => void;
}

export function CookiePreferencesModal({
  isOpen,
  onClose,
  onSave,
}: CookiePreferencesModalProps) {
  const [analytics, setAnalytics] = useState(true);
  const [functional, setFunctional] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dropearn_cookie_preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnalytics(parsed.analytics ?? true);
        setFunctional(parsed.functional ?? true);
        setMarketing(parsed.marketing ?? false);
      } catch {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const prefs: CookiePreferences = {
      necessary: true,
      analytics,
      functional,
      marketing,
      consentGiven: true,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("dropearn_cookie_preferences", JSON.stringify(prefs));
    onSave(prefs);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 sm:p-8 shadow-2xl border border-slate-700/80">
        <button
          onClick={onClose}
          aria-label="Close preferences"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 id="cookie-modal-title" className="text-xl font-bold text-white">
              Cookie & Privacy Preferences
            </h3>
            <p className="text-xs text-slate-400">
              Customize how we store and process data in your browser.
            </p>
          </div>
        </div>

        <div className="space-y-4 my-6 text-xs text-slate-300">
          {/* Necessary */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-white text-sm">
                  Essential & Security Cookies
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  Always Active
                </span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed">
                Required for core authentication sessions, anti-fraud rate limits, and secure file downloads. Cannot be disabled.
              </p>
            </div>
            <div className="shrink-0 mt-1">
              <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* Analytics */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-white text-sm block mb-1">
                Analytics & Traffic Statistics
              </span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Helps us count visitor downloads, measure creator traffic quality, and maintain fraud deterrence.
              </p>
            </div>
            <label className="shrink-0 mt-1 relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="sr-only peer"
                aria-label="Toggle analytics cookies"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Functional */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-white text-sm block mb-1">
                Functional & Personalization
              </span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Remembers your theme preferences (Light/Dark/System) and dashboard layout settings.
              </p>
            </div>
            <label className="shrink-0 mt-1 relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={functional}
                onChange={(e) => setFunctional(e.target.checked)}
                className="sr-only peer"
                aria-label="Toggle functional cookies"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Marketing */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-4">
            <div>
              <span className="font-bold text-white text-sm block mb-1">
                Monetization & Advertising
              </span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Enables personalized Google AdSense ad units on file download gateways to maximize creator CPM earnings.
              </p>
            </div>
            <label className="shrink-0 mt-1 relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="sr-only peer"
                aria-label="Toggle marketing cookies"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSave}>
            Save Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
