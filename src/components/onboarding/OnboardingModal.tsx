"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/Button";
import {
  UploadCloud,
  DollarSign,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  X,
  Sparkles,
} from "lucide-react";

export function OnboardingModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (user) {
      const dismissedLocally = localStorage.getItem(`dropearn_onboarded_${user.id}`);
      if (!dismissedLocally && !user.onboardingCompleted) {
        setIsOpen(true);
      }
    }
  }, [user]);

  const steps = [
    {
      icon: <UploadCloud className="w-8 h-8 text-blue-400" />,
      badge: "Step 1 of 3",
      title: "Upload & Secure Your Files",
      description:
        "Upload files up to 100 MB each with free 1 GB storage. Add optional password protection, expiration dates, and custom download limits.",
      highlight: "Supports all formats: software, media, PDFs, archives & documents.",
    },
    {
      icon: <DollarSign className="w-8 h-8 text-emerald-400" />,
      badge: "Step 2 of 3",
      title: "Share Links & Earn Revenue",
      description:
        "Generate instant shareable links. When visitors pass the 5-second countdown and download your files, you earn 70% of all AdSense monetization.",
      highlight: "Earn up to $12.00 per 1,000 qualified downloads with Tier 1 traffic.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-purple-400" />,
      badge: "Step 3 of 3",
      title: "Real-Time Tracking & Payouts",
      description:
        "Monitor your traffic velocity and immutable ledger balance. Request payouts anytime via PayPal, USDT TRC20, Bitcoin, or Bank Wire.",
      highlight: "Invite fellow creators to earn a lifetime 10% referral commission.",
    },
  ];

  const handleComplete = async () => {
    if (user) {
      localStorage.setItem(`dropearn_onboarded_${user.id}`, "true");
      try {
        await fetch("/api/v1/auth/onboarding", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ completed: true }),
        });
      } catch {}
    }
    setIsOpen(false);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  if (!isOpen) return null;

  const step = steps[currentStep];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-modal-title"
    >
      <div className="relative w-full max-w-lg rounded-3xl glass-card p-6 sm:p-10 shadow-2xl border border-slate-700/80 text-center">
        {/* Skip Button */}
        <button
          onClick={handleComplete}
          aria-label="Skip onboarding"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <span>Skip Tour</span>
          <X className="w-4 h-4" />
        </button>

        {/* Step Badge & Icon */}
        <div className="mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {step.badge}
          </span>
        </div>

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700/60 shadow-xl mb-4">
          {step.icon}
        </div>

        {/* Content */}
        <h3 id="onboarding-modal-title" className="text-2xl font-black text-white tracking-tight">
          {step.title}
        </h3>

        <p className="text-sm text-slate-300 mt-2 mb-4 leading-relaxed">
          {step.description}
        </p>

        <div className="p-3.5 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-blue-300 text-xs font-medium flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
          <span>{step.highlight}</span>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center justify-center gap-2 mb-6" role="tablist">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              aria-label={`Go to step ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                currentStep === i ? "w-8 bg-blue-500" : "w-2 bg-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-3">
          {currentStep > 0 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentStep((prev) => prev - 1)}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button size="md" onClick={handleNext} className="px-6">
            <span>{currentStep === steps.length - 1 ? "Get Started" : "Continue"}</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
