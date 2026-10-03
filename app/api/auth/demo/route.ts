import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/session"
import { DEMO_SESSION_COOKIE, demoProfileSchema, isLocalDemoMode } from "@/lib/demo-session"

const unavailable = () =>
  NextResponse.json({ message: "Local demo access is only available in development without a database." }, { status: 404 })

export async function GET() {
  if (!isLocalDemoMode()) return unavailable()

  const user = await getCurrentUser()
  return NextResponse.json({ demoMode: true, user: user?.isDemo ? user : null })
}

export async function POST(request: Request) {
  if (!isLocalDemoMode()) return unavailable()

  let input: unknown
  try {
    input = await request.json()
  } catch {
    return NextResponse.json({ message: "Provide valid demo profile details." }, { status: 400 })
  }

  const profile = demoProfileSchema.safeParse(input)
  if (!profile.success) {
    return NextResponse.json({ message: "Enter valid demo profile details to continue." }, { status: 400 })
  }

  const response = NextResponse.json({ ok: true, demoMode: true })
  response.cookies.set(DEMO_SESSION_COOKIE, Buffer.from(JSON.stringify(profile.data)).toString("base64url"), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 8,
  })
  return response
}

export async function DELETE() {
  if (!isLocalDemoMode()) return unavailable()

  const response = NextResponse.json({ ok: true })
  response.cookies.delete(DEMO_SESSION_COOKIE)
  return response
}
