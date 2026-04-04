import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { ApproveUserDTO } from "@/core/auth/application/dtos/auth.dto"
import { UserAlreadyApprovedError } from "@/core/auth/domain"

export type ApproveUserDependencies = {
  authRepository: AuthRepository
}

export const createApproveUserUseCase = (deps: ApproveUserDependencies) => {
  return async (dto: ApproveUserDTO): Promise<void> => {
    const isApproved = await deps.authRepository.isUserApproved(dto.userId)
    if (isApproved) {
      throw new UserAlreadyApprovedError(dto.userId)
    }

    await deps.authRepository.approveUser(dto.userId)
  }
}
