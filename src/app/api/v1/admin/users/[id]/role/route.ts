import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { changeRole } from "@/core/shared/infrastructure/config/dependencies"
import { SuperAdminDemotionError, OrgNotFoundError, ASSIGNABLE_ROLES } from "@/core/auth"
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
    const body = await request.json() as { role: string, action: string }

    if (!body.role || !body.action) {
      return NextResponse.json(
        { error: "Missing required fields: role, action" },
        { status: 400 },
      )
    }

    if (!ASSIGNABLE_ROLES.includes(body.role as typeof ASSIGNABLE_ROLES[number])) {
      return NextResponse.json(
        { error: `Invalid role. Must be one of: ${ASSIGNABLE_ROLES.join(", ")}` },
        { status: 400 },
      )
    }

    if (!["assign", "remove"].includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'assign' or 'remove'" },
        { status: 400 },
      )
    }

    await changeRole({
      userId,
      role: body.role as typeof ASSIGNABLE_ROLES[number],
      action: body.action as "assign" | "remove",
      adminId: session.user.id,
    })

    return NextResponse.json(
      { message: `Role ${body.action === "assign" ? "assigned" : "removed"} successfully` },
      { status: 200 },
    )
  } catch (error) {
    if (error instanceof SuperAdminDemotionError) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 },
      )
    }

    if (error instanceof OrgNotFoundError) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 },
      )
    }

    console.error("POST /api/v1/admin/users/[id]/role error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
