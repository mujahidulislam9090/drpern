import { NextRequest, NextResponse } from "next/server";
import { storage } from "@/lib/storage";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  const filename =
    searchParams.get("filename") ||
    (key ? path.basename(key) : "downloaded_file");

  if (!key) {
    return NextResponse.json(
      { error: "Missing file storage key" },
      { status: 400 }
    );
  }

  // Prevent path traversal attempts
  if (key.includes("..")) {
    return NextResponse.json({ error: "Invalid file key" }, { status: 400 });
  }

  try {
    const exists = await storage.exists(key);
    if (!exists) {
      return NextResponse.json(
        { error: "File not found or has been removed from storage" },
        { status: 404 }
      );
    }

    const stream = await storage.getFileStream(key);

    // Convert Node Readable stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        stream.on("data", (chunk) => controller.enqueue(chunk));
        stream.on("end", () => controller.close());
        stream.on("error", (err) => controller.error(err));
      },
    });

    return new NextResponse(webStream, {
      headers: {
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "Content-Type": "application/octet-stream",
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("[StorageDownload] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to download file from storage" },
      { status: 500 }
    );
  }
}
