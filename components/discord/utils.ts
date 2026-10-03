import type { ChannelMessage, DemoState } from "@/lib/demo/types"

export type Presence = "online" | "idle" | "dnd" | "offline"

const SEED_PRESENCE: Record<string, Presence> = {
  "u-arjun": "online",
  "u-meera": "online",
  "u-kabir": "dnd",
  "u-rohan": "idle",
  "u-ananya": "offline",
}

export function presenceOf(userId: string, meId: string): Presence {
  if (userId === meId) return "online"
  return SEED_PRESENCE[userId] ?? "offline"
}

export const PRESENCE_LABEL: Record<Presence, string> = {
  online: "Online",
  idle: "Idle",
  dnd: "Do Not Disturb",
  offline: "Offline",
}

export const PRESENCE_DOT: Record<Presence, string> = {
  online: "bg-success",
  idle: "bg-warning",
  dnd: "bg-destructive",
  offline: "bg-muted-foreground/60",
}

export function serverInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}

export function hasUnread(s: Pick<DemoState, "channelMessages" | "lastRead">, channelIds: string[], meId: string) {
  const ids = new Set(channelIds)
  return s.channelMessages.some(
    (m: ChannelMessage) => ids.has(m.channelId) && m.authorId !== meId && m.createdAt > (s.lastRead[m.channelId] ?? ""),
  )
}

export function formatStamp(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(Date.now() - 86_400_000)
  const time = d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
  if (d.toDateString() === today.toDateString()) return `Today at ${time}`
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday at ${time}`
  return `${d.toLocaleDateString()} ${time}`
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
}
