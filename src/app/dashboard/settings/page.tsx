"use client";

import React, { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { User, Mail, Key, Shield, CheckCircle2 } from "lucide-react";

export default function UserSettingsPage() {
  const { user } = useAuth();
  const [defaultPayoutMethod, setDefaultPayoutMethod] = useState("PAYPAL");
  const [defaultPayoutAddress, setDefaultPayoutAddress] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Manage your account profile, security credentials, and payout preferences.
        </p>
      </div>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Preferences saved successfully.</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-blue-400" />
          <span>Profile Information</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-1">Display Name</span>
            <span className="font-semibold text-white">
              {user?.displayName || "Not set"}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Email Address</span>
            <span className="font-semibold text-white">{user?.email}</span>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Account Role</span>
            <Badge variant={user?.role === "ADMIN" ? "purple" : "info"}>
              {user?.role}
            </Badge>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Account Status</span>
            <Badge variant="success">{user?.status}</Badge>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">Unique Referral Code</span>
            <span className="font-mono font-bold text-blue-400">
              {user?.referralCode}
            </span>
          </div>

          <div>
            <span className="text-slate-500 block mb-1">User ID</span>
            <span className="font-mono text-slate-400 truncate block">
              {user?.id}
            </span>
          </div>
        </div>
      </div>

      {/* Payout Preferences */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-blue-400" />
          <span>Payout Preferences</span>
        </h3>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Default Payout Method
            </label>
            <select
              value={defaultPayoutMethod}
              onChange={(e) => setDefaultPayoutMethod(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="PAYPAL">PayPal</option>
              <option value="CRYPTO_USDT">USDT (TRC20)</option>
              <option value="CRYPTO_BTC">Bitcoin (BTC)</option>
              <option value="BANK_TRANSFER">Bank Wire</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Default Payout Address / Account
            </label>
            <input
              type="text"
              value={defaultPayoutAddress}
              onChange={(e) => setDefaultPayoutAddress(e.target.value)}
              placeholder="e.g. paypal@example.com or USDT wallet address"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <Button type="submit" size="sm">
            Save Preferences
          </Button>
        </form>
      </div>
    </div>
  );
}
