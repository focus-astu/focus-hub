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

export type UserRoleInfo = {
  role: string
  organizationId: string
  organizationName: string
}

export type AllUsersResponseDTO = {
  id: string
  name: string
  email: string
  universityId: string
  year: number
  department: string | null
  role: string
  organizationRoles: UserRoleInfo[]
  isSuper: boolean
  createdAt: string
}

export type ChangeRoleDTO = {
  userId: string
  role: "teacher" | "counselor" | "generalLeader" | "admin"
  action: "assign" | "remove"
  adminId: string
}
