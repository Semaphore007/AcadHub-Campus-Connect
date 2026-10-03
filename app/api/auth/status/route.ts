import { NextResponse } from "next/server"
import { checkAuthReadiness } from "@/lib/auth-readiness"

export async function GET() {
  const readiness = await checkAuthReadiness()
  if (!readiness.ready) {
    return NextResponse.json(
      readiness,
      { status: 503 },
    )
  }
  return NextResponse.json(readiness)
}
