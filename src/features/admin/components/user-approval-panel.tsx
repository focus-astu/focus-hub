"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Users, Loader2 } from "lucide-react"
import { RejectReasonModal } from "./reject-reason-modal"

type PendingUser = {
  id: string
  name: string
  email: string
  universityId: string
  year: number
  department: string | null
  createdAt: string
}

type UserApprovalPanelProps = {
  initialUsers: PendingUser[]
}

export const UserApprovalPanel = ({ initialUsers }: UserApprovalPanelProps) => {
  const [users, setUsers] = useState<PendingUser[]>(initialUsers)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const [rejectTarget, setRejectTarget] = useState<PendingUser | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null)

  const handleApprove = async (userId: string) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }))
    setFeedback(null)

    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      if (!res.ok) {
        const data = await res.json()
        setFeedback({ type: "error", message: data.error || "Failed to approve user" })
        return
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setFeedback({ type: "success", message: "User approved successfully" })
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." })
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const handleReject = async (userId: string, reason: string) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }))
    setFeedback(null)

    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject", reason }),
      })

      if (!res.ok) {
        const data = await res.json()
        setFeedback({ type: "error", message: data.error || "Failed to reject user" })
        return
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId))
      setRejectTarget(null)
      setFeedback({ type: "success", message: "User rejected" })
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." })
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">No Pending Users</h3>
        <p className="mt-1 text-sm text-slate-500">All user accounts have been reviewed.</p>
      </div>
    )
  }

  return (
    <div>
      {feedback && (
        <div
          role="alert"
          className={`mb-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          {feedback.message}
        </div>
      )}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3.5 font-semibold text-slate-600">Name</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Email</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">University ID</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Year</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Department</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Registered</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                >
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-slate-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 font-mono text-sm text-slate-600">
                    {user.universityId}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    Year {user.year}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                    {user.department || "—"}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleApprove(user.id)}
                        disabled={actionLoading[user.id]}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50"
                        tabIndex={0}
                        aria-label={`Approve ${user.name}`}
                      >
                        {actionLoading[user.id] ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <CheckCircle className="h-3.5 w-3.5" />
                        )}
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectTarget(user)}
                        disabled={actionLoading[user.id]}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition-all hover:bg-red-100 disabled:opacity-50"
                        tabIndex={0}
                        aria-label={`Reject ${user.name}`}
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-slate-900">{user.name}</p>
                <p className="mt-0.5 truncate text-sm text-slate-500">{user.email}</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm">
              <div>
                <span className="text-xs text-slate-400">ID</span>
                <p className="font-mono text-slate-700">{user.universityId}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Year</span>
                <p className="text-slate-700">Year {user.year}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Department</span>
                <p className="text-slate-700">{user.department || "—"}</p>
              </div>
              <div>
                <span className="text-xs text-slate-400">Registered</span>
                <p className="text-slate-700">{formatDate(user.createdAt)}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={() => handleApprove(user.id)}
                disabled={actionLoading[user.id]}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 transition-all hover:bg-emerald-100 disabled:opacity-50"
                tabIndex={0}
                aria-label={`Approve ${user.name}`}
              >
                {actionLoading[user.id] ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4" />
                )}
                Approve
              </button>
              <button
                type="button"
                onClick={() => setRejectTarget(user)}
                disabled={actionLoading[user.id]}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-700 transition-all hover:bg-red-100 disabled:opacity-50"
                tabIndex={0}
                aria-label={`Reject ${user.name}`}
              >
                <XCircle className="h-4 w-4" />
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <RejectReasonModal
        userName={rejectTarget?.name ?? ""}
        isOpen={rejectTarget !== null}
        onClose={() => setRejectTarget(null)}
        onConfirm={(reason) => {
          if (rejectTarget) handleReject(rejectTarget.id, reason)
        }}
        isLoading={rejectTarget ? actionLoading[rejectTarget.id] ?? false : false}
      />
    </div>
  )
}
