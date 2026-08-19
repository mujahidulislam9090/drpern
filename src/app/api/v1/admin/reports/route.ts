export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status") || undefined;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && status !== "ALL" ? { status: status as any } : {}),
    };

    const [reports, totalCount] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          file: {
            select: { id: true, slug: true, title: true, isDeleted: true, isEnabled: true },
          },
          resolvedBy: {
            select: { id: true, email: true, displayName: true },
          },
        },
      }),
      prisma.report.count({ where }),
    ]);

    return NextResponse.json({
      reports: reports.map((r) => ({
        id: r.id,
        file: r.file,
        reporterEmail: r.reporterEmail,
        reporterIp: r.reporterIp,
        reason: r.reason,
        details: r.details,
        status: r.status,
        resolvedBy: r.resolvedBy,
        resolvedAt: r.resolvedAt ? r.resolvedAt.toISOString() : null,
        createdAt: r.createdAt.toISOString(),
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
