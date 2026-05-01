import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { editUpdate, deleteUpdate } from "@/core/shared/infrastructure/config/dependencies"
import { EntityNotFoundError, ValidationError } from "@/core/shared"
import { headers } from "next/headers"
import { MongoClient } from "mongodb"

type RouteParams = {
  params: Promise<{ id: string }>
}

const isGeneralLeaderOrAdmin = async (userId: string, userRole: string): Promise<boolean> => {
  if (userRole === "admin") return true

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

export const PUT = async (request: NextRequest, { params }: RouteParams) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canManage = await isGeneralLeaderOrAdmin(session.user.id, session.user.role ?? "user")
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const body = await request.json() as {
      title?: string
      description?: string
      category?: string
      imageBase64?: string
      removeImage?: boolean
    }

    const updated = await editUpdate({
      id,
      title: body.title,
      description: body.description,
      category: body.category as "prayer" | "fellowship" | "worship" | "outreach" | "other" | undefined,
      imageBase64: body.imageBase64,
      removeImage: body.removeImage,
    })

    return NextResponse.json(updated)
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("PUT /api/v1/updates/[id] error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const DELETE = async (_request: Request, { params }: RouteParams) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canManage = await isGeneralLeaderOrAdmin(session.user.id, session.user.role ?? "user")
    if (!canManage) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params

    await deleteUpdate({
      updateId: id,
      requesterId: session.user.id,
      isAdmin: session.user.role === "admin",
    })

    return NextResponse.json({ message: "Update deleted" })
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("DELETE /api/v1/updates/[id] error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
