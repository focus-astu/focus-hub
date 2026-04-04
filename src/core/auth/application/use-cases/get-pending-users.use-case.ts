import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { PendingUserResponseDTO } from "@/core/auth/application/dtos/auth.dto"

export type GetPendingUsersDependencies = {
  authRepository: AuthRepository
}

export const createGetPendingUsersUseCase = (deps: GetPendingUsersDependencies) => {
  return async (): Promise<PendingUserResponseDTO[]> => {
    return deps.authRepository.getPendingUsers()
  }
}
