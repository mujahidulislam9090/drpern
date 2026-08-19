import Decimal from "decimal.js";
import { prisma } from "../db";
import {
  AdminDashboardMetrics,
  AdminRevenueBreakdown,
  AdminVisitorAnalytics,
  SiteSettingsMap,
} from "../../types";
import { DEFAULT_SITE_SETTINGS } from "../constants";

export async function getAdminDashboardMetrics(): Promise<AdminDashboardMetrics> {
  const now = new Date();
  
  // Time boundaries
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfYesterday = new Date(startOfToday.getTime() - 24 * 60 * 60 * 1000);
  const startOf7DaysAgo = new Date(startOfToday.getTime() - 7 * 24 * 60 * 60 * 1000);
  const startOf30DaysAgo = new Date(startOfToday.getTime() - 30 * 24 * 60 * 60 * 1000);
  const startOfThisWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
  const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    // Revenue aggregates
    revenueToday,
    revenueYesterday,
    revenue7Days,
    revenue30Days,
    revenueLifetime,
    // File counts
    totalFiles,
    filesToday,
    filesThisWeek,
    filesThisMonth,
    activeFiles,
    disabledFiles,
    // Download counts
    totalDownloads,
    qualifiedDownloads,
    downloadsToday,
    downloadsThisWeek,
    downloadsThisMonth,
    // User counts
    totalUsers,
    usersToday,
    usersThisWeek,
    usersThisMonth,
    activeUsers,
    // Visitor counts
    visitorsToday,
    visitorsYesterday,
    visitors7Days,
    visitors30Days,
    uniqueSessionsToday,
    downloadStartsToday,
  ] = await Promise.all([
    // Revenue
    prisma.revenueEvent.findMany({
      where: { createdAt: { gte: startOfToday }, status: "CONFIRMED" },
      select: { rawAmount: true, uploaderShareAmount: true, platformShareAmount: true },
    }),
    prisma.revenueEvent.findMany({
      where: { createdAt: { gte: startOfYesterday, lt: startOfToday }, status: "CONFIRMED" },
      select: { rawAmount: true },
    }),
    prisma.revenueEvent.findMany({
      where: { createdAt: { gte: startOf7DaysAgo }, status: "CONFIRMED" },
      select: { rawAmount: true },
    }),
    prisma.revenueEvent.findMany({
      where: { createdAt: { gte: startOf30DaysAgo }, status: "CONFIRMED" },
      select: { rawAmount: true },
    }),
    prisma.revenueEvent.findMany({
      where: { status: "CONFIRMED" },
      select: { rawAmount: true },
    }),
    // Files
    prisma.file.count({ where: { isDeleted: false } }),
    prisma.file.count({ where: { isDeleted: false, createdAt: { gte: startOfToday } } }),
    prisma.file.count({ where: { isDeleted: false, createdAt: { gte: startOfThisWeek } } }),
    prisma.file.count({ where: { isDeleted: false, createdAt: { gte: startOfThisMonth } } }),
    prisma.file.count({ where: { isDeleted: false, isEnabled: true } }),
    prisma.file.count({ where: { isDeleted: false, isEnabled: false } }),
    // Downloads
    prisma.fileDownload.count(),
    prisma.fileDownload.count({ where: { isQualified: true } }),
    prisma.fileDownload.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.fileDownload.count({ where: { createdAt: { gte: startOfThisWeek } } }),
    prisma.fileDownload.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    // Users
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfThisWeek } } }),
    prisma.user.count({ where: { createdAt: { gte: startOfThisMonth } } }),
    prisma.user.count({ where: { status: "ACTIVE" } }),
    // Visitors
    prisma.visitorEvent.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.visitorEvent.count({ where: { createdAt: { gte: startOfYesterday, lt: startOfToday } } }),
    prisma.visitorEvent.count({ where: { createdAt: { gte: startOf7DaysAgo } } }),
    prisma.visitorEvent.count({ where: { createdAt: { gte: startOf30DaysAgo } } }),
    prisma.visitorEvent.groupBy({
      by: ["sessionId"],
      where: { createdAt: { gte: startOfToday } },
    }).then((res) => res.length),
    prisma.visitorEvent.count({
      where: { createdAt: { gte: startOfToday }, eventType: "DOWNLOAD_START" },
    }),
  ]);

  const sumGross = (events: { rawAmount: any }[]) =>
    events.reduce((acc, curr) => acc.add(new Decimal(curr.rawAmount.toString())), new Decimal(0));

  const sumUploader = (events: { uploaderShareAmount: any }[]) =>
    events.reduce((acc, curr) => acc.add(new Decimal(curr.uploaderShareAmount.toString())), new Decimal(0));

  const sumPlatform = (events: { platformShareAmount: any }[]) =>
    events.reduce((acc, curr) => acc.add(new Decimal(curr.platformShareAmount.toString())), new Decimal(0));

  return {
    revenue: {
      today: sumGross(revenueToday).toFixed(2),
      yesterday: sumGross(revenueYesterday).toFixed(2),
      last7Days: sumGross(revenue7Days).toFixed(2),
      last30Days: sumGross(revenue30Days).toFixed(2),
      lifetime: sumGross(revenueLifetime).toFixed(2),
      grossToday: sumGross(revenueToday).toFixed(2),
      uploaderShareToday: sumUploader(revenueToday).toFixed(2),
      platformShareToday: sumPlatform(revenueToday).toFixed(2),
    },
    visitors: {
      today: visitorsToday,
      yesterday: visitorsYesterday,
      last7Days: visitors7Days,
      last30Days: visitors30Days,
      uniqueSessionsToday,
      downloadStartsToday,
      configured: true,
    },
    files: {
      total: totalFiles,
      uploadedToday: filesToday,
      uploadedThisWeek: filesThisWeek,
      uploadedThisMonth: filesThisMonth,
      active: activeFiles,
      disabled: disabledFiles,
    },
    downloads: {
      total: totalDownloads,
      qualified: qualifiedDownloads,
      today: downloadsToday,
      thisWeek: downloadsThisWeek,
      thisMonth: downloadsThisMonth,
    },
    users: {
      total: totalUsers,
      newToday: usersToday,
      newThisWeek: usersThisWeek,
      newThisMonth: usersThisMonth,
      active: activeUsers,
    },
  };
}

