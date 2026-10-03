"use client"

import Link from "next/link"
import { toast } from "react-toastify"
import { CalendarClock, Check, Users } from "lucide-react"
import { UserAvatar } from "@/components/app/user-avatar"
import { actions, errorMessage, useDemo } from "@/lib/demo/store"
import type { DemoUser, Goal } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { daysLeft, matchScore, SkillChip, StatusBadge } from "./goal-meta"

export function GoalCard({ goal, me }: { goal: Goal; me: DemoUser }) {
  const members = useDemo((s) => s.users)
  const team = goal.memberIds.map((id) => members.find((u) => u.id === id)).filter(Boolean) as DemoUser[]
  const joined = goal.memberIds.includes(me.id)
  const full = goal.memberIds.length >= goal.slots
  const closed = goal.status === "archived" || goal.status === "completed"
  const score = matchScore(goal.skills, me.skills)
  const mySkills = new Set(me.skills.map((s) => s.toLowerCase()))

  const join = () => {
    try {
      actions.joinGoal(goal.id)
      toast.success(`Joined "${goal.title}"`)
    } catch (e) {
      toast.error(errorMessage(e))
    }
  }

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-accent">{goal.category}</span>
          <StatusBadge status={goal.status} />
        </div>
        {me.skills.length > 0 && score > 0 ? (
          <span className="shrink-0 rounded-full bg-success/12 px-2 py-0.5 text-[11px] font-semibold text-success">{score}% match</span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <h3 className="text-pretty text-base font-semibold leading-snug text-foreground">
          <Link href={`/goals/${goal.id}`} className="after:absolute after:inset-0 focus-visible:outline-none relative">
            {goal.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{goal.description}</p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {goal.skills.map((s) => (
          <SkillChip key={s} skill={s} matched={mySkills.has(s.toLowerCase())} />
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex -space-x-2">
            {team.slice(0, 4).map((u) => (
              <UserAvatar key={u.id} name={u.name} seed={u.id} className="size-6 ring-2 ring-card" />
            ))}
          </span>
          <span className="flex items-center gap-1">
            <Users className="size-3.5" aria-hidden />
            {goal.memberIds.length}/{goal.slots}
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <CalendarClock className="size-3.5" aria-hidden />
            {daysLeft(goal.deadline)}
          </span>
        </div>
        {joined ? (
          <Link
            href={`/goals/${goal.id}`}
            className="relative z-10 inline-flex h-8 items-center gap-1.5 rounded-lg bg-secondary px-3 text-xs font-semibold text-secondary-foreground hover:bg-secondary/80"
          >
            <Check className="size-3.5" aria-hidden />
            Open room
          </Link>
        ) : (
          <button
            type="button"
            onClick={join}
            disabled={full || closed}
            className={cn(
              "relative z-10 inline-flex h-8 items-center rounded-lg px-3 text-xs font-semibold transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
            )}
          >
            {closed ? "Closed" : full ? "Team full" : "Join team"}
          </button>
        )}
      </div>
    </article>
  )
}
