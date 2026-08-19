"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CreditCard,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

export default function WithdrawalsPage() {
  const [balances, setBalances] = useState<any>(null);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [amount, setAmount] = useState("");
  const [payoutMethod, setPayoutMethod] = useState("PAYPAL");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      fetch("/api/v1/earnings").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/v1/withdrawals").then((r) => (r.ok ? r.json() : null)),
    ])
      .then(([earnings, withRes]) => {
        if (earnings) setBalances(earnings.balances);
        if (withRes) setWithdrawals(withRes.withdrawals || []);
      })
      .catch((err) => console.error("Withdrawals fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/v1/withdrawals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          payoutMethod,
          payoutDetails: {
            address: recipientAddress,
            notes,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit withdrawal request");
      }

      setSuccess("Withdrawal request submitted successfully! An administrator will review and process your payout.");
      setAmount("");
      setRecipientAddress("");
      setNotes("");
      fetchData();
    } catch (err: any) {
      setError(err.message || "Failed to submit withdrawal request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const available = Number(balances?.availableBalance || "0");
  const minWithdrawal = 10.0;
  const canWithdraw = available >= minWithdrawal;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <Badge variant="success">Paid</Badge>;
      case "PROCESSING":
        return <Badge variant="purple">Processing</Badge>;
      case "APPROVED":
        return <Badge variant="info">Approved</Badge>;
      case "PENDING":
        return <Badge variant="warning">Pending Review</Badge>;
      case "REJECTED":
        return <Badge variant="danger">Rejected</Badge>;
      case "CANCELLED":
        return <Badge variant="default">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Withdrawals & Payouts
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Request real payouts of your confirmed earnings. Minimum threshold: $10.00.
        </p>
      </div>

      {/* Balance Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Available for Withdrawal"
          value={formatCurrency(balances?.availableBalance || "0.00")}
          subtitle={
            canWithdraw
              ? "Eligible for immediate payout request"
              : `Minimum $${minWithdrawal.toFixed(2)} required`
          }
          icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
          highlight={true}
        />

        <StatCard
          title="Pending Earnings"
          value={formatCurrency(balances?.pendingBalance || "0.00")}
          subtitle="Awaiting qualification review"
          icon={<Clock className="w-5 h-5 text-amber-400" />}
        />

        <StatCard
          title="Total Paid Out"
          value={formatCurrency(balances?.totalWithdrawn || "0.00")}
          subtitle="Completed lifetime payouts"
          icon={<CheckCircle2 className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* Withdrawal Request Form */}
      <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-400" />
          <span>Submit Payout Request</span>
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          Payouts are manually verified and processed by administrators to protect network security.
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleWithdrawSubmit} className="space-y-4 max-w-xl">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Withdrawal Amount ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              min={minWithdrawal}
              max={available}
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder={`Min $${minWithdrawal.toFixed(2)}`}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Payout Method
            </label>
            <select
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-sm focus:outline-none focus:border-blue-500"
            >
              <option value="PAYPAL">PayPal (Email)</option>
              <option value="CRYPTO_USDT">USDT (TRC20 / ERC20)</option>
              <option value="CRYPTO_BTC">Bitcoin (BTC)</option>
              <option value="BANK_TRANSFER">Bank Wire Transfer</option>
              <option value="OTHER">Other Method</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Recipient Account / Wallet Address
            </label>
            <input
              type="text"
              required
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder={
                payoutMethod === "PAYPAL"
                  ? "your-paypal@email.com"
                  : payoutMethod.startsWith("CRYPTO")
                  ? "Enter crypto wallet address"
                  : "Account / Routing / IBAN info"
              }
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional payout instructions..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <Button
            type="submit"
            disabled={!canWithdraw}
            loading={submitting}
            className="w-full sm:w-auto mt-2"
          >
            <span>Request Payout</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>

          {!canWithdraw && (
            <p className="text-xs text-amber-400 mt-2">
              You need at least ${minWithdrawal.toFixed(2)} in available balance to request a payout.
            </p>
          )}
        </form>
      </div>

      {/* Withdrawal History Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4">
          Withdrawal History
        </h3>

        {withdrawals.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-6 h-6" />}
            title="No withdrawal requests yet"
            description="When you request payouts, their real status and tracking details will be listed here."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-3">Date Requested</th>
                  <th className="py-3 px-3">Amount</th>
                  <th className="py-3 px-3">Method</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Admin Notes</th>
                  <th className="py-3 px-3">Processed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {withdrawals.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3 text-slate-400">
                      {formatDate(w.requestedAt)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white">
                      {formatCurrency(w.amount)}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono text-slate-300">
                        {w.payoutMethod}
                      </span>
                    </td>
                    <td className="py-3 px-3">{getStatusBadge(w.status)}</td>
                    <td className="py-3 px-3 text-slate-400 max-w-[200px] truncate">
                      {w.adminNote || w.rejectionReason || "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {w.processedAt ? formatDate(w.processedAt) : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
