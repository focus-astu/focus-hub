export const TeamStatus = {
  ACTIVE: "active",
  ARCHIVED: "archived",
} as const

export type TeamStatus = (typeof TeamStatus)[keyof typeof TeamStatus]

export type Team = {
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
