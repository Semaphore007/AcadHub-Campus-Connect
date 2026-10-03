"use client"

import { useMemo, useState } from "react"
import useSWR from "swr"
import { Clock, Search, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getGroups } from "@/lib/api/client"
import { MOCK_GROUPS } from "@/data/simulations/mock"
import type { Group } from "@/lib/api/types"
import { cn } from "@/lib/utils"
import { SimFrame } from "./sim-frame"

const CATEGORIES = ["All", "Project", "Learning", "Research", "Competition"] as const

export function FeedSim() {
  const { data, isLoading } = useSWR("groups", getGroups, { revalidateOnFocus: false })
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All")
  const [query, setQuery] = useState("")
  const [beginner, setBeginner] = useState(false)

  const groups: Group[] = data?.data ?? MOCK_GROUPS
  const filtered = useMemo(
    () =>
      groups.filter(
        (g) =>
          (category === "All" || g.category === category) &&
          (!beginner || g.beginnerFriendly) &&
          `${g.name} ${g.skills.join(" ")}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [groups, category, beginner, query],
  )

  return (
    <SimFrame
      id="feed"
      index="04"
      title="Goal discovery feed"
      description="Students browse open goals by category, skill or beginner-friendliness."
      controls={
        <Badge variant={data?.source === "backend" ? "success" : "outline"}>
          {isLoading ? "Loading…" : data?.source === "backend" ? "Live backend" : "Mock data"}
        </Badge>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <label className="relative flex-1">
            <span className="sr-only">Search goals</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by goal or skill…"
              className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none focus-visible:border-accent"
            />
          </label>
          <label className="inline-flex items-center gap-2 text-sm text-foreground">
            <input type="checkbox" checked={beginner} onChange={(e) => setBeginner(e.target.checked)} className="size-4 accent-[var(--accent)]" />
            Beginner friendly
          </label>
        </div>
        <div role="tablist" aria-label="Category" className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              role="tab"
              aria-selected={category === c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                category === c ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <ul className="grid gap-3 md:grid-cols-2" aria-live="polite">
          {filtered.length === 0 && <li className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No goals match these filters.</li>}
          {filtered.map((g) => (
            <li key={g.groupCode} className="flex flex-col gap-3 rounded-xl border border-border p-4 transition-colors hover:border-accent/40">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="accent">{g.category}</Badge>
                <span className="font-mono text-[11px] text-muted-foreground">{g.groupCode}</span>
              </div>
              <p className="font-semibold leading-snug text-foreground">{g.name}</p>
              <p className="text-sm leading-relaxed text-muted-foreground">{g.description}</p>
              <ul className="flex flex-wrap gap-1.5">
                {g.skills.map((s) => (
                  <li key={s}>
                    <Badge variant="outline">{s}</Badge>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center gap-4 border-t border-border pt-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1"><Users className="size-3.5" aria-hidden />{g.members}/{g.maxMembers}</span>
                <span className="inline-flex items-center gap-1"><Clock className="size-3.5" aria-hidden />{g.deadline}</span>
                {g.beginnerFriendly && <span className="ml-auto text-success">Beginner friendly</span>}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SimFrame>
  )
}
