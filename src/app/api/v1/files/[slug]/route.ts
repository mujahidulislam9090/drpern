export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { getFileBySlug, deleteUserFile } from "@/lib/services/fileService";
import { getUserFromRequest, requireAuth } from "@/lib/services/authService";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await getUserFromRequest(req);
    const file = await getFileBySlug(
      params.slug,
      user?.role === "ADMIN" || false
    );

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const isUploader = user ? user.id === file.uploaderId : false;

    return NextResponse.json({
      file: {
        id: file.id,
        slug: file.slug,
        title: file.title,
        description: file.description,
        category: file.category,
        tags: file.tags,
        originalName: file.originalName,
        mimeType: file.mimeType,
        sizeBytes: file.sizeBytes.toString(),
        hasPassword: Boolean(file.passwordHash),
        downloadCount: file.downloadCount,
        qualifiedDownloadCount: isUploader || user?.role === "ADMIN" ? file.qualifiedDownloadCount : undefined,
        createdAt: file.createdAt.toISOString(),
        expiresAt: file.expiresAt ? file.expiresAt.toISOString() : null,
        isExpired: (file as any).isExpired || false,
        isLimitReached: (file as any).isLimitReached || false,
        uploader: {
          id: file.uploader.id,
          displayName: file.uploader.displayName || "Anonymous",
          avatarUrl: file.uploader.avatarUrl,
        },
        isUploader,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const user = await requireAuth(req);
    const file = await getFileBySlug(params.slug, true);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    if (file.uploaderId !== user.id && user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await deleteUserFile(file.id, file.uploaderId);
    return NextResponse.json({ success: true, message: "File deleted" });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
