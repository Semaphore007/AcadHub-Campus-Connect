"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import {
  ChevronDown,
  Hash,
  Headphones,
  HeadphoneOff,
  LogOut,
  Mic,
  MicOff,
  PhoneOff,
  Plus,
  Settings,
  Trash2,
  UserPlus,
  Users,
  Volume2,
  X,
} from "lucide-react"
import { toast } from "react-toastify"
import { UserAvatar } from "@/components/app/user-avatar"
import { discord, errorMessage, useDemo } from "@/lib/demo/store"
import { dmChannelId } from "@/lib/demo/discord-seed"
import type { DemoUser, Server } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { CreateChannelDialog } from "./dialogs"
import { PRESENCE_DOT, PRESENCE_LABEL, hasUnread, presenceOf } from "./utils"

const menuItem =
  "flex cursor-pointer items-center justify-between gap-2 rounded px-2 py-1.5 text-sm outline-none data-[highlighted]:bg-primary data-[highlighted]:text-primary-foreground"

export type VoiceState = { serverId: string; channelId: string } | null

function StatusAvatar({ user, meId, className }: { user: DemoUser; meId: string; className?: string }) {
  const p = presenceOf(user.id, meId)
  return (
    <span className={cn("relative inline-flex shrink-0", className)}>
      <UserAvatar name={user.name} seed={user.id} className="size-full" />
      <span
        className={cn("absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-[3px] border-sidebar", PRESENCE_DOT[p])}
        aria-label={PRESENCE_LABEL[p]}
      />
    </span>
  )
}

