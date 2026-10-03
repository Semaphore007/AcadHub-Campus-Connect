import type { GoalCategory, GoalStatus } from "@/lib/demo/types"
import { cn } from "@/lib/utils"

export const CATEGORIES: GoalCategory[] = ["Hackathon", "Study", "Project", "Research", "Club", "Event"]

const STATUS_STYLE: Record<GoalStatus, string> = {
  open: "bg-success/12 text-success",
  active: "bg-primary/12 text-primary",
  completed: "bg-accent/12 text-accent",
  archived: "bg-muted text-muted-foreground",
}

export function StatusBadge({ status }: { status: GoalStatus }) {
  return (
    <span className={cn("rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize", STATUS_STYLE[status])}>{status}</span>
  )
}

export function SkillChip({ skill, matched }: { skill: string; matched?: boolean }) {
  return (
    <span
      className={cn(
        "rounded-lg border px-2 py-0.5 text-xs font-medium",
        matched ? "border-success/40 bg-success/10 text-success" : "border-border/60 bg-secondary/60 text-muted-foreground",
      )}
    >
      {skill}
    </span>
  )
}

export function daysLeft(deadline: string) {
  const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86_400_000)
  if (d < 0) return "Ended"
  if (d === 0) return "Due today"
  return `${d} day${d === 1 ? "" : "s"} left`
}

export function matchScore(goalSkills: string[], userSkills: string[]) {
  if (goalSkills.length === 0) return 0
  const mine = new Set(userSkills.map((s) => s.toLowerCase()))
  return Math.round((goalSkills.filter((s) => mine.has(s.toLowerCase())).length / goalSkills.length) * 100)
}
