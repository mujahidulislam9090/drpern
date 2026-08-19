import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { prisma } from "@/lib/db";
import { AdPlacementLocation } from "@prisma/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);

    const [adSensePublisherId, adProviderEnabled, autoAdsEnabled, placements, providers] =
      await Promise.all([
        prisma.siteSetting.findUnique({ where: { key: "adSensePublisherId" } }),
        prisma.siteSetting.findUnique({ where: { key: "adProviderEnabled" } }),
        prisma.siteSetting.findUnique({ where: { key: "adSenseAutoAds" } }),
        prisma.adPlacement.findMany({
          include: { provider: true },
          orderBy: { location: "asc" },
        }),
        prisma.adProvider.findMany({
          orderBy: { createdAt: "desc" },
        }),
      ]);

    // Standard platform ad placement catalog
    const standardLocations: { name: string; location: AdPlacementLocation; category: string }[] = [
      { name: "Download Page Top Banner", location: "DOWNLOAD_TOP", category: "Download Page" },
      { name: "Download Page Middle (In-Content)", location: "DOWNLOAD_MIDDLE", category: "Download Page" },
      { name: "Download Page Countdown Timer Unit", location: "DOWNLOAD_COUNTDOWN", category: "Download Page" },
      { name: "Download Page Post-Download Completion", location: "DOWNLOAD_COMPLETED", category: "Download Page" },
      { name: "Download Page Bottom Banner", location: "DOWNLOAD_BOTTOM", category: "Download Page" },
      { name: "Download Page Sticky Desktop Sidebar", location: "DOWNLOAD_SIDEBAR", category: "Download Page" },
      { name: "Home Page Below Hero", location: "HOME_HERO_BOTTOM", category: "Landing & Public" },
      { name: "Home Page Mid-Section", location: "HOME_MID_SECTION", category: "Landing & Public" },
      { name: "Home Page Footer Banner", location: "HOME_FOOTER", category: "Landing & Public" },
      { name: "Payout Rates Page Top Banner", location: "RATES_TOP", category: "Landing & Public" },
      { name: "Payout Rates Page Bottom Banner", location: "RATES_BOTTOM", category: "Landing & Public" },
      { name: "FAQ Page Bottom Banner", location: "FAQ_BOTTOM", category: "Landing & Public" },
      { name: "Report Abuse Page Bottom", location: "REPORT_BOTTOM", category: "Landing & Public" },
      { name: "Universal Sidebar Banner", location: "SIDEBAR", category: "Universal" },
      { name: "Universal Header Banner", location: "BANNER", category: "Universal" },
    ];

    const existingLocations = new Set(placements.map((p) => p.location));
    const missing = standardLocations.filter((s) => !existingLocations.has(s.location));

    if (missing.length > 0) {
      await Promise.all(
        missing.map((m) =>
          prisma.adPlacement.create({
            data: {
              name: m.name,
              location: m.location,
              isEnabled: false,
            },
          })
        )
      );
    }

    const updatedPlacements = await prisma.adPlacement.findMany({
      include: { provider: true },
      orderBy: { location: "asc" },
    });

    return NextResponse.json({
      adSensePublisherId:
        adSensePublisherId?.value ||
        process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
        "",
      adProviderEnabled: adProviderEnabled?.value === "true",
      autoAdsEnabled: autoAdsEnabled?.value === "true",
      placements: updatedPlacements,
      providers,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === "UNAUTHORIZED" ? 401 : 403 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { adSensePublisherId, adProviderEnabled, autoAdsEnabled, placements } = body;

    // 1. Update Global Settings
    if (typeof adSensePublisherId === "string") {
      await prisma.siteSetting.upsert({
        where: { key: "adSensePublisherId" },
        update: { value: adSensePublisherId.trim() },
        create: {
          key: "adSensePublisherId",
          value: adSensePublisherId.trim(),
          category: "ADS",
        },
      });
    }

    if (typeof adProviderEnabled === "boolean") {
      await prisma.siteSetting.upsert({
        where: { key: "adProviderEnabled" },
        update: { value: String(adProviderEnabled) },
        create: {
          key: "adProviderEnabled",
          value: String(adProviderEnabled),
          category: "ADS",
        },
      });
    }

    if (typeof autoAdsEnabled === "boolean") {
      await prisma.siteSetting.upsert({
        where: { key: "adSenseAutoAds" },
        update: { value: String(autoAdsEnabled) },
        create: {
          key: "adSenseAutoAds",
          value: String(autoAdsEnabled),
          category: "ADS",
        },
      });
    }

    // 2. Update Placements
    if (Array.isArray(placements)) {
      for (const p of placements) {
        if (p.id) {
          let providerId = p.providerId;
          if (p.slotId) {
            const provider = await prisma.adProvider.create({
              data: {
                name: `AdSense - ${p.name || p.location}`,
                providerKey: "ADSENSE",
                adSlotId: p.slotId,
                isEnabled: p.isEnabled ?? false,
              },
            });
            providerId = provider.id;
          }

          await prisma.adPlacement.update({
            where: { id: p.id },
            data: {
              isEnabled: Boolean(p.isEnabled),
              ...(providerId ? { providerId } : {}),
            },
          });
        }
      }
    }

    // 3. Create Audit Log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "UPDATE_AD_SETTINGS",
        targetType: "AdPlacement",
        details: {
          adSensePublisherId,
          adProviderEnabled,
          autoAdsEnabled,
          updatedCount: placements?.length || 0,
        },
      },
    });

    return NextResponse.json({ success: true, message: "All ad configurations updated successfully" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json(
        { error: error.message },
        { status: error.message === "UNAUTHORIZED" ? 401 : 403 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
