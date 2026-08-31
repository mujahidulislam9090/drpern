"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  error?: boolean;
  autoFocus?: boolean;
  onComplete?: (code: string) => void;
}

export function OTPInput({
  value,
  onChange,
  length = 6,
  disabled = false,
  error = false,
  autoFocus = true,
  onComplete,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [autoFocus]);

  const digits = Array.from({ length }, (_, i) => value[i] || "");

  const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const cleanDigit = rawVal.replace(/[^\d]/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = cleanDigit;
    const newValue = newDigits.join("");
    onChange(newValue);

    if (cleanDigit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newValue.length === length && onComplete) {
      onComplete(newValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").replace(/[^\d]/g, "").slice(0, length);
    if (!pastedData) return;

    onChange(pastedData);

    const targetIndex = Math.min(pastedData.length, length - 1);
    inputRefs.current[targetIndex]?.focus();

    if (pastedData.length === length && onComplete) {
      onComplete(pastedData);
    }
  };

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3" role="group" aria-label="6-digit verification code">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputRefs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete={i === 0 ? "one-time-code" : "off"}
          value={digits[i] || ""}
          disabled={disabled}
          onChange={(e) => handleInputChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={error ? "true" : "false"}
          className={cn(
            "w-10 h-12 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl sm:rounded-2xl bg-slate-900 border transition-all select-none font-mono",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            error
              ? "border-red-500 text-red-400 bg-red-950/20"
              : digits[i]
              ? "border-blue-500/80 text-white bg-slate-800/80 shadow-md shadow-blue-500/10"
              : "border-slate-700 text-slate-100 placeholder-slate-600",
            disabled && "opacity-50 cursor-not-allowed bg-slate-950"
          )}
        />
      ))}
    </div>
  );
}
