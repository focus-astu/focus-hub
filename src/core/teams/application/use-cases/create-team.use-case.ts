import type { TeamRepository } from "@/core/teams/application/ports/team-repository.port"
import type { CreateTeamDTO, TeamResponseDTO } from "@/core/teams/application/dtos/team.dto"
import { TeamStatus } from "@/core/teams/domain"
import { ValidationError } from "@/core/shared"

export type CreateTeamDependencies = {
  teamRepository: TeamRepository
}

export const createCreateTeamUseCase = (deps: CreateTeamDependencies) => {
  return async (dto: CreateTeamDTO): Promise<TeamResponseDTO> => {
    if (!dto.name.trim()) {
      throw new ValidationError("Team name cannot be empty")
    }
    if (!dto.description.trim()) {
      throw new ValidationError("Team description cannot be empty")
    }

    const displayOrder = dto.displayOrder ?? (await deps.teamRepository.getMaxDisplayOrder()) + 1
    const now = new Date().toISOString()

    const team = await deps.teamRepository.create({
      id: crypto.randomUUID(),
      name: dto.name.trim(),
      description: dto.description.trim(),
      iconName: dto.iconName,
      color: dto.color,
      displayOrder,
      status: TeamStatus.ACTIVE,
      createdAt: now,
      updatedAt: now,
    })

    return {
      id: team.id,
      name: team.name,
      description: team.description,
      iconName: team.iconName,
      color: team.color,
      displayOrder: team.displayOrder,
      status: team.status,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
    }
  }
}
