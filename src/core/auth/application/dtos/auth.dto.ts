import type { UserStatus } from "@/core/auth/domain"

export type RegisterDTO = {
  name: string
  email: string
  password: string
  universityId: string
  year: number
  department?: string
}

export type ApproveUserDTO = {
  userId: string
  adminId: string
}

export type RejectUserDTO = {
  userId: string
  adminId: string
  reason?: string
}

export type PendingUserResponseDTO = {
  id: string
  name: string
  email: string
  universityId: string
  year: number
  department: string | null
  emailVerified: boolean
  status: UserStatus
  createdAt: string
}
