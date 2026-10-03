import { z } from "zod"

export const DEMO_SESSION_COOKIE = "acadhub-demo-session"

export const demoProfileSchema = z.object({
  name: z.string().trim().min(2).max(50),
  email: z.email(),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_]{3,20}$/),
  academicBranch: z.string().trim().max(80).optional().default(""),
  graduationYear: z.string().trim().max(4).optional().default(""),
  technicalInterests: z.string().trim().max(200).optional().default(""),
})

export type DemoProfile = z.infer<typeof demoProfileSchema>

export function isLocalDemoMode() {
  return process.env.NODE_ENV === "development" && !process.env.DATABASE_URL
}

export function parseDemoProfile(value: string | undefined): DemoProfile | null {
  if (!value) return null

  try {
    const decoded = Buffer.from(value, "base64url").toString("utf8")
    const result = demoProfileSchema.safeParse(JSON.parse(decoded))
    return result.success ? result.data : null
  } catch (error) {
    console.error("Could not read the local demo session cookie:", error)
    return null
  }
}
