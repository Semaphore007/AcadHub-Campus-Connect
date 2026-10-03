"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Plus, Search, Target } from "lucide-react"
import { useCurrentUser, useDemo } from "@/lib/demo/store"
import type { GoalCategory } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { CreateGoalDialog } from "./create-goal-dialog"
import { GoalCard } from "./goal-card"
import { CATEGORIES, matchScore } from "./goal-meta"

type Tab = "all" | "matched" | "mine"
const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All goals" },
  { id: "matched", label: "Best matches" },
  { id: "mine", label: "My teams" },
]

export function GoalsBrowser() {
  const me = useCurrentUser()
  const goals = useDemo((s) => s.goals)
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [tab, setTab] = useState<Tab>("all")
  const [category, setCategory] = useState<GoalCategory | "All">("All")
  const [query, setQuery] = useState("")
  const createOpen = params.get("create") === "1"

  const setCreateOpen = (open: boolean) => router.replace(open ? `${pathname}?create=1` : pathname, { scroll: false })

  const visible = useMemo(() => {
    if (!me) return []
    const q = query.trim().toLowerCase()
    let list = goals.filter((g) => g.status !== "archived" || g.memberIds.includes(me.id))
    if (tab === "mine") list = list.filter((g) => g.memberIds.includes(me.id))
    if (tab === "matched") list = list.filter((g) => !g.memberIds.includes(me.id) && matchScore(g.skills, me.skills) > 0)
    if (category !== "All") list = list.filter((g) => g.category === category)
    if (q) list = list.filter((g) => [g.title, g.description, ...g.skills].join(" ").toLowerCase().includes(q))
    return tab === "matched"
      ? [...list].sort((a, b) => matchScore(b.skills, me.skills) - matchScore(a.skills, me.skills))
      : [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [goals, me, tab, category, query])

  if (!me) return null

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">Goal-based matching</p>
          <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight">Find your team</h1>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Join goals that match your skills, or post your own and collaborate in a shared team room.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="inline-flex h-10 shrink-0 items-center gap-1.5 self-start rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 sm:self-auto"
        >
          <Plus className="size-4" aria-hidden />
          New goal
        </button>
      </header>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="tablist" aria-label="Goal filters" className="flex gap-1 rounded-xl bg-secondary/60 p-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-medium transition",
                tab === t.id ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <label htmlFor="goal-search" className="sr-only">Search goals</label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            id="goal-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title or skill"
            className="h-10 w-full rounded-xl border border-border/60 bg-secondary/50 pl-9 pr-3 text-sm outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2" aria-label="Categories">
        {(["All", ...CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={category === c}
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition",
              category === c ? "border-primary bg-primary text-primary-foreground" : "border-border/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      {tab === "matched" && me.skills.length === 0 ? (
        <p className="rounded-xl border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          Add skills to your profile to get matched with goals.
        </p>
      ) : null}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
          <Target className="size-8 text-muted-foreground" aria-hidden />
          <p className="text-sm text-muted-foreground">No goals found. Try another filter or create one.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visible.map((g) => (
            <GoalCard key={g.id} goal={g} me={me} />
          ))}
        </div>
      )}

      <CreateGoalDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
