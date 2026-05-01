import type { SupabaseClient } from "@supabase/supabase-js"
import { ValidationError } from "@/core/shared"

const MAX_SIZE_BYTES = 5 * 1024 * 1024
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const BUCKET_NAME = "post-images"

export type ImageUploadService = {
  upload: (base64Data: string) => Promise<string>
  delete: (imageUrl: string) => Promise<void>
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

const extractStoragePath = (publicUrl: string): string | null => {
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`
  const idx = publicUrl.indexOf(marker)
  if (idx === -1) return null
  return publicUrl.slice(idx + marker.length)
}

export const createImageUploadService = (supabase: SupabaseClient): ImageUploadService => ({
  upload: async (base64Data: string): Promise<string> => {
    const { mimeType, data } = parseMimeType(base64Data)

    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw new ValidationError(`Unsupported image format: ${mimeType}. Allowed: JPEG, PNG, WebP, GIF`)
    }

    const buffer = Buffer.from(data, "base64")

    if (buffer.byteLength > MAX_SIZE_BYTES) {
      throw new ValidationError("Image too large. Maximum size is 5MB.")
    }

    const ext = mimeToExt[mimeType] ?? ".jpg"
    const filename = `${crypto.randomUUID()}${ext}`
    const storagePath = `posts/${filename}`

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(storagePath, buffer, {
        contentType: mimeType,
        upsert: false,
      })

    if (error) {
      throw new ValidationError(`Image upload failed: ${error.message}`)
    }

    const { data: urlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(storagePath)

    return urlData.publicUrl
  },

  delete: async (imageUrl: string): Promise<void> => {
    const storagePath = extractStoragePath(imageUrl)
    if (!storagePath) return

    await supabase.storage
      .from(BUCKET_NAME)
      .remove([storagePath])
  },
})
