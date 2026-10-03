import { pool } from "@/lib/db"
import { isLocalDemoMode } from "@/lib/demo-session"

export type AuthReadiness =
  | { ready: true; demoMode: boolean; message?: string }
  | { ready: false; demoMode: false; message: string }

export async function checkAuthReadiness(): Promise<AuthReadiness> {
  if (isLocalDemoMode()) {
    return {
      ready: true,
      demoMode: true,
      message: "Local demo access is enabled. Your profile and activity will not be saved.",
    }
  }

  if (!process.env.DATABASE_URL) {
    return {
      ready: false,
      demoMode: false,
      message: "Account storage is not configured. Set DATABASE_URL in the server environment.",
    }
  }

  if (!process.env.BETTER_AUTH_SECRET || process.env.BETTER_AUTH_SECRET.length < 32) {
    return {
      ready: false,
      demoMode: false,
      message: "Authentication is not configured. Set BETTER_AUTH_SECRET to at least 32 characters.",
    }
  }

  try {
    await pool.query(`
      SELECT "id", "email", "username", "academicBranch", "graduationYear", "technicalInterests"
      FROM "user"
      LIMIT 0
    `)
    await pool.query('SELECT "id", "token", "userId" FROM "session" LIMIT 0')
    await pool.query('SELECT "id", "accountId", "providerId", "userId" FROM "account" LIMIT 0')
    await pool.query('SELECT "id", "identifier", "value" FROM "verification" LIMIT 0')

    return { ready: true, demoMode: false }
  } catch (error) {
    console.error("Authentication database readiness check failed:", error)
    return {
      ready: false,
      demoMode: false,
      message: "Account database is not ready. Apply the Better Auth database migrations, then try again.",
    }
  }
}
