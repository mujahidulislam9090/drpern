"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  fbSignOut,
  sendPasswordResetEmail,
  type FirebaseUser,
} from "@/lib/firebase/client";
import { onAuthStateChanged } from "firebase/auth";
import { SessionUser } from "@/types";
import { isFirebaseConfigured } from "@/lib/firebase/config";

interface AuthContextType {
  user: SessionUser | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: (refCode?: string) => Promise<SessionUser>;
  signInWithEmail: (email: string, pass: string) => Promise<SessionUser>;
  signUpWithEmail: (
    email: string,
    pass: string,
    displayName?: string,
    refCode?: string
  ) => Promise<SessionUser>;
  resetPassword: (email: string) => Promise<void>;
  devLogin: (email: string, role?: "USER" | "ADMIN") => Promise<SessionUser>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<SessionUser | null>;
  setUser: (user: SessionUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync Firebase ID token with PostgreSQL backend API
  const syncWithBackend = async (token: string, refCode?: string): Promise<SessionUser> => {
    const res = await fetch("/api/v1/auth/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, referralCode: refCode }),
    });

    if (!res.ok) {
      let errorMsg = "Authentication synchronization failed";
      try {
        const err = await res.json();
        errorMsg = err.error || errorMsg;
      } catch {
        // Fallback message
      }
      console.error("[AuthContext] Backend sync failed:", errorMsg);
      throw new Error(errorMsg);
    }

    const data = await res.json();
    if (!data.user) {
      throw new Error("Server returned empty user profile");
    }

    setUser(data.user);
    return data.user;
  };

  const refreshSession = async (): Promise<SessionUser | null> => {
    try {
      const res = await fetch("/api/v1/auth/session");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        return data.user;
      }
    } catch (err) {
      console.error("[AuthContext] Session refresh error:", err);
    }
    return null;
  };

  useEffect(() => {
    // Initial cookie session verification
    refreshSession().finally(() => setLoading(false));

    if (isFirebaseConfigured()) {
      const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser) {
          try {
            const token = await fbUser.getIdToken();
            await syncWithBackend(token);
          } catch (err) {
            console.warn("[AuthContext] onAuthStateChanged background sync:", err);
          }
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, []);

  const signInWithGoogle = async (refCode?: string): Promise<SessionUser> => {
    if (!isFirebaseConfigured()) {
      return await devLogin("google.user@example.com", "USER");
    }
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      const syncedUser = await syncWithBackend(token, refCode);
      return syncedUser;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, pass: string): Promise<SessionUser> => {
    if (!isFirebaseConfigured()) {
      return await devLogin(email, email.includes("admin") ? "ADMIN" : "USER");
    }
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      const token = await result.user.getIdToken();
      const syncedUser = await syncWithBackend(token);
      return syncedUser;
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string,
    pass: string,
    displayName?: string,
    refCode?: string
  ): Promise<SessionUser> => {
    if (!isFirebaseConfigured()) {
      return await devLogin(email, email.includes("admin") ? "ADMIN" : "USER");
    }
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName }).catch(() => {});
      }
      const token = await result.user.getIdToken();
      const syncedUser = await syncWithBackend(token, refCode);
      return syncedUser;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    if (isFirebaseConfigured()) {
      await sendPasswordResetEmail(auth, email);
    }
  };

  // Local development authentication helper
  const devLogin = async (email: string, role: "USER" | "ADMIN" = "USER"): Promise<SessionUser> => {
    setLoading(true);
    try {
      const devUid = `dev_${role.toLowerCase()}_${Date.now()}`;
      const devToken = `dev_token_${devUid}_${encodeURIComponent(email)}`;
      const syncedUser = await syncWithBackend(devToken);

      if (syncedUser && role === "ADMIN" && syncedUser.role !== "ADMIN") {
        // If testing admin locally, promote in DB
        await fetch(`/api/v1/admin/users/${syncedUser.id}/action`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "MAKE_ADMIN" }),
        }).catch(() => {});
        const refreshed = await refreshSession();
        return refreshed || syncedUser;
      }
      return syncedUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isFirebaseConfigured()) {
        await fbSignOut(auth).catch(() => {});
      }
      await fetch("/api/v1/auth/session", { method: "DELETE" });
      setUser(null);
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        firebaseUser,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        devLogin,
        logout,
        refreshSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
