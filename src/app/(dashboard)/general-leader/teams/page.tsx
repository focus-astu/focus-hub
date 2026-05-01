import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/core/auth/infrastructure/config/auth"
import { GLTeamManagement } from "@/features/general-leader"
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
    const membership = await db.collection("member").findOne({ organizationId: glOrg.id, userId })
    return !!membership
  } finally {
    await client.close()
  }
}

export default async function GLTeamsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const canAccess = await isGeneralLeaderOrAdmin(session.user.id, session.user.role ?? "user")
  if (!canAccess) redirect("/dashboard")

  return <GLTeamManagement />
}
