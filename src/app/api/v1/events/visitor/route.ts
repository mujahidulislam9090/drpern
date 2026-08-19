import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const pagePath = body.pagePath || "/";
    const fileId = body.fileId || null;
    const eventType = body.eventType || "PAGE_VIEW";
    const referer = req.headers.get("referer") || body.referer || null;
    const userAgent = req.headers.get("user-agent") || null;

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    let sessionId = body.sessionId || req.cookies.get("vid")?.value;
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    try {
      await prisma.visitorEvent.create({
        data: {
          sessionId,
          ipAddress,
          userAgent,
          pagePath,
          eventType,
          referer,
          fileId,
        },
      });
    } catch (dbErr: any) {
      // Gracefully handle if DB is offline during development
      console.warn("[Visitor Analytics] Event skipped:", dbErr?.message || dbErr);
    }

    const response = NextResponse.json({ success: true, sessionId });
    if (!req.cookies.get("vid")) {
      response.cookies.set("vid", sessionId, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        path: "/",
        sameSite: "lax",
      });
    }

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 200 });
  }
}
