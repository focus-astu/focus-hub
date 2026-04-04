import { NextRequest, NextResponse } from "next/server"
import { MongoClient, type Db } from "mongodb"

let _client: MongoClient | null = null
let _db: Db | null = null

const getDb = () => {
  if (!_db) {
    _client = new MongoClient(process.env.MONGODB_URI!)
    _db = _client.db()
  }
  return _db
}

export const POST = async (req: NextRequest) => {
  try {
    const { email } = await req.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      )
    }

    const db = getDb()
    const user = await db.collection("user").findOne(
      { email: email.toLowerCase().trim() },
      { projection: { approved: 1 } },
    )

    if (!user) {
      return NextResponse.json({ approved: false })
    }

    return NextResponse.json({ approved: !!user.approved })
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
