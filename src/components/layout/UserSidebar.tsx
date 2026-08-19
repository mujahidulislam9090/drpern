"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../auth/AuthContext";
import {
  LayoutDashboard,
  User,
  FolderOpen,
  Upload,
  Download,
  DollarSign,
  TrendingUp,
  CreditCard,
  Users,
  Settings,
  Shield,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/files", label: "My Files", icon: FolderOpen },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/downloads", label: "Downloads", icon: Download },
  { href: "/dashboard/earnings", label: "Earnings", icon: DollarSign },
  { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/dashboard/withdrawals", label: "Withdrawals", icon: CreditCard },
  { href: "/dashboard/referrals", label: "Referrals", icon: Users },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function UserSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-2xl glass-card p-4 space-y-6 sticky top-24 border border-slate-800">
        {/* Quick Upload CTA */}
        <Link
          href="/dashboard/upload"
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </Link>

        {/* Navigation List */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href ||
                (item.href === "/dashboard/withdrawals" && pathname === "/dashboard/withdraw");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-blue-500/15 text-blue-400 border border-blue-500/30 shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-blue-400" : "text-slate-500")} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          {/* Admin Panel Link - ONLY visible to ADMIN users */}
          {isAdmin && (
            <div className="pt-2">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-purple-400 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 transition-all shadow-sm"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Panel</span>
              </Link>
            </div>
          )}
        </nav>

        {/* Sign Out CTA */}
        <div className="pt-4 border-t border-slate-800/80">
          <button
            onClick={() => logout()}
            className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
