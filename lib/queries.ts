import { sql } from "drizzle-orm"
import { db } from "@/lib/db"

export type CommunityRow = {
  id: number
  slug: string
  name: string
  description: string
  icon: string
  color: string
  memberCount: number
  postCount: number
  joined: boolean
}

export type PostRow = {
  id: number
  title: string
  body: string
  mediaPath: string | null
  mediaType: string | null
  mediaName: string | null
  createdAt: string
  communityId: number
  communitySlug: string
  communityName: string
  communityIcon: string
  communityColor: string
  authorId: string
  authorName: string
  authorUsername: string | null
  authorImage: string | null
  score: number
  myVote: number
  commentCount: number
}

export type PublicUser = {
  id: string
  name: string
  username: string | null
  image: string | null
  bio?: string | null
}

async function rows<T>(query: ReturnType<typeof sql>): Promise<T[]> {
  const res = await db.execute(query)
  return res.rows as T[]
}

export function getCommunities(userId: string | null) {
  return rows<CommunityRow>(sql`
    select c.id, c.slug, c.name, c.description, c.icon, c.color,
      (select count(*)::int from community_members m where m."communityId" = c.id) as "memberCount",
      (select count(*)::int from posts p where p."communityId" = c.id) as "postCount",
      exists(select 1 from community_members m where m."communityId" = c.id and m."userId" = ${userId ?? ""}) as joined
    from communities c
    order by "memberCount" desc, c.name asc
  `)
}

export function getMyCommunities(userId: string) {
  return rows<Pick<CommunityRow, "id" | "slug" | "name" | "icon" | "color">>(sql`
    select c.id, c.slug, c.name, c.icon, c.color
    from communities c
    join community_members m on m."communityId" = c.id
    where m."userId" = ${userId}
    order by c.name asc
  `)
}

export async function getCommunityBySlug(slug: string, userId: string | null) {
  const [c] = await rows<CommunityRow>(sql`
    select c.id, c.slug, c.name, c.description, c.icon, c.color,
      (select count(*)::int from community_members m where m."communityId" = c.id) as "memberCount",
      (select count(*)::int from posts p where p."communityId" = c.id) as "postCount",
      exists(select 1 from community_members m where m."communityId" = c.id and m."userId" = ${userId ?? ""}) as joined
    from communities c where c.slug = ${slug} limit 1
  `)
  return c ?? null
}

export function getPosts(opts: {
  userId: string
  communityId?: number
  authorId?: string
  joinedOnly?: boolean
  sort?: "hot" | "new" | "top"
  postId?: number
}) {
  const { userId, communityId, authorId, joinedOnly, sort = "hot", postId } = opts
  const order =
    sort === "new"
      ? sql`p."createdAt" desc`
      : sort === "top"
        ? sql`score desc, p."createdAt" desc`
        : sql`(score + 1) / power(extract(epoch from (now() - p."createdAt")) / 3600 + 2, 1.5) desc`
  return rows<PostRow>(sql`
    select * from (
      select p.id, p.title, p.body, p."mediaPath", p."mediaType", p."mediaName", p."createdAt",
        c.id as "communityId", c.slug as "communitySlug", c.name as "communityName", c.icon as "communityIcon", c.color as "communityColor",
        u.id as "authorId", u.name as "authorName", u.username as "authorUsername", u.image as "authorImage",
        coalesce((select sum(v.value)::int from post_votes v where v."postId" = p.id), 0) as score,
        coalesce((select v.value from post_votes v where v."postId" = p.id and v."userId" = ${userId}), 0) as "myVote",
        (select count(*)::int from comments cm where cm."postId" = p.id) as "commentCount"
      from posts p
      join communities c on c.id = p."communityId"
      join "user" u on u.id = p."userId"
      where true
        ${communityId ? sql`and p."communityId" = ${communityId}` : sql``}
        ${authorId ? sql`and p."userId" = ${authorId}` : sql``}
        ${postId ? sql`and p.id = ${postId}` : sql``}
        ${joinedOnly ? sql`and p."communityId" in (select "communityId" from community_members where "userId" = ${userId})` : sql``}
    ) p
    order by ${order}
    limit 50
  `)
}

