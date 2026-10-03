"use client"

import { useSyncExternalStore } from "react"
import { createSeedState, DEMO_STATE_VERSION } from "./seed"
import { welcomeSocial } from "./discord-seed"
import type { Channel, ChannelType, DemoState, DemoUser, Goal, GoalCategory, Server, TaskStatus } from "./types"

const STORAGE_KEY = "acadhub-demo-state"
const listeners = new Set<() => void>()
let state: DemoState | null = null
const serverSnapshot = createSeedState()

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
const now = () => new Date().toISOString()

function load(): DemoState {
  if (state) return state
  if (typeof window === "undefined") return serverSnapshot
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? (JSON.parse(raw) as DemoState) : null
    state = parsed && parsed.version === DEMO_STATE_VERSION ? parsed : parsed ? migrate(parsed) : createSeedState()
  } catch {
    state = createSeedState()
  }
  return state
}

function commit(next: DemoState) {
  state = next
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // Storage may be full or disabled; keep in-memory state so the UI still works.
  }
  listeners.forEach((l) => l())
}

function update(fn: (s: DemoState) => DemoState) {
  commit(fn(load()))
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      state = null
      listener()
    }
  }
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", onStorage)
  }
}

export function useDemo<T>(selector: (s: DemoState) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(load()),
    () => selector(serverSnapshot),
  )
}

const hydratedSubscribe = () => () => {}
export function useHydrated() {
  return useSyncExternalStore(hydratedSubscribe, () => true, () => false)
}

export function useCurrentUser(): DemoUser | null {
  return useDemo((s) => s.users.find((u) => u.id === s.sessionUserId) ?? null)
}

export function getState() {
  return load()
}

function pushActivity(s: DemoState, text: string, href?: string): DemoState {
  return { ...s, activity: [{ id: uid("a"), text, href, createdAt: now(), read: false }, ...s.activity].slice(0, 40) }
}

export class DemoError extends Error {}

