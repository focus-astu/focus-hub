import type { Role } from "better-auth/plugins/access"

const role = (name: string) => name as unknown as Role

export const roles = {
  member: role("member"),
  teacher: role("teacher"),
  counselor: role("counselor"),
  generalLeader: role("generalLeader"),
  platformAdmin: role("platformAdmin"),
}