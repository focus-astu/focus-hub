import { describe, it, expect, beforeEach } from "@jest/globals"
import { createGetPendingUsersUseCase } from "@/core/auth"
import type { AuthRepository } from "@/core/auth"
import { MOCK_PENDING_USER, MOCK_PENDING_USERS_LIST } from "@/__tests__/fixtures"

describe("GetPendingUsers Use Case", () => {
  let mockAuthRepository: AuthRepository
  let getPendingUsers: ReturnType<typeof createGetPendingUsersUseCase>

  beforeEach(() => {
    mockAuthRepository = {
      getPendingUsers: async () => MOCK_PENDING_USERS_LIST,
      getAllApprovedUsers: async () => [],
      approveUser: async () => {},
      rejectUser: async () => {},
      isUserApproved: async () => false,
      getUserById: async () => MOCK_PENDING_USER,
      isOwnerOfOrg: async () => false,
    }

    getPendingUsers = createGetPendingUsersUseCase({
      authRepository: mockAuthRepository,
    })
  })

  it("should return all pending users", async () => {
    const result = await getPendingUsers()
    expect(result).toHaveLength(2)
    expect(result[0].id).toBe(MOCK_PENDING_USERS_LIST[0].id)
    expect(result[1].id).toBe(MOCK_PENDING_USERS_LIST[1].id)
  })

  it("should return empty array when no pending users exist", async () => {
    mockAuthRepository.getPendingUsers = async () => []

    const result = await getPendingUsers()
    expect(result).toEqual([])
  })

  it("should delegate to the repository", async () => {
    let called = false
    mockAuthRepository.getPendingUsers = async () => {
      called = true
      return []
    }

    await getPendingUsers()
    expect(called).toBe(true)
  })
})