export const auth = {
  signUp(input: { name: string; email: string; password: string; branch: string; year: string }) {
    const s = load()
    const email = input.email.trim().toLowerCase()
    if (s.users.some((u) => u.email.toLowerCase() === email)) throw new DemoError("An account with this email already exists.")
    const base = email.split("@")[0].replace(/[^a-z0-9_]/g, "_").slice(0, 16) || "student"
    let username = base
    let n = 1
    while (s.users.some((u) => u.username === username)) username = `${base}${n++}`
    const user: DemoUser = {
      id: uid("u"),
      name: input.name.trim(),
      email,
      username,
      password: input.password,
      branch: input.branch,
      year: input.year,
      bio: "",
      skills: [],
      interests: [],
      createdAt: now(),
    }
    commit(pushActivity(welcomeSocial({ ...s, users: [...s.users, user], sessionUserId: user.id }, user.id), `Welcome aboard, ${user.name.split(" ")[0]}!`, "/profile"))
    return user
  },
  signIn(email: string, password: string) {
    const s = load()
    const user = s.users.find((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    if (!user || !user.password || user.password !== password) throw new DemoError("Invalid email or password.")
    commit({ ...s, sessionUserId: user.id })
    return user
  },
  signInGuest() {
    const s = load()
    const existing = s.users.find((u) => u.email === "guest@acadhub.dev")
    if (existing) {
      commit({ ...s, sessionUserId: existing.id })
      return existing
    }
    return auth.signUp({ name: "Guest Student", email: "guest@acadhub.dev", password: "guest-demo", branch: "CSE", year: "2nd" })
  },
  signOut() {
    update((s) => ({ ...s, sessionUserId: null }))
  },
}

function requireUser(s: DemoState) {
  const user = s.users.find((u) => u.id === s.sessionUserId)
  if (!user) throw new DemoError("Please sign in first.")
  return user
}

export const actions = {
  updateProfile(patch: Partial<Pick<DemoUser, "name" | "bio" | "branch" | "year" | "skills" | "interests">>) {
    update((s) => {
      const me = requireUser(s)
      return { ...s, users: s.users.map((u) => (u.id === me.id ? { ...u, ...patch } : u)) }
    })
  },
  createGoal(input: { title: string; description: string; category: GoalCategory; skills: string[]; slots: number; deadline: string }) {
    const s = load()
    const me = requireUser(s)
    const goal: Goal = { ...input, id: uid("g"), status: "open", ownerId: me.id, memberIds: [me.id], createdAt: now() }
    commit(pushActivity({ ...s, goals: [goal, ...s.goals] }, `You created "${goal.title}"`, `/goals/${goal.id}`))
    return goal
  },
  joinGoal(goalId: string) {
    update((s) => {
      const me = requireUser(s)
      const goal = s.goals.find((g) => g.id === goalId)
      if (!goal) throw new DemoError("Goal not found.")
      if (goal.status === "archived" || goal.status === "completed") throw new DemoError("This goal is no longer accepting members.")
      if (goal.memberIds.includes(me.id)) return s
      if (goal.memberIds.length >= goal.slots) throw new DemoError("This team is already full.")
      const goals = s.goals.map((g) =>
        g.id === goalId ? { ...g, memberIds: [...g.memberIds, me.id], status: g.status === "open" ? ("active" as const) : g.status } : g,
      )
      return pushActivity({ ...s, goals }, `You joined "${goal.title}"`, `/goals/${goal.id}`)
    })
  },
  leaveGoal(goalId: string) {
    update((s) => {
      const me = requireUser(s)
      const goal = s.goals.find((g) => g.id === goalId)
      if (!goal) return s
      if (goal.ownerId === me.id) throw new DemoError("Owners cannot leave their own goal. Archive it instead.")
      return pushActivity(
        { ...s, goals: s.goals.map((g) => (g.id === goalId ? { ...g, memberIds: g.memberIds.filter((id) => id !== me.id) } : g)) },
        `You left "${goal.title}"`,
      )
    })
  },
  setGoalStatus(goalId: string, status: Goal["status"]) {
    update((s) => {
      const me = requireUser(s)
      const goal = s.goals.find((g) => g.id === goalId)
      if (!goal || goal.ownerId !== me.id) throw new DemoError("Only the goal owner can change its status.")
      return pushActivity(
        { ...s, goals: s.goals.map((g) => (g.id === goalId ? { ...g, status } : g)) },
        `"${goal.title}" marked ${status}`,
        `/goals/${goalId}`,
      )
    })
  },
  deleteGoal(goalId: string) {
    update((s) => {
      const me = requireUser(s)
      const goal = s.goals.find((g) => g.id === goalId)
      if (!goal || goal.ownerId !== me.id) throw new DemoError("Only the goal owner can delete it.")
      return {
        ...s,
        goals: s.goals.filter((g) => g.id !== goalId),
        messages: s.messages.filter((m) => m.goalId !== goalId),
        tasks: s.tasks.filter((t) => t.goalId !== goalId),
        resources: s.resources.filter((r) => r.goalId !== goalId),
      }
    })
  },
  sendMessage(goalId: string, text: string) {
    update((s) => {
      const me = requireUser(s)
      return { ...s, messages: [...s.messages, { id: uid("m"), goalId, authorId: me.id, text: text.trim(), createdAt: now() }] }
    })
  },
  addTask(goalId: string, title: string) {
    update((s) => {
      requireUser(s)
      return { ...s, tasks: [...s.tasks, { id: uid("t"), goalId, title: title.trim(), status: "todo", assigneeId: null, createdAt: now() }] }
    })
  },
  setTaskStatus(taskId: string, status: TaskStatus) {
    update((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, status } : t)) }))
  },
  assignTaskToMe(taskId: string) {
    update((s) => {
      const me = requireUser(s)
      return { ...s, tasks: s.tasks.map((t) => (t.id === taskId ? { ...t, assigneeId: t.assigneeId === me.id ? null : me.id } : t)) }
    })
  },
  deleteTask(taskId: string) {
    update((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }))
  },
  addResource(goalId: string, title: string, url: string) {
    update((s) => {
      const me = requireUser(s)
      return { ...s, resources: [...s.resources, { id: uid("r"), goalId, title: title.trim(), url: url.trim(), addedBy: me.id, createdAt: now() }] }
    })
  },
  deleteResource(resourceId: string) {
    update((s) => ({ ...s, resources: s.resources.filter((r) => r.id !== resourceId) }))
  },
  markActivityRead() {
    update((s) => ({ ...s, activity: s.activity.map((a) => ({ ...a, read: true })) }))
  },
  toggleCommunity(slug: string) {
    update((s) => ({
      ...s,
      joinedCommunities: s.joinedCommunities.includes(slug)
        ? s.joinedCommunities.filter((c) => c !== slug)
        : [...s.joinedCommunities, slug],
    }))
  },
  resetDemo() {
    const keepSession = load().sessionUserId
    const fresh = createSeedState()
    const me = load().users.find((u) => u.id === keepSession)
    commit(me ? welcomeSocial({ ...fresh, users: [...fresh.users, me], sessionUserId: me.id }, me.id) : fresh)
  },
}

const SERVER_COLORS = ["#5865f2", "#eb459e", "#3ba55c", "#faa61a", "#ed4245", "#00a8fc", "#9b59b6"]
const slugChannel = (name: string) =>
  name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32)

