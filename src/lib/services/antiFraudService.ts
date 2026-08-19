import { prisma } from "../db";
import { redis } from "../redis";
import { QUALIFICATION_RULES } from "../constants";

export interface QualificationResult {
  isQualified: boolean;
  reason: string;
}

export async function evaluateDownloadQualification(params: {
  fileId: string;
  uploaderId: string;
  ipAddress: string;
  visitorSessionId: string;
  currentUserId?: string | null;
  userAgent?: string | null;
  timeOnPageSeconds?: number;
}): Promise<QualificationResult> {
  const {
    fileId,
    uploaderId,
    ipAddress,
    visitorSessionId,
    currentUserId,
    timeOnPageSeconds = 10,
  } = params;

  // 1. Self-download check: Uploader cannot earn revenue from downloading their own file
  if (currentUserId && currentUserId === uploaderId) {
    return {
      isQualified: false,
      reason: "Self-download by uploader",
    };
  }

  // 2. Minimum page dwell time (bot protection)
  if (timeOnPageSeconds < QUALIFICATION_RULES.MIN_TIME_ON_PAGE_SECONDS) {
    return {
      isQualified: false,
      reason: `Insufficient time on page (${timeOnPageSeconds}s < ${QUALIFICATION_RULES.MIN_TIME_ON_PAGE_SECONDS}s)`,
    };
  }

  // 3. Redis Rate-limiting / Cooldown per IP per file
  const fileCooldownKey = `dl_cd:${ipAddress}:${fileId}`;
  const isCooldown = await redis.get(fileCooldownKey);
  if (isCooldown) {
    return {
      isQualified: false,
      reason: `Cooldown active for IP on this file (${QUALIFICATION_RULES.COOLDOWN_PER_IP_HOURS}h window)`,
    };
  }

  // 4. Redis Velocity check: Max daily qualified downloads per IP
  const ipDailyKey = `dl_daily:${ipAddress}:${new Date().toISOString().slice(0, 10)}`;
  const dailyCountStr = await redis.get(ipDailyKey);
  const dailyCount = dailyCountStr ? parseInt(dailyCountStr, 10) : 0;

  if (dailyCount >= QUALIFICATION_RULES.MAX_DAILY_QUALIFIED_PER_IP) {
    return {
      isQualified: false,
      reason: `Exceeded daily qualified limit for IP (${QUALIFICATION_RULES.MAX_DAILY_QUALIFIED_PER_IP}/day)`,
    };
  }

  // 5. Database check: Verify no other qualified download from same IP for this file in the last X hours
  const cooldownCutoff = new Date(
    Date.now() - QUALIFICATION_RULES.COOLDOWN_PER_IP_HOURS * 60 * 60 * 1000
  );
  const existingRecent = await prisma.fileDownload.findFirst({
    where: {
      fileId,
      ipAddress,
      isQualified: true,
      createdAt: { gte: cooldownCutoff },
    },
  });

  if (existingRecent) {
    return {
      isQualified: false,
      reason: "Recent qualified download already recorded in database",
    };
  }

  // Passed all anti-fraud checks! Mark rate-limit keys in Redis
  await redis.set(
    fileCooldownKey,
    "1",
    "EX",
    QUALIFICATION_RULES.COOLDOWN_PER_IP_HOURS * 3600
  );
  await redis.incr(ipDailyKey);
  await redis.expire(ipDailyKey, 86400);

  return {
    isQualified: true,
    reason: "Legitimate qualified visitor download",
  };
}
