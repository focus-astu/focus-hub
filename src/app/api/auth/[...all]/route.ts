import { auth } from "@/core/auth/infrastructure/config/auth"
import { toNextJsHandler } from "better-auth/next-js"

export const { POST, GET } = toNextJsHandler(auth)
