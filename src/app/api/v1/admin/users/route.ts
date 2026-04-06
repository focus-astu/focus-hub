import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { getPendingUsers, getAllUsers } from "@/core/shared/infrastructure/config/dependencies"
import { headers } from "next/headers"

export const GET = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 },
      )
    }

    const filter = request.nextUrl.searchParams.get("filter") ?? "pending"

    if (filter === "all") {
      const users = await getAllUsers()
      return NextResponse.json({ data: users }, { status: 200 })
    }

    const users = await getPendingUsers()
    return NextResponse.json({ data: users }, { status: 200 })
  } catch (error) {
    console.error("GET /api/v1/admin/users error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
