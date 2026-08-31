import React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "animate-pulse rounded-xl bg-slate-800/80 border border-slate-700/40",
        className
      )}
      {...props}
    />
  );
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24 rounded-lg" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32 rounded-lg" />
      <Skeleton className="h-3 w-40 rounded-lg" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="border-b border-slate-800/80 animate-pulse">
      {Array.from({ length: cols }, (_, i) => (
        <td key={i} className="py-4 px-4">
          <Skeleton className="h-4 w-full max-w-[120px] rounded-md" />
        </td>
      ))}
    </tr>
  );
}

export function FileListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="p-4 rounded-2xl glass-card border border-slate-800 flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3.5">
            <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-3 w-24 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-8 w-24 rounded-xl shrink-0" />
        </div>
      ))}
    </div>
  );
}
