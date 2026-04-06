"use client"

import { useState, useMemo } from "react"
import { Users, Search, Settings2, Shield, Loader2 } from "lucide-react"
import { RoleChangeModal } from "./role-change-modal"

type UserRoleInfo = {
  role: string
  organizationId: string
  organizationName: string
}

type ManagedUser = {
  id: string
  name: string
  email: string
  role: string
  organizationRoles: UserRoleInfo[]
  isSuper: boolean
  createdAt: string
}

type UserManagementPanelProps = {
  initialUsers: ManagedUser[]
}

const ROLE_BADGE_COLORS: Record<string, string> = {
  teacher: "bg-indigo-50 text-indigo-700",
  counselor: "bg-teal-50 text-teal-700",
  generalLeader: "bg-amber-50 text-amber-700",
  admin: "bg-red-50 text-red-700",
  owner: "bg-red-50 text-red-700",
}

const ROLE_DISPLAY: Record<string, string> = {
  teacher: "Teacher",
  counselor: "Counselor",
  generalLeader: "General Leader",
  admin: "Admin",
  owner: "Admin",
}

export const UserManagementPanel = ({ initialUsers }: UserManagementPanelProps) => {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers)
  const [search, setSearch] = useState("")
  const [roleTarget, setRoleTarget] = useState<ManagedUser | null>(null)
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null)

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return users
    const q = search.toLowerCase()
    return users.filter(
      (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }, [users, search])

  const handleRoleChange = async (userId: string, role: string, action: "assign" | "remove") => {
    const res = await fetch(`/api/v1/admin/users/${userId}/role`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role, action }),
    })

    if (!res.ok) {
      const data = await res.json()
      throw new Error(data.error || "Failed to update role")
    }

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id !== userId) return u
        const orgRoles = [...u.organizationRoles]
        if (action === "assign") {
          if (!orgRoles.some((r) => r.role === role)) {
            orgRoles.push({ role, organizationId: "", organizationName: "" })
          }
        } else {
          const idx = orgRoles.findIndex((r) => r.role === role)
          if (idx >= 0) orgRoles.splice(idx, 1)
        }
        return {
          ...u,
          organizationRoles: orgRoles,
          role: role === "admin"
            ? action === "assign" ? "admin" : "user"
            : u.role,
        }
      }),
    )

    setFeedback({ type: "success", message: `Role updated for user` })
    setTimeout(() => setFeedback(null), 3000)
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })

  const getUserRoleBadges = (user: ManagedUser) => {
    const roles = user.organizationRoles
      .map((r) => r.role)
      .filter((r, i, arr) => arr.indexOf(r) === i)

    return roles
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Users className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">No Users</h3>
        <p className="mt-1 text-sm text-slate-500">Approved users will appear here.</p>
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

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
            aria-label="Search users"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3.5 font-semibold text-slate-600">Name</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Email</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Roles</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Joined</th>
                <th className="px-6 py-3.5 font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => {
                const roleBadges = getUserRoleBadges(user)

                return (
                  <tr
                    key={user.id}
                    className="border-b border-slate-100 transition-colors last:border-0 hover:bg-slate-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-900">{user.name}</span>
                        {user.isSuper && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                            <Shield className="h-2.5 w-2.5" />
                            SUPER
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                          Student
                        </span>
                        {roleBadges.map((role) => (
                          <span
                            key={role}
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              ROLE_BADGE_COLORS[role] ?? "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {ROLE_DISPLAY[role] ?? role}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-500">
                      {formatDate(user.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setRoleTarget(user)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200"
                        tabIndex={0}
                        aria-label={`Manage roles for ${user.name}`}
                      >
                        <Settings2 className="h-3.5 w-3.5" />
                        Manage Roles
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && search.trim() && (
          <div className="px-6 py-8 text-center text-sm text-slate-500">
            No users match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>

      {roleTarget && (
        <RoleChangeModal
          user={{
            id: roleTarget.id,
            name: roleTarget.name,
            email: roleTarget.email,
            currentRoles: roleTarget.organizationRoles.map((r) => r.role),
            isSuper: roleTarget.isSuper,
          }}
          isOpen={roleTarget !== null}
          onClose={() => setRoleTarget(null)}
          onRoleChange={handleRoleChange}
        />
      )}
    </div>
  )
}