export function ServerSidebar({
  server,
  me,
  activeChannelId,
  voice,
  onVoiceChange,
  onNavigate,
}: {
  server: Server
  me: DemoUser
  activeChannelId: string | null
  voice: VoiceState
  onVoiceChange: (v: VoiceState) => void
  onNavigate?: () => void
}) {
  const router = useRouter()
  const users = useDemo((s) => s.users)
  const channelMessages = useDemo((s) => s.channelMessages)
  const lastRead = useDemo((s) => s.lastRead)
  const [createOpen, setCreateOpen] = useState(false)
  const isOwner = server.ownerId === me.id
  const isMember = server.memberIds.includes(me.id)
  const textChannels = server.channels.filter((c) => c.type === "text")
  const voiceChannels = server.channels.filter((c) => c.type === "voice")

  const copyInvite = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/channels/${server.id}`)
      toast.success("Invite link copied")
    } catch {
      toast.info(`Invite link: /channels/${server.id}`)
    }
  }

  const run = (fn: () => void, done?: string) => {
    try {
      fn()
      if (done) toast.success(done)
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  return (
    <div className="flex h-full w-60 flex-col bg-sidebar">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger className="flex h-12 shrink-0 items-center justify-between gap-2 border-b border-border/60 px-4 text-left font-semibold outline-none transition-colors hover:bg-secondary/60 focus-visible:bg-secondary/60">
          <span className="truncate">{server.name}</span>
          <ChevronDown className="size-4 shrink-0" aria-hidden />
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content align="start" sideOffset={4} className="z-[70] w-56 rounded-md border border-border bg-popover p-1.5 text-popover-foreground shadow-xl">
            <DropdownMenu.Item className={cn(menuItem, "text-primary")} onSelect={copyInvite}>
              Invite People <UserPlus className="size-4" aria-hidden />
            </DropdownMenu.Item>
            {isOwner ? (
              <DropdownMenu.Item className={menuItem} onSelect={() => setCreateOpen(true)}>
                Create Channel <Plus className="size-4" aria-hidden />
              </DropdownMenu.Item>
            ) : null}
            <DropdownMenu.Separator className="my-1 h-px bg-border" />
            {isOwner ? (
              <DropdownMenu.Item
                className={cn(menuItem, "text-destructive data-[highlighted]:bg-destructive")}
                onSelect={() => {
                  if (!window.confirm(`Delete ${server.name}? This cannot be undone.`)) return
                  run(() => {
                    discord.deleteServer(server.id)
                    router.push("/channels/me")
                  }, "Server deleted")
                }}
              >
                Delete Server <Trash2 className="size-4" aria-hidden />
              </DropdownMenu.Item>
            ) : isMember ? (
              <DropdownMenu.Item
                className={cn(menuItem, "text-destructive data-[highlighted]:bg-destructive")}
                onSelect={() =>
                  run(() => {
                    discord.leaveServer(server.id)
                    if (voice?.serverId === server.id) onVoiceChange(null)
                    router.push("/channels/me")
                  }, `Left ${server.name}`)
                }
              >
                Leave Server <LogOut className="size-4" aria-hidden />
              </DropdownMenu.Item>
            ) : null}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <nav aria-label="Channels" className="flex flex-1 flex-col gap-4 overflow-y-auto px-2 py-3">
        {[
          { label: "Text Channels", items: textChannels },
          { label: "Voice Channels", items: voiceChannels },
        ].map((group) => (
          <div key={group.label} className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between px-1 pb-1">
              <span className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</span>
              {isOwner ? (
                <button type="button" onClick={() => setCreateOpen(true)} aria-label="Create channel" className="text-muted-foreground hover:text-foreground">
                  <Plus className="size-4" aria-hidden />
                </button>
              ) : null}
            </div>
            {group.items.map((channel) => {
              const isText = channel.type === "text"
              const active = isText && channel.id === activeChannelId
              const unread = isText && !active && hasUnread({ channelMessages, lastRead }, [channel.id], me.id)
              const inVoice = voice?.channelId === channel.id
              const Icon = isText ? Hash : Volume2
              const row = (
                <>
                  <Icon className="size-5 shrink-0 text-muted-foreground" aria-hidden />
                  <span className="flex-1 truncate">{channel.name}</span>
                </>
              )
              const rowClass = cn(
                "group flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[15px] font-medium transition-colors",
                active
                  ? "bg-secondary text-foreground"
                  : unread
                    ? "text-foreground hover:bg-secondary/60"
                    : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )
              return (
                <div key={channel.id} className="relative">
                  {unread ? <span className="absolute top-1/2 -left-2 h-2 w-1 -translate-y-1/2 rounded-r-full bg-foreground" aria-hidden /> : null}
                  <div className="flex items-center">
                    {isText ? (
                      <Link href={`/channels/${server.id}/${channel.id}`} onClick={onNavigate} aria-current={active ? "page" : undefined} className={rowClass}>
                        {row}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        className={rowClass}
                        disabled={!isMember}
                        onClick={() => {
                          onVoiceChange(inVoice ? null : { serverId: server.id, channelId: channel.id })
                          if (!inVoice) toast.success(`Joined voice: ${channel.name}`)
                        }}
                      >
                        {row}
                      </button>
                    )}
                    {isOwner ? (
                      <button
                        type="button"
                        aria-label={`Delete ${channel.name}`}
                        onClick={() => {
                          if (!window.confirm(`Delete channel ${channel.name}?`)) return
                          run(() => {
                            discord.deleteChannel(server.id, channel.id)
                            if (inVoice) onVoiceChange(null)
                            if (active) router.push(`/channels/${server.id}`)
                          })
                        }}
                        className="absolute right-1.5 rounded p-0.5 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100 focus-visible:opacity-100 [div:hover>&]:opacity-100"
                      >
                        <X className="size-3.5" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                  {inVoice ? (
                    <div className="flex items-center gap-2 py-1 pl-8">
                      <UserAvatar name={me.name} seed={me.id} className="size-6 ring-2 ring-success" />
                      <span className="truncate text-sm text-muted-foreground">{me.name}</span>
                    </div>
                  ) : null}
                </div>
              )
            })}
          </div>
        ))}
      </nav>

      <UserPanel me={me} users={users} voice={voice} servers={[server]} onVoiceChange={onVoiceChange} />
      <CreateChannelDialog serverId={server.id} open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}

export function DmSidebar({
  me,
  activeUserId,
  voice,
  onVoiceChange,
  onNavigate,
}: {
  me: DemoUser
  activeUserId: string | null
  voice: VoiceState
  onVoiceChange: (v: VoiceState) => void
  onNavigate?: () => void
}) {
  const users = useDemo((s) => s.users)
  const friendships = useDemo((s) => s.friendships)
  const channelMessages = useDemo((s) => s.channelMessages)
  const lastRead = useDemo((s) => s.lastRead)
  const servers = useDemo((s) => s.servers)
  const [q, setQ] = useState("")

  const conversations = useMemo(() => {
    const latest = new Map<string, string>()
    for (const m of channelMessages) {
      if (!m.channelId.startsWith("dm:") || !m.channelId.includes(me.id)) continue
      const other = m.channelId.slice(3).split(":").find((id) => id !== me.id)
      if (other && (latest.get(other) ?? "") < m.createdAt) latest.set(other, m.createdAt)
    }
    for (const f of friendships) {
      if (f.status !== "accepted") continue
      const other = f.requesterId === me.id ? f.addresseeId : f.addresseeId === me.id ? f.requesterId : null
      if (other && !latest.has(other)) latest.set(other, f.createdAt)
    }
    return Array.from(latest.entries())
      .sort((a, b) => b[1].localeCompare(a[1]))
      .map(([id]) => users.find((u) => u.id === id))
      .filter((u): u is DemoUser => Boolean(u))
      .filter((u) => u.name.toLowerCase().includes(q.trim().toLowerCase()))
  }, [channelMessages, friendships, users, me.id, q])

  const pending = friendships.filter((f) => f.addresseeId === me.id && f.status === "pending").length

  return (
    <div className="flex h-full w-60 flex-col bg-sidebar">
      <div className="flex h-12 shrink-0 items-center border-b border-border/60 px-2.5">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a conversation"
          aria-label="Find a conversation"
          className="h-7 w-full rounded bg-background px-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <nav aria-label="Direct messages" className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-2">
        <Link
          href="/channels/me"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-md px-2.5 py-2 text-[15px] font-medium transition-colors",
            activeUserId === null ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
          )}
        >
          <Users className="size-5" aria-hidden />
          <span className="flex-1">Friends</span>
          {pending > 0 ? <span className="rounded-full bg-destructive px-1.5 text-xs font-bold text-white">{pending}</span> : null}
        </Link>
        <p className="mt-4 mb-1 px-2.5 text-xs font-bold uppercase tracking-wide text-muted-foreground">Direct Messages</p>
        {conversations.length === 0 ? <p className="px-2.5 text-sm text-muted-foreground">No conversations yet.</p> : null}
        {conversations.map((u) => {
          const active = u.id === activeUserId
          const unread = !active && hasUnread({ channelMessages, lastRead }, [dmChannelId(me.id, u.id)], me.id)
          return (
            <Link
              key={u.id}
              href={`/channels/me/${u.id}`}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors",
                active ? "bg-secondary text-foreground" : unread ? "text-foreground hover:bg-secondary/60" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <StatusAvatar user={u} meId={me.id} className="size-8" />
              <span className={cn("flex-1 truncate text-[15px]", unread && "font-semibold")}>{u.name}</span>
              {unread ? <span className="size-2 rounded-full bg-destructive" aria-label="Unread" /> : null}
            </Link>
          )
        })}
      </nav>
      <UserPanel me={me} users={users} voice={voice} servers={servers} onVoiceChange={onVoiceChange} />
    </div>
  )
}

function UserPanel({
  me,
  voice,
  servers,
  onVoiceChange,
}: {
  me: DemoUser
  users: DemoUser[]
  voice: VoiceState
  servers: Server[]
  onVoiceChange: (v: VoiceState) => void
}) {
  const [muted, setMuted] = useState(false)
  const [deafened, setDeafened] = useState(false)
  const allServers = useDemo((s) => s.servers)
  const voiceServer = voice ? (servers.find((s) => s.id === voice.serverId) ?? allServers.find((s) => s.id === voice.serverId)) : null
  const voiceChannel = voiceServer?.channels.find((c) => c.id === voice?.channelId)

  const iconBtn = "inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"

  return (
    <div className="shrink-0 border-t border-border/60 bg-background/60">
      {voiceServer && voiceChannel ? (
        <div className="flex items-center gap-2 border-b border-border/60 px-3 py-2">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-success">Voice Connected</p>
            <p className="truncate text-xs text-muted-foreground">
              {voiceChannel.name} / {voiceServer.name}
            </p>
          </div>
          <button type="button" className={iconBtn} aria-label="Disconnect" onClick={() => onVoiceChange(null)}>
            <PhoneOff className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
      <div className="flex items-center gap-2 px-2 py-1.5">
        <span className="relative inline-flex size-8 shrink-0">
          <UserAvatar name={me.name} seed={me.id} className="size-full" />
          <span className="absolute -right-0.5 -bottom-0.5 size-3.5 rounded-full border-[3px] border-background bg-success" aria-label="Online" />
        </span>
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-sm font-semibold">{me.name}</p>
          <p className="truncate text-xs text-muted-foreground">@{me.username}</p>
        </div>
        <button type="button" className={cn(iconBtn, muted && "text-destructive")} aria-label={muted ? "Unmute" : "Mute"} aria-pressed={muted} onClick={() => setMuted((m) => !m)}>
          {muted ? <MicOff className="size-4" aria-hidden /> : <Mic className="size-4" aria-hidden />}
        </button>
        <button type="button" className={cn(iconBtn, deafened && "text-destructive")} aria-label={deafened ? "Undeafen" : "Deafen"} aria-pressed={deafened} onClick={() => setDeafened((d) => !d)}>
          {deafened ? <HeadphoneOff className="size-4" aria-hidden /> : <Headphones className="size-4" aria-hidden />}
        </button>
        <Link href="/settings" className={iconBtn} aria-label="User settings">
          <Settings className="size-4" aria-hidden />
        </Link>
      </div>
    </div>
  )
}

export { StatusAvatar }
