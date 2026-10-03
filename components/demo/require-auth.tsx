"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useCurrentUser, useHydrated } from "@/lib/demo/store"

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated()
  const user = useCurrentUser()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (hydrated && !user) router.replace(`/sign-in?next=${encodeURIComponent(pathname)}`)
  }, [hydrated, user, router, pathname])

  if (!hydrated || !user) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center" role="status">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
        <span className="sr-only">Loading your workspace</span>
      </div>
    )
  }
  return <>{children}</>
}
