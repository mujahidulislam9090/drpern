"use client";

import React from "react";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2.5 focus:rounded-xl focus:bg-blue-600 focus:text-white focus:font-bold focus:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-400 text-sm transition-all"
    >
      Skip to main content
    </a>
  );
}
