import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui"
import type { TaskItem } from "../types"

type TaskCardProps = {
  task: TaskItem
}

const priorityBadgeStyles: Record<string, string> = {
  low: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  medium: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  high: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  urgent: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
}

export const TaskCard = ({ task }: TaskCardProps) => (
  <Card>
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle>{task.title}</CardTitle>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityBadgeStyles[task.priority] ?? ""}`}
        >
          {task.priority}
        </span>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        {task.description}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <span className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
          {task.status.replace("_", " ")}
        </span>
      </div>
    </CardContent>
  </Card>
)
