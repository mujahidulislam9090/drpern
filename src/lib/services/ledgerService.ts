import Decimal from "decimal.js";
import { prisma } from "../db";
import { UserBalanceSummary } from "../../types";
import { DEFAULT_SITE_SETTINGS } from "../constants";

// Decimal precision setup
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export async function getRevenueShareSettings() {
  const settings = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: ["uploaderRevenuePercent", "platformRevenuePercent", "minWithdrawal"],
      },
    },
  });

  let uploaderPercent = DEFAULT_SITE_SETTINGS.uploaderRevenuePercent;
  let platformPercent = DEFAULT_SITE_SETTINGS.platformRevenuePercent;
  let minWithdrawal = DEFAULT_SITE_SETTINGS.minWithdrawal;

  for (const s of settings) {
    if (s.key === "uploaderRevenuePercent") uploaderPercent = parseFloat(s.value) || uploaderPercent;
    if (s.key === "platformRevenuePercent") platformPercent = parseFloat(s.value) || platformPercent;
    if (s.key === "minWithdrawal") minWithdrawal = parseFloat(s.value) || minWithdrawal;
  }

  return { uploaderPercent, platformPercent, minWithdrawal };
}

export async function recordQualifiedRevenueEvent(params: {
  fileId: string;
  uploaderId: string;
  grossAmount: number | Decimal;
  currency?: string;
  provider?: string;
  metadata?: Record<string, unknown>;
}) {
  const { uploaderPercent, platformPercent } = await getRevenueShareSettings();
  const gross = new Decimal(params.grossAmount.toString());
  const currency = params.currency || "USD";
  const provider = params.provider || "direct";

  const uploaderShare = gross.mul(uploaderPercent).div(100);
  const platformShare = gross.sub(uploaderShare);

  return prisma.$transaction(async (tx) => {
    // 1. Create RevenueEvent
    const revEvent = await tx.revenueEvent.create({
      data: {
        eventType: "DOWNLOAD_AD",
        provider,
        rawAmount: gross.toFixed(4),
        currency,
        uploaderShareAmount: uploaderShare.toFixed(4),
        platformShareAmount: platformShare.toFixed(4),
        status: "CONFIRMED",
        fileId: params.fileId,
        uploaderId: params.uploaderId,
        metadata: (params.metadata as any) || {},
        confirmedAt: new Date(),
      },
    });

    // 2. Fetch latest ledger entry for uploader to get running balance
    const latestLedger = await tx.earningsLedger.findFirst({
      where: { userId: params.uploaderId },
      orderBy: { createdAt: "desc" },
    });

    const currentBalance = latestLedger ? new Decimal(latestLedger.runningBalance.toString()) : new Decimal(0);
    const newBalance = currentBalance.add(uploaderShare);

    // 3. Create immutable EarningsLedger entry
    await tx.earningsLedger.create({
      data: {
        userId: params.uploaderId,
        revenueEventId: revEvent.id,
        type: "CREDIT_REVENUE",
        amount: uploaderShare.toFixed(4),
        runningBalance: newBalance.toFixed(4),
        status: "AVAILABLE",
        description: `Download revenue share (${uploaderPercent}% of ${gross.toFixed(4)} ${currency})`,
      },
    });

    // 4. Update file qualified download counter
    await tx.file.update({
      where: { id: params.fileId },
      data: {
        qualifiedDownloadCount: { increment: 1 },
      },
    });

    // 5. Handle Referral commission if uploader was referred
    const uploader = await tx.user.findUnique({
      where: { id: params.uploaderId },
      select: { referredById: true },
    });

    if (uploader?.referredById) {
      const referral = await tx.referral.findUnique({
        where: { referredUserId: params.uploaderId },
      });

      if (referral) {
        const commRate = new Decimal(referral.commissionRate.toString());
        // Commission is % of platform share
        const referralAmount = platformShare.mul(commRate);

        if (referralAmount.gt(0)) {
          // Record referral revenue event
          const refRevEvent = await tx.revenueEvent.create({
            data: {
              eventType: "REFERRAL_BONUS",
              provider: "referral_program",
              rawAmount: referralAmount.toFixed(4),
              currency,
              uploaderShareAmount: referralAmount.toFixed(4),
              platformShareAmount: "0.0000",
              status: "CONFIRMED",
              uploaderId: referral.referrerId,
              confirmedAt: new Date(),
            },
          });

          // Update referrer balance
          const latestRefLedger = await tx.earningsLedger.findFirst({
            where: { userId: referral.referrerId },
            orderBy: { createdAt: "desc" },
          });

          const currentRefBal = latestRefLedger
            ? new Decimal(latestRefLedger.runningBalance.toString())
            : new Decimal(0);
          const newRefBal = currentRefBal.add(referralAmount);

          await tx.earningsLedger.create({
            data: {
              userId: referral.referrerId,
              revenueEventId: refRevEvent.id,
              type: "CREDIT_REFERRAL",
              amount: referralAmount.toFixed(4),
              runningBalance: newRefBal.toFixed(4),
              status: "AVAILABLE",
              description: `Referral commission for referred user activity`,
            },
          });

          // Update referral lifetime stats
          await tx.referral.update({
            where: { id: referral.id },
            data: {
              totalEarned: new Decimal(referral.totalEarned.toString()).add(referralAmount).toFixed(4),
            },
          });
        }
      }
    }

    return revEvent;
  });
}

