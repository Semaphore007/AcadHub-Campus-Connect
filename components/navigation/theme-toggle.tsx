"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export function ThemeToggle({ className, withLabel = false }: { className?: string; withLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = mounted && resolvedTheme === "dark"
  const next = isDark ? "light" : "dark"

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          onClick={() => setTheme(next)}
          aria-label={`Switch to ${next} theme`}
          className={cn(
            "relative inline-flex h-9 items-center justify-center gap-2 rounded-xl border border-border/60 px-2.5 text-sm",
            "bg-background/50 text-foreground transition-all hover:bg-secondary hover:border-border",
            !withLabel && "w-9 px-0",
            className,
          )}
        >
          {/* Sun icon (shown in light mode) */}
          <Sun
            className={cn(
              "size-4 transition-all duration-300",
              isDark ? "opacity-0 scale-50 absolute" : "opacity-100 scale-100",
              "text-primary",
            )}
            aria-hidden
          />
          {/* Moon icon (shown in dark mode) */}
          <Moon
            className={cn(
              "size-4 transition-all duration-300",
              isDark ? "opacity-100 scale-100" : "opacity-0 scale-50 absolute",
              "text-accent",
            )}
            aria-hidden
          />
          {withLabel && (
            <span className="transition-colors">
              <span className="dark:hidden">Light</span>
              <span className="hidden dark:inline">Dark</span>
              {" "}theme
            </span>
          )}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        Switch to {next} mode
      </TooltipContent>
    </Tooltip>
  )
}
