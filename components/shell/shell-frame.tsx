"use client"

import { Suspense, useState } from "react"
import { usePathname } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { Menu } from "lucide-react"
import { Brand } from "@/components/navigation/brand"
import { Sidebar, type ShellCommunity } from "./sidebar"
import { Topbar, type ShellUser } from "./topbar"

type Props = {
  user: ShellUser | null
  communities: ShellCommunity[]
  pendingRequests: number
  children: React.ReactNode
}

export function ShellFrame({ user, communities, pendingRequests, children }: Props) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  if (pathname?.startsWith("/channels")) {
    return (
      <main id="main" className="h-dvh overflow-hidden">
        {children}
      </main>
    )
  }
  const sidebarProps = { signedIn: Boolean(user), communities, pendingRequests }
  const toggleNavigation = () => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      setDesktopSidebarOpen((visible) => !visible)
      return
    }
    setOpen((visible) => !visible)
  }

  return (
    <div className="flex min-h-dvh bg-background">
      {/* Permanent left sidebar on desktop */}
      <aside
        className={`sticky top-0 hidden h-dvh w-60 shrink-0 border-r border-border/60 bg-sidebar ${
          desktopSidebarOpen ? "lg:flex lg:flex-col" : ""
        }`}
      >
        <Suspense>
          <Sidebar {...sidebarProps} />
        </Suspense>
      </aside>

      {/* Mobile sidebar drawer */}
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" />
          <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border/60 bg-sidebar shadow-2xl outline-none lg:hidden">
            <Dialog.Title className="sr-only">Navigation</Dialog.Title>
            <div className="flex h-14 items-center gap-2 border-b border-border/50 px-3">
              <Dialog.Close
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                aria-label="Close navigation"
              >
                <Menu className="size-4" aria-hidden />
              </Dialog.Close>
              <Brand compact className="min-w-0 gap-2" />
            </div>
            <Suspense>
              <Sidebar {...sidebarProps} headerOffset={false} onNavigate={() => setOpen(false)} />
            </Suspense>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onToggleMenu={toggleNavigation} />
        <main id="main" className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}
