"use client";

import React, { useState } from "react";
import { Button } from "../ui/Button";
import { useAuth } from "./AuthContext";
import { useToast } from "../ui/ToastContext";
import { parseResponseJson } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AlertTriangle, X, Trash2 } from "lucide-react";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({ isOpen, onClose }: DeleteAccountModalProps) {
  const [confirmation, setConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  if (!isOpen) return null;

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmation !== "DELETE") {
      setError("Please type DELETE in all capitals to confirm.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/v1/auth/delete-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const { ok, error: delErr } = await parseResponseJson(res);
      if (!ok) {
        throw new Error(delErr || "Failed to delete account.");
      }

      toast.success("Your account and all associated files have been permanently deleted.");
      onClose();
      await logout();
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Failed to delete account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-account-title"
    >
      <div className="relative w-full max-w-md rounded-3xl glass-card p-6 sm:p-8 shadow-2xl border border-red-500/30">
        <button
          onClick={onClose}
          aria-label="Cancel"
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h3 id="delete-account-title" className="text-xl font-bold text-white">
          Delete Account Permanently?
        </h3>

        <p className="text-xs text-slate-300 mt-2 leading-relaxed">
          This action is <strong>irreversible</strong>. Deleting your account will immediately remove all your uploaded files from storage, invalidate existing download links, and erase your ledger history.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleDelete} className="space-y-4 mt-6">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Type <span className="font-mono font-bold text-red-400">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              required
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder="DELETE"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-600 text-sm font-mono focus:outline-none focus:border-red-500 transition-colors"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="danger"
              size="sm"
              loading={loading}
              disabled={confirmation !== "DELETE"}
            >
              <Trash2 className="w-4 h-4 mr-1.5" />
              <span>Delete Permanently</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
