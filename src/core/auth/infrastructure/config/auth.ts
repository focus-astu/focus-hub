import { betterAuth } from "better-auth"
import { organization, admin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient } from "mongodb"
import { ac, member, teacher, counselor, generalLeader, platformAdmin } from "./permissions"

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db()

export const auth = betterAuth({
  database: mongodbAdapter(db),

  user: {
    additionalFields: {
      universityId: {
        type: "string",
        required: true,
        input: true,
      },
      year: {
        type: "number",
        required: true,
        input: true,
      },
      department: {
        type: "string",
        required: false,
        input: true,
      },
      approved: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendOnSignUp: true,
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Replace with Resend or production email service
      console.log(`[DEV] Verification email for ${user.email}: ${url}`)
    },
    autoSignInAfterVerification: true,
  },

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-in/email") return

      const email = ctx.body?.email
      if (!email) return

      const user = await db.collection("user").findOne({ email })
      if (user && !user.approved) {
        throw new APIError("FORBIDDEN", {
          message: "Your account is pending admin approval",
        })
      }
    }),
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const userCount = await db.collection("user").countDocuments()
          if (userCount !== 1) return

          await auth.api.setRole({
            body: { userId: user.id, role: "admin" },
          })

          await db.collection("user").updateOne(
            { _id: user.id },
            { $set: { approved: true } },
          )

          const defaultOrgs = [
            { name: "Teachers", slug: "teachers" },
            { name: "Counselors", slug: "counselors" },
            { name: "General Leaders", slug: "general-leaders" },
            { name: "Admins", slug: "admins" },
          ]

          for (const org of defaultOrgs) {
            await auth.api.createOrganization({
              body: {
                name: org.name,
                slug: org.slug,
                userId: user.id,
              },
            })
          }
        },
      },
    },
  },

  plugins: [
    organization({
      ac,
      roles: {
        member,
        admin: platformAdmin,
        owner: platformAdmin,
        teacher,
        counselor,
        generalLeader,
      },
      allowUserToCreateOrganization: async () => false,
    }),
    admin(),
    nextCookies(),
  ],
})
