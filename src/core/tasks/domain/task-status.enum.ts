export const TaskStatus = {
  BACKLOG: "backlog",
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  IN_REVIEW: "in_review",
  COMPLETED: "completed",
} as const

export type TaskStatus = (typeof TaskStatus)[keyof typeof TaskStatus]
