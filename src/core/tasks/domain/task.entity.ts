import type { Priority } from "./priority.enum"
import type { TaskStatus } from "./task-status.enum"

export type TaskProps = {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  assigneeId: string | null
  createdAt: Date
  updatedAt: Date
}

export class Task {
  private constructor(private readonly props: TaskProps) {}

  static create(props: Omit<TaskProps, "id" | "createdAt" | "updatedAt">, id: string): Task {
    return new Task({
      ...props,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
  }

  static reconstitute(props: TaskProps): Task {
    return new Task(props)
  }

  get id() {
    return this.props.id
  }

  get title() {
    return this.props.title
  }

  get description() {
    return this.props.description
  }

  get status() {
    return this.props.status
  }

  get priority() {
    return this.props.priority
  }

  get assigneeId() {
    return this.props.assigneeId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  markAsCompleted(): Task {
    return new Task({
      ...this.props,
      status: "completed" as TaskStatus,
      updatedAt: new Date(),
    })
  }

  assignTo(userId: string): Task {
    return new Task({
      ...this.props,
      assigneeId: userId,
      updatedAt: new Date(),
    })
  }

  toJSON(): TaskProps {
    return { ...this.props }
  }
}
