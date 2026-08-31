"use client";

import { useEffect } from "react";

interface ShortcutHandlers {
  onSearch?: () => void;
  onThemeToggle?: () => void;
  onHelp?: () => void;
  onEscape?: () => void;
  onTop?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable;

      // Escape works everywhere
      if (e.key === "Escape" && handlers.onEscape) {
        handlers.onEscape();
        return;
      }

      // Do not trigger hotkeys inside text inputs
      if (isInput) return;

      if (e.key === "/" && handlers.onSearch) {
        e.preventDefault();
        handlers.onSearch();
      } else if (e.key.toLowerCase() === "t" && !e.metaKey && !e.ctrlKey && handlers.onThemeToggle) {
        e.preventDefault();
        handlers.onThemeToggle();
      } else if (e.key === "?" && handlers.onHelp) {
        e.preventDefault();
        handlers.onHelp();
      } else if (e.key === "Home" && handlers.onTop) {
        e.preventDefault();
        handlers.onTop();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlers]);
}
