import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { NextResponse } from "next/server"
import { checkAuthReadiness } from "@/lib/auth-readiness"

const handlers = toNextJsHandler(auth)

async function handleAuthRequest(request: Request, handler: (request: Request) => Promise<Response>) {
  const readiness = await checkAuthReadiness()
  if (readiness.demoMode) {
    const isSessionLookup = request.method === "GET" && new URL(request.url).pathname.endsWith("/api/auth/get-session")
    if (isSessionLookup) {
      return NextResponse.json(null, { headers: { "Cache-Control": "no-store" } })
    }
    return NextResponse.json({ message: readiness.message }, { status: 503 })
  }

  if (!readiness.ready) {
    return NextResponse.json({ message: readiness.message }, { status: 503 })
  }

  return handler(request)
}

export const GET = (request: Request) => handleAuthRequest(request, handlers.GET)
export const POST = (request: Request) => handleAuthRequest(request, handlers.POST)
