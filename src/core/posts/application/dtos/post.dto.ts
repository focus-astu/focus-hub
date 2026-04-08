import type { ContentType, PostStatus } from "@/core/posts/domain"

export type CreatePostDTO = {
  authorId: string
  authorName: string
  title?: string
  content: string
  imageBase64?: string
}

export type PostResponseDTO = {
  id: string
  authorId: string
  authorName: string
  title: string | null
  content: string
  contentType: ContentType
  imageUrl: string | null
  status: PostStatus
  likeCount: number
  likedByCurrentUser: boolean
  createdAt: string
  updatedAt: string
}

export type ToggleLikeDTO = {
  postId: string
  userId: string
}

export type GetPostsDTO = {
  page?: number
  limit?: number
  currentUserId: string
}

export type DeletePostDTO = {
  postId: string
  requesterId: string
  isAdmin: boolean
}
