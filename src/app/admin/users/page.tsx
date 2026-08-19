"use client";

import React, { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  Users,
  Search,
  Shield,
  ShieldAlert,
  UserX,
  UserCheck,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchUsers = (page = 1, searchQuery = search, roleQ = role, statusQ = status) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: "15",
    });
    if (searchQuery) params.append("search", searchQuery);
    if (roleQ && roleQ !== "all") params.append("role", roleQ);
    if (statusQ && statusQ !== "all") params.append("status", statusQ);

    fetch(`/api/v1/admin/users?${params.toString()}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setUsers(data.users || []);
          setTotalCount(data.totalCount || 0);
          setTotalPages(data.totalPages || 1);
          setCurrentPage(data.currentPage || 1);
        }
      })
      .catch((err) => console.error("Admin users fetch error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers(1, search, role, status);
  }, [role, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1, search, role, status);
  };

  const handleAction = async (
    userId: string,
    action: "SUSPEND" | "BAN" | "ACTIVATE" | "MAKE_ADMIN" | "REMOVE_ADMIN"
  ) => {
    setActionLoadingId(userId);
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        fetchUsers(currentPage, search, role, status);
      }
    } catch (err) {
      console.error("Admin user action error:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          User Account Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search user accounts, review roles, manage permissions, and enforce moderation.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-slate-800">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by email, name, or referral code..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="BANNED">Banned</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-2xl glass-card p-6 border border-slate-800">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : users.length === 0 ? (
          <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No users found"
            description="No user records match your search or filter parameters."
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">User / Email</th>
                    <th className="py-3 px-3">Role</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Files</th>
                    <th className="py-3 px-3">Withdrawals</th>
                    <th className="py-3 px-3">Referral Code</th>
                    <th className="py-3 px-3">Joined Date</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-medium text-white max-w-[200px]">
                        <span className="block truncate">
                          {u.displayName || "Anonymous"}
                        </span>
                        <span className="text-[11px] text-slate-500 block truncate">
                          {u.email}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <Badge variant={u.role === "ADMIN" ? "purple" : "default"}>
                          {u.role}
                        </Badge>
                      </td>

                      <td className="py-3 px-3">
                        {u.status === "ACTIVE" ? (
                          <Badge variant="success">Active</Badge>
                        ) : u.status === "SUSPENDED" ? (
                          <Badge variant="warning">Suspended</Badge>
                        ) : (
                          <Badge variant="danger">Banned</Badge>
                        )}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {u.totalFiles}
                      </td>

                      <td className="py-3 px-3 font-semibold text-slate-200">
                        {u.totalWithdrawals}
                      </td>

                      <td className="py-3 px-3 font-mono font-bold text-blue-400">
                        {u.referralCode}
                      </td>

                      <td className="py-3 px-3 text-slate-400">
                        {formatDate(u.createdAt)}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {u.role === "USER" ? (
                            <button
                              onClick={() => handleAction(u.id, "MAKE_ADMIN")}
                              disabled={actionLoadingId === u.id}
                              className="p-1.5 rounded-lg text-purple-400 hover:bg-slate-800"
                              title="Promote to Admin"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(u.id, "REMOVE_ADMIN")}
                              disabled={actionLoadingId === u.id}
                              className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
                              title="Remove Admin Role"
                            >
                              <ShieldAlert className="w-4 h-4" />
                            </button>
                          )}

                          {u.status === "ACTIVE" ? (
                            <button
                              onClick={() => handleAction(u.id, "SUSPEND")}
                              disabled={actionLoadingId === u.id}
                              className="p-1.5 rounded-lg text-amber-400 hover:bg-slate-800"
                              title="Suspend User"
                            >
                              <UserX className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleAction(u.id, "ACTIVATE")}
                              disabled={actionLoadingId === u.id}
                              className="p-1.5 rounded-lg text-emerald-400 hover:bg-slate-800"
                              title="Activate User"
                            >
                              <UserCheck className="w-4 h-4" />
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
                    onClick={() => fetchUsers(currentPage - 1)}
                  >
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    onClick={() => fetchUsers(currentPage + 1)}
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
    </div>
  );
}
