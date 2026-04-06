export const ROLE_TO_ORG_SLUG: Record<string, string> = {
  teacher: "teachers",
  counselor: "counselors",
  generalLeader: "general-leaders",
  admin: "admins",
}

export const ROLE_DISPLAY_NAMES: Record<string, string> = {
  teacher: "Teacher",
  counselor: "Counselor",
  generalLeader: "General Leader",
  admin: "Admin",
}

export const ASSIGNABLE_ROLES = ["teacher", "counselor", "generalLeader", "admin"] as const
export type AssignableRole = typeof ASSIGNABLE_ROLES[number]
