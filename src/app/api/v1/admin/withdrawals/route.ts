export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const status = searchParams.get("status") || undefined;
    const skip = (page - 1) * limit;

    const where: any = {
      ...(status && status !== "ALL" ? { status: status as any } : {}),
    };

    const [withdrawals, totalCount] = await Promise.all([
      prisma.withdrawal.findMany({
        where,
        skip,
        take: limit,
        orderBy: { requestedAt: "desc" },
        include: {
          user: {
            select: { id: true, email: true, displayName: true },
          },
        },
      }),
      prisma.withdrawal.count({ where }),
    ]);

    return NextResponse.json({
      withdrawals: withdrawals.map((w) => ({
        id: w.id,
        user: w.user,
        amount: w.amount.toString(),
        currency: w.currency,
        payoutMethod: w.payoutMethod,
        payoutDetails: w.payoutDetails,
        status: w.status,
        adminNote: w.adminNote,
        rejectionReason: w.rejectionReason,
        requestedAt: w.requestedAt.toISOString(),
        processedAt: w.processedAt ? w.processedAt.toISOString() : null,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED" || error.message === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: error.message === "UNAUTHORIZED" ? 401 : 403 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
