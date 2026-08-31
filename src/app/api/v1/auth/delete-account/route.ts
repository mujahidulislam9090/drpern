export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { prisma } from "@/lib/db";
import { storage } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    // 1. Fetch user's files and clean up storage
    const userFiles = await prisma.file.findMany({
      where: { uploaderId: user.id },
      select: { storageKey: true },
    });

    for (const f of userFiles) {
      try {
        await storage.deleteFile(f.storageKey);
      } catch (err) {
        console.warn(`[DeleteAccount] Error deleting storage file ${f.storageKey}:`, err);
      }
    }

    // 2. Delete user record in PostgreSQL (cascades related records)
    await prisma.user.delete({
      where: { id: user.id },
    });

    const response = NextResponse.json({ success: true, message: "Account deleted successfully" });
    response.cookies.delete("fb_token");
    return response;
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("[DeleteAccountRoute] Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete account" }, { status: 500 });
  }
}
