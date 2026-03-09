import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createTask, getTasks } from "@/core/shared/infrastructure/config/dependencies"
import type { CreateTaskDTO } from "@/core/tasks"

export const GET = async (request: NextRequest) => {
  try {
    const { searchParams } = request.nextUrl
    const filters = {
      status: searchParams.get("status") ?? undefined,
      priority: searchParams.get("priority") ?? undefined,
      assigneeId: searchParams.get("assigneeId") ?? undefined,
    }

    const tasks = await getTasks(filters)
    return NextResponse.json({ data: tasks }, { status: 200 })
  } catch (error) {
    console.error("GET /api/v1/tasks error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export const POST = async (request: NextRequest) => {
  try {
    const body = (await request.json()) as CreateTaskDTO

    if (!body.title || !body.description || !body.priority) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, priority" },
        { status: 400 },
      )
    }

    const task = await createTask(body)
    return NextResponse.json({ data: task }, { status: 201 })
  } catch (error) {
    console.error("POST /api/v1/tasks error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
