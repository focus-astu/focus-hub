"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { ImagePlus, X, Loader2, Trash2, Send, FileText } from "lucide-react"
import Image from "next/image"

type PostItem = {
  id: string
  authorId: string
  authorName: string
  title: string | null
  content: string
  imageUrl: string | null
  likeCount: number
  createdAt: string
}

export const GLPostManagement = ({ currentUserId }: { currentUserId: string }) => {
  const [posts, setPosts] = useState<PostItem[]>([])
  const [content, setContent] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageBase64, setImageBase64] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteLoading, setDeleteLoading] = useState<Record<string, boolean>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/posts")
      if (!res.ok) throw new Error("Failed")
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch {
      setError("Failed to load posts")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Maximum 5MB.")
      return
    }

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.")
      return
    }

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
    if (!content.trim()) {
      setError("Please write something before posting.")
      return
    }

    setSubmitting(true)
    setError("")

    try {
      const res = await fetch("/api/v1/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          ...(imageBase64 && { imageBase64 }),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        const msg = typeof data.error === "string" ? data.error : "Failed to create post"
        setError(msg)
        return
      }

      setContent("")
      handleRemoveImage()
      await fetchPosts()
    } catch {
      setError("Connection error. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (postId: string) => {
    setDeleteLoading((prev) => ({ ...prev, [postId]: true }))
    try {
      const res = await fetch(`/api/v1/posts/${postId}`, { method: "DELETE" })
      if (!res.ok) {
        const data = await res.json()
        setError(typeof data.error === "string" ? data.error : "Failed to delete")
        return
      }
      setPosts((prev) => prev.filter((p) => p.id !== postId))
    } catch {
      setError("Connection error")
    } finally {
      setDeleteLoading((prev) => ({ ...prev, [postId]: false }))
    }
  }

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Posts</h1>
        <p className="mt-1 text-sm text-slate-500">Create and manage fellowship posts</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="p-4 sm:p-6">
          <textarea
            value={content}
            onChange={(e) => { setContent(e.target.value); setError("") }}
            placeholder="What's on your heart today? Share with the fellowship…"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-purple-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
            aria-label="Post content"
          />

          {imagePreview && (
            <div className="relative mt-3 inline-block">
              <Image
                src={imagePreview}
                alt="Upload preview"
                width={200}
                height={200}
                className="rounded-xl border border-slate-200 object-cover"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-lg transition-colors hover:bg-red-600"
                aria-label="Remove image"
                tabIndex={0}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {error && (
            <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleImageSelect}
                className="hidden"
                aria-label="Upload image"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-200"
                tabIndex={0}
                aria-label="Add image"
              >
                <ImagePlus className="h-4 w-4" />
                Add Image
              </button>
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !content.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-500/20 transition-all hover:bg-purple-700 hover:shadow-xl hover:shadow-purple-500/30 active:scale-[0.98] disabled:opacity-50"
              tabIndex={0}
              aria-label="Publish post"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publish
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <FileText className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No posts yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
                    <span className="ml-2 text-xs text-slate-400">{formatTimeAgo(post.createdAt)}</span>
                  </div>
                  {post.authorId === currentUserId && (
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      disabled={deleteLoading[post.id]}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                      tabIndex={0}
                      aria-label="Delete post"
                    >
                      {deleteLoading[post.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{post.content}</p>
                {post.imageUrl && (
                  <div className="mt-4">
                    <Image
                      src={post.imageUrl}
                      alt="Post image"
                      width={600}
                      height={400}
                      className="w-full rounded-xl object-cover"
                    />
                  </div>
                )}
                <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                  <span>{post.likeCount} {post.likeCount === 1 ? "like" : "likes"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
