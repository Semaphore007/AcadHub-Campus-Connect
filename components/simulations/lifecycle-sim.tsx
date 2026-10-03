"use client"

import { useEffect, useState } from "react"
import { Archive, CheckCircle2, Flag, Hammer, Pause, Play, RotateCcw, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SimFrame } from "./sim-frame"

const STAGES = [
  { label: "Goal created", icon: Flag, detail: "A student posts: “Build an IoT Vibration Monitor — need 3 people.”" },
  { label: "Students join", icon: Users, detail: "Students with matching skills request to join until slots fill." },
  { label: "Work in progress", icon: Hammer, detail: "The temporary group discusses, shares resources and builds." },
  { label: "Goal completed", icon: CheckCircle2, detail: "The team marks the goal done and records the outcome." },
  { label: "Archived", icon: Archive, detail: "The group closes. Knowledge stays searchable for future students." },
]

export function LifecycleSim() {
  const [stage, setStage] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    if (!playing) return
    if (stage >= STAGES.length - 1) {
      setPlaying(false)
      return
    }
    const t = setTimeout(() => setStage((s) => s + 1), 1400)
    return () => clearTimeout(t)
  }, [playing, stage])

  return (
    <SimFrame
      id="lifecycle"
      index="01"
      title="Goal lifecycle"
      description="Every AcadHub group exists for one goal and dissolves when it is complete."
      controls={
        <>
          <Button
            size="sm"
            onClick={() => {
              if (stage >= STAGES.length - 1) setStage(0)
              setPlaying((p) => !p)
            }}
          >
            {playing ? <Pause aria-hidden /> : <Play aria-hidden />}
            {playing ? "Pause" : "Play"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setStage((s) => Math.min(s + 1, STAGES.length - 1))} disabled={stage === STAGES.length - 1}>
            Next step
          </Button>
          <Button size="sm" variant="ghost" onClick={() => { setPlaying(false); setStage(0) }} aria-label="Reset lifecycle">
            <RotateCcw aria-hidden />
          </Button>
        </>
      }
    >
      <ol className="grid gap-3 md:grid-cols-5">
        {STAGES.map((s, i) => {
          const Icon = s.icon
          const state = i < stage ? "done" : i === stage ? "current" : "pending"
          return (
            <li key={s.label}>
              <button
                type="button"
                onClick={() => { setPlaying(false); setStage(i) }}
                aria-current={state === "current" ? "step" : undefined}
                className={cn(
                  "flex h-full w-full flex-col gap-3 rounded-xl border p-4 text-left transition-all",
                  state === "current" && "border-accent bg-accent/5 shadow-sm",
                  state === "done" && "border-success/30 bg-success/5",
                  state === "pending" && "border-border opacity-60 hover:opacity-100",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "inline-flex size-8 items-center justify-center rounded-lg",
                      state === "current" ? "bg-accent text-accent-foreground" : state === "done" ? "bg-success text-white" : "bg-secondary text-secondary-foreground",
                    )}
                  >
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <span className="text-sm font-semibold text-foreground">{s.label}</span>
              </button>
            </li>
          )
        })}
      </ol>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-valuemin={0} aria-valuemax={STAGES.length - 1} aria-valuenow={stage} aria-label="Lifecycle progress">
        <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${(stage / (STAGES.length - 1)) * 100}%` }} />
      </div>
      <p className="mt-4 rounded-lg bg-muted p-4 text-sm leading-relaxed text-foreground" aria-live="polite">
        {STAGES[stage].detail}
      </p>
    </SimFrame>
  )
}
