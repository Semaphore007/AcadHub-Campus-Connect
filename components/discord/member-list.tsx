"use client"

import Link from "next/link"
import { useMemo } from "react"
import { Crown } from "lucide-react"
import { useDemo } from "@/lib/demo/store"
import type { DemoUser, Server } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { StatusAvatar } from "./channel-sidebar"
import { presenceOf } from "./utils"

export function MemberList({ server, me }: { server: Server; me: DemoUser }) {
  const users = useDemo((s) => s.users)
  const groups = useMemo(() => {
    const members = server.memberIds.map((id) => users.find((u) => u.id === id)).filter((u): u is DemoUser => Boolean(u))
    const online = members.filter((u) => presenceOf(u.id, me.id) !== "offline")
    const offline = members.filter((u) => presenceOf(u.id, me.id) === "offline")
    return [
      { label: "Online", items: online },
      { label: "Offline", items: offline },
    ]
  }, [server.memberIds, users, me.id])

  return (
    <aside aria-label="Members" className="hidden w-60 shrink-0 overflow-y-auto bg-sidebar px-2 py-4 lg:block">
      {groups.map((g) =>
        g.items.length ? (
          <div key={g.label} className="mb-4">
            <p className="mb-1 px-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              {g.label} — {g.items.length}
            </p>
            <ul>
              {g.items.map((u) => (
                <li key={u.id}>
                  <Link
                    href={u.id === me.id ? "/profile" : `/channels/me/${u.id}`}
                    className={cn("flex items-center gap-3 rounded-md px-2 py-1.5 hover:bg-secondary/60", g.label === "Offline" && "opacity-50 hover:opacity-100")}
                  >
                    <StatusAvatar user={u} meId={me.id} className="size-8" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1 truncate text-[15px] font-medium">
                        <span className="truncate">{u.name}</span>
                        {u.id === server.ownerId ? <Crown className="size-3.5 shrink-0 text-warning" aria-label="Server owner" /> : null}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">{u.branch || `@${u.username}`}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null,
      )}
    </aside>
  )
}
