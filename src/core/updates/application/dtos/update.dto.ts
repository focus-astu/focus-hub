import type { UpdateCategory, UpdateStatus } from "@/core/updates/domain"

export type CreateUpdateDTO = {
  authorId: string
  authorName: string
  title: string
  description: string
  category: UpdateCategory
  imageBase64?: string
}

export type EditUpdateDTO = {
  id: string
  title?: string
  description?: string
  category?: UpdateCategory
  imageBase64?: string
  removeImage?: boolean
}

export type UpdateResponseDTO = {
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

export type DeleteUpdateDTO = {
  updateId: string
  requesterId: string
  isAdmin: boolean
}
