import { NextResponse } from "next/server"
import { getTopPosts } from "@/core/shared/infrastructure/config/dependencies"

export const GET = async () => {
  try {
    const posts = await getTopPosts(3)
    return NextResponse.json({ posts })
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Internal server error"
    console.error("GET /api/v1/posts/top error:", msg)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
