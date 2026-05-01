import type { Team } from "@/core/teams/domain"

export type TeamRepository = {
  create: (team: Team) => Promise<Team>
  getById: (id: string) => Promise<Team | null>
  getAll: () => Promise<Team[]>
  update: (id: string, fields: Partial<Team>) => Promise<Team | null>
  delete: (id: string) => Promise<void>
  getMaxDisplayOrder: () => Promise<number>
}