const REPLIES = [
  "Haha, nice one.",
  "Sounds good to me!",
  "Let me check and get back to you.",
  "Totally agree.",
  "Can we discuss this in the study session later?",
  "Ooh, send me the link!",
  "I'm in. What time works?",
  "That's a great idea, let's do it.",
]

function findFriendship(s: DemoState, a: string, b: string) {
  return s.friendships.find(
    (f) => (f.requesterId === a && f.addresseeId === b) || (f.requesterId === b && f.addresseeId === a),
  )
}

export const discord = {
  createServer(input: { name: string; description?: string }) {
    const s = load()
    const me = requireUser(s)
    const name = input.name.trim()
    if (name.length < 2 || name.length > 40) throw new DemoError("Server name must be 2-40 characters.")
    const server: Server = {
      id: uid("s"),
      name,
      description: input.description?.trim() ?? "",
      color: SERVER_COLORS[s.servers.length % SERVER_COLORS.length],
      ownerId: me.id,
      memberIds: [me.id],
      channels: [
        { id: uid("c"), name: "general", type: "text", topic: `Welcome to ${name}!` },
        { id: uid("c"), name: "resources", type: "text", topic: "Share links and notes." },
        { id: uid("v"), name: "General", type: "voice", topic: "" },
      ],
      createdAt: now(),
    }
    commit(pushActivity({ ...s, servers: [...s.servers, server] }, `You created the server "${name}"`, `/channels/${server.id}`))
    return server
  },
  joinServer(serverId: string) {
    update((s) => {
      const me = requireUser(s)
      const server = s.servers.find((sv) => sv.id === serverId)
      if (!server) throw new DemoError("Server not found.")
      if (server.memberIds.includes(me.id)) return s
      return pushActivity(
        { ...s, servers: s.servers.map((sv) => (sv.id === serverId ? { ...sv, memberIds: [...sv.memberIds, me.id] } : sv)) },
        `You joined ${server.name}`,
        `/channels/${serverId}`,
      )
    })
  },
  leaveServer(serverId: string) {
    update((s) => {
      const me = requireUser(s)
      const server = s.servers.find((sv) => sv.id === serverId)
      if (!server) return s
      if (server.ownerId === me.id) throw new DemoError("Owners can't leave. Delete the server instead.")
      return { ...s, servers: s.servers.map((sv) => (sv.id === serverId ? { ...sv, memberIds: sv.memberIds.filter((id) => id !== me.id) } : sv)) }
    })
  },
  deleteServer(serverId: string) {
    update((s) => {
      const me = requireUser(s)
      const server = s.servers.find((sv) => sv.id === serverId)
      if (!server || server.ownerId !== me.id) throw new DemoError("Only the owner can delete this server.")
      const channelIds = new Set(server.channels.map((c) => c.id))
      return {
        ...s,
        servers: s.servers.filter((sv) => sv.id !== serverId),
        channelMessages: s.channelMessages.filter((m) => !channelIds.has(m.channelId)),
      }
    })
  },
  createChannel(serverId: string, input: { name: string; type: ChannelType }) {
    const s = load()
    const me = requireUser(s)
    const server = s.servers.find((sv) => sv.id === serverId)
    if (!server || server.ownerId !== me.id) throw new DemoError("Only the owner can create channels.")
    const name = input.type === "text" ? slugChannel(input.name) : input.name.trim().slice(0, 32)
    if (!name) throw new DemoError("Channel name is required.")
    const channel: Channel = { id: uid(input.type === "text" ? "c" : "v"), name, type: input.type, topic: "" }
    commit({ ...s, servers: s.servers.map((sv) => (sv.id === serverId ? { ...sv, channels: [...sv.channels, channel] } : sv)) })
    return channel
  },
  deleteChannel(serverId: string, channelId: string) {
    update((s) => {
      const me = requireUser(s)
      const server = s.servers.find((sv) => sv.id === serverId)
      if (!server || server.ownerId !== me.id) throw new DemoError("Only the owner can delete channels.")
      if (server.channels.filter((c) => c.type === "text").length <= 1 && server.channels.find((c) => c.id === channelId)?.type === "text") {
        throw new DemoError("A server needs at least one text channel.")
      }
      return {
        ...s,
        servers: s.servers.map((sv) => (sv.id === serverId ? { ...sv, channels: sv.channels.filter((c) => c.id !== channelId) } : sv)),
        channelMessages: s.channelMessages.filter((m) => m.channelId !== channelId),
      }
    })
  },
  sendMessage(channelId: string, body: string) {
    const s = load()
    const me = requireUser(s)
    const textBody = body.trim().slice(0, 2000)
    if (!textBody) return
    commit({
      ...s,
      channelMessages: [...s.channelMessages, { id: uid("m"), channelId, authorId: me.id, text: textBody, createdAt: now() }],
      lastRead: { ...s.lastRead, [channelId]: now() },
    })
    if (channelId.startsWith("dm:")) {
      const otherId = channelId.slice(3).split(":").find((id) => id !== me.id)
      if (otherId && SEED_USER_IDS.has(otherId)) {
        window.setTimeout(() => {
          update((cur) => ({
            ...cur,
            channelMessages: [
              ...cur.channelMessages,
              { id: uid("m"), channelId, authorId: otherId, text: REPLIES[Math.floor(Math.random() * REPLIES.length)], createdAt: now() },
            ],
          }))
        }, 1200 + Math.random() * 1500)
      }
    }
  },
  editMessage(messageId: string, body: string) {
    update((s) => {
      const me = requireUser(s)
      const textBody = body.trim().slice(0, 2000)
      if (!textBody) return s
      return {
        ...s,
        channelMessages: s.channelMessages.map((m) =>
          m.id === messageId && m.authorId === me.id ? { ...m, text: textBody, editedAt: now() } : m,
        ),
      }
    })
  },
  deleteMessage(messageId: string) {
    update((s) => {
      const me = requireUser(s)
      return { ...s, channelMessages: s.channelMessages.filter((m) => !(m.id === messageId && m.authorId === me.id)) }
    })
  },
  markRead(channelId: string) {
    update((s) => ({ ...s, lastRead: { ...s.lastRead, [channelId]: now() } }))
  },
  sendFriendRequest(username: string) {
    const s = load()
    const me = requireUser(s)
    const target = s.users.find((u) => u.username.toLowerCase() === username.trim().toLowerCase().replace(/^@/, ""))
    if (!target) throw new DemoError("No user with that username. Usernames are case-insensitive.")
    if (target.id === me.id) throw new DemoError("You can't add yourself.")
    const existing = findFriendship(s, me.id, target.id)
    if (existing?.status === "accepted") throw new DemoError(`You're already friends with ${target.name}.`)
    if (existing && existing.requesterId === me.id) throw new DemoError("Friend request already sent.")
    if (existing) {
      commit({ ...s, friendships: s.friendships.map((f) => (f.id === existing.id ? { ...f, status: "accepted" } : f)) })
      return { target, accepted: true }
    }
    commit({
      ...s,
      friendships: [...s.friendships, { id: uid("f"), requesterId: me.id, addresseeId: target.id, status: "pending", createdAt: now() }],
    })
    if (SEED_USER_IDS.has(target.id)) {
      window.setTimeout(() => {
        update((cur) =>
          pushActivity(
            {
              ...cur,
              friendships: cur.friendships.map((f) =>
                f.requesterId === me.id && f.addresseeId === target.id ? { ...f, status: "accepted" } : f,
              ),
            },
            `${target.name} accepted your friend request`,
            `/channels/me/${target.id}`,
          ),
        )
      }, 2500)
    }
    return { target, accepted: false }
  },
  respondFriendRequest(friendshipId: string, accept: boolean) {
    update((s) => {
      const me = requireUser(s)
      const f = s.friendships.find((x) => x.id === friendshipId && x.addresseeId === me.id)
      if (!f) return s
      return {
        ...s,
        friendships: accept
          ? s.friendships.map((x) => (x.id === friendshipId ? { ...x, status: "accepted" } : x))
          : s.friendships.filter((x) => x.id !== friendshipId),
      }
    })
  },
  removeFriendship(friendshipId: string) {
    update((s) => {
      const me = requireUser(s)
      return {
        ...s,
        friendships: s.friendships.filter(
          (f) => !(f.id === friendshipId && (f.requesterId === me.id || f.addresseeId === me.id)),
        ),
      }
    })
  },
}

const SEED_USER_IDS = new Set(["u-arjun", "u-meera", "u-rohan", "u-ananya", "u-kabir"])

function migrate(old: DemoState): DemoState {
  const fresh = createSeedState()
  const extraUsers = (old.users ?? []).filter((u) => !SEED_USER_IDS.has(u.id))
  let next: DemoState = {
    ...fresh,
    users: [...fresh.users, ...extraUsers],
    goals: old.goals ?? fresh.goals,
    messages: old.messages ?? fresh.messages,
    tasks: old.tasks ?? fresh.tasks,
    resources: old.resources ?? fresh.resources,
    activity: old.activity ?? fresh.activity,
    sessionUserId: old.sessionUserId ?? null,
  }
  for (const u of extraUsers) next = welcomeSocial(next, u.id)
  return next
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong."
}
