"use client"

import { TaskCard } from "./task-card"
import type { TaskItem } from "../types"

type TaskListProps = {
  tasks: TaskItem[]
}

export const TaskList = ({ tasks }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-zinc-500 dark:text-zinc-400">
          No tasks yet
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          Create your first task to get started.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  )
}
