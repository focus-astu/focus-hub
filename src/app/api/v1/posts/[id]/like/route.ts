import { NextResponse } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { toggleLike } from "@/core/shared/infrastructure/config/dependencies"
import { EntityNotFoundError } from "@/core/shared"
import { headers } from "next/headers"

type RouteParams = {
  params: Promise<{ id: string }>
}

export const POST = async (_request: Request, { params }: RouteParams) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const result = await toggleLike({ postId: id, userId: session.user.id })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("POST /api/v1/posts/[id]/like error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
