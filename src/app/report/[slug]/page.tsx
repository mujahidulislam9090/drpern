"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { AdPlacementSlot } from "@/components/monetization/AdPlacementSlot";
import { Flag, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";
import { parseResponseJson } from "@/lib/utils";
import Link from "next/link";

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [reporterEmail, setReporterEmail] = useState("");
  const [reason, setReason] = useState("Copyright Infringement (DMCA)");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          reporterEmail,
          reason,
          details,
        }),
      });

      const { ok, error: reportErr } = await parseResponseJson(res);
      if (!ok) {
        throw new Error(reportErr || "Failed to submit report");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <Link
        href={`/d/${slug}`}
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to file</span>
      </Link>

      <div className="rounded-3xl glass-card p-6 sm:p-10 border border-slate-800">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
            <Flag className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Report Content</h1>
            <p className="text-xs text-slate-400">File ID: /d/{slug}</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-8 animate-fade-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-white mb-1">
              Report Submitted
            </h2>
            <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto">
              Thank you for helping keep DropEarn safe. Our moderation team reviews every report and will take action according to our terms of service.
            </p>
            <Button size="sm" onClick={() => router.push("/")}>
              Return Home
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Your Email (Optional for updates)
              </label>
              <input
                type="email"
                value={reporterEmail}
                onChange={(e) => setReporterEmail(e.target.value)}
                placeholder="reporter@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Reason for Report
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-red-500"
              >
                <option value="Copyright Infringement (DMCA)">
                  Copyright Infringement (DMCA)
                </option>
                <option value="Malware / Virus / Spyware">
                  Malware / Virus / Spyware
                </option>
                <option value="Child Exploitation / Abuse">
                  Child Exploitation / Abuse
                </option>
                <option value="Phishing / Fraud / Scam">
                  Phishing / Fraud / Scam
                </option>
                <option value="Illegal Content / Other">
                  Illegal Content / Other
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Additional Details
              </label>
              <textarea
                required
                rows={4}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe why this content violates terms..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-red-500 resize-none"
              />
            </div>

            <Button
              type="submit"
              variant="danger"
              loading={loading}
              className="w-full mt-2"
            >
              Submit Report
            </Button>
          </form>
        )}
      </div>

      {/* Ad Placement */}
      <div className="mt-8">
        <AdPlacementSlot location="REPORT_BOTTOM" format="horizontal" />
      </div>
    </div>
  );
}
