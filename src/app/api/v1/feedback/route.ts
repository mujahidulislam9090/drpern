export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const category = body.category || "General Feedback";
    const feedback = body.feedback;
    const email = body.email || user?.email || "anonymous";

    if (!feedback || typeof feedback !== "string" || !feedback.trim()) {
      return NextResponse.json({ error: "Feedback message cannot be empty" }, { status: 400 });
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Save as AuditLog entry with targetType 'FEEDBACK'
    await prisma.auditLog.create({
      data: {
        adminId: user?.role === "ADMIN" ? user.id : null,
        action: "SUBMIT_FEEDBACK",
        targetType: "USER_FEEDBACK",
        targetId: user?.id || null,
        details: {
          category,
          email,
          feedback: feedback.trim().slice(0, 2000),
          userId: user?.id || null,
        },
        ipAddress,
      },
    });

    return NextResponse.json({ success: true, message: "Feedback recorded" });
  } catch (error: any) {
    console.error("[FeedbackRoute] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to submit feedback" }, { status: 500 });
  }
}
