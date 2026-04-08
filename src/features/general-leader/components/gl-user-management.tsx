"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, UserPlus, UserMinus, Loader2, Shield } from "lucide-react"

type UserInfo = {
  id: string
  name: string
  email: string
  organizationRoles: { role: string, organizationName: string }[]
  isSuper: boolean
}

export const GLUserManagement = () => {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({})
  const [error, setError] = useState("")

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/admin/users?filter=all")
      if (!res.ok) throw new Error("Failed to fetch users")
      const data = await res.json()
      setUsers(data.users ?? data)
    } catch {
      setError("Failed to load users")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const isGL = (user: UserInfo) =>
    user.organizationRoles.some((r) => r.role === "generalLeader" || r.organizationName === "General Leaders")

  const handleToggleRole = async (userId: string, hasRole: boolean) => {
    setActionLoading((prev) => ({ ...prev, [userId]: true }))
    setError("")

    try {
      const res = await fetch(`/api/v1/general-leader/users/${userId}/role`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: hasRole ? "remove" : "assign" }),
      })

      if (!res.ok) {
        const data = await res.json()
        const msg = typeof data.error === "string" ? data.error : "Failed to update role"
        setError(msg)
        return
      }

      await fetchUsers()
    } catch {
      setError("Connection error")
    } finally {
      setActionLoading((prev) => ({ ...prev, [userId]: false }))
    }
  }

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="mt-1 text-sm text-slate-500">Assign or remove the General Leader role</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search users by name or email…"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
          aria-label="Search users"
        />
      </div>

      {error && (
        <div className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700" role="alert">
          {error}
        </div>
      )}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="px-6 py-3 font-semibold text-slate-600">Name</th>
              <th className="px-6 py-3 font-semibold text-slate-600">Email</th>
              <th className="px-6 py-3 font-semibold text-slate-600">GL Status</th>
              <th className="px-6 py-3 text-right font-semibold text-slate-600">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => {
              const hasGL = isGL(user)
              return (
                <tr key={user.id} className="border-b border-slate-50 transition-colors hover:bg-slate-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{user.name}</span>
                      {user.isSuper && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                          <Shield className="h-2.5 w-2.5" /> SUPER
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.email}</td>
                  <td className="px-6 py-4">
                    {hasGL ? (
                      <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                        General Leader
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggleRole(user.id, hasGL)}
                      disabled={actionLoading[user.id]}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                        hasGL
                          ? "bg-red-50 text-red-700 hover:bg-red-100"
                          : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                      }`}
                      tabIndex={0}
                      aria-label={hasGL ? `Remove GL role from ${user.name}` : `Assign GL role to ${user.name}`}
                    >
                      {actionLoading[user.id] ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : hasGL ? (
                        <UserMinus className="h-3.5 w-3.5" />
                      ) : (
                        <UserPlus className="h-3.5 w-3.5" />
                      )}
                      {hasGL ? "Remove" : "Assign"}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="space-y-3 md:hidden">
        {filteredUsers.map((user) => {
          const hasGL = isGL(user)
          return (
            <div key={user.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-slate-900">{user.name}</span>
                    {user.isSuper && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                        <Shield className="h-2.5 w-2.5" /> SUPER
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-slate-500">{user.email}</p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleRole(user.id, hasGL)}
                  disabled={actionLoading[user.id]}
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                    hasGL
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                  }`}
                  tabIndex={0}
                  aria-label={hasGL ? `Remove GL role from ${user.name}` : `Assign GL role to ${user.name}`}
                >
                  {actionLoading[user.id] ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : hasGL ? (
                    <UserMinus className="h-3.5 w-3.5" />
                  ) : (
                    <UserPlus className="h-3.5 w-3.5" />
                  )}
                  {hasGL ? "Remove" : "Assign"}
                </button>
              </div>
              {hasGL && (
                <div className="mt-2">
                  <span className="inline-flex items-center rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-semibold text-purple-700">
                    General Leader
                  </span>
                </div>
              )}
            </div>
          )
        })}
        {filteredUsers.length === 0 && search.trim() && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center text-sm text-slate-500">
            No users match &ldquo;{search}&rdquo;
          </div>
        )}
      </div>
    </div>
  )
}
