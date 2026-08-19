"use client";

import React, { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  CreditCard,
  CheckCircle,
  Play,
  XCircle,
  CheckCheck,
  AlertCircle,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminWithdrawalsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState("ALL");
  const [loading, setLoading] = useState(true);

  const [selectedWithdrawal, setSelectedWithdrawal] = useState<any | null>(null);
  const [modalAction, setModalAction] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWithdrawals = (page = 1, statusFilter = status) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
    });
    if (statusFilter && statusFilter !== "ALL") params.append("status", statusFilter);

    fetch(`/api/v1/admin/withdrawals?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setWithdrawals(data.withdrawals || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      })
      .catch((err) => console.error("Admin withdrawals fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWithdrawals(1, status);
  }, [status]);

  const handleExecuteAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWithdrawal || !modalAction) return;

    setActionLoading(true);
    try {
      const res = await fetch(
        `/api/v1/admin/withdrawals/${selectedWithdrawal.id}/action`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: modalAction,
            note,
            rejectionReason,
          }),
        }
      );

      if (res.ok) {
        setSelectedWithdrawal(null);
        setModalAction(null);
        setNote("");
        setRejectionReason("");
        fetchWithdrawals(currentPage, status);
      }
    } catch (err) {
      console.error("Action error:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
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
        return <Badge>{s}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Withdrawal Requests & Payout Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Review withdrawal requests, verify recipient details, and update actual payout states.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl">
        {["ALL", "PENDING", "APPROVED", "PROCESSING", "PAID", "REJECTED"].map((st) => (
          <button
            key={st}
            onClick={() => setStatus(st)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors ${
              status === st
                ? "bg-purple-600 text-white shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Table Section */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : withdrawals.length === 0 ? (
          <EmptyState
            icon={<CreditCard className="w-6 h-6" />}
            title="No withdrawal requests"
            description="There are no payout requests matching the selected status filter."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3">User</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Method</th>
                    <th className="py-3 px-3">Details</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {withdrawals.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 text-slate-400">
                        {formatDate(w.requestedAt)}
                      </td>

                      <td className="py-3 px-3 max-w-[150px] truncate font-medium text-white">
                        {w.user?.email || "Unknown User"}
                      </td>

                      <td className="py-3 px-3 font-bold text-emerald-400">
                        {formatCurrency(w.amount)}
                      </td>

                      <td className="py-3 px-3 font-mono">{w.payoutMethod}</td>

                      <td className="py-3 px-3 max-w-[200px] truncate font-mono text-[11px] text-slate-400">
                        {w.payoutDetails?.address || JSON.stringify(w.payoutDetails)}
                      </td>

                      <td className="py-3 px-3">{getStatusBadge(w.status)}</td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {w.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => {
                                  setSelectedWithdrawal(w);
                                  setModalAction("APPROVE");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 font-medium"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedWithdrawal(w);
                                  setModalAction("REJECT");
                                }}
                                className="px-2.5 py-1 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 font-medium"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {w.status === "APPROVED" && (
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(w);
                                setModalAction("START_PROCESSING");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 font-medium"
                            >
                              Process
                            </button>
                          )}

                          {w.status === "PROCESSING" && (
                            <button
                              onClick={() => {
                                setSelectedWithdrawal(w);
                                setModalAction("MARK_PAID");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30 font-medium"
                            >
                              Mark Paid
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span>
                  Page {currentPage} of {totalPages} ({totalCount} total)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    onClick={() => fetchWithdrawals(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchWithdrawals(currentPage + 1)}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Modal */}
      {selectedWithdrawal && modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass-card p-6 border border-slate-700 space-y-4">
            <h3 className="text-lg font-bold text-white">
              Confirm Action: {modalAction}
            </h3>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs space-y-1">
              <div>
                <span className="text-slate-500">Requester: </span>
                <span className="text-white font-medium">{selectedWithdrawal.user?.email}</span>
              </div>
              <div>
                <span className="text-slate-500">Amount: </span>
                <span className="text-emerald-400 font-bold">
                  {formatCurrency(selectedWithdrawal.amount)}
                </span>
              </div>
              <div>
                <span className="text-slate-500">Method: </span>
                <span className="text-slate-200">{selectedWithdrawal.payoutMethod}</span>
              </div>
              <div>
                <span className="text-slate-500">Destination: </span>
                <span className="font-mono text-blue-400">
                  {selectedWithdrawal.payoutDetails?.address}
                </span>
              </div>
            </div>

            {modalAction === "REJECT" && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Rejection Reason (Refunds balance to user)
                </label>
                <textarea
                  required
                  rows={2}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. Invalid wallet address or suspicious activity"
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Admin Note / Transaction Ref (Optional)
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. PayPal TX #12345 or Blockchain TxHash"
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedWithdrawal(null);
                  setModalAction(null);
                }}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                variant={modalAction === "REJECT" ? "danger" : "primary"}
                loading={actionLoading}
                onClick={handleExecuteAction}
              >
                Confirm {modalAction}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
