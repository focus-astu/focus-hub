import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { approveUser, rejectUser } from "@/core/shared/infrastructure/config/dependencies"
import { UserAlreadyApprovedError } from "@/core/auth"
import { headers } from "next/headers"

type RouteParams = {
  params: Promise<{ id: string }>
}

export const POST = async (request: NextRequest, { params }: RouteParams) => {
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

    const { id: userId } = await params
    const body = await request.json() as { action: "approve" | "reject", reason?: string }

    if (!body.action || !["approve", "reject"].includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 },
      )
    }

    if (body.action === "approve") {
      await approveUser({ userId, adminId: session.user.id })
    } else {
      await rejectUser({ userId, adminId: session.user.id, reason: body.reason })
    }

    return NextResponse.json(
      { message: `User ${body.action}d successfully` },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof UserAlreadyApprovedError) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 },
      )
    }

    console.error("POST /api/v1/admin/users/[id]/approve error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
