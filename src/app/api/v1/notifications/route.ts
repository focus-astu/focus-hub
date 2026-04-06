import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { getUserNotifications, getUnreadNotificationCount } from "@/core/shared/infrastructure/config/dependencies"
import { headers } from "next/headers"

export const GET = async (request: NextRequest) => {
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

    const unreadOnly = request.nextUrl.searchParams.get("unreadOnly") === "true"
    const countOnly = request.nextUrl.searchParams.get("countOnly") === "true"

    if (countOnly) {
      const count = await getUnreadNotificationCount(session.user.id)
      return NextResponse.json({ count }, { status: 200 })
    }

    const notifications = await getUserNotifications({
      userId: session.user.id,
      unreadOnly,
      limit: 20,
    })

    return NextResponse.json({ data: notifications }, { status: 200 })
  } catch (error) {
    console.error("GET /api/v1/notifications error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
