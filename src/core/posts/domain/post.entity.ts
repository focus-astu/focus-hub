export const ContentType = {
  TEXT: "text",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  GALLERY: "gallery",
} as const

export type ContentType = (typeof ContentType)[keyof typeof ContentType]

export const PostStatus = {
  PUBLISHED: "published",
  DRAFT: "draft",
  ARCHIVED: "archived",
} as const

export type PostStatus = (typeof PostStatus)[keyof typeof PostStatus]

export type Post = {
  id: string
  authorId: string
  authorName: string
  title: string | null
  content: string
  contentType: ContentType
  imageUrl: string | null
  status: PostStatus
  likeCount: number
  likedBy: string[]
  createdAt: string
  updatedAt: string
}
