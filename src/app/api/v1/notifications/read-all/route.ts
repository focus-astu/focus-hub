import { NextResponse } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { markAllNotificationsRead } from "@/core/shared/infrastructure/config/dependencies"
import { headers } from "next/headers"

export const POST = async () => {
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

    await markAllNotificationsRead(session.user.id)

    return NextResponse.json(
      { message: "All notifications marked as read" },
      { status: 200 },
    )
  } catch (error) {
    console.error("POST /api/v1/notifications/read-all error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
