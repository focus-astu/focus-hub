import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { headers } from "next/headers"

export const GET = async () => {
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

    const orgs = await auth.api.listOrganizations({
      headers: await headers(),
    })

    return NextResponse.json({ data: orgs }, { status: 200 })
  } catch (error) {
    console.error("GET /api/v1/admin/organizations error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}

export const POST = async (request: NextRequest) => {
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

    type OrgRole = "member" | "admin" | "owner" | "teacher" | "counselor" | "generalLeader"

    const body = await request.json() as {
      organizationId: string
      userId: string
      role: OrgRole
    }

    if (!body.organizationId || !body.userId || !body.role) {
      return NextResponse.json(
        { error: "Missing required fields: organizationId, userId, role" },
        { status: 400 },
      )
    }

    await auth.api.addMember({
      body: {
        organizationId: body.organizationId,
        userId: body.userId,
        role: body.role,
      },
    })

    return NextResponse.json(
      { message: "Member added successfully" },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/v1/admin/organizations error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
