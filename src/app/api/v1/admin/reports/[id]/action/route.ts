import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { prisma } from "@/lib/db";
import { processAdminFileAction } from "@/lib/services/adminService";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { action, disableFile } = body; // action: RESOLVED, DISMISSED, INVESTIGATING

    const report = await prisma.report.findUnique({
      where: { id: params.id },
      include: { file: true },
    });

    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    if (disableFile && report.fileId) {
      await processAdminFileAction({
        fileId: report.fileId,
        adminId: admin.id,
        action: "DISABLE",
        reason: `Disabled due to report #${report.id.slice(-6)}: ${report.reason}`,
      });
    }

    const updated = await prisma.report.update({
      where: { id: params.id },
      data: {
        status: action || "RESOLVED",
        resolvedById: admin.id,
        resolvedAt: new Date(),
      },
    });

    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: `REPORT_${action || "RESOLVED"}`,
        targetType: "Report",
        targetId: params.id,
        details: { reportId: params.id, fileId: report.fileId, disableFile },
      },
    });

    return NextResponse.json({ success: true, report: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
