"use client"

import { useState } from "react"
import { RotateCcw, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { SIM_STUDENTS } from "@/data/simulations/mock"
import { cn } from "@/lib/utils"
import { Avatar, SimFrame } from "./sim-frame"

const SLOTS = 4

export function GroupSim() {
  const [members, setMembers] = useState(1)
  const full = members >= SLOTS

  return (
    <SimFrame
      id="group"
      index="03"
      title="Temporary group formation"
      description="Slots fill as students join. When the group is full, it closes to new requests."
      controls={
        <>
          <Button size="sm" onClick={() => setMembers((m) => Math.min(m + 1, SLOTS))} disabled={full}>
            <UserPlus aria-hidden />
            Request to join
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setMembers(1)} aria-label="Reset group">
            <RotateCcw aria-hidden />
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">IOT-VIB-24 · IoT Vibration Monitoring</p>
          <Badge variant={full ? "success" : "warning"} aria-live="polite">
            {full ? "Full · Active" : `${members}/${SLOTS} joined`}
          </Badge>
        </div>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Array.from({ length: SLOTS }).map((_, i) => {
            const s = SIM_STUDENTS[i]
            const filled = i < members
            return (
              <li
                key={s.id}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-5 text-center transition-all",
                  filled ? "border-accent/40 bg-accent/5" : "border-dashed border-border",
                )}
              >
                {filled ? <Avatar initials={s.initials} className="size-12 bg-primary text-primary-foreground" /> : <span className="size-12 rounded-full border border-dashed border-border" aria-hidden />}
                <span className="text-sm font-medium text-foreground">{filled ? s.name : "Open slot"}</span>
                <span className="text-xs text-muted-foreground">{filled ? (i === 0 ? "Creator" : s.skill) : "Waiting"}</span>
              </li>
            )
          })}
        </ul>
      </div>
    </SimFrame>
  )
}
