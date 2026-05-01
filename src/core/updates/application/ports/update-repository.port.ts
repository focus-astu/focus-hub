import type { Update } from "@/core/updates/domain"

export type UpdateRepository = {
  create: (update: Update) => Promise<Update>
  getById: (id: string) => Promise<Update | null>
  getAll: (options: { page: number, limit: number }) => Promise<{ updates: Update[], total: number }>
  update: (id: string, fields: Partial<Update>) => Promise<Update | null>
  delete: (id: string) => Promise<void>
}
