import type { TeamRepository } from "@/core/teams/application/ports/team-repository.port"
import type { EditTeamDTO, TeamResponseDTO } from "@/core/teams/application/dtos/team.dto"
import { EntityNotFoundError } from "@/core/shared"

export type EditTeamDependencies = {
  teamRepository: TeamRepository
}

export const createEditTeamUseCase = (deps: EditTeamDependencies) => {
  return async (dto: EditTeamDTO): Promise<TeamResponseDTO> => {
    const existing = await deps.teamRepository.getById(dto.id)
    if (!existing) throw new EntityNotFoundError("Team", dto.id)

    const fields = {
      ...(dto.name !== undefined && { name: dto.name.trim() }),
      ...(dto.description !== undefined && { description: dto.description.trim() }),
      ...(dto.iconName !== undefined && { iconName: dto.iconName }),
      ...(dto.color !== undefined && { color: dto.color }),
      ...(dto.displayOrder !== undefined && { displayOrder: dto.displayOrder }),
      updatedAt: new Date().toISOString(),
    }

    const updated = await deps.teamRepository.update(dto.id, fields)
    if (!updated) throw new EntityNotFoundError("Team", dto.id)

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      iconName: updated.iconName,
      color: updated.color,
      displayOrder: updated.displayOrder,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    }
  }
}
