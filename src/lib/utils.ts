import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import Decimal from "decimal.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: string | number | Decimal | null | undefined, currency = "USD"): string {
  if (amount === null || amount === undefined || amount === "") {
    return "$0.00";
  }
  try {
    const d = new Decimal(amount.toString());
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency || "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(d.toNumber());
  } catch {
    return "$0.00";
  }
}

export function formatBytes(bytes: number | string | bigint | null | undefined): string {
  if (!bytes) return "0 Bytes";
  const num = typeof bytes === "bigint" ? Number(bytes) : Number(bytes);
  if (isNaN(num) || num <= 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(num) / Math.log(k));
  return `${parseFloat((num / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = new Date(date);
  if (isNaN(d.getTime())) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function sanitizeFilename(filename: string): string {
  const basename = filename.split(/[/\\]/).filter(Boolean).pop() || "file";
  return basename.replace(/[^a-zA-Z0-9._-]/g, "_").replace(/^\.+/, "");
}

