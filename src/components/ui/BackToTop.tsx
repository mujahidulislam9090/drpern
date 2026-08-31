"use client";

import React, { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top of page"
      className="fixed bottom-6 left-6 z-40 p-3 rounded-2xl bg-blue-600/90 hover:bg-blue-500 text-white shadow-xl shadow-blue-500/25 border border-blue-400/30 backdrop-blur-md transition-all animate-fade-in hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-blue-400/50 cursor-pointer"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
