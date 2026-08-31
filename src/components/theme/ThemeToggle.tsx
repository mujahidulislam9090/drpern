"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Laptop } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabels?: boolean;
}

export function ThemeToggle({ className = "", showLabels = false }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center rounded-xl bg-slate-200/80 dark:bg-slate-800/90 p-1 border border-slate-300 dark:border-slate-700/80 shadow-inner ${className}`}
      role="group"
      aria-label="Color theme switcher"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        title="Switch to light mode"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === "light"
            ? "bg-white text-amber-600 shadow-sm border border-slate-200/80"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <Sun className="w-3.5 h-3.5" />
        {showLabels && <span>Light</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        title="Switch to dark mode"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === "dark"
            ? "bg-slate-700 text-blue-400 shadow-sm border border-slate-600/80"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <Moon className="w-3.5 h-3.5" />
        {showLabels && <span>Dark</span>}
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-pressed={theme === "system"}
        title="Sync with system preference"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
          theme === "system"
            ? "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400 shadow-sm border border-slate-200/80 dark:border-slate-600/80"
            : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
        }`}
      >
        <Laptop className="w-3.5 h-3.5" />
        {showLabels && <span>Auto</span>}
      </button>
    </div>
  );
}
