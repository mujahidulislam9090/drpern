import crypto from "node:crypto";
import { prisma } from "../db";
import { redis } from "../redis";
import {
  VerificationChannel,
  VerificationPurpose,
  VerificationProvider,
} from "./verification/types";
import { EmailVerificationProvider } from "./verification/emailProvider";
import { SmsVerificationProvider } from "./verification/smsProvider";
import { WhatsAppVerificationProvider } from "./verification/whatsAppProvider";

const OTP_SECRET = process.env.OTP_SECRET || process.env.NEXTAUTH_SECRET || "dropearn_secure_otp_salt_2026";
const OTP_EXPIRY_MINUTES = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_ATTEMPTS = 5;

const emailProvider = new EmailVerificationProvider();
const smsProvider = new SmsVerificationProvider();
const whatsAppProvider = new WhatsAppVerificationProvider();

function getProviderForChannel(channel: VerificationChannel): VerificationProvider {
  switch (channel) {
    case "SMS":
      return smsProvider;
    case "WHATSAPP":
      return whatsAppProvider;
    case "EMAIL":
    default:
      return emailProvider;
  }
}

export function hashOtp(code: string, destination: string): string {
  return crypto
    .createHmac("sha256", OTP_SECRET)
    .update(`${code}:${destination.toLowerCase().trim()}`)
    .digest("hex");
}

export function maskDestination(destination: string, channel: VerificationChannel): string {
  if (channel === "EMAIL") {
    const parts = destination.split("@");
    if (parts.length !== 2) return destination;
    const [name, domain] = parts;
    const visible = name.length > 2 ? `${name.charAt(0)}***${name.charAt(name.length - 1)}` : `${name.charAt(0)}***`;
    return `${visible}@${domain}`;
  } else {
    // Phone
    const digits = destination.replace(/[^\d+]/g, "");
    if (digits.length > 6) {
      return `${digits.slice(0, 4)} ****** ${digits.slice(-3)}`;
    }
    return digits;
  }
}

export function getAvailableVerificationChannels(): {
  channel: VerificationChannel;
  name: string;
  isAvailable: boolean;
}[] {
  return [
    {
      channel: "EMAIL",
      name: "Email Address",
      isAvailable: emailProvider.isConfigured(),
    },
    {
      channel: "SMS",
      name: "SMS Text Message",
      isAvailable: smsProvider.isConfigured(),
    },
    {
      channel: "WHATSAPP",
      name: "WhatsApp Message",
      isAvailable: whatsAppProvider.isConfigured(),
    },
  ];
}

