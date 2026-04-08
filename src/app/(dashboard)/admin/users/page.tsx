import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { UserApprovalPanel, UserManagementPanel, AdminUsersTabs } from "@/features/admin"

const fetchUsers = async (filter: "pending" | "all") => {
  const headersList = await headers()
  const cookie = headersList.get("cookie") ?? ""

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/v1/admin/users?filter=${filter}`, {
    headers: { cookie },
    cache: "no-store",
  })

  if (res.status === 403) {
    redirect("/")
  }

  if (!res.ok) return []

  const json = await res.json()
  return json.data ?? []
}

export default async function AdminUsersPage() {
  const [pendingUsers, allUsers] = await Promise.all([
    fetchUsers("pending"),
    fetchUsers("all"),
  ])

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          User Management
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Approve registrations and manage user roles.
        </p>
      </div>

      <AdminUsersTabs
        pendingCount={pendingUsers.length}
        allCount={allUsers.length}
        pendingPanel={<UserApprovalPanel initialUsers={pendingUsers} />}
        allUsersPanel={<UserManagementPanel initialUsers={allUsers} />}
      />
    </div>
  )
}