export async function getAdminRevenueAnalytics(
  period: "today" | "7d" | "30d" | "90d" | "all" = "30d"
): Promise<AdminRevenueBreakdown> {
  const now = new Date();
  let startDate: Date | null = null;

  if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  } else if (period === "90d") {
    startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
  }

  const where = {
    ...(startDate ? { createdAt: { gte: startDate } } : {}),
  };

  const [events, pendingEvents] = await Promise.all([
    prisma.revenueEvent.findMany({
      where: { ...where, status: "CONFIRMED" },
      orderBy: { createdAt: "asc" },
    }),
    prisma.revenueEvent.findMany({
      where: { ...where, status: "PENDING" },
    }),
  ]);

  let gross = new Decimal(0);
  let uploader = new Decimal(0);
  let platform = new Decimal(0);

  const dateMap = new Map<
    string,
    { gross: Decimal; uploader: Decimal; platform: Decimal; count: number }
  >();

  for (const e of events) {
    const raw = new Decimal(e.rawAmount.toString());
    const up = new Decimal(e.uploaderShareAmount.toString());
    const pl = new Decimal(e.platformShareAmount.toString());

    gross = gross.add(raw);
    uploader = uploader.add(up);
    platform = platform.add(pl);

    const dateKey = e.createdAt.toISOString().slice(0, 10);
    const existing = dateMap.get(dateKey) || {
      gross: new Decimal(0),
      uploader: new Decimal(0),
      platform: new Decimal(0),
      count: 0,
    };

    dateMap.set(dateKey, {
      gross: existing.gross.add(raw),
      uploader: existing.uploader.add(up),
      platform: existing.platform.add(pl),
      count: existing.count + 1,
    });
  }

  const pending = pendingEvents.reduce(
    (acc, curr) => acc.add(new Decimal(curr.rawAmount.toString())),
    new Decimal(0)
  );

  const timeSeries = Array.from(dateMap.entries()).map(([date, val]) => ({
    date,
    gross: val.gross.toNumber(),
    uploaderShare: val.uploader.toNumber(),
    platformShare: val.platform.toNumber(),
    eventCount: val.count,
  }));

  return {
    period,
    grossRevenue: gross.toFixed(2),
    uploaderShare: uploader.toFixed(2),
    platformShare: platform.toFixed(2),
    pendingRevenue: pending.toFixed(2),
    confirmedRevenue: gross.toFixed(2),
    timeSeries,
  };
}

