export const Priority = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
  URGENT: "urgent",
} as const

export type Priority = (typeof Priority)[keyof typeof Priority]
