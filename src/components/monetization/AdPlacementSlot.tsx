"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export type AdPlacementLocationType =
  | "DOWNLOAD_TOP"
  | "DOWNLOAD_MIDDLE"
  | "DOWNLOAD_BOTTOM"
  | "DOWNLOAD_SIDEBAR"
  | "DOWNLOAD_COUNTDOWN"
  | "DOWNLOAD_COMPLETED"
  | "HOME_HERO_BOTTOM"
  | "HOME_MID_SECTION"
  | "HOME_FOOTER"
  | "RATES_TOP"
  | "RATES_BOTTOM"
  | "FAQ_BOTTOM"
  | "REPORT_BOTTOM"
  | "SIDEBAR"
  | "BANNER";

interface AdPlacementSlotProps {
  location: AdPlacementLocationType;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  showLabel?: boolean;
  className?: string;
}

interface ActivePlacement {
  id: string;
  name: string;
  location: string;
  isEnabled: boolean;
  slotId: string | null;
  clientId: string | null;
  providerKey: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export function AdPlacementSlot({
  location,
  format = "auto",
  showLabel = true,
  className = "",
}: AdPlacementSlotProps) {
  const [placement, setPlacement] = useState<ActivePlacement | null>(null);
  const [clientId, setClientId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/ads/placements?location=${location}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setClientId(data.clientId || null);
          const found = (data.placements || []).find(
            (p: ActivePlacement) => p.location === location && p.isEnabled
          );
          setPlacement(found || null);
        }
      })
      .catch(() => {
        setPlacement(null);
      })
      .finally(() => setLoading(false));
  }, [location]);

  useEffect(() => {
    if (placement && placement.slotId && clientId) {
      try {
        if (typeof window !== "undefined") {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
          setAdLoaded(true);
        }
      } catch (err) {
        console.warn(`[AdPlacementSlot:${location}] AdSense push notice:`, err);
      }
    }
  }, [placement, clientId, location]);

  if (loading) {
    return null;
  }

  const activeClientId = placement?.clientId || clientId;
  const isAdSenseConfigured =
    Boolean(activeClientId && activeClientId.startsWith("ca-pub-")) &&
    Boolean(placement?.slotId);

  // If placement is enabled and real AdSense credentials are configured, render official AdSense tag
  if (placement && placement.isEnabled && isAdSenseConfigured) {
    return (
      <div className={`ad-container my-4 text-center overflow-hidden ${className}`}>
        {showLabel && (
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-1">
            Advertisement
          </span>
        )}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${activeClientId}`}
          crossOrigin="anonymous"
          strategy="lazyOnload"
        />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={activeClientId}
          data-ad-slot={placement.slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // If in local development and placement is enabled or in testing, show honest development indicator
  if (process.env.NODE_ENV === "development" && placement?.isEnabled) {
    return (
      <div
        className={`rounded-2xl border border-dashed border-purple-500/30 bg-purple-500/5 p-4 text-center text-xs text-purple-300 my-4 ${className}`}
      >
        <div className="font-semibold text-purple-200">
          Ad Slot ({location})
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">
          Active placement ready for Google AdSense • Format: {format}
        </p>
      </div>
    );
  }

  return null;
}
