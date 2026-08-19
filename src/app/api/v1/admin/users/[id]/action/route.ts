import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { processAdminUserAction } from "@/lib/services/adminService";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { action, reason } = body;

    if (!["SUSPEND", "BAN", "ACTIVATE", "MAKE_ADMIN", "REMOVE_ADMIN"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await processAdminUserAction({
      userId: params.id,
      adminId: admin.id,
      action,
      reason,
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
