import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "25", 10);
    const skip = (page - 1) * limit;
    const filter = searchParams.get("filter"); // "all", "qualified", "unqualified"

    const where: any = {};
    if (filter === "qualified") where.isQualified = true;
    if (filter === "unqualified") where.isQualified = false;

    const [downloads, totalCount, qualifiedCount, totalToday] = await Promise.all([
      prisma.fileDownload.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          file: {
            select: {
              id: true,
              title: true,
              slug: true,
              sizeBytes: true,
              uploader: {
                select: {
                  displayName: true,
                  email: true,
                },
              },
            },
          },
        },
      }),
      prisma.fileDownload.count({ where }),
      prisma.fileDownload.count({ where: { isQualified: true } }),
      prisma.fileDownload.count({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    return NextResponse.json({
      downloads: downloads.map((d) => ({
        id: d.id,
        fileTitle: d.file.title,
        fileSlug: d.file.slug,
        fileSizeBytes: d.file.sizeBytes.toString(),
        uploaderName: d.file.uploader.displayName || d.file.uploader.email,
        ipAddress: d.ipAddress,
        country: d.country || "Global",
        isQualified: d.isQualified,
        qualificationReason: d.qualificationReason || "Standard download event",
        createdAt: d.createdAt.toISOString(),
      })),
      totalCount,
      qualifiedCount,
      totalToday,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
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
