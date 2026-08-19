import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    // Fetch publisher ID setting
    const [adSenseSetting, placements] = await Promise.all([
      prisma.siteSetting.findUnique({
        where: { key: "adSensePublisherId" },
      }),
      prisma.adPlacement.findMany({
        where: {
          isEnabled: true,
          ...(location ? { location: location as any } : {}),
        },
        include: {
          provider: true,
        },
      }),
    ]);

    const clientId =
      adSenseSetting?.value ||
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID ||
      null;

    const formatted = placements.map((p) => ({
      id: p.id,
      name: p.name,
      location: p.location,
      isEnabled: p.isEnabled,
      slotId: p.provider?.adSlotId || null,
      providerKey: p.provider?.providerKey || "ADSENSE",
      clientId:
        p.provider?.config &&
        typeof p.provider.config === "object" &&
        (p.provider.config as any).clientId
          ? (p.provider.config as any).clientId
          : clientId,
    }));

    return NextResponse.json({
      clientId,
      placements: formatted,
    });
  } catch (error: any) {
    console.error("[AdsPlacementsAPI] Error:", error);
    return NextResponse.json(
      { error: "Failed to load ad configuration" },
      { status: 500 }
    );
  }
}
