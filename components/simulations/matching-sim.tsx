"use client"

import { useState } from "react"
import { Check, Plus, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SIM_STUDENTS, SKILL_GOAL } from "@/data/simulations/mock"
import { cn } from "@/lib/utils"
import { Avatar, SimFrame } from "./sim-frame"

export function MatchingSim() {
  const [invited, setInvited] = useState<string[]>([])
  const [matched, setMatched] = useState(false)

  const ranked = [...SIM_STUDENTS].sort(
    (a, b) => Number(SKILL_GOAL.required.includes(b.skill)) - Number(SKILL_GOAL.required.includes(a.skill)),
  )
  const covered = SKILL_GOAL.required.filter((skill) => SIM_STUDENTS.some((s) => invited.includes(s.id) && s.skill === skill))

  return (
    <SimFrame
      id="matching"
      index="02"
      title="Skill matching"
      description="The goal lists the skills it needs. AcadHub surfaces students whose skills match."
      controls={
        <>
          <Button size="sm" onClick={() => setMatched(true)} disabled={matched}>
            <Sparkles aria-hidden />
            Find matches
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setMatched(false); setInvited([]) }} aria-label="Reset matching">
            <RotateCcw aria-hidden />
          </Button>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted p-5 lg:col-span-2">
          <p className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Goal</p>
          <p className="text-lg font-semibold leading-snug text-foreground">{SKILL_GOAL.title}</p>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">Required skills · {covered.length}/{SKILL_GOAL.required.length} covered</p>
            <ul className="flex flex-wrap gap-2">
              {SKILL_GOAL.required.map((skill) => (
                <li key={skill}>
                  <Badge variant={covered.includes(skill) ? "success" : "outline"}>
                    {covered.includes(skill) && <Check aria-hidden />}
                    {skill}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <ul className="flex flex-col gap-2 lg:col-span-3" aria-live="polite">
          {ranked.map((s) => {
            const match = SKILL_GOAL.required.includes(s.skill)
            const isInvited = invited.includes(s.id)
            return (
              <li
                key={s.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-all",
                  matched && match ? "border-accent/40 bg-accent/5" : "border-border",
                  matched && !match && "opacity-50",
                )}
              >
                <Avatar initials={s.initials} />
                <div className="flex flex-1 flex-col">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <span className="text-xs text-muted-foreground">Skill: {s.skill}</span>
                </div>
                {matched && (
                  <Badge variant={match ? "accent" : "outline"}>{match ? "Match" : "No match"}</Badge>
                )}
                <Button
                  size="sm"
                  variant={isInvited ? "secondary" : "outline"}
                  disabled={!matched || !match}
                  onClick={() => setInvited((v) => (isInvited ? v.filter((x) => x !== s.id) : [...v, s.id]))}
                  aria-pressed={isInvited}
                >
                  {isInvited ? <Check aria-hidden /> : <Plus aria-hidden />}
                  {isInvited ? "Invited" : "Invite"}
                </Button>
              </li>
            )
          })}
        </ul>
      </div>
    </SimFrame>
  )
}
