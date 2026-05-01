"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ImagePlus, X, Loader2, Trash2, Send, Newspaper, Pencil } from "lucide-react"
import Image from "next/image"

const CATEGORIES = [
  { value: "prayer", label: "Prayer", color: "text-blue-600", bg: "bg-blue-50" },
  { value: "fellowship", label: "Fellowship", color: "text-purple-600", bg: "bg-purple-50" },
  { value: "worship", label: "Worship", color: "text-amber-600", bg: "bg-amber-50" },
  { value: "outreach", label: "Outreach", color: "text-emerald-600", bg: "bg-emerald-50" },
  { value: "other", label: "Other", color: "text-slate-600", bg: "bg-slate-50" },
] as const

type UpdateItem = {
  id: string
  authorId: string
  authorName: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  createdAt: string
}

type EditingState = {
  id: string
  title: string
  description: string
  category: string
} | null

export const GLUpdateManagement = () => {
  const [updates, setUpdates] = useState<UpdateItem[]>([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<string>("other")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({})
  const [editing, setEditing] = useState<EditingState>(null)
  const [editSubmitting, setEditSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchUpdates = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/updates")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setUpdates(data.updates ?? [])
    } catch {
      setError("Failed to load updates")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void fetchUpdates()
  }, [fetchUpdates])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError("Image too large. Maximum 5MB."); return }
    if (!file.type.startsWith("image/")) { setError("Only image files are allowed."); return }

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setImagePreview(result)
      setImageBase64(result)
      setError("")
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImageBase64(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async () => {
    if (!title.trim()) { setError("Please add a title."); return }
    if (!description.trim()) { setError("Please add a description."); return }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/v1/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          category,
          ...(imageBase64 && { imageBase64 }),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to create update")
        return
      }

      setTitle("")
      setDescription("")
      setCategory("other")
      handleRemoveImage()
      await fetchUpdates()
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (updateId: string) => {
    setDeleteLoading((prev) => ({ ...prev, [updateId]: true }))
    try {
      const res = await fetch(`/api/v1/updates/${updateId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to delete")
        return
      }
      setUpdates((prev) => prev.filter((u) => u.id !== updateId))
    } catch {
      setError("Connection error")
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [updateId]: false }))
    }
  }

  const handleEditSave = async () => {
    if (!editing) return
    setEditSubmitting(true)
    setError("")

    try {
      const res = await fetch(`/api/v1/updates/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editing.title,
          description: editing.description,
          category: editing.category,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to update")
        return
      }

      setEditing(null)
      await fetchUpdates()
    } catch {
      setError("Connection error")
    } finally {
      setEditSubmitting(false)
    }
  }

  const getCategoryMeta = (cat: string) =>
    CATEGORIES.find((c) => c.value === cat) ?? CATEGORIES[4]

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return "Just now"
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="mx-auto w-full max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Updates</h1>
        <p className="mt-1 text-sm text-slate-500">Manage weekly programs and event updates for the landing page</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="space-y-3 p-4">
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError("") }}
            placeholder="Update title (e.g. Monday Morning Prayer)"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Update title"
          />

          <textarea
            value={description}
            onChange={(e) => { setDescription(e.target.value); setError("") }}
            placeholder="Describe the program or event..."
            rows={3}
            className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Update description"
          />

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => setCategory(cat.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                  category === cat.value
                    ? `${cat.bg} ${cat.color} ring-2 ring-current/20`
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
                tabIndex={0}
                aria-label={`Category: ${cat.label}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {imagePreview && (
            <div className="relative inline-block">
              <Image src={imagePreview} alt="Upload preview" width={120} height={120} className="rounded-lg border border-slate-200 object-cover" />
              <button type="button" onClick={handleRemoveImage} className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600" aria-label="Remove image" tabIndex={0}>
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}

          <div className="flex items-center justify-between">
            <div>
              <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleImageSelect} className="hidden" aria-label="Upload image" />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200" tabIndex={0} aria-label="Add image">
                <ImagePlus className="h-4 w-4" />
                Add Image
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !title.trim() || !description.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
              tabIndex={0}
              aria-label="Publish update"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Publish
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : updates.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-2 text-xs font-medium text-slate-500">No updates yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {updates.map((update) => {
            const catMeta = getCategoryMeta(update.category)
            const isEditing = editing?.id === update.id

            if (isEditing) {
              return (
                <div key={update.id} className="overflow-hidden rounded-xl border-2 border-purple-300 bg-white p-4 shadow-sm">
                  <input
                    value={editing.title}
                    onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                    className="mb-2 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    aria-label="Edit title"
                  />
                  <textarea
                    value={editing.description}
                    onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                    rows={3}
                    className="mb-2 w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 focus:border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-100"
                    aria-label="Edit description"
                  />
                  <div className="mb-3 flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setEditing({ ...editing, category: cat.value })}
                        className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                          editing.category === cat.value
                            ? `${cat.bg} ${cat.color} ring-2 ring-current/20`
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                        tabIndex={0}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50" tabIndex={0}>
                      Cancel
                    </button>
                    <button type="button" onClick={handleEditSave} disabled={editSubmitting} className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-700 disabled:opacity-50" tabIndex={0}>
                      {editSubmitting ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              )
            }

            return (
              <div key={update.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {update.imageUrl && (
                  <div className="relative h-36 w-full">
                    <Image src={update.imageUrl} alt="Update image" fill className="object-cover" />
                  </div>
                )}
                <div className="p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${catMeta.bg} ${catMeta.color}`}>
                        {catMeta.label}
                      </span>
                      <span className="shrink-0 text-[10px] text-slate-400">{formatTimeAgo(update.createdAt)}</span>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing({ id: update.id, title: update.title, description: update.description, category: update.category })}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-blue-50 hover:text-blue-500"
                        tabIndex={0}
                        aria-label="Edit update"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(update.id)}
                        disabled={deleteLoading[update.id]}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                        tabIndex={0}
                        aria-label="Delete update"
                      >
                        {deleteLoading[update.id] ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                      </button>
                    </div>
                  </div>
                  <h3 className="mt-1.5 text-sm font-bold text-slate-900">{update.title}</h3>
                  <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-slate-600">{update.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
