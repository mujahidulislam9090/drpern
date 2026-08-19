import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/services/authService";
import { requestWithdrawal, getUserWithdrawals } from "@/lib/services/withdrawalService";
import { PayoutMethod } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    const result = await getUserWithdrawals(user.id, { page, limit });
    return NextResponse.json(result);
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();

    const amount = body.amount;
    const payoutMethod = body.payoutMethod as PayoutMethod;
    const payoutDetails = body.payoutDetails;

    if (!amount || !payoutMethod || !payoutDetails) {
      return NextResponse.json(
        { error: "Amount, payout method, and payment details are required" },
        { status: 400 }
      );
    }

    const withdrawal = await requestWithdrawal({
      userId: user.id,
      amount,
      payoutMethod,
      payoutDetails,
    });

    return NextResponse.json({ success: true, withdrawal });
  } catch (error: any) {
    if (error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to create withdrawal request" },
      { status: 400 }
    );
  }
}
