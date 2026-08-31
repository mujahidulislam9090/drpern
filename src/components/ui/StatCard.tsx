import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  trendPositive?: boolean;
  className?: string;
  highlight?: boolean;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive,
  className,
  highlight = false,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl p-6 transition-all duration-200 shadow-md",
        highlight
          ? "bg-blue-50 dark:bg-gradient-to-br dark:from-blue-900/40 dark:via-slate-900 dark:to-slate-900 border border-blue-200 dark:border-blue-500/30 shadow-blue-500/5"
          : "glass-card hover:border-slate-300 dark:hover:border-slate-700",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{title}</p>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700/50 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white font-mono">{value}</h3>
        {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</p>}
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5 text-xs">
          <span
            className={cn(
              "font-semibold",
              trendPositive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  );
}
