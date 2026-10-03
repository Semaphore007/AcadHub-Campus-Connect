import { MOCK_GROUPS, MOCK_THREADS } from "@/data/simulations/mock"
import type { ApiResult, CreateGroupInput, CreateThreadInput, Group, Thread } from "./types"

/**
 * Single integration boundary between this site and the existing Express backend.
 * When NEXT_PUBLIC_API_BASE_URL is empty or the backend is unreachable,
 * every method resolves with local mock data so the site always renders.
 */
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "")

export const ENDPOINTS = {
  groups: "/api/v1/group/groups",
  createGroup: "/api/v1/group/create",
  joinGroup: (code: string) => `/api/v1/group/join/${encodeURIComponent(code)}`,
  forum: (code: string) => `/api/v1/forum/groups/${encodeURIComponent(code)}/forum`,
  createThread: (code: string) => `/api/v1/forum/groups/${encodeURIComponent(code)}/threads`,
} as const

type RequestOptions = {
  method?: "GET" | "POST"
  body?: unknown
  csrfToken?: string
}

async function request<T>(path: string, fallback: () => T, options: RequestOptions = {}): Promise<ApiResult<T>> {
  if (!API_BASE_URL) return { data: fallback(), source: "mock" }

  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(options.csrfToken ? { "X-CSRF-Token": options.csrfToken } : {}),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: AbortSignal.timeout(3000),
      cache: "no-store",
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const json = (await res.json()) as { data?: T } & T
    return { data: (json.data ?? json) as T, source: "backend" }
  } catch (err) {
    return {
      data: fallback(),
      source: "mock",
      error: err instanceof Error ? err.message : "Backend unavailable",
    }
  }
}

export function getGroups() {
  return request<Group[]>(ENDPOINTS.groups, () => MOCK_GROUPS)
}

export function createGroup(input: CreateGroupInput, csrfToken?: string) {
  return request<Group>(
    ENDPOINTS.createGroup,
    () => ({
      groupCode: "DEMO-" + input.name.slice(0, 3).toUpperCase(),
      name: input.name,
      description: input.description ?? "",
      category: "Project",
      skills: input.skills,
      members: 1,
      maxMembers: input.maxMembers,
      deadline: "Not set",
      status: "open",
      beginnerFriendly: true,
    }),
    { method: "POST", body: input, csrfToken },
  )
}

export function joinGroup(groupCode: string, csrfToken?: string) {
  return request<{ joined: boolean; groupCode: string }>(
    ENDPOINTS.joinGroup(groupCode),
    () => ({ joined: true, groupCode }),
    { method: "POST", csrfToken },
  )
}

export function getForum(groupCode: string) {
  return request<Thread[]>(ENDPOINTS.forum(groupCode), () => MOCK_THREADS.filter((t) => t.groupCode === groupCode))
}

export function createThread(groupCode: string, input: CreateThreadInput, csrfToken?: string) {
  return request<Thread>(
    ENDPOINTS.createThread(groupCode),
    () => ({ id: "t-demo", groupCode, title: input.title, author: "You", replies: 0, createdAt: "just now" }),
    { method: "POST", body: input, csrfToken },
  )
}
