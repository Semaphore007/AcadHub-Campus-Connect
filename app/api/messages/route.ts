import { type NextRequest, NextResponse } from "next/server"
import { sql } from "drizzle-orm"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { messages } from "@/lib/db/schema"
import { areFriends, isMember } from "@/lib/queries"

export type ChatMessage = {
  id: number
  body: string
  kind: "text" | "voice" | "image" | "video" | "file"
  mediaPath: string | null
  mediaName: string | null
  createdAt: string
  senderId: string
  senderName: string
  senderUsername: string | null
  senderImage: string | null
}

async function authorize(userId: string, dm: string | null, community: string | null) {
  if (dm) return (await areFriends(userId, dm)) ? { dm } : null
  const id = Number(community)
  if (Number.isInteger(id) && id > 0 && (await isMember(userId, id))) return { community: id }
  return null
}

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id
  const params = request.nextUrl.searchParams
  const target = await authorize(userId, params.get("dm"), params.get("community"))
  if (!target) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  const where =
    "dm" in target
      ? sql`(m."senderId" = ${userId} and m."recipientId" = ${target.dm}) or (m."senderId" = ${target.dm} and m."recipientId" = ${userId})`
      : sql`m."communityId" = ${target.community}`

  const res = await db.execute(sql`
    select * from (
      select m.id, m.body, m.kind, m."mediaPath", m."mediaName", m."createdAt",
        u.id as "senderId", u.name as "senderName", u.username as "senderUsername", u.image as "senderImage"
      from messages m join "user" u on u.id = m."senderId"
      where ${where}
      order by m."createdAt" desc
      limit 150
    ) t order by t."createdAt" asc
  `)
  return NextResponse.json({ messages: res.rows as ChatMessage[] })
}

const postSchema = z.object({
  dm: z.string().max(100).nullable().optional(),
  community: z.number().int().positive().nullable().optional(),
  body: z.string().max(4000).default(""),
  kind: z.enum(["text", "voice", "image", "video", "file"]),
  mediaPath: z.string().max(500).nullable().optional(),
  mediaName: z.string().max(200).nullable().optional(),
})

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: request.headers })
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const userId = session.user.id

  const parsed = postSchema.safeParse(await request.json())
  if (!parsed.success) return NextResponse.json({ error: "Invalid message" }, { status: 400 })
  const data = parsed.data
  if (data.kind === "text" && !data.body.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 })
  if (data.kind !== "text" && !data.mediaPath) return NextResponse.json({ error: "Missing media" }, { status: 400 })
  if (data.mediaPath && !data.mediaPath.startsWith(`uploads/${userId}/`)) {
    return NextResponse.json({ error: "Invalid media" }, { status: 400 })
  }

  const target = await authorize(userId, data.dm ?? null, data.community ? String(data.community) : null)
  if (!target) return NextResponse.json({ error: "Forbidden" }, { status: 403 })

  await db.insert(messages).values({
    senderId: userId,
    recipientId: "dm" in target ? target.dm : null,
    communityId: "community" in target ? target.community : null,
    body: data.body.trim(),
    kind: data.kind,
    mediaPath: data.mediaPath ?? null,
    mediaName: data.mediaName ?? null,
  })
  return NextResponse.json({ ok: true })
}
