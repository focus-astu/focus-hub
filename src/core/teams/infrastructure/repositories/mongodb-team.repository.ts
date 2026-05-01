import type { TeamRepository } from "@/core/teams/application/ports/team-repository.port"
import type { Team } from "@/core/teams/domain"
import { TeamStatus } from "@/core/teams/domain"
import { MongoClient } from "mongodb"

export const createMongodbTeamRepository = (client: MongoClient): TeamRepository => {
  const db = client.db()
  const teams = db.collection("teams")

  const toTeam = (doc: Record<string, unknown>): Team => ({
    id: doc.id as string,
    name: doc.name as string,
    description: doc.description as string,
    iconName: doc.iconName as string,
    color: doc.color as string,
    displayOrder: (doc.displayOrder as number) ?? 0,
    status: (doc.status as Team["status"]) ?? TeamStatus.ACTIVE,
    createdAt: doc.createdAt as string,
    updatedAt: doc.updatedAt as string,
  })

  return {
    create: async (team: Team): Promise<Team> => {
      await teams.insertOne({ ...team })
      return team
    },

    getById: async (id: string): Promise<Team | null> => {
      const doc = await teams.findOne({ id })
      return doc ? toTeam(doc as unknown as Record<string, unknown>) : null
    },

    getAll: async (): Promise<Team[]> => {
      const docs = await teams
        .find({ status: TeamStatus.ACTIVE })
        .sort({ displayOrder: 1 })
        .toArray()
      return docs.map((d) => toTeam(d as unknown as Record<string, unknown>))
    },

    update: async (id: string, fields: Partial<Team>): Promise<Team | null> => {
      const result = await teams.findOneAndUpdate(
        { id },
        { $set: fields },
        { returnDocument: "after" },
      )
      return result ? toTeam(result as unknown as Record<string, unknown>) : null
    },

    delete: async (id: string): Promise<void> => {
      await teams.deleteOne({ id })
    },

    getMaxDisplayOrder: async (): Promise<number> => {
      const doc = await teams.findOne(
        { status: TeamStatus.ACTIVE },
        { sort: { displayOrder: -1 } },
      )
      return doc ? ((doc as unknown as Record<string, unknown>).displayOrder as number) ?? 0 : 0
    },
  }
}
