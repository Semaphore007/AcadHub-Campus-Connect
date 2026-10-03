"use client"

import { ThemeProvider, useTheme } from "next-themes"
import { ToastContainer } from "react-toastify"
import { TooltipProvider } from "@/components/ui/tooltip"
import { BackToTop } from "@/components/layout/scroll-ui"

function Toasts() {
  const { resolvedTheme } = useTheme()
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={2600}
      hideProgressBar
      newestOnTop
      theme={resolvedTheme === "dark" ? "dark" : "light"}
    />
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="acadhub-theme">
      <TooltipProvider delayDuration={200}>
        {children}
        <BackToTop />
        <Toasts />
      </TooltipProvider>
    </ThemeProvider>
  )
}
