"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldAlert,
  BarChart3,
  Users,
  FolderOpen,
  DollarSign,
  CreditCard,
  Settings,
  History,
  Eye,
  ArrowLeft,
  Megaphone,
  DownloadCloud,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: BarChart3, exact: true },
  { href: "/admin/revenue", label: "Revenue Analytics", icon: DollarSign },
  { href: "/admin/ads", label: "Ad Management", icon: Megaphone },
  { href: "/admin/visitors", label: "Visitor Traffic", icon: Eye },
  { href: "/admin/downloads", label: "Downloads Audit", icon: DownloadCloud },
  { href: "/admin/files", label: "File Management", icon: FolderOpen },
  { href: "/admin/users", label: "User Management", icon: Users },
  { href: "/admin/withdrawals", label: "Withdrawals", icon: CreditCard },
  { href: "/admin/reports", label: "Reports Moderation", icon: ShieldAlert },
  { href: "/admin/settings", label: "Platform Settings", icon: Settings },
  { href: "/admin/audit-logs", label: "Audit Logs", icon: History },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full lg:w-64 shrink-0">
      <div className="rounded-2xl glass-card p-4 space-y-6 sticky top-24 border-purple-500/20">
        {/* Admin Badge Header */}
        <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-purple-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400">
              Admin Portal
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>User View</span>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-purple-500/20 text-purple-300 border border-purple-500/30 shadow-sm font-semibold"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                <Icon
                  className={cn("w-4 h-4", isActive ? "text-purple-400" : "text-slate-500")}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
