import React from "react";
import Link from "next/link";
import { FileUp, ShieldCheck, Zap, DollarSign, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60 pt-14 pb-10 text-sm text-slate-600 dark:text-slate-400 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20">
                <FileUp className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                Drop<span className="text-blue-600 dark:text-blue-500">Earn</span>
              </span>
            </Link>

            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              The honest, transparent file monetization platform for software authors, modders, and digital creators. Upload files, share links, and earn 70% direct revenue shares from qualified downloads.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span>Verified Anti-Fraud</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-500" />
                <span>Instant Payouts</span>
              </span>
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                <span>70% Creator Share</span>
              </span>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/upload" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Upload Files
                </Link>
              </li>
              <li>
                <Link href="/rates" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  CPM Payout Rates
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/withdraw" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Earnings & Payouts
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Trust & Security
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Content & DMCA Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Privacy & Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-blue-600 dark:hover:text-white transition-colors">
                  Anti-Fraud Guidelines
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-400 dark:text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-200 dark:border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} DropEarn. Built for creators worldwide.</p>
          <p className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for independent developers & creators</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
