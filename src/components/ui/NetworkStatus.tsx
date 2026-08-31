"use client";

import React, { useState, useEffect } from "react";
import { WifiOff, Wifi, RefreshCw } from "lucide-react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [showRestored, setShowRestored] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowRestored(true);
      const timer = setTimeout(() => setShowRestored(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowRestored(false);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial check
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setIsOnline(false);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline && !showRestored) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed top-16 inset-x-0 z-40 flex items-center justify-center p-2 pointer-events-none animate-fade-in"
    >
      {!isOnline ? (
        <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-red-600/90 text-white shadow-2xl border border-red-400/30 backdrop-blur-md flex items-center gap-2.5 text-xs font-semibold">
          <WifiOff className="w-4 h-4 animate-pulse shrink-0" />
          <span>You are currently offline. Checking for connection...</span>
          <button
            onClick={() => window.location.reload()}
            className="ml-2 px-2 py-0.5 rounded-lg bg-black/20 hover:bg-black/40 text-white text-[11px] font-bold flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      ) : showRestored ? (
        <div className="pointer-events-auto px-4 py-2 rounded-2xl bg-emerald-600/90 text-white shadow-2xl border border-emerald-400/30 backdrop-blur-md flex items-center gap-2 text-xs font-semibold">
          <Wifi className="w-4 h-4 shrink-0" />
          <span>Connection restored — You are back online!</span>
        </div>
      ) : null}
    </div>
  );
}
