import { randomUUID } from "crypto"
import type { IdGenerator } from "@/core/shared/application/ports/id-generator.port"

export const cryptoIdGenerator: IdGenerator = {
  generate: () => randomUUID(),
}
