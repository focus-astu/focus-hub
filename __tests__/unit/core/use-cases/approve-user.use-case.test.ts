import { describe, it, expect, beforeEach } from "@jest/globals"
import { createApproveUserUseCase, UserAlreadyApprovedError } from "@/core/auth"
import type { AuthRepository } from "@/core/auth"
import { MOCK_APPROVE_USER_DTO, MOCK_PENDING_USER } from "@/__tests__/fixtures"

describe("ApproveUser Use Case", () => {
  let mockAuthRepository: AuthRepository
  let approveUser: ReturnType<typeof createApproveUserUseCase>

  beforeEach(() => {
    mockAuthRepository = {
      getPendingUsers: async () => [MOCK_PENDING_USER],
      getAllApprovedUsers: async () => [],
      approveUser: async () => {},
      rejectUser: async () => {},
      isUserApproved: async () => false,
      getUserById: async () => MOCK_PENDING_USER,
      isOwnerOfOrg: async () => false,
    }

    approveUser = createApproveUserUseCase({
      authRepository: mockAuthRepository,
    })
  })

  it("should approve a pending user", async () => {
    let capturedUserId: string | null = null
    mockAuthRepository.approveUser = async (userId: string) => {
      capturedUserId = userId
    }

    await approveUser(MOCK_APPROVE_USER_DTO)
    expect(capturedUserId).toBe(MOCK_APPROVE_USER_DTO.userId)
  })

  it("should throw UserAlreadyApprovedError if user is already approved", async () => {
    mockAuthRepository.isUserApproved = async () => true

    await expect(approveUser(MOCK_APPROVE_USER_DTO)).rejects.toThrow(
      UserAlreadyApprovedError,
    )
  })

  it("should call isUserApproved before approving", async () => {
    const calls: string[] = []
    mockAuthRepository.isUserApproved = async () => {
      calls.push("isUserApproved")
      return false
    }
    mockAuthRepository.approveUser = async () => {
      calls.push("approveUser")
    }

    await approveUser(MOCK_APPROVE_USER_DTO)
    expect(calls).toEqual(["isUserApproved", "approveUser"])
  })
})