export function getComments(postId: number) {
  return rows<{
    id: number
    body: string
    createdAt: string
    authorId: string
    authorName: string
    authorUsername: string | null
    authorImage: string | null
  }>(sql`
    select cm.id, cm.body, cm."createdAt", u.id as "authorId", u.name as "authorName", u.username as "authorUsername", u.image as "authorImage"
    from comments cm join "user" u on u.id = cm."userId"
    where cm."postId" = ${postId}
    order by cm."createdAt" asc
  `)
}

export type FriendRow = PublicUser & { friendshipId: number; status: string; direction: "incoming" | "outgoing" }

export function getFriendships(userId: string) {
  return rows<FriendRow>(sql`
    select f.id as "friendshipId", f.status,
      case when f."requesterId" = ${userId} then 'outgoing' else 'incoming' end as direction,
      u.id, u.name, u.username, u.image, u.bio
    from friendships f
    join "user" u on u.id = case when f."requesterId" = ${userId} then f."addresseeId" else f."requesterId" end
    where (f."requesterId" = ${userId} or f."addresseeId" = ${userId})
    order by f."createdAt" desc
  `)
}

export async function getFriends(userId: string) {
  return (await getFriendships(userId)).filter((f) => f.status === "accepted")
}

export async function areFriends(a: string, b: string) {
  const r = await rows<{ ok: boolean }>(sql`
    select exists(
      select 1 from friendships
      where status = 'accepted'
        and (("requesterId" = ${a} and "addresseeId" = ${b}) or ("requesterId" = ${b} and "addresseeId" = ${a}))
    ) as ok
  `)
  return Boolean(r[0]?.ok)
}

export async function isMember(userId: string, communityId: number) {
  const r = await rows<{ ok: boolean }>(sql`
    select exists(select 1 from community_members where "userId" = ${userId} and "communityId" = ${communityId}) as ok
  `)
  return Boolean(r[0]?.ok)
}

export function searchUsers(q: string, userId: string) {
  const like = `%${q.toLowerCase()}%`
  return rows<PublicUser & { relation: string | null }>(sql`
    select u.id, u.name, u.username, u.image, u.bio,
      (select case when f.status = 'accepted' then 'friends'
                   when f."requesterId" = ${userId} then 'outgoing'
                   else 'incoming' end
       from friendships f
       where (f."requesterId" = ${userId} and f."addresseeId" = u.id) or (f."addresseeId" = ${userId} and f."requesterId" = u.id)
       limit 1) as relation
    from "user" u
    where u.id <> ${userId} and u.username is not null and coalesce(u."profilePublic", true) = true
      ${q ? sql`and (lower(u.username) like ${like} or lower(u.name) like ${like})` : sql``}
    order by u."createdAt" desc
    limit 24
  `)
}

export async function getUserByUsername(username: string) {
  const [u] = await rows<PublicUser & { createdAt: string }>(sql`
    select id, name, username, image, bio, "createdAt"
    from "user"
    where lower(username) = ${username.toLowerCase()} and coalesce("profilePublic", true) = true
    limit 1
  `)
  return u ?? null
}

export async function getPendingRequestCount(userId: string) {
  const [r] = await rows<{ n: number }>(sql`
    select count(*)::int as n from friendships where "addresseeId" = ${userId} and status = 'pending'
  `)
  return r?.n ?? 0
}

export async function getStats() {
  const [r] = await rows<{ users: number; posts: number; communities: number; messages: number }>(sql`
    select (select count(*)::int from "user") as users,
      (select count(*)::int from posts) as posts,
      (select count(*)::int from communities) as communities,
      (select count(*)::int from messages) as messages
  `)
  return r
}
