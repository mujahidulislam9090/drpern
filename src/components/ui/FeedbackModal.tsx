"use client";

import React, { useState } from "react";
import { Button } from "./Button";
import { useToast } from "./ToastContext";
import { parseResponseJson } from "@/lib/utils";
import { MessageSquarePlus, X, Send, Sparkles } from "lucide-react";

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("Feature Suggestion");
  const [feedback, setFeedback] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setLoading(true);
    try {
      const res = await fetch("/api/v1/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          feedback: feedback.trim(),
          email: email.trim() || undefined,
        }),
      });

      const { ok, error } = await parseResponseJson(res);
      if (!ok) {
        throw new Error(error || "Could not submit feedback");
      }

      toast.success("Thank you for your feedback! Our engineering team will review it.");
      setFeedback("");
      setIsOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit feedback.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Give beta feedback"
        className="fixed bottom-6 right-6 z-40 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 shadow-2xl border border-slate-700/80 backdrop-blur-md flex items-center gap-2 text-xs font-semibold hover:scale-105 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <MessageSquarePlus className="w-4 h-4 text-blue-400" />
        <span>Feedback</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="feedback-modal-title"
        >
          <div className="relative w-full max-w-md rounded-3xl glass-card p-6 sm:p-8 shadow-2xl border border-slate-700/80">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close feedback"
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 id="feedback-modal-title" className="text-xl font-bold text-white">
                  Send Feedback
                </h3>
                <p className="text-xs text-slate-400">
                  Help us shape the future of DropEarn.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 my-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-blue-500"
                >
                  <option value="Feature Suggestion">Feature Suggestion</option>
                  <option value="Bug Report">Bug Report</option>
                  <option value="Payout / Monetization Question">Payout / Monetization Question</option>
                  <option value="General Feedback">General Feedback</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Tell us what you love, what feels clunky, or what you'd like added..."
                  className="w-full p-3.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Email (Optional, if you want a response)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" size="sm" loading={loading}>
                  <Send className="w-3.5 h-3.5 mr-1.5" />
                  <span>Send Feedback</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
