"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Check, Menu, MessageCircle, UserMinus, Users, X } from "lucide-react"
import { toast } from "react-toastify"
import { discord, errorMessage, useDemo } from "@/lib/demo/store"
import type { DemoUser, Friendship } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { StatusAvatar } from "./channel-sidebar"
import { PRESENCE_LABEL, presenceOf } from "./utils"

type Tab = "online" | "all" | "pending" | "add"

export function FriendsView({ me, onOpenNav }: { me: DemoUser; onOpenNav: () => void }) {
  const users = useDemo((s) => s.users)
  const friendships = useDemo((s) => s.friendships)
  const [tab, setTab] = useState<Tab>("online")
  const [username, setUsername] = useState("")

  const { friends, incoming, outgoing, suggestions } = useMemo(() => {
    const byId = new Map(users.map((u) => [u.id, u]))
    const mine = friendships.filter((f) => f.requesterId === me.id || f.addresseeId === me.id)
    const other = (f: Friendship) => byId.get(f.requesterId === me.id ? f.addresseeId : f.requesterId)
    const pair = (f: Friendship) => ({ f, user: other(f) })
    const valid = (x: { f: Friendship; user?: DemoUser }): x is { f: Friendship; user: DemoUser } => Boolean(x.user)
    const related = new Set(mine.flatMap((f) => [f.requesterId, f.addresseeId]))
    return {
      friends: mine.filter((f) => f.status === "accepted").map(pair).filter(valid),
      incoming: mine.filter((f) => f.status === "pending" && f.addresseeId === me.id).map(pair).filter(valid),
      outgoing: mine.filter((f) => f.status === "pending" && f.requesterId === me.id).map(pair).filter(valid),
      suggestions: users.filter((u) => u.id !== me.id && !related.has(u.id)),
    }
  }, [users, friendships, me.id])

  const online = friends.filter((x) => presenceOf(x.user.id, me.id) !== "offline")

  const add = (name: string) => {
    try {
      const res = discord.sendFriendRequest(name)
      toast.success(res.accepted ? `You are now friends with ${res.target.name}` : `Friend request sent to ${res.target.name}`)
      setUsername("")
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "online", label: "Online" },
    { id: "all", label: "All" },
    { id: "pending", label: "Pending", badge: incoming.length },
  ]

  const list = tab === "online" ? online : friends

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-card" aria-label="Friends">
      <header className="flex h-12 shrink-0 items-center gap-3 overflow-x-auto border-b border-border/60 px-3">
        <button type="button" onClick={onOpenNav} className="rounded p-1 text-muted-foreground hover:text-foreground md:hidden" aria-label="Open navigation">
          <Menu className="size-5" aria-hidden />
        </button>
        <span className="flex items-center gap-2 font-semibold">
          <Users className="size-5 text-muted-foreground" aria-hidden /> Friends
        </span>
        <span className="h-5 w-px bg-border" aria-hidden />
        <div role="tablist" aria-label="Friend filters" className="flex items-center gap-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-1.5 rounded px-2.5 py-0.5 text-[15px] font-medium transition-colors",
                tab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              {t.label}
              {t.badge ? <span className="rounded-full bg-destructive px-1.5 text-xs font-bold text-white">{t.badge}</span> : null}
            </button>
          ))}
          <button
            role="tab"
            type="button"
            aria-selected={tab === "add"}
            onClick={() => setTab("add")}
            className={cn(
              "rounded px-2.5 py-0.5 text-[15px] font-medium whitespace-nowrap transition-colors",
              tab === "add" ? "bg-transparent text-success" : "bg-success text-white hover:bg-success/90",
            )}
          >
            Add Friend
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-8">
        {tab === "add" ? (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-lg font-bold">Add Friend</h2>
              <p className="text-sm text-muted-foreground">You can add friends with their AcadHub username.</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  add(username)
                }}
                className="mt-3 flex items-center gap-2 rounded-lg border border-border bg-background p-2 focus-within:border-primary"
              >
                <label htmlFor="friend-username" className="sr-only">Username</label>
                <input
                  id="friend-username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter a username, e.g. arjun_iitd"
                  className="h-9 flex-1 bg-transparent px-2 text-[15px] outline-none placeholder:text-muted-foreground"
                />
                <button type="submit" disabled={!username.trim()} className="h-9 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground disabled:opacity-50">
                  Send Friend Request
                </button>
              </form>
            </div>
            <div>
              <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">People you may know</h3>
              {suggestions.length === 0 ? <p className="text-sm text-muted-foreground">{"You're connected with everyone. Nice!"}</p> : null}
              <ul className="flex flex-col divide-y divide-border/60">
                {suggestions.map((u) => (
                  <FriendRow key={u.id} user={u} meId={me.id} subtitle={u.branch || `@${u.username}`}>
                    <button type="button" onClick={() => add(u.username)} className="rounded-md bg-success px-3 py-1.5 text-sm font-semibold text-white hover:bg-success/90">
                      Add
                    </button>
                  </FriendRow>
                ))}
              </ul>
            </div>
          </div>
        ) : tab === "pending" ? (
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Pending — {incoming.length + outgoing.length}</h3>
            {incoming.length + outgoing.length === 0 ? <Empty text="There are no pending friend requests." /> : null}
            <ul className="flex flex-col divide-y divide-border/60">
              {incoming.map(({ f, user }) => (
                <FriendRow key={f.id} user={user} meId={me.id} subtitle="Incoming Friend Request">
                  <RoundBtn label="Accept" className="hover:text-success" onClick={() => { discord.respondFriendRequest(f.id, true); toast.success(`You are now friends with ${user.name}`) }}>
                    <Check className="size-5" aria-hidden />
                  </RoundBtn>
                  <RoundBtn label="Ignore" className="hover:text-destructive" onClick={() => discord.respondFriendRequest(f.id, false)}>
                    <X className="size-5" aria-hidden />
                  </RoundBtn>
                </FriendRow>
              ))}
              {outgoing.map(({ f, user }) => (
                <FriendRow key={f.id} user={user} meId={me.id} subtitle="Outgoing Friend Request">
                  <RoundBtn label="Cancel request" className="hover:text-destructive" onClick={() => discord.removeFriendship(f.id)}>
                    <X className="size-5" aria-hidden />
                  </RoundBtn>
                </FriendRow>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {tab === "online" ? "Online" : "All friends"} — {list.length}
            </h3>
            {list.length === 0 ? <Empty text={tab === "online" ? "No one's around right now." : "No friends yet. Add some!"} /> : null}
            <ul className="flex flex-col divide-y divide-border/60">
              {list.map(({ f, user }) => (
                <FriendRow key={f.id} user={user} meId={me.id} subtitle={PRESENCE_LABEL[presenceOf(user.id, me.id)]}>
                  <Link href={`/channels/me/${user.id}`} aria-label={`Message ${user.name}`} className="inline-flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground hover:text-foreground">
                    <MessageCircle className="size-5" aria-hidden />
                  </Link>
                  <RoundBtn
                    label={`Remove ${user.name}`}
                    className="hover:text-destructive"
                    onClick={() => {
                      if (!window.confirm(`Remove ${user.name} from friends?`)) return
                      try {
                        discord.removeFriendship(f.id)
                      } catch (err) {
                        toast.error(errorMessage(err))
                      }
                    }}
                  >
                    <UserMinus className="size-5" aria-hidden />
                  </RoundBtn>
                </FriendRow>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

function FriendRow({ user, meId, subtitle, children }: { user: DemoUser; meId: string; subtitle: string; children: React.ReactNode }) {
  return (
    <li className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-3 hover:bg-secondary/40">
      <StatusAvatar user={user} meId={meId} className="size-9" />
      <div className="min-w-0 flex-1">
        <p className="flex items-baseline gap-1.5 truncate">
          <span className="font-semibold">{user.name}</span>
          <span className="hidden text-sm text-muted-foreground group-hover:inline">@{user.username}</span>
        </p>
        <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </li>
  )
}

function RoundBtn({ label, onClick, className, children }: { label: string; onClick: () => void; className?: string; children: React.ReactNode }) {
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cn("inline-flex size-9 items-center justify-center rounded-full bg-background text-muted-foreground", className)}>
      {children}
    </button>
  )
}

function Empty({ text }: { text: string }) {
  return <p className="py-16 text-center text-muted-foreground">{text}</p>
}
