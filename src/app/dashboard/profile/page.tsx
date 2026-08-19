"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Clock,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Save,
  Image as ImageIcon,
} from "lucide-react";

export default function ProfilePage() {
  const { user, refreshSession, setUser } = useAuth();

  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setAvatarUrl(user.avatarUrl || "");
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg("");
    setErrorMsg("");

    try {
      const res = await fetch("/api/v1/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          avatarUrl: avatarUrl.trim() || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      if (data.user) {
        setUser(data.user);
        setSuccessMsg("Profile information updated successfully.");
      }
    } catch (err: any) {
      console.error("[ProfilePage] Save error:", err);
      setErrorMsg(err.message || "Failed to save profile changes.");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-slate-800 rounded-xl" />
        <div className="h-64 bg-slate-800/50 rounded-2xl border border-slate-800" />
      </div>
    );
  }

  const formattedCreatedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not available";

  const formattedLastLogin = user.lastLoginAt
    ? new Date(user.lastLoginAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "Active now";

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Manage your public creator profile and account identity details
        </p>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card & Avatar Preview */}
        <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-6 flex flex-col items-center text-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shadow-xl shadow-blue-500/20 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={user.displayName || "Avatar"}
                  className="w-full h-full object-cover rounded-[22px]"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "";
                  }}
                />
              ) : (
                <span className="text-3xl font-black text-white uppercase">
                  {user.displayName ? user.displayName.charAt(0) : user.email.charAt(0)}
                </span>
              )}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-slate-900 ${
                user.status === "ACTIVE" ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              {user.displayName || "Creator"}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-800/80 space-y-2 text-left text-xs text-slate-300">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Role</span>
              <span className="font-semibold px-2 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                {user.role}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Account Status</span>
              <span className="font-semibold text-emerald-400">{user.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Referral Code</span>
              <span className="font-mono text-white font-bold">{user.referralCode}</span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className="md:col-span-2 rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white">Edit Profile Details</h3>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Display Name (Creator Name)
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Walker"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                This name is displayed on your public file sharing links.
              </p>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Avatar Image URL (Optional)
              </label>
              <div className="relative">
                <ImageIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter a direct image link (HTTPS) or use default initial avatar.
              </p>
            </div>

            <div className="pt-2">
              <Button type="submit" loading={saving} className="px-6">
                <Save className="w-4 h-4 mr-2" />
                <span>Save Profile Changes</span>
              </Button>
            </div>
          </form>

          {/* Read-Only Account Identity Metadata */}
          <div className="pt-6 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Verified Identity Records (Read-Only)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Primary Email</span>
                </div>
                <p className="font-mono text-slate-200 truncate">{user.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Firebase UID</span>
                </div>
                <p className="font-mono text-slate-200 truncate">{user.firebaseUid}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Joined Platform</span>
                </div>
                <p className="text-slate-200">{formattedCreatedDate}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-1">
                  <Clock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Last Active</span>
                </div>
                <p className="text-slate-200">{formattedLastLogin}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
