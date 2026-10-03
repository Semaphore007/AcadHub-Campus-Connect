"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { toast } from "react-toastify"
import { Bell, LayoutDashboard, LogOut, Menu, Plus, RotateCcw, Settings, Sparkles, Target, User } from "lucide-react"
import { Brand } from "@/components/navigation/brand"
import { ThemeToggle } from "@/components/navigation/theme-toggle"
import { SearchCommand } from "@/components/navigation/search-command"
import { UserAvatar } from "@/components/app/user-avatar"
import { timeAgo } from "@/lib/avatars"
import { actions, auth, useCurrentUser, useDemo } from "@/lib/demo/store"
import { cn } from "@/lib/utils"

export type ShellUser = { id: string; name: string; username: string | null; image: string | null; email: string; isDemo: boolean }

const itemClass =
  "flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-secondary cursor-pointer"

function Notifications() {
  const activity = useDemo((s) => s.activity)
  const unread = activity.filter((a) => !a.read).length
  return (
    <DropdownMenu.Root onOpenChange={(open) => !open && unread > 0 && actions.markActivityRead()}>
      <DropdownMenu.Trigger
        aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"}
        className="relative inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
      >
        <Bell className="size-4" aria-hidden />
        {unread > 0 ? (
          <span className="absolute -top-1 -right-1 flex min-w-4 items-center justify-center rounded-full bg-hot px-1 text-[10px] font-bold text-white ring-2 ring-background">
            {unread}
          </span>
        ) : null}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-80 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl">
          <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activity</p>
          <div className="max-h-80 overflow-y-auto">
            {activity.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No activity yet.</p>
            ) : (
              activity.slice(0, 12).map((a) => (
                <DropdownMenu.Item key={a.id} asChild>
                  <Link href={a.href ?? "/dashboard"} className={cn(itemClass, "items-start")}>
                    <span className={cn("mt-1.5 size-2 shrink-0 rounded-full", a.read ? "bg-border" : "bg-primary")} aria-hidden />
                    <span className="flex min-w-0 flex-col">
                      <span className="text-sm leading-snug">{a.text}</span>
                      <span className="text-xs text-muted-foreground">{timeAgo(a.createdAt)}</span>
                    </span>
                  </Link>
                </DropdownMenu.Item>
              ))
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

export function Topbar({ onToggleMenu }: { user?: ShellUser | null; onToggleMenu: () => void }) {
  const router = useRouter()
  const user = useCurrentUser()

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleMenu}
          className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="Toggle navigation"
          title="Toggle navigation"
        >
          <Menu className="size-4" aria-hidden />
        </button>
        <Brand compact className="gap-2" />
      </div>

      <div className="hidden flex-1 md:flex">
        <SearchCommand />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <div className="md:hidden">
          <SearchCommand compact />
        </div>
        <ThemeToggle className="rounded-xl" />

        {user ? (
          <>
            <Notifications />
            <Link
              href="/goals?create=1"
              className="hidden h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md sm:inline-flex"
            >
              <Plus className="size-4" aria-hidden />
              New goal
            </Link>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="Account menu">
                <UserAvatar name={user.name} seed={user.id} online />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content align="end" sideOffset={8} className="z-50 w-64 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl">
                  <div className="mb-1 flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5">
                    <UserAvatar name={user.name} seed={user.id} className="size-9" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">u/{user.username}</p>
                    </div>
                  </div>
                  <DropdownMenu.Item asChild>
                    <Link href="/dashboard" className={itemClass}>
                      <LayoutDashboard className="size-4 text-muted-foreground" aria-hidden />
                      Dashboard
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/goals" className={itemClass}>
                      <Target className="size-4 text-muted-foreground" aria-hidden />
                      Goals
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/profile" className={itemClass}>
                      <User className="size-4 text-muted-foreground" aria-hidden />
                      My profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/ai" className={itemClass}>
                      <Sparkles className="size-4 text-accent" aria-hidden />
                      AI Study Buddy
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link href="/settings" className={itemClass}>
                      <Settings className="size-4 text-muted-foreground" aria-hidden />
                      Settings
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className={itemClass}
                    onSelect={() => {
                      actions.resetDemo()
                      toast.info("Demo data reset to defaults")
                    }}
                  >
                    <RotateCcw className="size-4 text-muted-foreground" aria-hidden />
                    Reset demo data
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-border/60" />
                  <DropdownMenu.Item
                    onSelect={() => {
                      auth.signOut()
                      toast.info("Signed out")
                      router.push("/sign-in")
                    }}
                    className={cn(itemClass, "text-destructive data-[highlighted]:bg-destructive/10")}
                  >
                    <LogOut className="size-4" aria-hidden />
                    Sign out
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </>
        ) : (
          <>
            <Link href="/sign-in" className="hidden h-9 items-center rounded-xl border border-border/60 px-4 text-sm font-medium transition-colors hover:bg-secondary sm:inline-flex">
              Log in
            </Link>
            <Link href="/sign-up" className="inline-flex h-9 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md">
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
