export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { getAdminDashboardMetrics } from "@/lib/services/adminService";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const metrics = await getAdminDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
