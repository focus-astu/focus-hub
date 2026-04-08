import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const CHAPA_API = "https://api.chapa.co/v1/transaction/initialize"

export const POST = async (request: NextRequest) => {
  try {
    const secretKey = process.env.CHAPA_SECRET_KEY
    if (!secretKey) {
      return NextResponse.json(
        { error: "Payment service not configured" },
        { status: 503 },
      )
    }

    const body = await request.json() as {
      amount: number
      firstName?: string
      lastName?: string
      email?: string
    }

    if (!body.amount || body.amount < 1) {
      return NextResponse.json(
        { error: "Amount must be at least 1 ETB" },
        { status: 400 },
      )
    }

    const txRef = `focus-donate-${crypto.randomUUID()}`
    const baseUrl = process.env.BETTER_AUTH_URL ?? "http://localhost:3000"

    const chapaPayload = {
      amount: String(body.amount),
      currency: "ETB",
      tx_ref: txRef,
      return_url: `${baseUrl}/donation-success?tx_ref=${txRef}`,
      customization: {
        title: "Focus Donation",
        description: "Supporting our fellowship",
      },
      ...(body.email && { email: body.email }),
      ...(body.firstName && { first_name: body.firstName }),
      ...(body.lastName && { last_name: body.lastName }),
    }

    const chapaRes = await fetch(CHAPA_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapaPayload),
    })

    const chapaData = await chapaRes.json()

    if (!chapaRes.ok || chapaData.status !== "success") {
      console.error("Chapa initialize error:", chapaData)
      const message = typeof chapaData.message === "string"
        ? chapaData.message
        : "Failed to initialize payment"
      return NextResponse.json(
        { error: message },
        { status: 502 },
      )
    }

    return NextResponse.json(
      { checkoutUrl: chapaData.data.checkout_url, txRef },
      { status: 200 },
    )
  } catch (error) {
    console.error("POST /api/v1/donations/initialize error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    )
  }
}
