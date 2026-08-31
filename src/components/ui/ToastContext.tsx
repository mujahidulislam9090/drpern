"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import {
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<ToastItem, "id">) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      const duration = toast.duration ?? 5000;

      const newItem: ToastItem = { ...toast, id, duration };
      setToasts((prev) => [...prev, newItem]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toastHelpers = {
    success: (message: string, title?: string) =>
      addToast({ type: "success", message, title }),
    error: (message: string, title?: string) =>
      addToast({ type: "error", message, title }),
    warning: (message: string, title?: string) =>
      addToast({ type: "warning", message, title }),
    info: (message: string, title?: string) =>
      addToast({ type: "info", message, title }),
  };

  return (
    <ToastContext.Provider
      value={{
        toasts,
        addToast,
        removeToast,
        toast: toastHelpers,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}) {
  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none p-2 sm:p-0"
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="pointer-events-auto rounded-2xl glass-card p-4 shadow-2xl border border-slate-700/80 flex items-start gap-3 animate-fade-in transition-all"
        >
          <div className="shrink-0 mt-0.5">
            {t.type === "success" && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {t.type === "error" && (
              <AlertCircle className="w-5 h-5 text-red-400" />
            )}
            {t.type === "warning" && (
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            )}
            {t.type === "info" && <Info className="w-5 h-5 text-blue-400" />}
          </div>

          <div className="flex-1 min-w-0">
            {t.title && (
              <h4 className="text-xs font-bold text-white mb-0.5 truncate">
                {t.title}
              </h4>
            )}
            <p className="text-xs text-slate-300 leading-relaxed break-words">
              {t.message}
            </p>
            {t.action && (
              <button
                onClick={() => {
                  t.action!.onClick();
                  onDismiss(t.id);
                }}
                className="mt-2 text-xs font-semibold text-blue-400 hover:text-blue-300 underline"
              >
                {t.action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => onDismiss(t.id)}
            aria-label="Dismiss notification"
            className="shrink-0 p-1 text-slate-500 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
