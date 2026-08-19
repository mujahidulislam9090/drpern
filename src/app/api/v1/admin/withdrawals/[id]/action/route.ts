import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { processAdminWithdrawalAction } from "@/lib/services/withdrawalService";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await requireAdmin(req);
    const body = await req.json();
    const { action, note, rejectionReason } = body;

    if (!["APPROVE", "START_PROCESSING", "MARK_PAID", "REJECT", "CANCEL"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const updated = await processAdminWithdrawalAction({
      withdrawalId: params.id,
      adminId: admin.id,
      action,
      note,
      rejectionReason,
    });

    return NextResponse.json({ success: true, withdrawal: updated });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
