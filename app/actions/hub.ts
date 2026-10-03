"use server"

import { and, eq, or, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { db } from "@/lib/db"
import { comments, communities, communityMembers, friendships, postVotes, posts, user } from "@/lib/db/schema"
import { USERNAME_RE } from "@/lib/validation"
import { AVATAR_PRESETS } from "@/lib/avatars"
import { getCurrentUser } from "@/lib/session"

type Result = { ok: true } | { ok: false; error: string }

async function getUserId() {
  const currentUser = await getCurrentUser()
  if (!currentUser) throw new Error("Unauthorized")
  if (currentUser.isDemo) throw new Error("Demo mode is read-only; changes are not saved.")
  return currentUser.id
}

const imageSchema = z
  .string()
  .max(500)
  .refine(
    (v) =>
      AVATAR_PRESETS.some((p) => `preset:${p.id}` === v) || /^blob:uploads\/[A-Za-z0-9_-]+\/[^\s]+$/.test(v),
    "Invalid avatar",
  )

const onboardingSchema = z.object({
  username: z.string().trim().toLowerCase().regex(USERNAME_RE),
  bio: z.string().trim().max(160).optional().default(""),
  image: imageSchema,
  communityIds: z.array(z.number().int().positive()).max(20),
})

export async function completeOnboarding(input: z.input<typeof onboardingSchema>): Promise<Result> {
  const userId = await getUserId()
  const parsed = onboardingSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Please check your username and avatar." }
  const { username, bio, image, communityIds } = parsed.data
  if (image.startsWith("blob:") && !image.startsWith(`blob:uploads/${userId}/`)) {
    return { ok: false, error: "Invalid avatar" }
  }

  const taken = await db
    .select({ id: user.id })
    .from(user)
    .where(and(eq(sql`lower(${user.username})`, username), sql`${user.id} <> ${userId}`))
    .limit(1)
  if (taken.length) return { ok: false, error: "That username was just taken. Try another." }

  await db.update(user).set({ username, bio, image, updatedAt: new Date() }).where(eq(user.id, userId))
  if (communityIds.length) {
    await db
      .insert(communityMembers)
      .values(communityIds.map((communityId) => ({ communityId, userId })))
      .onConflictDoNothing()
  }
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function updateProfile(input: { bio: string; image: string }): Promise<Result> {
  const userId = await getUserId()
  const bio = z.string().trim().max(160).safeParse(input.bio)
  const image = imageSchema.safeParse(input.image)
  if (!bio.success || !image.success) return { ok: false, error: "Invalid profile data" }
  if (image.data.startsWith("blob:") && !image.data.startsWith(`blob:uploads/${userId}/`)) {
    return { ok: false, error: "Invalid avatar" }
  }
  await db.update(user).set({ bio: bio.data, image: image.data, updatedAt: new Date() }).where(eq(user.id, userId))
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function toggleMembership(communityId: number): Promise<{ joined: boolean }> {
  const userId = await getUserId()
  const id = z.number().int().positive().parse(communityId)
  const existing = await db
    .select()
    .from(communityMembers)
    .where(and(eq(communityMembers.userId, userId), eq(communityMembers.communityId, id)))
    .limit(1)
  if (existing.length) {
    await db
      .delete(communityMembers)
      .where(and(eq(communityMembers.userId, userId), eq(communityMembers.communityId, id)))
  } else {
    await db.insert(communityMembers).values({ userId, communityId: id })
  }
  revalidatePath("/", "layout")
  return { joined: !existing.length }
}

const communitySchema = z.object({
  name: z.string().trim().min(3).max(40),
  description: z.string().trim().max(240),
  icon: z.string().max(20),
  color: z.string().max(20),
})

export async function createCommunity(input: z.input<typeof communitySchema>): Promise<Result & { slug?: string }> {
  const userId = await getUserId()
  const parsed = communitySchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Name must be 3-40 characters." }
  const slug = parsed.data.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40)
  if (!slug) return { ok: false, error: "Invalid name" }
  const exists = await db.select({ id: communities.id }).from(communities).where(eq(communities.slug, slug)).limit(1)
  if (exists.length) return { ok: false, error: "A community with that name already exists." }
  const [c] = await db
    .insert(communities)
    .values({ ...parsed.data, slug, createdBy: userId })
    .returning({ id: communities.id })
  await db.insert(communityMembers).values({ communityId: c.id, userId, role: "owner" })
  revalidatePath("/", "layout")
  return { ok: true, slug }
}

const postSchema = z.object({
  communityId: z.number().int().positive(),
  title: z.string().trim().min(3).max(200),
  body: z.string().trim().max(10000),
  mediaPath: z.string().max(500).nullable(),
  mediaType: z.string().max(100).nullable(),
  mediaName: z.string().max(200).nullable(),
})

export async function createPost(input: z.input<typeof postSchema>): Promise<Result & { id?: number }> {
  const userId = await getUserId()
  const parsed = postSchema.safeParse(input)
  if (!parsed.success) return { ok: false, error: "Title must be at least 3 characters." }
  if (parsed.data.mediaPath && !parsed.data.mediaPath.startsWith(`uploads/${userId}/`)) {
    return { ok: false, error: "Invalid attachment" }
  }
  const member = await db
    .select()
    .from(communityMembers)
    .where(and(eq(communityMembers.userId, userId), eq(communityMembers.communityId, parsed.data.communityId)))
    .limit(1)
  if (!member.length) return { ok: false, error: "Join this community to post in it." }
  const [p] = await db
    .insert(posts)
    .values({ ...parsed.data, userId })
    .returning({ id: posts.id })
  revalidatePath("/", "layout")
  return { ok: true, id: p.id }
}

export async function votePost(postId: number, value: 1 | -1 | 0) {
  const userId = await getUserId()
  const id = z.number().int().positive().parse(postId)
  const v = z.union([z.literal(1), z.literal(-1), z.literal(0)]).parse(value)
  if (v === 0) {
    await db.delete(postVotes).where(and(eq(postVotes.postId, id), eq(postVotes.userId, userId)))
  } else {
    await db
      .insert(postVotes)
      .values({ postId: id, userId, value: v })
      .onConflictDoUpdate({ target: [postVotes.postId, postVotes.userId], set: { value: v } })
  }
  revalidatePath("/", "layout")
}

export async function addComment(postId: number, body: string): Promise<Result> {
  const userId = await getUserId()
  const id = z.number().int().positive().parse(postId)
  const text = z.string().trim().min(1).max(4000).safeParse(body)
  if (!text.success) return { ok: false, error: "Comment cannot be empty." }
  await db.insert(comments).values({ postId: id, userId, body: text.data })
  revalidatePath(`/post/${id}`)
  return { ok: true }
}

export async function deletePost(postId: number) {
  const userId = await getUserId()
  const id = z.number().int().positive().parse(postId)
  await db.delete(posts).where(and(eq(posts.id, id), eq(posts.userId, userId)))
  revalidatePath("/", "layout")
}

export async function sendFriendRequest(targetId: string): Promise<Result> {
  const userId = await getUserId()
  const target = z.string().min(1).max(100).parse(targetId)
  if (target === userId) return { ok: false, error: "You can't add yourself." }
  const existing = await db
    .select()
    .from(friendships)
    .where(
      or(
        and(eq(friendships.requesterId, userId), eq(friendships.addresseeId, target)),
        and(eq(friendships.requesterId, target), eq(friendships.addresseeId, userId)),
      ),
    )
    .limit(1)
  if (existing.length) {
    const f = existing[0]
    if (f.status === "pending" && f.addresseeId === userId) {
      await db.update(friendships).set({ status: "accepted" }).where(eq(friendships.id, f.id))
    }
  } else {
    await db.insert(friendships).values({ requesterId: userId, addresseeId: target })
  }
  revalidatePath("/", "layout")
  return { ok: true }
}

export async function respondFriendRequest(friendshipId: number, accept: boolean) {
  const userId = await getUserId()
  const id = z.number().int().positive().parse(friendshipId)
  if (accept) {
    await db
      .update(friendships)
      .set({ status: "accepted" })
      .where(and(eq(friendships.id, id), eq(friendships.addresseeId, userId)))
  } else {
    await db.delete(friendships).where(and(eq(friendships.id, id), eq(friendships.addresseeId, userId)))
  }
  revalidatePath("/", "layout")
}

export async function removeFriendship(friendshipId: number) {
  const userId = await getUserId()
  const id = z.number().int().positive().parse(friendshipId)
  await db
    .delete(friendships)
    .where(and(eq(friendships.id, id), or(eq(friendships.requesterId, userId), eq(friendships.addresseeId, userId))))
  revalidatePath("/", "layout")
}
