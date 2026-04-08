"use client"

import { useState, useEffect, useCallback } from "react"
import { Heart, Loader2, FileText } from "lucide-react"
import Image from "next/image"

type FeedPost = {
  id: string
  authorName: string
  title: string | null
  content: string
  imageUrl: string | null
  likeCount: number
  likedByCurrentUser: boolean
  createdAt: string
}

export const PostFeed = () => {
  const [posts, setPosts] = useState<FeedPost[]>([])
  const [loading, setLoading] = useState(true)
  const [likeLoading, setLikeLoading] = useState<Record<string, boolean>>({})

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/posts")
      if (!res.ok) return
      const data = await res.json()
      setPosts(data.posts ?? [])
    } catch { /* silently fail for feed */ } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const handleLike = async (postId: string) => {
    setLikeLoading((prev) => ({ ...prev, [postId]: true }))

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const liked = !p.likedByCurrentUser
        return {
          ...p,
          likedByCurrentUser: liked,
          likeCount: liked ? p.likeCount + 1 : p.likeCount - 1,
        }
      }),
    )

    try {
      const res = await fetch(`/api/v1/posts/${postId}/like`, { method: "POST" })
      if (!res.ok) {
        await fetchPosts()
      }
    } catch {
      await fetchPosts()
    } finally {
      setLikeLoading((prev) => ({ ...prev, [postId]: false }))
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
        <FileText className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm font-medium text-slate-500">No posts yet</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700">
                {post.authorName.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-bold text-slate-900">{post.authorName}</span>
                <span className="ml-2 text-xs text-slate-400">{formatTimeAgo(post.createdAt)}</span>
              </div>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{post.content}</p>

            {post.imageUrl && (
              <div className="mt-4 overflow-hidden rounded-xl">
                <Image
                  src={post.imageUrl}
                  alt="Post image"
                  width={600}
                  height={400}
                  className="w-full object-cover"
                />
              </div>
            )}

            <div className="mt-4 flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleLike(post.id)}
                disabled={likeLoading[post.id]}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${
                  post.likedByCurrentUser
                    ? "bg-red-50 text-red-600"
                    : "bg-slate-100 text-slate-500 hover:bg-red-50 hover:text-red-500"
                }`}
                tabIndex={0}
                aria-label={post.likedByCurrentUser ? "Unlike post" : "Like post"}
              >
                <Heart className={`h-3.5 w-3.5 ${post.likedByCurrentUser ? "fill-red-500 text-red-500" : ""}`} />
                {post.likeCount}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
