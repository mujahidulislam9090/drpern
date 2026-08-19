import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { getUserBalances } from "@/lib/services/ledgerService";
import { prisma } from "@/lib/db";
import Decimal from "decimal.js";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const balances = await getUserBalances(user.id);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOf30DaysAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      todayDownloads,
      last7DaysDownloads,
      last30DaysDownloads,
      lifetimeDownloads,
      totalQualified,
      todayCredits,
      last7DaysCredits,
      last30DaysCredits,
      topFiles,
      totalFilesCount,
      activeFilesCount,
    ] = await Promise.all([
      // Downloads by timeframe
      prisma.fileDownload.count({
        where: { file: { uploaderId: user.id }, createdAt: { gte: startOfToday } },
      }),
      prisma.fileDownload.count({
        where: { file: { uploaderId: user.id }, createdAt: { gte: startOf7DaysAgo } },
      }),
      prisma.fileDownload.count({
        where: { file: { uploaderId: user.id }, createdAt: { gte: startOf30DaysAgo } },
      }),
      prisma.fileDownload.count({
        where: { file: { uploaderId: user.id } },
      }),
      prisma.fileDownload.count({
        where: { file: { uploaderId: user.id }, isQualified: true },
      }),

      // Earnings by timeframe from EarningsLedger
      prisma.earningsLedger.findMany({
        where: {
          userId: user.id,
          type: { in: ["CREDIT_REVENUE", "CREDIT_REFERRAL", "ADJUSTMENT"] },
          createdAt: { gte: startOfToday },
        },
        select: { amount: true },
      }),
      prisma.earningsLedger.findMany({
        where: {
          userId: user.id,
          type: { in: ["CREDIT_REVENUE", "CREDIT_REFERRAL", "ADJUSTMENT"] },
          createdAt: { gte: startOf7DaysAgo },
        },
        select: { amount: true },
      }),
      prisma.earningsLedger.findMany({
        where: {
          userId: user.id,
          type: { in: ["CREDIT_REVENUE", "CREDIT_REFERRAL", "ADJUSTMENT"] },
          createdAt: { gte: startOf30DaysAgo },
        },
        select: { amount: true },
      }),

      // Top 5 files for the user
      prisma.file.findMany({
        where: { uploaderId: user.id, isDeleted: false },
        orderBy: [{ qualifiedDownloadCount: "desc" }, { downloadCount: "desc" }],
        take: 5,
        select: {
          id: true,
          title: true,
          slug: true,
          category: true,
          sizeBytes: true,
          downloadCount: true,
          qualifiedDownloadCount: true,
          isEnabled: true,
          createdAt: true,
        },
      }),

      // File counts
      prisma.file.count({
        where: { uploaderId: user.id, isDeleted: false },
      }),
      prisma.file.count({
        where: { uploaderId: user.id, isDeleted: false, isEnabled: true },
      }),
    ]);

    const sumAmounts = (entries: { amount: any }[]) =>
      entries
        .reduce((acc, curr) => acc.add(new Decimal(curr.amount.toString())), new Decimal(0))
        .toFixed(2);

    const earningsByTimeframe = {
      today: sumAmounts(todayCredits),
      last7Days: sumAmounts(last7DaysCredits),
      last30Days: sumAmounts(last30DaysCredits),
      lifetime: balances.lifetimeEarnings,
    };

    return NextResponse.json({
      balances,
      earnings: earningsByTimeframe,
      downloads: {
        today: todayDownloads,
        last7Days: last7DaysDownloads,
        last30Days: last30DaysDownloads,
        lifetime: lifetimeDownloads,
        totalQualified,
      },
      files: {
        total: totalFilesCount,
        active: activeFilesCount,
        disabled: totalFilesCount - activeFilesCount,
        topFiles: topFiles.map((f) => ({
          id: f.id,
          title: f.title,
          slug: f.slug,
          category: f.category,
          sizeBytes: f.sizeBytes.toString(),
          downloadCount: f.downloadCount,
          qualifiedDownloadCount: f.qualifiedDownloadCount,
          isEnabled: f.isEnabled,
          createdAt: f.createdAt.toISOString(),
        })),
      },
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
