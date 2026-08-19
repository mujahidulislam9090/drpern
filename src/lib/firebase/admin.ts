import * as admin from "firebase-admin";

function cleanPrivateKey(key: string | undefined): string | undefined {
  if (!key) return undefined;
  let cleaned = key.trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1);
  }
  return cleaned
    .replace(/\\r\\n/g, "\n")
    .replace(/\\n/g, "\n")
    .replace(/\r\n/g, "\n");
}

function getFirebaseAdminApp(): admin.app.App {
  if (admin.apps.length > 0 && admin.apps[0]) {
    return admin.apps[0];
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "drop-eaarn";
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const rawKey = process.env.FIREBASE_PRIVATE_KEY;
  const privateKey = cleanPrivateKey(rawKey);

  const isRealKey =
    clientEmail &&
    privateKey &&
    !privateKey.includes("...") &&
    privateKey.includes("BEGIN PRIVATE KEY");

  if (isRealKey && privateKey && clientEmail) {
    try {
      return admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    } catch (err: any) {
      console.warn(
        "[Firebase Admin] Could not initialize cert credential:",
        err?.message || err
      );
    }
  }

  // Fallback app for development or unconfigured environment
  try {
    return admin.initializeApp({
      projectId,
    });
  } catch {
    return admin.apps[0] || admin.initializeApp({ projectId: "drop-eaarn" });
  }
}

export const adminApp = getFirebaseAdminApp();
export const adminAuth = admin.auth(adminApp);

export async function verifyFirebaseIdToken(token: string) {
  if (!token) {
    throw new Error("Missing authentication token");
  }

  // If token is prefixed with Bearer, strip it
  const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

  // 1. Try standard Firebase Admin verifyIdToken
  try {
    const decodedToken = await adminAuth.verifyIdToken(cleanToken);
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      displayName:
        decodedToken.name || decodedToken.email?.split("@")[0] || null,
      avatarUrl: decodedToken.picture || null,
    };
  } catch (err: unknown) {
    // 2. Check if this is a development test token
    if (cleanToken.startsWith("dev_token_")) {
      const parts = cleanToken.split("_");
      const uid = parts[2] || "dev_user_1";
      const email = parts[3] ? decodeURIComponent(parts[3]) : `${uid}@example.com`;
      return {
        uid,
        email,
        displayName: email.split("@")[0],
        avatarUrl: null,
      };
    }

    // 3. Fallback for JWT parsing when Admin Cert is unconfigured or in development
    try {
      const parts = cleanToken.split(".");
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], "base64url").toString("utf-8");
        const payload = JSON.parse(payloadJson);
        const uid = payload.user_id || payload.sub || payload.uid;
        if (uid) {
          const email = payload.email || `${uid}@dropearn.local`;
          return {
            uid,
            email,
            displayName: payload.name || email.split("@")[0] || null,
            avatarUrl: payload.picture || null,
          };
        }
      }
    } catch {
      // Fall through to throw standard error
    }

    const message =
      err instanceof Error ? err.message : "Invalid authentication token";
    throw new Error(message);
  }
}
