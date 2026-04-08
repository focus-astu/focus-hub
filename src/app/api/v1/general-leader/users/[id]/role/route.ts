import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { changeRole } from "@/core/shared/infrastructure/config/dependencies"
import { SuperAdminDemotionError, OrgNotFoundError } from "@/core/auth"
import { headers } from "next/headers"
import { MongoClient } from "mongodb"

type RouteParams = {
  params: Promise<{ id: string }>
}

const isGeneralLeader = async (userId: string): Promise<boolean> => {
  const uri = process.env.MONGODB_URI
  if (!uri) return false

  const client = new MongoClient(uri)
  try {
    const db = client.db()
    const glOrg = await db.collection("organization").findOne({ slug: "general-leaders" })
    if (!glOrg) return false
    const membership = await db.collection("member").findOne({
      organizationId: glOrg.id,
      userId,
    })
    return !!membership
  } finally {
    await client.close()
  }
}

export const POST = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const isGL = session.user.role === "admin" || await isGeneralLeader(session.user.id)
    if (!isGL) {
      return NextResponse.json({ error: "Only General Leaders can perform this action" }, { status: 403 })
    }

    const { id: userId } = await params
    const body = await request.json() as { action: string }

    if (!body.action || !["assign", "remove"].includes(body.action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'assign' or 'remove'" },
        { status: 400 },
      )
    }

    await changeRole({
      userId,
      role: "generalLeader",
      action: body.action as "assign" | "remove",
      adminId: session.user.id,
    })

    return NextResponse.json({
      message: `General Leader role ${body.action === "assign" ? "assigned" : "removed"} successfully`,
    })
  } catch (error) {
    if (error instanceof SuperAdminDemotionError) {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    if (error instanceof OrgNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("POST /api/v1/general-leader/users/[id]/role error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
