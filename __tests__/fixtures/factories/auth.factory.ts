import type { RegisterDTO, PendingUserResponseDTO } from "@/core/auth"
import { MOCK_REGISTER_DTO, MOCK_PENDING_USER } from "../auth.fixture"

let counter = 0

export const buildRegisterDTO = (overrides?: Partial<RegisterDTO>): RegisterDTO => ({
  ...MOCK_REGISTER_DTO,
  email: `user-${++counter}@astu.edu.et`,
  ...overrides,
})

export const buildPendingUser = (overrides?: Partial<PendingUserResponseDTO>): PendingUserResponseDTO => ({
  ...MOCK_PENDING_USER,
  id: `user-pending-factory-${++counter}`,
  ...overrides,
})

export const resetAuthFactoryCounter = () => {
  counter = 0
}