export async function getUserBalances(userId: string): Promise<UserBalanceSummary> {
  // Aggregate directly from ledger and withdrawals
  const [latestLedger, pendingEntries, lifetimeCredits, completedWithdrawals] = await Promise.all([
    // Latest running balance
    prisma.earningsLedger.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      select: { runningBalance: true },
    }),
    // Pending credits
    prisma.earningsLedger.findMany({
      where: { userId, status: "PENDING" },
      select: { amount: true },
    }),
    // All lifetime credits (Revenue + Referrals + Positive Adjustments)
    prisma.earningsLedger.findMany({
      where: {
        userId,
        type: { in: ["CREDIT_REVENUE", "CREDIT_REFERRAL", "ADJUSTMENT"] },
        amount: { gt: 0 },
      },
      select: { amount: true },
    }),
    // Total withdrawn
    prisma.withdrawal.findMany({
      where: { userId, status: "PAID" },
      select: { amount: true },
    }),
  ]);

  const availableBalance = latestLedger ? new Decimal(latestLedger.runningBalance.toString()) : new Decimal(0);

  const pendingBalance = pendingEntries.reduce(
    (acc, curr) => acc.add(new Decimal(curr.amount.toString())),
    new Decimal(0)
  );

  const lifetimeEarnings = lifetimeCredits.reduce(
    (acc, curr) => acc.add(new Decimal(curr.amount.toString())),
    new Decimal(0)
  );

  const totalWithdrawn = completedWithdrawals.reduce(
    (acc, curr) => acc.add(new Decimal(curr.amount.toString())),
    new Decimal(0)
  );

  return {
    availableBalance: availableBalance.toFixed(2),
    pendingBalance: pendingBalance.toFixed(2),
    lifetimeEarnings: lifetimeEarnings.toFixed(2),
    totalWithdrawn: totalWithdrawn.toFixed(2),
    currency: "USD",
  };
}

export async function getUserLedgerHistory(
  userId: string,
  options: { page?: number; limit?: number } = {}
) {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const [entries, totalCount] = await Promise.all([
    prisma.earningsLedger.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        revenueEvent: {
          select: {
            eventType: true,
            provider: true,
            file: {
              select: {
                title: true,
                slug: true,
              },
            },
          },
        },
      },
    }),
    prisma.earningsLedger.count({ where: { userId } }),
  ]);

  return {
    entries: entries.map((e) => ({
      id: e.id,
      type: e.type,
      amount: e.amount.toString(),
      runningBalance: e.runningBalance.toString(),
      status: e.status,
      description: e.description,
      fileTitle: e.revenueEvent?.file?.title || null,
      fileSlug: e.revenueEvent?.file?.slug || null,
      createdAt: e.createdAt.toISOString(),
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}
