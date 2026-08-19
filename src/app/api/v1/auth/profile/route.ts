import { NextRequest, NextResponse } from "next/server";
import { requireAuth, updateUserProfile } from "@/lib/services/authService";

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Unauthorized" },
      { status: error.message === "UNAUTHORIZED" ? 401 : 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuth(req);
    const body = await req.json();

    const updatedUser = await updateUserProfile(user.id, {
      displayName: body.displayName,
      avatarUrl: body.avatarUrl,
    });

    return NextResponse.json({ user: updatedUser, message: "Profile updated successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update profile" },
      { status: error.message === "UNAUTHORIZED" ? 401 : 400 }
    );
  }
}
