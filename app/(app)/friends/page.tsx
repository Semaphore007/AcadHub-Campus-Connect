"use client"

import { useState } from "react"
import { Check, Clock, Search, UserCheck, UserMinus, UserPlus, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"

type Tab = "requests" | "friends" | "find"

interface User {
  id: string
  name: string
  username: string
  avatar: string
  bio: string
  mutualFriends: number
  online: boolean
  communities: string[]
}

const PENDING_REQUESTS: (User & { sentAt: string })[] = [
  { id: "r1", name: "Arjun Sharma", username: "arjun_iitd", avatar: "AS", bio: "ML enthusiast | Hackathon lover", mutualFriends: 4, online: true, communities: ["AI/ML", "Hackathons"], sentAt: "2h ago" },
  { id: "r2", name: "Meera Singh", username: "meera_cs24", avatar: "MS", bio: "Web dev | Design enthusiast", mutualFriends: 2, online: false, communities: ["Web Dev", "Design"], sentAt: "Yesterday" },
]

const FRIENDS: (User & { lastActive: string })[] = [
  { id: "f1", name: "Priya Nair", username: "priya_cs23", avatar: "PN", bio: "Full-stack dev | IoT projects", mutualFriends: 0, online: true, communities: ["Web Dev", "IoT"], lastActive: "Online now" },
  { id: "f2", name: "Rishi Dev", username: "dev_rishi", avatar: "RD", bio: "Competitive programmer | Codeforces 1400", mutualFriends: 3, online: false, communities: ["DSA", "Hackathons"], lastActive: "3h ago" },
  { id: "f3", name: "Sneha Patel", username: "sneha_p", avatar: "SP", bio: "UI/UX designer | Figma pro", mutualFriends: 1, online: true, communities: ["Design", "Web Dev"], lastActive: "Online now" },
]

const SUGGESTIONS: User[] = [
  { id: "s1", name: "Kabir Nanda", username: "kabir_ml", avatar: "KN", bio: "Deep learning researcher", mutualFriends: 3, online: true, communities: ["AI/ML", "Research"] },
  { id: "s2", name: "Ananya Roy", username: "ananya_r", avatar: "AR", bio: "IoT & embedded systems", mutualFriends: 2, online: false, communities: ["IoT", "Electronics"] },
  { id: "s3", name: "Vikram Joshi", username: "vikram_j", avatar: "VJ", bio: "Full-stack MERN developer", mutualFriends: 5, online: true, communities: ["Web Dev", "Campus Life"] },
  { id: "s4", name: "Tanisha Modi", username: "tanisha_m", avatar: "TM", bio: "Research student | NLP", mutualFriends: 1, online: false, communities: ["AI/ML", "Research"] },
  { id: "s5", name: "Aditya Kumar", username: "aditya_k", avatar: "AK", bio: "Game dev & AR enthusiast", mutualFriends: 0, online: true, communities: ["Web Dev", "Design"] },
  { id: "s6", name: "Divya Sharma", username: "divya_s", avatar: "DS", bio: "Competitive programming gold", mutualFriends: 4, online: false, communities: ["DSA", "Hackathons"] },
]

function UserAvatar({ initials, online, size = "md" }: { initials: string; online?: boolean; size?: "sm" | "md" | "lg" }) {
  const sz = size === "sm" ? "size-9 text-xs" : size === "lg" ? "size-14 text-base" : "size-11 text-sm"
  return (
    <div className="relative shrink-0">
      <div className={cn("flex items-center justify-center rounded-full bg-gradient-to-br from-primary/70 to-accent/70 font-bold text-white", sz)}>
        {initials}
      </div>
      {online !== undefined && (
        <span className={cn("absolute bottom-0 right-0 rounded-full border-2 border-background", size === "sm" ? "size-2" : "size-2.5", online ? "bg-green-400" : "bg-border")} />
      )}
    </div>
  )
}

export default function FriendsPage() {
  const [tab, setTab] = useState<Tab>("requests")
  const [query, setQuery] = useState("")
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [accepted, setAccepted] = useState<Set<string>>(new Set())

  const TABS: { id: Tab; label: string; icon: typeof Users; count?: number }[] = [
    { id: "requests", label: "Requests", icon: Clock, count: PENDING_REQUESTS.filter((r) => !dismissed.has(r.id) && !accepted.has(r.id)).length },
    { id: "friends", label: "Friends", icon: UserCheck, count: FRIENDS.length },
    { id: "find", label: "Find People", icon: Search },
  ]

  const filteredSuggestions = SUGGESTIONS.filter(
    (u) => !sentRequests.has(u.id) && (
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      u.username.toLowerCase().includes(query.toLowerCase())
    )
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Friends</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Connect with students from your communities</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-2xl border border-border/60 bg-card p-1">
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            aria-selected={tab === id}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-medium transition-all",
              tab === id
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon className="size-4" aria-hidden />
            {label}
            {count !== undefined && count > 0 && (
              <span className={cn("flex size-5 items-center justify-center rounded-full text-[10px] font-bold", tab === id ? "bg-white/25 text-white" : "bg-primary/10 text-primary")}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Incoming requests */}
      {tab === "requests" && (
        <div className="flex flex-col gap-3">
          {PENDING_REQUESTS.filter((r) => !dismissed.has(r.id) && !accepted.has(r.id)).length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
              <UserPlus className="size-12 opacity-20" />
              <p className="font-medium">No pending requests</p>
              <p className="text-sm">Switch to "Find People" to connect with students</p>
            </div>
          ) : (
            PENDING_REQUESTS.filter((r) => !dismissed.has(r.id) && !accepted.has(r.id)).map((user) => (
              <div key={user.id} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4">
                <UserAvatar initials={user.avatar} online={user.online} size="lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{user.name}</p>
                      <span className="text-xs text-muted-foreground">u/{user.username}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.bio}</p>
                    {user.mutualFriends > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.mutualFriends} mutual friend{user.mutualFriends > 1 ? "s" : ""}
                      </p>
                    )}
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {user.communities.map((c) => (
                        <span key={c} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAccepted((s) => new Set([...s, user.id]))}
                      className="flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md"
                    >
                      <Check className="size-3.5" /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setDismissed((s) => new Set([...s, user.id]))}
                      className="flex items-center gap-1.5 rounded-xl border border-border/60 px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <X className="size-3.5" /> Decline
                    </button>
                  </div>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{user.sentAt}</span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Friends list */}
      {tab === "friends" && (
        <div className="flex flex-col gap-3">
          {FRIENDS.map((user) => (
            <div key={user.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/20 hover:shadow-sm">
              <UserAvatar initials={user.avatar} online={user.online} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-foreground">{user.name}</p>
                  <span className="text-xs text-muted-foreground">u/{user.username}</span>
                </div>
                <p className="text-sm text-muted-foreground">{user.bio}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{user.lastActive}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-xl border border-border/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Message
                </button>
                <button
                  type="button"
                  aria-label="Remove friend"
                  className="flex size-8 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
                >
                  <UserMinus className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Find people */}
      {tab === "find" && (
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              type="search"
              placeholder="Search by name or username…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-border/60 bg-secondary/50 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          {!query && (
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Suggested from your communities
            </p>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {filteredSuggestions.map((user) => (
              <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-start gap-3">
                  <UserAvatar initials={user.avatar} online={user.online} />
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground">u/{user.username}</p>
                    {user.mutualFriends > 0 && (
                      <p className="text-xs text-muted-foreground">{user.mutualFriends} mutual friend{user.mutualFriends > 1 ? "s" : ""}</p>
                    )}
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">{user.bio}</p>
                <div className="flex flex-wrap gap-1">
                  {user.communities.map((c) => (
                    <span key={c} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{c}</span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => setSentRequests((s) => new Set([...s, user.id]))}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary/10 py-2 text-sm font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  <UserPlus className="size-4" />
                  Add Friend
                </button>
              </div>
            ))}

            {sentRequests.size > 0 && SUGGESTIONS.filter((u) => sentRequests.has(u.id)).map((user) => (
              <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-success/30 bg-success/5 p-4">
                <div className="flex items-center gap-3">
                  <UserAvatar initials={user.avatar} size="sm" />
                  <p className="font-semibold text-foreground">{user.name}</p>
                </div>
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <Check className="size-4" />
                  Request sent!
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
