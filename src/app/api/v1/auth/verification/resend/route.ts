export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { requestOtpVerification } from "@/lib/services/otpService";
import { getUserFromRequest } from "@/lib/services/authService";

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromRequest(req);
    const body = await req.json();

    const destination = body.destination || user?.email;
    const channel = body.channel || "EMAIL";
    const purpose = body.purpose || "SIGNUP_VERIFICATION";

    if (!destination) {
      return NextResponse.json(
        { error: "Destination email or phone is required." },
        { status: 400 }
      );
    }

    const ipAddress =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "127.0.0.1";
    const userAgent = req.headers.get("user-agent") || undefined;

    const result = await requestOtpVerification({
      destination,
      channel,
      purpose,
      userId: user?.id,
      ipAddress,
      userAgent,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to resend verification code." },
      { status: 400 }
    );
  }
}
