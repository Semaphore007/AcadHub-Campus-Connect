"use client"

import { useState } from "react"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SimFrame } from "./sim-frame"

const HOPS = [
  { label: "Browser", detail: "POST /api/v1/groups/create" },
  { label: "Express router", detail: "routes/grouprouter.js" },
  { label: "Auth + CSRF", detail: "verify JWT · check token" },
  { label: "Controller", detail: "validate input · create group" },
  { label: "PostgreSQL", detail: "INSERT INTO groups …" },
  { label: "Response", detail: "201 Created · { groupCode }" },
]

export function RequestSim() {
  const [hop, setHop] = useState(-1)
  const [running, setRunning] = useState(false)

  const run = async () => {
    setRunning(true)
    for (let i = 0; i < HOPS.length; i++) {
      setHop(i)
      await new Promise((r) => setTimeout(r, 650))
    }
    setRunning(false)
  }

  return (
    <SimFrame
      id="request"
      index="06"
      title="Request lifecycle"
      description="Trace one API request from the browser to the database and back."
      controls={
        <Button size="sm" onClick={run} disabled={running}>
          <Play aria-hidden />
          {running ? "Sending…" : "Send request"}
        </Button>
      }
    >
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-6" aria-live="polite">
        {HOPS.map((h, i) => (
          <li
            key={h.label}
            className={cn(
              "flex flex-col gap-1 rounded-xl border p-4 transition-all duration-300",
              i === hop ? "border-accent bg-accent/10 shadow-sm" : i < hop ? "border-success/30 bg-success/5" : "border-border",
            )}
          >
            <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm font-semibold text-foreground">{h.label}</span>
            <span className="font-mono text-[11px] leading-snug text-muted-foreground">{h.detail}</span>
          </li>
        ))}
      </ol>
    </SimFrame>
  )
}
