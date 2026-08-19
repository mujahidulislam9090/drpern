export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { slug, fileId, reporterEmail, reason, details } = body;

    if (!reason || (!slug && !fileId)) {
      return NextResponse.json(
        { error: "Reason and file identifier are required" },
        { status: 400 }
      );
    }

    let targetFileId = fileId;
    if (!targetFileId && slug) {
      const file = await prisma.file.findUnique({ where: { slug } });
      if (!file) {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
      }
      targetFileId = file.id;
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const report = await prisma.report.create({
      data: {
        fileId: targetFileId,
        reporterEmail: reporterEmail || null,
        reporterIp: ipAddress,
        reason,
        details: details || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Report submitted successfully and queued for review",
      reportId: report.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
