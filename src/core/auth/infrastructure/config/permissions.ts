import { createAccessControl } from "better-auth/plugins/access"
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/organization/access"

export const statement = {
  ...defaultStatements,
  announcement: ["create", "read", "update", "delete"],
  blogPost: ["create", "read", "update", "delete"],
  task: ["create", "read", "update", "delete", "assign"],
  learningResource: ["create", "read", "update", "delete"],
  counseling: ["create", "read"],
  userManagement: ["approve", "reject", "ban", "promote"],
} as const

export const ac = createAccessControl(statement)

export const member = ac.newRole({
  announcement: ["read"],
  blogPost: ["read"],
  task: ["read"],
  learningResource: ["read"],
})

export const teacher = ac.newRole({
  announcement: ["read"],
  blogPost: ["read"],
  task: ["create", "read", "update", "delete", "assign"],
  learningResource: ["create", "read", "update", "delete"],
})

export const counselor = ac.newRole({
  announcement: ["read"],
  blogPost: ["read"],
  counseling: ["create", "read"],
})

export const generalLeader = ac.newRole({
  announcement: ["create", "read", "update", "delete"],
  blogPost: ["create", "read", "update", "delete"],
})

export const platformAdmin = ac.newRole({
  ...adminAc.statements,
  announcement: ["create", "read", "update", "delete"],
  blogPost: ["create", "read", "update", "delete"],
  task: ["create", "read", "update", "delete", "assign"],
  learningResource: ["create", "read", "update", "delete"],
  counseling: ["create", "read"],
  userManagement: ["approve", "reject", "ban", "promote"],
})
