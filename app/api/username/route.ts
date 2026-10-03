import { type NextRequest, NextResponse } from "next/server"
import { eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { user } from "@/lib/db/schema"
import { USERNAME_RE } from "@/lib/validation"

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("u")?.trim().toLowerCase() ?? ""
  if (!USERNAME_RE.test(raw)) {
    return NextResponse.json({ available: false, reason: "invalid" })
  }
  const rows = await db
    .select({ id: user.id })
    .from(user)
    .where(eq(sql`lower(${user.username})`, raw))
    .limit(1)
  return NextResponse.json({ available: rows.length === 0 })
}
