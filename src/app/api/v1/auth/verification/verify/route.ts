export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyOtpCode } from "@/lib/services/otpService";
import { getUserFromRequest } from "@/lib/services/authService";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const destination = body.destination || user?.email;
    const code = body.code;
    const purpose = body.purpose || "SIGNUP_VERIFICATION";

    if (!destination) {
      return NextResponse.json(
        { error: "Destination is required." },
        { status: 400 }
      );
    }

    if (!code || typeof code !== "string" || code.trim().length !== 6) {
      return NextResponse.json(
        { error: "Please enter a valid 6-digit verification code." },
        { status: 400 }
      );
    }

    const result = await verifyOtpCode({
      destination,
      code,
      purpose,
      userId: user?.id,
    });

    return NextResponse.json({
      success: true,
      message: "Verified successfully.",
      ...result,
    });
  } catch (error: any) {
    console.error("[VerificationVerifyRoute] Error:", error);
    return NextResponse.json(
      { error: error.message || "Verification failed." },
      { status: 400 }
    );
  }
}