export async function requestOtpVerification(params: {
  destination: string;
  channel: VerificationChannel;
  purpose: VerificationPurpose;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
}) {
  const cleanDestination = params.destination.trim().toLowerCase();
  const now = new Date();

  // 1. Rate Limiting Check (Max 5 OTP requests per IP/destination per 10 minutes)
  const rateKey = `otp_rate:${params.ipAddress || "global"}:${cleanDestination}`;
  const count = await redis.incr(rateKey);
  if (count === 1) {
    await redis.expire(rateKey, 600);
  }
  if (count > 5) {
    throw new Error("Too many verification attempts. Please wait 10 minutes before requesting another code.");
  }

  // 2. Check Cooldown on Existing Active OTP
  const existingActive = await prisma.otpVerification.findFirst({
    where: {
      destination: cleanDestination,
      purpose: params.purpose,
      isUsed: false,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (existingActive && existingActive.resendAvailableAt > now) {
    const secondsRemaining = Math.ceil(
      (existingActive.resendAvailableAt.getTime() - now.getTime()) / 1000
    );
    throw new Error(
      `Please wait ${secondsRemaining} seconds before requesting a new verification code.`
    );
  }

  // 3. Invalidate Previous Unused OTPs for this destination & purpose
  if (existingActive) {
    await prisma.otpVerification.updateMany({
      where: {
        destination: cleanDestination,
        purpose: params.purpose,
        isUsed: false,
      },
      data: { isUsed: true },
    });
  }

  // 4. Generate Cryptographically Secure 6-digit OTP
  const rawCode = crypto.randomInt(100000, 1000000).toString();
  const otpHash = hashOtp(rawCode, cleanDestination);

  const expiresAt = new Date(now.getTime() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const resendAvailableAt = new Date(
    now.getTime() + OTP_RESEND_COOLDOWN_SECONDS * 1000
  );

  // 5. Persist Hashed OTP Record in Database
  const record = await prisma.otpVerification.create({
    data: {
      userId: params.userId || null,
      destination: cleanDestination,
      channel: params.channel,
      purpose: params.purpose,
      otpHash,
      attempts: 0,
      maxAttempts: OTP_MAX_ATTEMPTS,
      expiresAt,
      resendAvailableAt,
      isUsed: false,
      ipAddress: params.ipAddress || null,
      userAgent: params.userAgent || null,
    },
  });

  // 6. Deliver Code through Channel Provider
  const provider = getProviderForChannel(params.channel);
  const sendResult = await provider.sendVerification({
    destination: cleanDestination,
    code: rawCode,
    purpose: params.purpose,
    expiresInMinutes: OTP_EXPIRY_MINUTES,
  });

  return {
    id: record.id,
    destinationMasked: maskDestination(cleanDestination, params.channel),
    channel: params.channel,
    purpose: params.purpose,
    resendAvailableAt: resendAvailableAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    deliveryStatus: sendResult.success ? "DELIVERED" : "PROVIDER_PENDING_CONFIG",
    deliveryError: sendResult.error || null,
    provider: sendResult.provider,
  };
}

export async function verifyOtpCode(params: {
  destination: string;
  code: string;
  purpose: VerificationPurpose;
  userId?: string;
}) {
  const cleanDestination = params.destination.trim().toLowerCase();
  const cleanCode = params.code.trim();
  const now = new Date();

  // Find most recent active OTP record
  const record = await prisma.otpVerification.findFirst({
    where: {
      destination: cleanDestination,
      purpose: params.purpose,
      isUsed: false,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new Error("No active verification request found. Please request a new code.");
  }

  if (record.expiresAt < now) {
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    });
    throw new Error("Verification code has expired. Please request a new code.");
  }

  if (record.attempts >= record.maxAttempts) {
    await prisma.otpVerification.update({
      where: { id: record.id },
      data: { isUsed: true },
    });
    throw new Error("Maximum verification attempts exceeded. Please request a new code.");
  }

  // Increment attempts counter
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: { attempts: { increment: 1 } },
  });

  // Verify constant-time hash
  const computedHash = hashOtp(cleanCode, cleanDestination);
  const isMatch = crypto.timingSafeEqual(
    Buffer.from(record.otpHash, "hex"),
    Buffer.from(computedHash, "hex")
  );

  if (!isMatch) {
    const attemptsLeft = record.maxAttempts - (record.attempts + 1);
    throw new Error(
      attemptsLeft > 0
        ? `Incorrect code. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`
        : "Incorrect code. Maximum attempts reached. Please request a new code."
    );
  }

  // Mark OTP as used
  await prisma.otpVerification.update({
    where: { id: record.id },
    data: {
      isUsed: true,
      usedAt: now,
    },
  });

  // Update associated User account verification state in Database
  const targetUserId = params.userId || record.userId;
  if (targetUserId) {
    const isEmail = cleanDestination.includes("@");
    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(isEmail ? { emailVerified: true } : { phoneVerified: true, phoneNumber: cleanDestination }),
      },
    });
  } else if (cleanDestination.includes("@")) {
    // If no explicit userId provided, check if a user exists by email and mark verified
    const existing = await prisma.user.findUnique({ where: { email: cleanDestination } });
    if (existing) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { emailVerified: true },
      });
    }
  }

  return {
    verified: true,
    destination: cleanDestination,
    purpose: params.purpose,
    verifiedAt: now.toISOString(),
  };
}
