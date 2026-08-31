"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  // Show reading scroll bar only on public informative pages
  const isEligiblePage =
    pathname === "/" ||
    pathname === "/rates" ||
    pathname === "/faq" ||
    pathname.startsWith("/report");

  useEffect(() => {
    if (!isEligiblePage) return;

    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight <= 0) return;
      const currentScroll = window.scrollY;
      const percent = Math.min(
        100,
        Math.max(0, (currentScroll / totalHeight) * 100)
      );
      setProgress(percent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isEligiblePage]);

  if (!isEligiblePage || progress <= 0) return null;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(progress)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 transition-all duration-75"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
