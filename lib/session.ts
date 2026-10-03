import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { DEMO_SESSION_COOKIE, isLocalDemoMode, parseDemoProfile } from "@/lib/demo-session"

export type SessionUser = {
  id: string
  name: string
  email: string
  image: string | null
  username: string | null
  bio: string | null
  isDemo: boolean
  academicBranch?: string
  graduationYear?: string
  technicalInterests?: string
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  if (isLocalDemoMode()) {
    const demo = parseDemoProfile((await cookies()).get(DEMO_SESSION_COOKIE)?.value)
    if (!demo) return null
    return {
      id: "local-demo-user",
      name: demo.name,
      email: demo.email,
      image: null,
      username: demo.username,
      bio: null,
      isDemo: true,
      academicBranch: demo.academicBranch,
      graduationYear: demo.graduationYear,
      technicalInterests: demo.technicalInterests,
    }
  }

  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32) {
    return null
  }
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) return null
    const u = session.user as typeof session.user & { username?: string | null; bio?: string | null }
    return {
      id: u.id,
      name: u.name,
      email: u.email,
      image: u.image ?? null,
      username: u.username ?? null,
      bio: u.bio ?? null,
      isDemo: false,
    }
  } catch (error) {
    console.error("Failed to resolve the current Better Auth session:", error)
    return null
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) redirect("/sign-in")
  return user
}

export async function getUserIdOrThrow(): Promise<string> {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")
  if (user.isDemo) throw new Error("Demo mode is read-only; changes are not saved.")
  return user.id
}
