import type { TeamStatus } from "@/core/teams/domain"

export type CreateTeamDTO = {
  name: string
  description: string
  iconName: string
  color: string
  displayOrder?: number
}

export type EditTeamDTO = {
  id: string
  name?: string
  description?: string
  iconName?: string
  color?: string
  displayOrder?: number
}

export type TeamResponseDTO = {
  id: string
  name: string
  description: string
  iconName: string
  color: string
  displayOrder: number
  status: TeamStatus
  createdAt: string
  updatedAt: string
}

export type DeleteTeamDTO = {
  teamId: string
}
