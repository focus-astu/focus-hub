import type { Post } from "@/core/posts/domain"

export type PostRepository = {
  create: (post: Post) => Promise<Post>
  getById: (id: string) => Promise<Post | null>
  getAll: (options: { page: number, limit: number }) => Promise<{ posts: Post[], total: number }>
  delete: (id: string) => Promise<void>
  addLike: (postId: string, userId: string) => Promise<void>
  removeLike: (postId: string, userId: string) => Promise<void>
}
