export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { getOrCreateUserFromFirebase } from "@/lib/services/authService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const token = body.token || req.headers.get("authorization")?.replace("Bearer ", "");
    const referralCode = body.referralCode;

    if (!token) {
      return NextResponse.json({ error: "Missing authentication token" }, { status: 400 });
    }

    const decoded = await verifyFirebaseIdToken(token);
    const user = await getOrCreateUserFromFirebase(decoded, referralCode);

    const response = NextResponse.json({
      user: {
        id: user.id,
        firebaseUid: user.firebaseUid,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        role: user.role,
        status: user.status,
        referralCode: user.referralCode,
        lastLoginAt: user.lastLoginAt?.toISOString() || null,
        createdAt: user.createdAt.toISOString(),
      },
    });

    // Set secure session cookie
    response.cookies.set("fb_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[AuthSync] Error syncing user identity:", error);
    return NextResponse.json(
      { error: error.message || "Failed to authenticate and sync account" },
      { status: 401 }
    );
  }
}
