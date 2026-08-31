export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getAvailableVerificationChannels } from "@/lib/services/otpService";

export async function GET() {
  const channels = getAvailableVerificationChannels();
  return NextResponse.json({ channels });
}
