import { betterAuth } from "better-auth"
import { organization, admin } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js"
import { createAuthMiddleware, APIError } from "better-auth/api"
import { mongodbAdapter } from "better-auth/adapters/mongodb"
import { MongoClient, ObjectId, type Db } from "mongodb"
import { ac, member, teacher, counselor, generalLeader, platformAdmin } from "./permissions"

let _client: MongoClient | null = null
let _db: Db | null = null

const getDb = () => {
  if (!_db) {
    const uri = process.env.MONGODB_URI
    if (!uri) throw new Error("MONGODB_URI environment variable is not set")
    _client = new MongoClient(uri)
    _db = _client.db()
  }
  return _db
}

const db = process.env.MONGODB_URI ? getDb() : null!

const generateId = () => crypto.randomUUID()

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

      const user = await getDb().collection("user").findOne({ email })
      if (!user) return
      if (!user.emailVerified) return
      if (!user.approved) {
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
          const userDb = getDb()
          const userCount = await userDb.collection("user").countDocuments()
          if (userCount !== 1) return

          await userDb.collection("user").updateOne(
            { _id: new ObjectId(user.id) },
            { $set: { role: "admin", approved: true } },
          )

          const now = new Date()
          const defaultOrgs = [
            { name: "Teachers", slug: "teachers" },
            { name: "Counselors", slug: "counselors" },
            { name: "General Leaders", slug: "general-leaders" },
            { name: "Admins", slug: "admins" },
          ]

          for (const org of defaultOrgs) {
            const orgId = generateId()
            await userDb.collection("organization").insertOne({
              id: orgId,
              name: org.name,
              slug: org.slug,
              logo: null,
              metadata: null,
              createdAt: now,
            })
            await userDb.collection("member").insertOne({
              id: generateId(),
              organizationId: orgId,
              userId: user.id,
              role: "owner",
              createdAt: now,
            })
          }

          console.log(`[AUTH] First user ${user.email} promoted to admin with default organizations`)
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
