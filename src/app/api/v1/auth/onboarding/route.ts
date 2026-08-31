export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        onboardingCompleted: Boolean(body.completed),
      },
    });

    return NextResponse.json({ success: true, onboardingCompleted: updated.onboardingCompleted });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message || "Failed to update onboarding state" }, { status: 500 });
  }
}
