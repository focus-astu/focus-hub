import type { AuthRepository } from "@/core/auth/application/ports/auth-repository.port"
import type { AllUsersResponseDTO } from "@/core/auth/application/dtos/auth.dto"

export type GetAllUsersDependencies = {
  authRepository: AuthRepository
}

export const createGetAllUsersUseCase = (deps: GetAllUsersDependencies) => {
  return async (): Promise<AllUsersResponseDTO[]> => {
    return deps.authRepository.getAllApprovedUsers()
  }
}
