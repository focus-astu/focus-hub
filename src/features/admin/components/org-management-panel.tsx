"use client"

import { useState } from "react"
import { Building2, UserPlus, Users, Loader2, ChevronDown, ChevronUp } from "lucide-react"

type Organization = {
  id: string
  name: string
  slug: string
  members?: Array<{
    id: string
    userId: string
    role: string
    user?: { name: string; email: string }
  }>
}

type OrgManagementPanelProps = {
  initialOrgs: Organization[]
}

const AVAILABLE_ROLES = [
  { value: "member", label: "Member" },
  { value: "teacher", label: "Teacher" },
  { value: "counselor", label: "Counselor" },
  { value: "generalLeader", label: "General Leader" },
  { value: "admin", label: "Admin" },
]

export const OrgManagementPanel = ({ initialOrgs }: OrgManagementPanelProps) => {
  const [orgs] = useState<Organization[]>(initialOrgs)
  const [expandedOrg, setExpandedOrg] = useState<string | null>(null)
  const [addMemberForm, setAddMemberForm] = useState<{
    orgId: string
    userId: string
    role: string
  } | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [feedback, setFeedback] = useState<{ type: "success" | "error", message: string } | null>(null)

  const handleToggleExpand = (orgId: string) => {
    setExpandedOrg((prev) => (prev === orgId ? null : orgId))
  }

  const handleOpenAddMember = (orgId: string) => {
    setAddMemberForm({ orgId, userId: "", role: "member" })
    setFeedback(null)
  }

  const handleAddMember = async () => {
    if (!addMemberForm || !addMemberForm.userId.trim()) return

    setIsAdding(true)
    setFeedback(null)

    try {
      const res = await fetch("/api/v1/admin/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationId: addMemberForm.orgId,
          userId: addMemberForm.userId.trim(),
          role: addMemberForm.role,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setFeedback({ type: "error", message: data.error || "Failed to add member" })
        return
      }

      setFeedback({ type: "success", message: "Member added successfully" })
      setAddMemberForm(null)
    } catch {
      setFeedback({ type: "error", message: "Network error. Please try again." })
    } finally {
      setIsAdding(false)
    }
  }

  if (orgs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-8 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <Building2 className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-700">No Organizations</h3>
        <p className="mt-1 text-sm text-slate-500">Organizations will appear here once created.</p>
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

      <div className="space-y-4">
        {orgs.map((org) => {
          const isExpanded = expandedOrg === org.id
          const memberCount = org.members?.length ?? 0

          return (
            <div
              key={org.id}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <button
                type="button"
                onClick={() => handleToggleExpand(org.id)}
                className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left transition-colors hover:bg-slate-50 sm:px-6"
                aria-expanded={isExpanded}
                aria-label={`Toggle ${org.name} details`}
                tabIndex={0}
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 sm:h-10 sm:w-10">
                    <Building2 className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate font-bold text-slate-900">{org.name}</h3>
                    <p className="truncate text-sm text-slate-500">/{org.slug}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                  <span className="hidden items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 sm:inline-flex">
                    <Users className="h-3.5 w-3.5" />
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </span>
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 sm:hidden">
                    {memberCount}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-slate-200 px-4 py-4 sm:px-6">
                  {org.members && org.members.length > 0 ? (
                    <>
                      <div className="mb-4 hidden overflow-x-auto sm:block">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="border-b border-slate-100">
                              <th className="pb-2 font-semibold text-slate-600">Name</th>
                              <th className="pb-2 font-semibold text-slate-600">Email</th>
                              <th className="pb-2 font-semibold text-slate-600">Role</th>
                            </tr>
                          </thead>
                          <tbody>
                            {org.members.map((m) => (
                              <tr key={m.id} className="border-b border-slate-50 last:border-0">
                                <td className="py-2 text-slate-900">{m.user?.name ?? "—"}</td>
                                <td className="py-2 text-slate-600">{m.user?.email ?? "—"}</td>
                                <td className="py-2">
                                  <span className="inline-flex rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                                    {m.role}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mb-4 space-y-2 sm:hidden">
                        {org.members.map((m) => (
                          <div key={m.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-900">{m.user?.name ?? "—"}</p>
                              <p className="truncate text-xs text-slate-500">{m.user?.email ?? "—"}</p>
                            </div>
                            <span className="ml-2 inline-flex shrink-0 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                              {m.role}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="mb-4 text-sm text-slate-500">No members yet.</p>
                  )}

                  {addMemberForm?.orgId === org.id ? (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <h4 className="mb-3 text-sm font-bold text-slate-700">Add Member</h4>
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <input
                          type="text"
                          placeholder="User ID"
                          value={addMemberForm.userId}
                          onChange={(e) =>
                            setAddMemberForm((prev) =>
                              prev ? { ...prev, userId: e.target.value } : null,
                            )
                          }
                          className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                          aria-label="User ID to add"
                        />
                        <select
                          value={addMemberForm.role}
                          onChange={(e) =>
                            setAddMemberForm((prev) =>
                              prev ? { ...prev, role: e.target.value } : null,
                            )
                          }
                          className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/10"
                          aria-label="Member role"
                        >
                          {AVAILABLE_ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={handleAddMember}
                            disabled={isAdding || !addMemberForm.userId.trim()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-blue-700 disabled:opacity-50"
                            tabIndex={0}
                          >
                            {isAdding ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <UserPlus className="h-4 w-4" />
                            )}
                            Add
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddMemberForm(null)}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-50"
                            tabIndex={0}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenAddMember(org.id)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-blue-700 transition-all hover:bg-blue-100"
                      tabIndex={0}
                      aria-label={`Add member to ${org.name}`}
                    >
                      <UserPlus className="h-4 w-4" />
                      Add Member
                    </button>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
