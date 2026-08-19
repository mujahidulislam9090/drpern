import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);

    const [referrals, totalEarnedResult] = await Promise.all([
      prisma.referral.findMany({
        where: { referrerId: user.id },
        include: {
          referredUser: {
            select: {
              id: true,
              displayName: true,
              email: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.referral.aggregate({
        where: { referrerId: user.id },
        _sum: { totalEarned: true },
      }),
    ]);

    const totalBonus = totalEarnedResult._sum.totalEarned
      ? totalEarnedResult._sum.totalEarned.toString()
      : "0.0000";

    return NextResponse.json({
      referralCode: user.referralCode,
      referralLink: `/auth/register?ref=${user.referralCode}`,
      totalReferrals: referrals.length,
      totalEarned: totalBonus,
      commissionRate: "10%",
      referrals: referrals.map((r) => ({
        id: r.id,
        user: {
          displayName: r.referredUser.displayName,
          email: r.referredUser.email.replace(/(.{2})(.*)(@.*)/, "$1***$3"), // privacy masked
          joinedAt: r.referredUser.createdAt.toISOString(),
        },
        earned: r.totalEarned.toString(),
        createdAt: r.createdAt.toISOString(),
      })),
    });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
