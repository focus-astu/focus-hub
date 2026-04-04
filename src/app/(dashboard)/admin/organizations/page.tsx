import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { OrgManagementPanel } from "@/features/admin"

const getOrganizations = async () => {
  const headersList = await headers()
  const cookie = headersList.get("cookie") ?? ""

  const baseUrl = process.env.BETTER_AUTH_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/v1/admin/organizations`, {
    headers: { cookie },
    cache: "no-store",
  })

  if (res.status === 403) {
    redirect("/")
  }

  if (!res.ok) {
    return []
  }

  const json = await res.json()
  return json.data ?? []
}

export default async function AdminOrganizationsPage() {
  const organizations = await getOrganizations()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Organizations
        </h1>
        <p className="mt-2 text-sm text-slate-500 sm:text-base">
          Manage organizations and their members.
        </p>
      </div>

      <OrgManagementPanel initialOrgs={organizations} />
    </div>
  )
}