export async function getAdminVisitorAnalytics(
  period: "today" | "7d" | "30d" | "all" = "30d"
): Promise<AdminVisitorAnalytics> {
  const now = new Date();
  let startDate: Date | null = null;

  if (period === "today") {
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "7d") {
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "30d") {
    startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  const where = {
    ...(startDate ? { createdAt: { gte: startDate } } : {}),
  };

  const [pageViews, uniqueSessionsList, downloadVisits, downloadStarts, qualifiedDownloads, rawEvents] =
    await Promise.all([
      prisma.visitorEvent.count({ where }),
      prisma.visitorEvent.groupBy({
        by: ["sessionId"],
        where,
      }),
      prisma.visitorEvent.count({
        where: { ...where, pagePath: { startsWith: "/d/" } },
      }),
      prisma.visitorEvent.count({
        where: { ...where, eventType: "DOWNLOAD_START" },
      }),
      prisma.fileDownload.count({
        where: { ...(startDate ? { createdAt: { gte: startDate } } : {}), isQualified: true },
      }),
      prisma.visitorEvent.findMany({
        where,
        select: { createdAt: true, pagePath: true, eventType: true },
        orderBy: { createdAt: "asc" },
      }),
    ]);

  const uniqueSessions = uniqueSessionsList.length;
  const conversionRate = downloadVisits > 0 ? (downloadStarts / downloadVisits) * 100 : 0;

  const dateMap = new Map<
    string,
    { pageViews: number; downloadVisits: number; downloads: number; qualified: number }
  >();

  for (const ev of rawEvents) {
    const dateKey = ev.createdAt.toISOString().slice(0, 10);
    const existing = dateMap.get(dateKey) || {
      pageViews: 0,
      downloadVisits: 0,
      downloads: 0,
      qualified: 0,
    };

    existing.pageViews += 1;
    if (ev.pagePath.startsWith("/d/")) existing.downloadVisits += 1;
    if (ev.eventType === "DOWNLOAD_START") existing.downloads += 1;

    dateMap.set(dateKey, existing);
  }

  const timeSeries = Array.from(dateMap.entries()).map(([date, stats]) => ({
    date,
    pageViews: stats.pageViews,
    downloadVisits: stats.downloadVisits,
    downloads: stats.downloads,
    qualified: stats.qualified,
  }));

  return {
    period,
    totalPageViews: pageViews,
    uniqueSessions,
    downloadPageVisits: downloadVisits,
    downloadStarts,
    qualifiedDownloads,
    conversionRate: parseFloat(conversionRate.toFixed(2)),
    timeSeries,
  };
}

export async function getAdminFilesList(options: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}) {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {
    ...(options.search
      ? {
          OR: [
            { title: { contains: options.search, mode: "insensitive" } },
            { slug: { contains: options.search, mode: "insensitive" } },
            { originalName: { contains: options.search, mode: "insensitive" } },
            { uploader: { email: { contains: options.search, mode: "insensitive" } } },
          ],
        }
      : {}),
  };

  if (options.status === "active") {
    where.isEnabled = true;
    where.isDeleted = false;
  } else if (options.status === "disabled") {
    where.isEnabled = false;
    where.isDeleted = false;
  } else if (options.status === "deleted") {
    where.isDeleted = true;
  }

  const [files, totalCount] = await Promise.all([
    prisma.file.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        uploader: {
          select: { id: true, email: true, displayName: true },
        },
        _count: {
          select: { reports: true },
        },
      },
    }),
    prisma.file.count({ where }),
  ]);

  return {
    files: files.map((f) => ({
      id: f.id,
      slug: f.slug,
      title: f.title,
      originalName: f.originalName,
      sizeBytes: f.sizeBytes.toString(),
      mimeType: f.mimeType,
      category: f.category,
      downloadCount: f.downloadCount,
      qualifiedDownloadCount: f.qualifiedDownloadCount,
      isEnabled: f.isEnabled,
      isDeleted: f.isDeleted,
      reportCount: f._count.reports,
      uploader: f.uploader,
      createdAt: f.createdAt.toISOString(),
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function processAdminFileAction(params: {
  fileId: string;
  adminId: string;
  action: "DISABLE" | "ENABLE" | "DELETE" | "RESTORE";
  reason?: string;
}) {
  const { fileId, adminId, action, reason } = params;

  const file = await prisma.file.findUnique({ where: { id: fileId } });
  if (!file) throw new Error("File not found");

  let updateData: any = {};
  if (action === "DISABLE") updateData = { isEnabled: false };
  if (action === "ENABLE") updateData = { isEnabled: true, isDeleted: false };
  if (action === "DELETE") updateData = { isDeleted: true, isEnabled: false };
  if (action === "RESTORE") updateData = { isDeleted: false, isEnabled: true };

  const updated = await prisma.file.update({
    where: { id: fileId },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: `FILE_${action}`,
      targetType: "File",
      targetId: fileId,
      details: { slug: file.slug, title: file.title, reason },
    },
  });

  return updated;
}

export async function getAdminUsersList(options: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  const page = options.page || 1;
  const limit = options.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = {
    ...(options.search
      ? {
          OR: [
            { email: { contains: options.search, mode: "insensitive" } },
            { displayName: { contains: options.search, mode: "insensitive" } },
            { referralCode: { contains: options.search, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(options.role ? { role: options.role as any } : {}),
    ...(options.status ? { status: options.status as any } : {}),
  };

  const [users, totalCount] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { files: true, withdrawals: true },
        },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users: users.map((u) => ({
      id: u.id,
      email: u.email,
      displayName: u.displayName,
      role: u.role,
      status: u.status,
      referralCode: u.referralCode,
      totalFiles: u._count.files,
      totalWithdrawals: u._count.withdrawals,
      createdAt: u.createdAt.toISOString(),
    })),
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function processAdminUserAction(params: {
  userId: string;
  adminId: string;
  action: "SUSPEND" | "BAN" | "ACTIVATE" | "MAKE_ADMIN" | "REMOVE_ADMIN";
  reason?: string;
}) {
  const { userId, adminId, action, reason } = params;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  let updateData: any = {};
  if (action === "SUSPEND") updateData = { status: "SUSPENDED" };
  if (action === "BAN") updateData = { status: "BANNED" };
  if (action === "ACTIVATE") updateData = { status: "ACTIVE" };
  if (action === "MAKE_ADMIN") updateData = { role: "ADMIN" };
  if (action === "REMOVE_ADMIN") updateData = { role: "USER" };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: `USER_${action}`,
      targetType: "User",
      targetId: userId,
      details: { email: user.email, previousStatus: user.status, reason },
    },
  });

  return updated;
}

export async function getAdminSettings(): Promise<SiteSettingsMap> {
  const settings = await prisma.siteSetting.findMany();
  const map: Record<string, string> = {};

  for (const s of settings) {
    map[s.key] = s.value;
  }

  return {
    siteName: map.siteName || DEFAULT_SITE_SETTINGS.siteName,
    siteDescription: map.siteDescription || DEFAULT_SITE_SETTINGS.siteDescription,
    logoUrl: map.logoUrl || DEFAULT_SITE_SETTINGS.logoUrl,
    maintenanceMode: map.maintenanceMode === "true",
    uploaderRevenuePercent: parseFloat(map.uploaderRevenuePercent) || DEFAULT_SITE_SETTINGS.uploaderRevenuePercent,
    platformRevenuePercent: parseFloat(map.platformRevenuePercent) || DEFAULT_SITE_SETTINGS.platformRevenuePercent,
    minWithdrawal: parseFloat(map.minWithdrawal) || DEFAULT_SITE_SETTINGS.minWithdrawal,
    maxFileSizeMb: parseInt(map.maxFileSizeMb, 10) || DEFAULT_SITE_SETTINGS.maxFileSizeMb,
    allowedMimeTypes: (() => {
      if (!map.allowedMimeTypes) return DEFAULT_SITE_SETTINGS.allowedMimeTypes;
      try {
        const parsed = JSON.parse(map.allowedMimeTypes);
        return Array.isArray(parsed) ? parsed : DEFAULT_SITE_SETTINGS.allowedMimeTypes;
      } catch {
        return map.allowedMimeTypes.split(",").map((s) => s.trim()).filter(Boolean);
      }
    })(),
    adProviderEnabled: map.adProviderEnabled === "true",
    adProviderKey: map.adProviderKey || DEFAULT_SITE_SETTINGS.adProviderKey,
    adSensePublisherId: map.adSensePublisherId || "",
    registrationEnabled: map.registrationEnabled !== "false",
  };
}

export async function updateAdminSettings(
  settings: Partial<SiteSettingsMap>,
  adminId: string
) {
  for (const [key, value] of Object.entries(settings)) {
    if (value !== undefined) {
      const stringValue = typeof value === "object" ? JSON.stringify(value) : String(value);
      await prisma.siteSetting.upsert({
        where: { key },
        create: {
          key,
          value: stringValue,
          type: typeof value === "boolean" ? "BOOLEAN" : typeof value === "number" ? "NUMBER" : "STRING",
        },
        update: {
          value: stringValue,
        },
      });
    }
  }

  await prisma.auditLog.create({
    data: {
      adminId,
      action: "SETTINGS_UPDATE",
      targetType: "SiteSetting",
      details: settings as any,
    },
  });

  return getAdminSettings();
}
