export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/services/authService";
import { processDownload } from "@/lib/services/downloadService";
import { verifyFilePassword, getFileBySlug } from "@/lib/services/fileService";
import { storage } from "@/lib/storage";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json().catch(() => ({}));
    const password = body.password;
    const timeOnPageSeconds = typeof body.timeOnPage === "number" ? body.timeOnPage : 10;
    const visitorSessionId = body.sessionId || req.cookies.get("vid")?.value || "guest_session";

    const file = await getFileBySlug(params.slug);
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Password verification if required
    if (file.passwordHash) {
      if (!password) {
        return NextResponse.json(
          { error: "Password required for this file" },
          { status: 403 }
        );
      }
      const isValid = await verifyFilePassword(params.slug, password);
      if (!isValid) {
        return NextResponse.json({ error: "Incorrect password" }, { status: 403 });
      }
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";

    const userAgent = req.headers.get("user-agent") || null;

    const result = await processDownload({
      slug: params.slug,
      ipAddress,
      visitorSessionId,
      userAgent,
      currentUserId: user?.id || null,
      timeOnPageSeconds,
    });

    return NextResponse.json({
      success: true,
      downloadUrl: result.downloadUrl,
      isS3: result.isS3,
      originalName: result.originalName,
      mimeType: result.mimeType,
      isQualified: result.isQualified,
    });
  } catch (error: any) {
    console.error("Download processing error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process download" },
      { status: 400 }
    );
  }
}
