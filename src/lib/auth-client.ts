import {
  ac,
  member,
  teacher,
  counselor,
  generalLeader,
  platformAdmin,
} from "@/core/auth/infrastructure/config/permissions"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
  plugins: [
    organizationClient({
      ac,
      roles: {
        member,
        teacher,
        counselor,
        generalLeader,
        admin: platformAdmin,
        owner: platformAdmin,
      },
    }),
    adminClient(),
  ],
})

export type Session = typeof authClient.$Infer.Session
