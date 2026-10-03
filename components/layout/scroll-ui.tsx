"use client"

import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

function scrollTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })
}

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? window.scrollY / max : 0)
    }
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <div aria-hidden className="absolute inset-x-0 bottom-0 h-[2px] bg-transparent">
      <div
        className="h-full origin-left"
        style={{
          transform: `scaleX(${progress})`,
          background: "linear-gradient(90deg, oklch(0.5 0.24 275), oklch(0.58 0.22 230))",
        }}
      />
    </div>
  )
}


export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const reduce = useReducedMotion()
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: 16 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-40"
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={scrollTop}
                aria-label="Back on top of the page"
                className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-primary px-4 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                <ArrowUp className="size-4" aria-hidden />
                Back on Top
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">Scroll to the top</TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function BackToTopLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={scrollTop}
      className={cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground", className)}
    >
      Back on Top <ArrowUp className="size-3.5" aria-hidden />
    </button>
  )
}
