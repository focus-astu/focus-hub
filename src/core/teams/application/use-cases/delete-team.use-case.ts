import type { TeamRepository } from "@/core/teams/application/ports/team-repository.port"
import type { DeleteTeamDTO } from "@/core/teams/application/dtos/team.dto"
import { EntityNotFoundError } from "@/core/shared"

export type DeleteTeamDependencies = {
  teamRepository: TeamRepository
}

export const createDeleteTeamUseCase = (deps: DeleteTeamDependencies) => {
  return async (dto: DeleteTeamDTO): Promise<void> => {
    const team = await deps.teamRepository.getById(dto.teamId)
    if (!team) throw new EntityNotFoundError("Team", dto.teamId)

    await deps.teamRepository.delete(dto.teamId)
  }
}
