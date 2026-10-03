"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Bot, Compass, MessagesSquare, Plus, Target } from "lucide-react"
import { useDemo } from "@/lib/demo/store"
import { cn } from "@/lib/utils"
import { hasUnread, serverInitials } from "./utils"

type Props = {
  meId: string
  activeServerId: string | null
  onNavigate?: () => void
  onCreateServer: () => void
  onExplore: () => void
}

function RailItem({
  active,
  unread,
  label,
  children,
  className,
}: {
  active?: boolean
  unread?: boolean
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className="group relative flex w-full justify-center" title={label}>
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 w-1 -translate-y-1/2 rounded-r-full bg-foreground transition-all",
          active ? "h-10" : unread ? "h-2 group-hover:h-5" : "h-0 group-hover:h-5",
        )}
      />
      <div className={cn("transition-all", className)}>{children}</div>
    </div>
  )
}

const tileBase =
  "flex size-12 items-center justify-center overflow-hidden text-sm font-semibold transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring"

export function ServerRail({ meId, activeServerId, onNavigate, onCreateServer, onExplore }: Props) {
  const servers = useDemo((s) => s.servers)
  const channelMessages = useDemo((s) => s.channelMessages)
  const lastRead = useDemo((s) => s.lastRead)
  const friendships = useDemo((s) => s.friendships)

  const mine = useMemo(() => servers.filter((s) => s.memberIds.includes(meId)), [servers, meId])
  const pending = friendships.filter((f) => f.addresseeId === meId && f.status === "pending").length
  const dmUnread = useMemo(() => {
    const ids = Array.from(new Set(channelMessages.filter((m) => m.channelId.startsWith("dm:") && m.channelId.includes(meId)).map((m) => m.channelId)))
    return hasUnread({ channelMessages, lastRead }, ids, meId)
  }, [channelMessages, lastRead, meId])

  return (
    <nav aria-label="Servers" className="flex h-full w-[72px] shrink-0 flex-col items-center gap-2 overflow-y-auto bg-background py-3">
      <RailItem active={activeServerId === null} unread={dmUnread} label="Direct Messages">
        <Link
          href="/channels/me"
          onClick={onNavigate}
          aria-label="Direct Messages"
          className={cn(
            tileBase,
            "relative",
            activeServerId === null
              ? "rounded-2xl bg-primary text-primary-foreground"
              : "rounded-3xl bg-secondary text-foreground hover:rounded-2xl hover:bg-primary hover:text-primary-foreground",
          )}
        >
          <MessagesSquare className="size-6" aria-hidden />
        </Link>
        {pending > 0 ? (
          <span className="pointer-events-none absolute right-2.5 bottom-0 flex min-w-5 items-center justify-center rounded-full border-4 border-background bg-destructive px-1 text-[10px] font-bold text-white">
            {pending}
          </span>
        ) : null}
      </RailItem>

      <div className="h-0.5 w-8 rounded-full bg-border" aria-hidden />

      {mine.map((server) => {
        const active = server.id === activeServerId
        const unread = hasUnread({ channelMessages, lastRead }, server.channels.map((c) => c.id), meId)
        return (
          <RailItem key={server.id} active={active} unread={unread} label={server.name}>
            <Link
              href={`/channels/${server.id}`}
              onClick={onNavigate}
              aria-label={server.name}
              aria-current={active ? "page" : undefined}
              className={cn(tileBase, "text-white", active ? "rounded-2xl" : "rounded-3xl hover:rounded-2xl")}
              style={{ backgroundColor: server.color }}
            >
              {serverInitials(server.name)}
            </Link>
          </RailItem>
        )
      })}

      <RailItem label="Add a Server">
        <button
          type="button"
          onClick={onCreateServer}
          aria-label="Add a Server"
          className={cn(tileBase, "rounded-3xl bg-secondary text-success hover:rounded-2xl hover:bg-success hover:text-white")}
        >
          <Plus className="size-6" aria-hidden />
        </button>
      </RailItem>
      <RailItem label="Explore Servers">
        <button
          type="button"
          onClick={onExplore}
          aria-label="Explore Servers"
          className={cn(tileBase, "rounded-3xl bg-secondary text-success hover:rounded-2xl hover:bg-success hover:text-white")}
        >
          <Compass className="size-6" aria-hidden />
        </button>
      </RailItem>

      <div className="h-0.5 w-8 rounded-full bg-border" aria-hidden />

      <RailItem label="Goals">
        <Link href="/goals" aria-label="Goals" className={cn(tileBase, "rounded-3xl bg-secondary text-muted-foreground hover:rounded-2xl hover:text-foreground")}>
          <Target className="size-5" aria-hidden />
        </Link>
      </RailItem>
      <RailItem label="AI Study Buddy">
        <Link href="/ai" aria-label="AI Study Buddy" className={cn(tileBase, "rounded-3xl bg-secondary text-accent hover:rounded-2xl")}>
          <Bot className="size-5" aria-hidden />
        </Link>
      </RailItem>
    </nav>
  )
}
