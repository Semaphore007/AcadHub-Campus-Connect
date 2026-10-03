import * as React from "react"
import { cn } from "@/lib/utils"

export function SimFrame({
  id,
  index,
  title,
  description,
  children,
  controls,
  className,
}: {
  id: string
  index: string
  title: string
  description: string
  children: React.ReactNode
  controls?: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("scroll-mt-24 overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="flex flex-col gap-4 border-b border-border p-5 md:flex-row md:items-end md:justify-between md:p-6">
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Simulation {index}</p>
          <h2 id={`${id}-title`} className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {controls && <div className="flex flex-wrap gap-2">{controls}</div>}
      </div>
      <div className="p-5 md:p-6">{children}</div>
    </section>
  )
}

export function Avatar({ initials, className }: { initials: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-medium text-secondary-foreground",
        className,
      )}
    >
      {initials}
    </span>
  )
}
