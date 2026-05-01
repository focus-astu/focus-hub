export const UpdateCategory = {
  PRAYER: "prayer",
  FELLOWSHIP: "fellowship",
  WORSHIP: "worship",
  OUTREACH: "outreach",
  OTHER: "other",
} as const

export type UpdateCategory = (typeof UpdateCategory)[keyof typeof UpdateCategory]

export const UpdateStatus = {
  PUBLISHED: "published",
  DRAFT: "draft",
} as const

export type UpdateStatus = (typeof UpdateStatus)[keyof typeof UpdateStatus]

export type Update = {
  id: string
  authorId: string
  authorName: string
  title: string
  description: string
  category: UpdateCategory
  imageUrl: string | null
  status: UpdateStatus
  createdAt: string
  updatedAt: string
}
