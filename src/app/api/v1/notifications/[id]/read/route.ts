import { NextResponse } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { markNotificationRead } from "@/core/shared/infrastructure/config/dependencies"
import { headers } from "next/headers"

type RouteParams = {
  params: Promise<{ id: string }>
}

export const PATCH = async (_request: Request, { params }: RouteParams) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      )
    }

    const { id } = await params
    await markNotificationRead(id)

    return NextResponse.json(
      { message: "Notification marked as read" },
      { status: 200 },
    )
  } catch (error) {
    console.error("PATCH /api/v1/notifications/[id]/read error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
