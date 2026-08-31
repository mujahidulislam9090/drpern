"use client";

import React, { useState } from "react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useTheme } from "../theme/ThemeProvider";
import { X, Command, Keyboard } from "lucide-react";

export function KeyboardShortcutsModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  useKeyboardShortcuts({
    onHelp: () => setIsOpen(true),
    onEscape: () => setIsOpen(false),
    onThemeToggle: () => {
      setTheme(theme === "dark" ? "light" : "dark");
    },
    onTop: () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
  });

  if (!isOpen) return null;

  const shortcuts = [
    { key: "?", description: "Open keyboard shortcuts help modal" },
    { key: "/", description: "Focus search bar / filter inputs" },
    { key: "t", description: "Toggle Light and Dark color theme" },
    { key: "Escape", description: "Close active modal, dropdown, or menu" },
    { key: "Home", description: "Smoothly scroll to the top of the page" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl glass-card p-6 sm:p-8 shadow-2xl border border-slate-700/80">
        <button
          onClick={() => setIsOpen(false)}
          aria-label="Close shortcuts help"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 id="shortcuts-modal-title" className="text-xl font-bold text-white">
              Keyboard Shortcuts
            </h3>
            <p className="text-xs text-slate-400">
              Navigate faster across the platform with hotkeys.
            </p>
          </div>
        </div>

        <div className="space-y-3 my-4">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
            >
              <span className="text-slate-300 font-medium">{s.description}</span>
              <kbd className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 font-mono font-bold text-blue-400 text-xs shadow-inner">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">Esc</kbd> anytime to close this dialog.
        </div>
      </div>
    </div>
  );
}
