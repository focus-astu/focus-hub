import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { createPost, getPosts } from "@/core/shared/infrastructure/config/dependencies"
import { ValidationError } from "@/core/shared"
import { headers } from "next/headers"
import { MongoClient } from "mongodb"

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

export const POST = async (request: NextRequest) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const canPost = await isGeneralLeaderOrAdmin(session.user.id, session.user.role ?? "user")
    if (!canPost) {
      return NextResponse.json({ error: "Only General Leaders or admins can create posts" }, { status: 403 })
    }

    const body = await request.json() as { content?: string, title?: string, imageBase64?: string }

    const post = await createPost({
      authorId: session.user.id,
      authorName: session.user.name,
      content: body.content ?? "",
      title: body.title,
      imageBase64: body.imageBase64,
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("POST /api/v1/posts error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export const GET = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const result = await getPosts({
      page: 1,
      limit: 50,
      currentUserId: session.user.id,
    })

    return NextResponse.json(result)
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("GET /api/v1/posts error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
