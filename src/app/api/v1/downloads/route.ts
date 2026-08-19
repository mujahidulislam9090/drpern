import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const [downloads, totalCount] = await Promise.all([
      prisma.fileDownload.findMany({
        where: {
          file: {
            uploaderId: user.id,
          },
        },
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
            },
          },
        },
      }),
      prisma.fileDownload.count({
        where: {
          file: {
            uploaderId: user.id,
          },
        },
      }),
    ]);

    return NextResponse.json({
      downloads: downloads.map((d) => ({
        id: d.id,
        fileId: d.fileId,
        fileTitle: d.file.title,
        fileSlug: d.file.slug,
        fileSizeBytes: d.file.sizeBytes.toString(),
        ipAddress: d.ipAddress ? `${d.ipAddress.split(".")[0] || ""}.*.*.*` : "Anonymous",
        country: d.country || "Global",
        isQualified: d.isQualified,
        qualificationReason: d.qualificationReason || (d.isQualified ? "Verified dwell time" : "Unqualified visit"),
        downloadStartedAt: d.downloadStartedAt.toISOString(),
        downloadCompletedAt: d.downloadCompletedAt?.toISOString() || null,
        createdAt: d.createdAt.toISOString(),
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
