import type { PendingUserResponseDTO } from "@/core/auth/application/dtos/auth.dto"

export type AuthRepository = {
  getPendingUsers: () => Promise<PendingUserResponseDTO[]>
  approveUser: (userId: string) => Promise<void>
  rejectUser: (userId: string, reason?: string) => Promise<void>
  isUserApproved: (userId: string) => Promise<boolean>
  getUserById: (userId: string) => Promise<PendingUserResponseDTO | null>
}
