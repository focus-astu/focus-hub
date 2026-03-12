import { roles } from "@/core/auth/infrastructure/config/permissions"
import { adminClient, organizationClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    plugins: [
        organizationClient({
            roles: {
                member: roles.member,
                teacher: roles.teacher,
                counselor: roles.counselor,
                generalLeader: roles.generalLeader,
                admin: roles.platformAdmin,
                owner: roles.platformAdmin,
            },
        }),

        adminClient({
            roles: {
                admin: roles.platformAdmin,
                user: roles.member,
            },
        }),
    ],
})

export type Session = typeof authClient.$Infer.Session
