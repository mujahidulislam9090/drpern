"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { CookiePreferencesModal, CookiePreferences } from "./CookiePreferencesModal";
import { ShieldCheck, SlidersHorizontal, Check, X } from "lucide-react";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dropearn_cookie_preferences");
    if (!saved) {
      // Delay showing banner slightly to prevent layout jarring on initial load
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem("dropearn_cookie_preferences", JSON.stringify(prefs));
    setShowBanner(false);
  };

  const handleAcceptAll = () => {
    savePreferences({
      necessary: true,
      analytics: true,
      functional: true,
      marketing: true,
      consentGiven: true,
      timestamp: new Date().toISOString(),
    });
  };

  const handleRejectNonEssential = () => {
    savePreferences({
      necessary: true,
      analytics: false,
      functional: false,
      marketing: false,
      consentGiven: true,
      timestamp: new Date().toISOString(),
    });
  };

  if (!showBanner) {
    return (
      <CookiePreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={savePreferences}
      />
    );
  }

  return (
    <>
      <div
        role="region"
        aria-label="Cookie consent banner"
        className="fixed bottom-0 inset-x-0 z-40 p-4 sm:p-6 bg-slate-950/90 backdrop-blur-xl border-t border-slate-800 shadow-2xl animate-fade-in"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5 max-w-3xl">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                Your Privacy & Cookie Choices
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                We use cookies to maintain your authenticated creator session, measure verified file downloads, prevent download fraud, and display advertising units. You can accept all cookies, reject non-essential cookies, or customize your preferences anytime.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowModal(true)}
              className="text-xs flex items-center gap-1.5"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Customize</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleRejectNonEssential}
              className="text-xs"
            >
              Reject Non-Essential
            </Button>

            <Button
              size="sm"
              onClick={handleAcceptAll}
              className="text-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Accept All</span>
            </Button>
          </div>
        </div>
      </div>

      <CookiePreferencesModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={savePreferences}
      />
    </>
  );
}
