import React from "react";
import Link from "next/link";
import { FileUp, Shield, Lock, DollarSign } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950/60 pt-12 pb-8 text-sm text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <FileUp className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Drop<span className="text-blue-500">Earn</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-4">
              DropEarn is a transparent, legitimate monetized file sharing platform.
              Upload files, generate secure links, and earn real revenue shares from
              qualified downloads.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-blue-400" /> Real Data Only
              </span>
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-400" /> S3 Encrypted
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-purple-400" /> Immutable Ledger
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/upload" className="hover:text-white transition-colors">
                  Upload File
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  User Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/withdraw" className="hover:text-white transition-colors">
                  Withdrawals
                </Link>
              </li>
              <li>
                <Link href="/dashboard/referrals" className="hover:text-white transition-colors">
                  Referral Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="text-slate-500">DMCA & Abuse Policy</span>
              </li>
              <li>
                <span className="text-slate-500">Privacy & Terms</span>
              </li>
              <li>
                <span className="text-slate-500">Anti-Fraud Guidelines</span>
              </li>
              <li>
                <Link href="/admin" className="text-slate-600 hover:text-slate-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DropEarn. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">
            Powered by PostgreSQL, Prisma, Redis, & S3 Storage.
          </p>
        </div>
      </div>
    </footer>
  );
}
