"use client"

import { useState } from "react"
import { X, Shield, Loader2, AlertTriangle } from "lucide-react"

type RoleOption = {
  value: string
  label: string
  description: string
}

const ROLE_OPTIONS: RoleOption[] = [
  { value: "teacher", label: "Teacher", description: "Can create tasks, assignments, and learning roadmaps" },
  { value: "counselor", label: "Counselor", description: "Can provide student support and guidance" },
  { value: "generalLeader", label: "General Leader", description: "Can post announcements and manage blog content" },
  { value: "admin", label: "Admin", description: "Full system control including user and role management" },
]

type UserForModal = {
  id: string
  name: string
  email: string
  currentRoles: string[]
  isSuper: boolean
}

type RoleChangeModalProps = {
  user: UserForModal
  isOpen: boolean
  onClose: () => void
  onRoleChange: (userId: string, role: string, action: "assign" | "remove") => Promise<void>
}

export const RoleChangeModal = ({ user, isOpen, onClose, onRoleChange }: RoleChangeModalProps) => {
  const [pendingChanges, setPendingChanges] = useState<Record<string, "assign" | "remove">>({})
  const [saving, setSaving] = useState(false)
  const [confirmAdmin, setConfirmAdmin] = useState<"assign" | "remove" | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null)

  if (!isOpen) return null

  const hasRole = (role: string) => {
    if (pendingChanges[role] === "assign") return true
    if (pendingChanges[role] === "remove") return false
    return user.currentRoles.includes(role)
  }

  const handleToggleRole = (role: string) => {
    if (user.isSuper && role === "admin") return

    const currently = user.currentRoles.includes(role)
    const pending = pendingChanges[role]

    if (role === "admin") {
      if (currently && !pending) {
        setConfirmAdmin("remove")
        return
      }
      if (!currently && !pending) {
        setConfirmAdmin("assign")
        return
      }
    }

    setPendingChanges((prev) => {
      const next = { ...prev }
      if (currently) {
        if (pending === "remove") {
          delete next[role]
        } else {
          next[role] = "remove"
        }
      } else {
        if (pending === "assign") {
          delete next[role]
        } else {
          next[role] = "assign"
        }
      }
      return next
    })
  }

  const handleConfirmAdmin = () => {
    if (!confirmAdmin) return
    setPendingChanges((prev) => ({ ...prev, admin: confirmAdmin }))
    setConfirmAdmin(null)
  }

  const handleSave = async () => {
    const changes = Object.entries(pendingChanges)
    if (changes.length === 0) {
      onClose()
      return
    }

    setSaving(true)
    setFeedback(null)

    try {
      for (const [role, action] of changes) {
        await onRoleChange(user.id, role, action)
      }
      setFeedback({ type: "success", message: "Roles updated successfully" })
      setPendingChanges({})
      setTimeout(onClose, 800)
    } catch {
      setFeedback({ type: "error", message: "Failed to update roles. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const hasPendingChanges = Object.keys(pendingChanges).length > 0

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-modal-title"
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close modal"
          tabIndex={0}
        >
          <X className="h-5 w-5" />
        </button>

        <h2 id="role-modal-title" className="text-lg font-bold text-slate-900">
          Manage Roles
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {user.name} &middot; {user.email}
        </p>

        {user.isSuper && (
          <div className="mt-3 flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            <Shield className="h-3.5 w-3.5" />
            Super Admin — Admin role cannot be removed
          </div>
        )}

        {feedback && (
          <div
            role="alert"
            className={`mt-3 rounded-xl border px-4 py-2.5 text-sm font-medium ${
              feedback.type === "success"
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {feedback.message}
          </div>
        )}

        <div className="mt-5 space-y-3">
          {ROLE_OPTIONS.map((option) => {
            const active = hasRole(option.value)
            const isLocked = user.isSuper && option.value === "admin"
            const isPending = !!pendingChanges[option.value]

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggleRole(option.value)}
                disabled={isLocked || saving}
                className={`flex w-full items-start gap-4 rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                  active
                    ? "border-blue-500 bg-blue-50/50"
                    : "border-slate-200 bg-white hover:border-slate-300"
                } ${isLocked ? "cursor-not-allowed opacity-60" : ""} ${isPending ? "ring-2 ring-amber-300 ring-offset-1" : ""}`}
                tabIndex={0}
                aria-label={`${active ? "Remove" : "Assign"} ${option.label} role`}
                aria-pressed={active}
              >
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 ${
                  active ? "border-blue-500 bg-blue-500" : "border-slate-300"
                }`}>
                  {active && (
                    <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{option.label}</span>
                    {isPending && (
                      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
                        {pendingChanges[option.value] === "assign" ? "ADDING" : "REMOVING"}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">{option.description}</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50"
            tabIndex={0}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasPendingChanges}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
            tabIndex={0}
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>

        {confirmAdmin !== null && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
            <div
              className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  {confirmAdmin === "assign" ? "Promote to Admin?" : "Remove Admin Role?"}
                </h3>
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {confirmAdmin === "assign"
                  ? `This will give ${user.name} full system control including user management, role assignment, and platform oversight.`
                  : `This will revoke ${user.name}'s admin privileges. They will lose access to admin features.`}
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmAdmin(null)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700"
                  tabIndex={0}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAdmin}
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white ${
                    confirmAdmin === "assign" ? "bg-blue-600 hover:bg-blue-700" : "bg-red-600 hover:bg-red-700"
                  }`}
                  tabIndex={0}
                >
                  {confirmAdmin === "assign" ? "Promote" : "Remove"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
