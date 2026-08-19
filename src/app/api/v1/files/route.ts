import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { createFile, getUserFiles } from "@/lib/services/fileService";
import { sanitizeFilename } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const formData = await req.formData();

    const file = formData.get("file") as globalThis.File | null;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const title = (formData.get("title") as string) || file.name;
    const description = formData.get("description") as string | undefined;
    const category = (formData.get("category") as string) || "General";
    const tagsRaw = formData.get("tags") as string | undefined;
    const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : [];
    const password = formData.get("password") as string | undefined;
    const downloadLimitRaw = formData.get("downloadLimit") as string | undefined;
    const downloadLimit = downloadLimitRaw ? parseInt(downloadLimitRaw, 10) : undefined;
    const expiresAtRaw = formData.get("expiresAt") as string | undefined;
    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;
    const isPublic = formData.get("isPublic") !== "false";

    // Read buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const created = await createFile({
      uploaderId: user.id,
      title,
      description,
      category,
      tags,
      originalName: sanitizeFilename(file.name),
      mimeType: file.type || "application/octet-stream",
      sizeBytes: buffer.length,
      buffer,
      password,
      downloadLimit,
      expiresAt,
      isPublic,
    });

    return NextResponse.json({
      success: true,
      file: {
        id: created.id,
        slug: created.slug,
        title: created.title,
        sizeBytes: created.sizeBytes.toString(),
        mimeType: created.mimeType,
        shareUrl: `/d/${created.slug}`,
      },
    });
  } catch (error: any) {
    console.error("Upload error:", error);
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to upload file" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const result = await getUserFiles(user.id, { page, limit, search, category });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
