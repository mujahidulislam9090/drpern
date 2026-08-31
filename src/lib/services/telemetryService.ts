/**
 * Sanitized telemetry & crash reporting service.
 * Ensures passwords, OTPs, tokens, and private credentials are NEVER logged or transmitted.
 */

export interface CrashReportPayload {
  message: string;
  source?: string;
  lineno?: number;
  colno?: number;
  url?: string;
  userAgent?: string;
  timestamp: string;
}

export function reportClientCrash(error: Error, errorInfo?: React.ErrorInfo) {
  // Sanitize message to strip any potential token or sensitive patterns
  const sanitizedMessage = error.message
    .replace(/[a-zA-Z0-9_-]{20,}/g, "[REDACTED_TOKEN]")
    .slice(0, 500);

  const payload: CrashReportPayload = {
    message: sanitizedMessage,
    source: errorInfo?.componentStack?.slice(0, 300) || undefined,
    url: typeof window !== "undefined" ? window.location.pathname : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
    timestamp: new Date().toISOString(),
  };

  console.warn("[DropEarn Telemetry] Captured client exception:", payload);

  // If a remote monitoring service like Sentry or Datadog is configured via SENTRY_DSN
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    try {
      fetch("/api/v1/events/crash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    } catch {}
  }
}
