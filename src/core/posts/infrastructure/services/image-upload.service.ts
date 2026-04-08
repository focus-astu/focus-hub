import { writeFile, mkdir } from "fs/promises"
import path from "path"
import { ValidationError } from "@/core/shared"

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "posts")

export type ImageUploadService = {
  upload: (base64Data: string) => Promise<string>
}

const parseMimeType = (base64: string): { mimeType: string, data: string } => {
  const match = base64.match(/^data:(image\/\w+);base64,(.+)$/)
  if (!match) throw new ValidationError("Invalid image data format. Expected base64 with data URI prefix.")
  return { mimeType: match[1], data: match[2] }
}

const mimeToExt: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
}

export const createImageUploadService = (): ImageUploadService => ({
  upload: async (base64Data: string): Promise<string> => {
    const { mimeType, data } = parseMimeType(base64Data)

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new ValidationError(`Unsupported image format: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF`)
    }

    const buffer = Buffer.from(data, "base64")

    if (buffer.byteLength > MAX_SIZE_BYTES) {
      throw new ValidationError("Image too large. Maximum size is 5MB.")
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext = mimeToExt[mimeType] ?? ".jpg"
    const filename = `${crypto.randomUUID()}${ext}`
    const filepath = path.join(UPLOAD_DIR, filename)

    await writeFile(filepath, buffer)

    return `/uploads/posts/${filename}`
  },
})
