import { NextResponse } from "next/server"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { deletePost } from "@/core/shared/infrastructure/config/dependencies"
import { EntityNotFoundError, DomainError } from "@/core/shared"
import { headers } from "next/headers"

type RouteParams = {
  params: Promise<{ id: string }>
}

export const DELETE = async (_request: Request, { params }: RouteParams) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await deletePost({
      postId: id,
      requesterId: session.user.id,
      isAdmin: session.user.role === "admin",
    })

    return NextResponse.json({ message: "Post deleted" })
  } catch (error) {
    if (error instanceof EntityNotFoundError) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }
    if (error instanceof DomainError && error.code === "FORBIDDEN") {
      return NextResponse.json({ error: error.message }, { status: 403 })
    }
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("DELETE /api/v1/posts/[id] error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
