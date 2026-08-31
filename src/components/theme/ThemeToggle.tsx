"use client";

import React from "react";
import { useTheme } from "./ThemeProvider";
import { Sun, Moon, Laptop } from "lucide-react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div className={`inline-flex items-center rounded-xl bg-slate-800/80 p-1 border border-slate-700/80 ${className}`} role="group" aria-label="Select color theme">
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        aria-label="Light mode"
        className={`p-1.5 rounded-lg text-xs transition-colors ${
          theme === "light"
            ? "bg-slate-700 text-amber-400 shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        aria-label="Dark mode"
        className={`p-1.5 rounded-lg text-xs transition-colors ${
          theme === "dark"
            ? "bg-slate-700 text-blue-400 shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => setTheme("system")}
        aria-pressed={theme === "system"}
        aria-label="System theme"
        className={`p-1.5 rounded-lg text-xs transition-colors ${
          theme === "system"
            ? "bg-slate-700 text-purple-400 shadow-sm"
            : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Laptop className="w-4 h-4" />
      </button>
    </div>
  );
}
