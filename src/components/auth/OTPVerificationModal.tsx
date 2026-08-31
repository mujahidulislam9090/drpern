"use client";

import React, { useState, useEffect } from "react";
import { OTPInput } from "./OTPInput";
import { Button } from "../ui/Button";
import { parseResponseJson } from "@/lib/utils";
import {
  ShieldCheck,
  X,
  Mail,
  Smartphone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  destination: string;
  defaultChannel?: "EMAIL" | "SMS" | "WHATSAPP";
  purpose?: "SIGNUP_VERIFICATION" | "LOGIN_2FA" | "PASSWORD_RESET" | "WITHDRAWAL_CONFIRM";
  onSuccess?: () => void;
}

export function OTPVerificationModal({
  isOpen,
  onClose,
  destination,
  defaultChannel = "EMAIL",
  purpose = "SIGNUP_VERIFICATION",
  onSuccess,
}: OTPVerificationModalProps) {
  const [code, setCode] = useState("");
  const [channel, setChannel] = useState<"EMAIL" | "SMS" | "WHATSAPP">(defaultChannel);
  const [maskedDest, setMaskedDest] = useState(destination);
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [availableChannels, setAvailableChannels] = useState<{ channel: string; name: string; isAvailable: boolean }[]>([]);

  // 1. Fetch available channels
  useEffect(() => {
    if (isOpen) {
      fetch("/api/v1/auth/verification/channels")
        .then(async (res) => {
          const { ok, data } = await parseResponseJson(res);
          if (ok && data?.channels) {
            setAvailableChannels(data.channels);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  // 2. Request OTP Code on Modal Open or Channel Change
  const requestOtp = async (targetChannel = channel) => {
    setLoading(true);
    setError("");
    setCode("");
    try {
      const res = await fetch("/api/v1/auth/verification/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          channel: targetChannel,
          purpose,
        }),
      });

      const { ok, data, error: sendErr } = await parseResponseJson(res);
      if (!ok || !data?.success) {
        throw new Error(sendErr || "Unable to send verification code.");
      }

      setMaskedDest(data.destinationMasked || destination);
      setSecondsLeft(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Failed to deliver verification code.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && destination) {
      requestOtp(defaultChannel);
    }
  }, [isOpen, destination, defaultChannel]);

  // 3. Countdown timer
  useEffect(() => {
    if (!isOpen || secondsLeft <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, secondsLeft]);

  // 4. Verify Code
  const handleVerify = async (codeToVerify = code) => {
    if (codeToVerify.length !== 6 || verifying) return;
    setVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/verification/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          code: codeToVerify,
          purpose,
        }),
      });

      const { ok, data, error: verifyErr } = await parseResponseJson(res);
      if (!ok || !data?.verified) {
        throw new Error(verifyErr || "Verification failed. Please check the code.");
      }

      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setVerifying(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="otp-modal-title"
    >
      <div className="relative w-full max-w-md rounded-3xl glass-card p-6 sm:p-8 shadow-2xl border border-slate-700/70 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close verification modal"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 mb-4 shadow-lg shadow-blue-500/10">
          <ShieldCheck className="w-7 h-7" />
        </div>

        <h2 id="otp-modal-title" className="text-2xl font-bold text-white tracking-tight">
          Verify Your Account
        </h2>

        <p className="text-xs sm:text-sm text-slate-400 mt-1 mb-6">
          We sent a 6-digit verification code to{" "}
          <strong className="text-slate-200 font-mono">{maskedDest}</strong>
        </p>

        {/* Error Feedback */}
        {error && (
          <div
            role="alert"
            className="mb-4 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2 text-left"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Success Feedback */}
        {success && (
          <div
            role="status"
            className="mb-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 animate-fade-in"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Verified successfully!</span>
          </div>
        )}

        {/* 6-Digit OTP Input */}
        <div className="my-6">
          <OTPInput
            value={code}
            onChange={setCode}
            disabled={verifying || success}
            error={Boolean(error)}
            onComplete={handleVerify}
          />
        </div>

        {/* Verify Button */}
        <Button
          onClick={() => handleVerify()}
          loading={verifying}
          disabled={code.length !== 6 || success}
          className="w-full mb-4 py-3"
          size="lg"
        >
          <span>Verify & Continue</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>

        {/* Resend Countdown */}
        <div className="text-xs text-slate-400 flex items-center justify-center gap-1">
          {canResend ? (
            <button
              onClick={() => requestOtp(channel)}
              disabled={loading}
              className="text-blue-400 hover:text-blue-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              <span>Resend verification code</span>
            </button>
          ) : (
            <span>
              Resend code in <strong className="text-slate-200 font-mono">{secondsLeft}s</strong>
            </span>
          )}
        </div>

        {/* Channel Selection If Multiple Configured */}
        {availableChannels.filter((c) => c.isAvailable).length > 1 && (
          <div className="mt-6 pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-500 block mb-2">Change delivery channel:</span>
            <div className="flex items-center justify-center gap-2">
              {availableChannels.map((c) => (
                <button
                  key={c.channel}
                  disabled={!c.isAvailable}
                  onClick={() => {
                    setChannel(c.channel as any);
                    requestOtp(c.channel as any);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                    channel === c.channel
                      ? "border-blue-500 bg-blue-500/10 text-blue-400"
                      : "border-slate-800 text-slate-400 hover:text-white"
                  }`}
                >
                  {c.channel === "EMAIL" && <Mail className="w-3 h-3 inline mr-1" />}
                  {c.channel === "SMS" && <Smartphone className="w-3 h-3 inline mr-1" />}
                  {c.channel === "WHATSAPP" && <MessageSquare className="w-3 h-3 inline mr-1" />}
                  {c.name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
