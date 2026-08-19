import { NextRequest } from "next/server";
import { prisma } from "../db";
import { verifyFirebaseIdToken } from "../firebase/admin";
import { customAlphabet } from "nanoid";
import { SessionUser } from "../../types";

const generateRandomCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

/**
 * Generate a unique referral code guaranteed not to collide
 */
async function generateUniqueReferralCode(): Promise<string> {
  for (let i = 0; i < 5; i++) {
    const code = generateRandomCode();
    const existing = await prisma.user.findUnique({ where: { referralCode: code } });
    if (!existing) return code;
  }
  return generateRandomCode() + Math.floor(Math.random() * 100);
}

/**
 * Synchronize Firebase authenticated user with PostgreSQL User record.
 * Handles race conditions, existing accounts, profile updating, and referral tracking.
 */
export async function getOrCreateUserFromFirebase(
  decoded: {
    uid: string;
    email: string;
    displayName?: string | null;
    avatarUrl?: string | null;
  },
  referralCode?: string
) {
  if (!decoded.uid) {
    throw new Error("Invalid identity: missing Firebase UID");
  }

  const now = new Date();

  // 1. Check if user already exists by firebaseUid
  let user = await prisma.user.findUnique({
    where: { firebaseUid: decoded.uid },
  });

  if (user) {
    // Account exists: update displayName, avatarUrl, and lastLoginAt
    const updateData: {
      lastLoginAt: Date;
      displayName?: string;
      avatarUrl?: string;
    } = {
      lastLoginAt: now,
    };

    if (decoded.displayName && decoded.displayName !== user.displayName) {
      updateData.displayName = decoded.displayName;
    }
    if (decoded.avatarUrl && decoded.avatarUrl !== user.avatarUrl) {
      updateData.avatarUrl = decoded.avatarUrl;
    }

    user = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return user;
  }

  // 2. Check if user exists by email (e.g. pre-seeded or invited account)
  if (decoded.email) {
    const existingByEmail = await prisma.user.findUnique({
      where: { email: decoded.email },
    });

    if (existingByEmail) {
      user = await prisma.user.update({
        where: { id: existingByEmail.id },
        data: {
          firebaseUid: decoded.uid,
          displayName: decoded.displayName || existingByEmail.displayName,
          avatarUrl: decoded.avatarUrl || existingByEmail.avatarUrl,
          lastLoginAt: now,
        },
      });
      return user;
    }
  }

  // 3. New User Registration
  // Lookup referrer if code provided
  let referrerId: string | null = null;
  if (referralCode) {
    const cleanRef = referralCode.trim().toUpperCase();
    const referrer = await prisma.user.findUnique({
      where: { referralCode: cleanRef },
    });
    if (referrer) {
      referrerId = referrer.id;
    }
  }

  // Generate unique referral code for this new user
  const newReferralCode = await generateUniqueReferralCode();

  // Determine initial role: first platform user is ADMIN, subsequent are USER
  const userCount = await prisma.user.count();
  const initialRole = userCount === 0 ? "ADMIN" : "USER";

  try {
    user = await prisma.user.create({
      data: {
        firebaseUid: decoded.uid,
        email: decoded.email || `${decoded.uid}@dropearn.local`,
        displayName: decoded.displayName || decoded.email?.split("@")[0] || "Creator",
        avatarUrl: decoded.avatarUrl || null,
        role: initialRole,
        status: "ACTIVE",
        referralCode: newReferralCode,
        referredById: referrerId,
        lastLoginAt: now,
      },
    });

    // Create referral relationship stats if referred
    if (referrerId) {
      await prisma.referral.create({
        data: {
          referrerId,
          referredUserId: user.id,
          commissionRate: 0.10, // 10% commission on platform revenue
          totalEarned: 0,
        },
      }).catch((refErr) => {
        console.warn("[AuthService] Referral relation create warning:", refErr);
      });
    }

    return user;
  } catch (err: any) {
    // Handle potential concurrent race condition (unique constraint collision on firebaseUid or email)
    if (err.code === "P2002") {
      const existingUser = await prisma.user.findUnique({
        where: { firebaseUid: decoded.uid },
      });
      if (existingUser) {
        return existingUser;
      }
    }
    console.error("[AuthService] Failed to create database user account:", err);
    throw new Error(`Database user account creation failed: ${err.message}`);
  }
}

/**
 * Extracts and verifies session user from incoming HTTP request.
 */
export async function getUserFromRequest(req: NextRequest): Promise<SessionUser | null> {
  const authHeader = req.headers.get("authorization");
  const cookieToken = req.cookies.get("fb_token")?.value;
  const token = authHeader?.replace("Bearer ", "") || cookieToken;

  if (!token) {
    return null;
  }

  try {
    const decoded = await verifyFirebaseIdToken(token);
    let user = await prisma.user.findUnique({
      where: { firebaseUid: decoded.uid },
    });

    if (!user) {
      // Auto-sync if valid Firebase token but user record not yet created in PostgreSQL
      user = await getOrCreateUserFromFirebase(decoded);
    }

    if (user.status === "BANNED" || user.status === "SUSPENDED") {
      throw new Error(`User account is ${user.status.toLowerCase()}`);
    }

    return {
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
    };
  } catch (err: any) {
    console.error("[AuthService] Auth verification failed:", err?.message || err);
    return null;
  }
}

/**
 * Requires an authenticated user session, throws UNAUTHORIZED if missing.
 */
export async function requireAuth(req: NextRequest): Promise<SessionUser> {
  const user = await getUserFromRequest(req);
  if (!user) {
    throw new Error("UNAUTHORIZED");
  }
  return user;
}

/**
 * Requires an authenticated ADMIN user session, throws FORBIDDEN if not admin.
 */
export async function requireAdmin(req: NextRequest): Promise<SessionUser> {
  const user = await requireAuth(req);
  if (user.role !== "ADMIN") {
    throw new Error("FORBIDDEN");
  }
  return user;
}

/**
 * Updates a user's editable profile information safely.
 */
export async function updateUserProfile(
  userId: string,
  data: { displayName?: string; avatarUrl?: string }
) {
  const cleanDisplayName = data.displayName?.trim();
  const cleanAvatarUrl = data.avatarUrl?.trim();

  if (cleanDisplayName !== undefined && (cleanDisplayName.length < 2 || cleanDisplayName.length > 50)) {
    throw new Error("Display name must be between 2 and 50 characters.");
  }

  if (cleanAvatarUrl !== undefined && cleanAvatarUrl.length > 500) {
    throw new Error("Avatar URL must not exceed 500 characters.");
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(cleanDisplayName !== undefined ? { displayName: cleanDisplayName } : {}),
      ...(cleanAvatarUrl !== undefined ? { avatarUrl: cleanAvatarUrl } : {}),
    },
  });

  return {
    id: updated.id,
    firebaseUid: updated.firebaseUid,
    email: updated.email,
    displayName: updated.displayName,
    avatarUrl: updated.avatarUrl,
    role: updated.role,
    status: updated.status,
    referralCode: updated.referralCode,
    lastLoginAt: updated.lastLoginAt?.toISOString() || null,
    createdAt: updated.createdAt.toISOString(),
  };
}
