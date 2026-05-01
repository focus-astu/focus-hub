"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Trash2, UsersRound, Pencil, Plus } from "lucide-react"
import { ICON_MAP, ICON_OPTIONS, getIcon } from "@/lib/icon-map"

const COLOR_OPTIONS = [
  { value: "#2563EB", label: "Blue", bg: "bg-blue-600" },
  { value: "#7C3AED", label: "Purple", bg: "bg-purple-600" },
  { value: "#14B8A6", label: "Teal", bg: "bg-teal-500" },
  { value: "#F59E0B", label: "Amber", bg: "bg-amber-500" },
  { value: "#EF4444", label: "Red", bg: "bg-red-500" },
  { value: "#10B981", label: "Emerald", bg: "bg-emerald-500" },
  { value: "#EC4899", label: "Pink", bg: "bg-pink-500" },
  { value: "#6366F1", label: "Indigo", bg: "bg-indigo-500" },
] as const

type TeamItem = {
  id: string
  name: string
  description: string
  iconName: string
  color: string
  displayOrder: number
  createdAt: string
}

type EditingState = {
  id: string
  name: string
  description: string
  iconName: string
  color: string
} | null

export const GLTeamManagement = () => {
  const [teams, setTeams] = useState<TeamItem[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [iconName, setIconName] = useState("users")
  const [color, setColor] = useState("#2563EB")
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({})
  const [editing, setEditing] = useState<EditingState>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const [showIconPicker, setShowIconPicker] = useState(false)
  const [editIconPicker, setEditIconPicker] = useState(false)
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

  const handleToggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const fetchTeams = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/teams")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setTeams(data.teams ?? [])
    } catch {
      setError("Failed to load teams")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchTeams()
  }, [fetchTeams])

  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please add a team name."); return }
    if (!description.trim()) { setError("Please add a description."); return }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/v1/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          iconName,
          color,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to create team")
        return
      }

      setName("")
      setDescription("")
      setIconName("users")
      setColor("#2563EB")
      await fetchTeams()
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (teamId: string) => {
    setDeleteLoading((prev) => ({ ...prev, [teamId]: true }))
    try {
      const res = await fetch(`/api/v1/teams/${teamId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to delete")
        return
      }
      setTeams((prev) => prev.filter((t) => t.id !== teamId))
    } catch {
      setError("Connection error")
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [teamId]: false }))
    }
  }

  const handleEditSave = async () => {
    if (!editing) return
    setEditSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/v1/teams/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editing.name,
          description: editing.description,
          iconName: editing.iconName,
          color: editing.color,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to update")
        return
      }

      setEditing(null)
      setEditIconPicker(false)
      await fetchTeams()
    } catch {
      setError("Connection error")
    } finally {
      setEditSubmitting(false)
    }
  }

  const renderIconPicker = (selected: string, onSelect: (name: string) => void) => (
    <div className="grid grid-cols-5 gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3">
      {ICON_OPTIONS.map((opt) => {
        const Icon = ICON_MAP[opt]
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onSelect(opt)}
            className={`flex flex-col items-center gap-1 rounded-lg p-2 text-[10px] transition-all ${
              selected === opt
                ? "bg-purple-100 text-purple-700 ring-2 ring-purple-300"
                : "text-slate-500 hover:bg-slate-100"
            }`}
            tabIndex={0}
            aria-label={`Icon: ${opt}`}
          >
            <Icon className="h-5 w-5" />
            <span className="truncate">{opt}</span>
          </button>
        )
      })}
    </div>
  )

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Ministry Teams</h1>
        <p className="mt-1 text-sm text-slate-500">Manage teams displayed on the landing page</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 p-4">
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setError("") }}
            placeholder="Team name (e.g. Action Team)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Team name"
          />

          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setError("") }}
            placeholder="Describe what this team does..."
            rows={2}
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Team description"
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
              tabIndex={0}
              aria-label="Pick icon"
            >
              {(() => { const Icon = getIcon(iconName); return <Icon className="h-4 w-4" /> })()}
              Icon: {iconName}
            </button>

            <div className="flex gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setColor(c.value)}
                  className={`h-6 w-6 rounded-full ${c.bg} transition-all ${
                    color === c.value ? "ring-2 ring-slate-900 ring-offset-2" : "hover:ring-2 hover:ring-slate-300 hover:ring-offset-1"
                  }`}
                  tabIndex={0}
                  aria-label={`Color: ${c.label}`}
                />
              ))}
            </div>
          </div>

          {showIconPicker && renderIconPicker(iconName, (n) => { setIconName(n); setShowIconPicker(false) })}

          {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !name.trim() || !description.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 active:scale-[0.98] disabled:opacity-50"
              tabIndex={0}
              aria-label="Add team"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Team
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : teams.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <UsersRound className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-xs font-medium text-slate-500">No teams yet. Add the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {teams.map((team) => {
            const TeamIcon = getIcon(team.iconName)
            const isEditing = editing?.id === team.id

            if (isEditing) {
              return (
                <div key={team.id} className="overflow-hidden rounded-xl border-2 border-purple-300 bg-white p-4 shadow-sm">
                  <input
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    className="mb-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    aria-label="Edit name"
                  />
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={2}
                    className="mb-2 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    aria-label="Edit description"
                  />
                  <div className="mb-3 flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setEditIconPicker(!editIconPicker)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                      tabIndex={0}
                    >
                      {(() => { const EIcon = getIcon(editing.iconName); return <EIcon className="h-4 w-4" /> })()}
                      {editing.iconName}
                    </button>
                    <div className="flex gap-1.5">
                      {COLOR_OPTIONS.map((c) => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setEditing({ ...editing, color: c.value })}
                          className={`h-6 w-6 rounded-full ${c.bg} transition-all ${
                            editing.color === c.value ? "ring-2 ring-slate-900 ring-offset-2" : "hover:ring-2 hover:ring-slate-300 hover:ring-offset-1"
                          }`}
                          tabIndex={0}
                        />
                      ))}
                    </div>
                  </div>
                  {editIconPicker && renderIconPicker(editing.iconName, (n) => { setEditing({ ...editing, iconName: n }); setEditIconPicker(false) })}
                  <div className="flex gap-2">
                    <button type="button" onClick={() => { setEditing(null); setEditIconPicker(false) }} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50" tabIndex={0}>
                      Cancel
                    </button>
                    <button type="button" onClick={handleEditSave} disabled={editSubmitting} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50" tabIndex={0}>
                      {editSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )
            }

            const isExpanded = expandedIds.has(team.id)
            const isLong = team.description.length > 100

            return (
              <div key={team.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: team.color, boxShadow: `0 10px 15px -3px ${team.color}33` }}>
                    <TeamIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-slate-900">{team.name}</h3>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => setEditing({ id: team.id, name: team.name, description: team.description, iconName: team.iconName, color: team.color })}
                      className="rounded p-1.5 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
                      tabIndex={0}
                      aria-label="Edit team"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(team.id)}
                      disabled={deleteLoading[team.id]}
                      className="rounded p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      tabIndex={0}
                      aria-label="Delete team"
                    >
                      {deleteLoading[team.id] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="mt-2 pl-16">
                  <p className={`text-xs leading-relaxed text-slate-600 ${!isExpanded && isLong ? "line-clamp-2" : ""}`}>
                    {team.description}
                  </p>
                  {isLong && (
                    <button
                      type="button"
                      onClick={() => handleToggleExpand(team.id)}
                      className="mt-1 text-[11px] font-semibold text-purple-600 transition-colors hover:text-purple-700"
                      tabIndex={0}
                      aria-label={isExpanded ? "Show less" : "Show more"}
                    >
                      {isExpanded ? "Less" : "More..."}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
