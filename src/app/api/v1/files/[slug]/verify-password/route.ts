export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyFilePassword } from "@/lib/services/fileService";

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await req.json();
    const password = body.password;

    if (!password) {
      return NextResponse.json({ error: "Password required" }, { status: 400 });
    }

    const isValid = await verifyFilePassword(params.slug, password);
    return NextResponse.json({ valid: isValid });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
