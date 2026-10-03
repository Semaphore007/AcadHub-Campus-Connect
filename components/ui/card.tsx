import * as React from "react"
import { cn } from "@/lib/utils"

export function Card({ className, interactive, ...props }: React.ComponentProps<"div"> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground",
        interactive && "transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
      {...props}
    />
  )
}
