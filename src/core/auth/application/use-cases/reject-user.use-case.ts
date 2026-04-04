import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { RejectUserDTO } from "@/core/auth/application/dtos/auth.dto"

export type RejectUserDependencies = {
  authRepository: AuthRepository
}

export const createRejectUserUseCase = (deps: RejectUserDependencies) => {
  return async (dto: RejectUserDTO): Promise<void> => {
    await deps.authRepository.rejectUser(dto.userId, dto.reason)
  }
}
