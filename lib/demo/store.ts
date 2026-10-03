"use client"

import { useSyncExternalStore } from "react"
import { createSeedState, DEMO_STATE_VERSION } from "./seed"
import type { DemoState, DemoUser, Goal, GoalCategory, TaskStatus } from "./types"

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
    state = parsed && parsed.version === DEMO_STATE_VERSION ? parsed : createSeedState()
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
    commit(pushActivity({ ...s, users: [...s.users, user], sessionUserId: user.id }, `Welcome aboard, ${user.name.split(" ")[0]}!`, "/profile"))
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
    commit(me ? { ...fresh, users: [...fresh.users, me], sessionUserId: me.id } : fresh)
  },
}

export function errorMessage(e: unknown) {
  return e instanceof Error ? e.message : "Something went wrong."
}
