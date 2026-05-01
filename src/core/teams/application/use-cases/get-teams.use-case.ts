import type { TeamRepository } from "@/core/teams/application/ports/team-repository.port"
import type { TeamResponseDTO } from "@/core/teams/application/dtos/team.dto"

export type GetTeamsDependencies = {
  teamRepository: TeamRepository
}

export const createGetTeamsUseCase = (deps: GetTeamsDependencies) => {
  return async (): Promise<TeamResponseDTO[]> => {
    const teams = await deps.teamRepository.getAll()

    return teams.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      iconName: t.iconName,
      color: t.color,
      displayOrder: t.displayOrder,
      status: t.status,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }))
  }
}
