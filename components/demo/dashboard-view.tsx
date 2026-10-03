"use client"

import Link from "next/link"
import { ArrowRight, Bot, CheckCircle2, Compass, ListTodo, Plus, Target, Users } from "lucide-react"
import { GoalCard } from "@/components/goals/goal-card"
import { matchScore } from "@/components/goals/goal-meta"
import { timeAgo } from "@/lib/avatars"
import { useCurrentUser, useDemo } from "@/lib/demo/store"

export function DashboardView() {
  const me = useCurrentUser()
  const goals = useDemo((s) => s.goals)
  const tasks = useDemo((s) => s.tasks)
  const activity = useDemo((s) => s.activity)
  if (!me) return null

  const myGoals = goals.filter((g) => g.memberIds.includes(me.id) && g.status !== "archived")
  const myTasks = tasks.filter((t) => t.assigneeId === me.id && t.status !== "done")
  const doneTasks = tasks.filter((t) => t.assigneeId === me.id && t.status === "done").length
  const recommended = goals
    .filter((g) => g.status === "open" && !g.memberIds.includes(me.id) && g.memberIds.length < g.slots)
    .map((g) => ({ g, score: matchScore(g.skills, me.skills) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)

  const stats = [
    { label: "Active teams", value: myGoals.length, icon: Users },
    { label: "Open tasks", value: myTasks.length, icon: ListTodo },
    { label: "Tasks done", value: doneTasks, icon: CheckCircle2 },
    { label: "Skills listed", value: me.skills.length, icon: Target },
  ]

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6">
      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/10 p-6 sm:p-8">
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-wider text-accent">Dashboard</p>
            <h1 className="mt-1 text-balance text-3xl font-bold tracking-tight">Welcome back, {me.name.split(" ")[0]}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {me.branch} · {me.year} year — {myTasks.length > 0 ? `you have ${myTasks.length} open task${myTasks.length === 1 ? "" : "s"}.` : "you're all caught up."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/goals?create=1" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Plus className="size-4" aria-hidden />
              New goal
            </Link>
            <Link href="/goals" className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/60 bg-background px-4 text-sm font-semibold hover:bg-secondary">
              <Compass className="size-4" aria-hidden />
              Browse goals
            </Link>
          </div>
        </div>
      </header>

      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <s.icon className="size-5" aria-hidden />
            </span>
            <div>
              <dt className="text-xs text-muted-foreground">{s.label}</dt>
              <dd className="text-2xl font-bold tabular-nums">{s.value}</dd>
            </div>
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="flex flex-col gap-3 lg:col-span-2" aria-labelledby="teams-heading">
          <div className="flex items-center justify-between">
            <h2 id="teams-heading" className="text-lg font-semibold">Your teams</h2>
            <Link href="/goals" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              All goals <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </div>
          {myGoals.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              {"You haven't joined any teams yet. "}
              <Link href="/goals" className="font-semibold text-primary hover:underline">Find one</Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {myGoals.map((g) => {
                const goalTasks = tasks.filter((t) => t.goalId === g.id)
                const pct = goalTasks.length ? Math.round((goalTasks.filter((t) => t.status === "done").length / goalTasks.length) * 100) : 0
                return (
                  <li key={g.id}>
                    <Link href={`/goals/${g.id}`} className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-4 transition hover:border-primary/40">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{g.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {g.category} · {g.memberIds.length}/{g.slots} members · {goalTasks.length} tasks
                        </p>
                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Task progress">
                          <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-muted-foreground">{pct}%</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-3" aria-labelledby="activity-heading">
          <h2 id="activity-heading" className="text-lg font-semibold">Recent activity</h2>
          <ul className="flex flex-col divide-y divide-border/60 rounded-2xl border border-border/60 bg-card">
            {activity.slice(0, 6).map((a) => (
              <li key={a.id} className="p-3.5">
                <p className="text-sm leading-snug">{a.text}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</p>
              </li>
            ))}
            {activity.length === 0 ? <li className="p-6 text-center text-sm text-muted-foreground">Nothing yet.</li> : null}
          </ul>
          <Link href="/ai" className="flex items-center gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-4 transition hover:bg-accent/15">
            <Bot className="size-5 text-accent" aria-hidden />
            <span className="text-sm font-medium">Ask the AI Study Buddy</span>
            <ArrowRight className="ml-auto size-4 text-accent" aria-hidden />
          </Link>
        </section>
      </div>

      {recommended.length > 0 ? (
        <section className="flex flex-col gap-3" aria-labelledby="rec-heading">
          <h2 id="rec-heading" className="text-lg font-semibold">Recommended for your skills</h2>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommended.map(({ g }) => (
              <GoalCard key={g.id} goal={g} me={me} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  )
}
