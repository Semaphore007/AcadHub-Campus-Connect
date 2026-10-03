"use client"

import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BackToTop } from "@/components/layout/scroll-ui"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="acadhub-theme">
      <TooltipProvider delayDuration={200}>
        {children}
        <BackToTop />
      </TooltipProvider>
    </ThemeProvider>
  )
}
