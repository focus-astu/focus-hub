import type { PendingUserResponseDTO, AllUsersResponseDTO } from "@/core/auth/application/dtos/auth.dto"

export type AuthRepository = {
  getPendingUsers: () => Promise<PendingUserResponseDTO[]>
  getAllApprovedUsers: () => Promise<AllUsersResponseDTO[]>
  approveUser: (userId: string) => Promise<void>
  rejectUser: (userId: string, reason?: string) => Promise<void>
  isUserApproved: (userId: string) => Promise<boolean>
  getUserById: (userId: string) => Promise<PendingUserResponseDTO | null>
  isOwnerOfOrg: (userId: string, orgSlug: string) => Promise<boolean>
}
