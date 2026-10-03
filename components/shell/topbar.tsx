"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import * as DropdownMenu from "@radix-ui/react-dropdown-menu"
import { Bell, LogOut, Menu, Plus, Search, Settings, Sparkles, User } from "lucide-react"
import { Brand } from "@/components/navigation/brand"
import { ThemeToggle } from "@/components/navigation/theme-toggle"
import { UserAvatar } from "@/components/app/user-avatar"
import { signOut } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export type ShellUser = { id: string; name: string; username: string | null; image: string | null; email: string; isDemo: boolean }

export function Topbar({ user, onToggleMenu }: { user: ShellUser | null; onToggleMenu: () => void }) {
  const router = useRouter()

  const onSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const q = String(new FormData(e.currentTarget).get("q") ?? "").trim()
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search")
  }

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border/60 bg-background/90 px-4 backdrop-blur-xl sm:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggleMenu}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-xl border border-border/60",
            "text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
          )}
          aria-label="Toggle navigation"
          title="Toggle navigation"
        >
          <Menu className="size-4" aria-hidden />
        </button>
        <Brand compact className="gap-2" />
      </div>

      {/* Search */}
      <form onSubmit={onSearch} role="search" className="relative max-w-xl flex-1">
        <label htmlFor="global-search" className="sr-only">
          Search communities and students
        </label>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          id="global-search"
          name="q"
          type="search"
          placeholder="Search communities, students, goals..."
          className={cn(
            "h-9 w-full rounded-xl border border-border/60 bg-secondary/50 pr-4 pl-9 text-sm",
            "outline-none transition-all placeholder:text-muted-foreground",
            "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
          )}
        />
      </form>

      {/* Right actions */}
      <div className="ml-auto flex items-center gap-1.5">
        {user?.isDemo && (
          <span
            aria-label="Preview session; profile changes are not saved"
            title="Preview session; profile changes are not saved"
            className="inline-flex rounded-full border border-border/60 bg-secondary px-1.5 py-1 text-[9px] font-semibold text-muted-foreground sm:px-2.5 sm:text-[11px]"
          >
            Preview
          </span>
        )}
        <ThemeToggle className="rounded-xl" />

        {user ? (
          <>
            {/* Notifications bell */}
            <button
              type="button"
              aria-label="Notifications"
              className="relative inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Bell className="size-4" aria-hidden />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-hot ring-2 ring-background" aria-hidden />
            </button>

            {/* Create button */}
            <Link
              href="/submit"
              className={cn(
                "hidden h-9 items-center gap-1.5 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground",
                "transition-all hover:bg-primary/90 hover:shadow-md sm:inline-flex",
              )}
            >
              <Plus className="size-4" aria-hidden />
              Create
            </Link>

            {/* User dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger
                className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Account menu"
              >
                <UserAvatar name={user.name} image={user.image} seed={user.id} online />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="end"
                  sideOffset={8}
                  className="z-50 w-64 rounded-2xl border border-border bg-popover p-1.5 text-popover-foreground shadow-2xl"
                >
                  {/* User info */}
                  <div className="flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5 mb-1">
                    <UserAvatar name={user.name} image={user.image} seed={user.id} className="size-9" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{user.name}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.username ? `u/${user.username}` : "Complete your profile"}</p>
                    </div>
                  </div>
                  <DropdownMenu.Separator className="my-1 h-px bg-border/60" />
                  <DropdownMenu.Item asChild>
                    <Link
                      href={user.username ? `/u/${user.username}` : "/settings"}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-secondary"
                    >
                      <User className="size-4 text-muted-foreground" aria-hidden />
                      View Profile
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/ai"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-secondary"
                    >
                      <Sparkles className="size-4 text-accent" aria-hidden />
                      <span>AI Study Buddy</span>
                      <span className="ml-auto rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold text-accent">AI</span>
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm outline-none transition-colors data-[highlighted]:bg-secondary"
                    >
                      <Settings className="size-4 text-muted-foreground" aria-hidden />
                      Settings
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Separator className="my-1 h-px bg-border/60" />
                  <DropdownMenu.Item
                    onSelect={async () => {
                      try {
                        if (user.isDemo) {
                          const response = await fetch("/api/auth/demo", { method: "DELETE" })
                          if (!response.ok) throw new Error("Could not end the local demo session.")
                        } else {
                          const result = await signOut()
                          if (result.error) throw new Error(result.error.message ?? "Could not sign out.")
                        }
                        router.push("/sign-in")
                        router.refresh()
                      } catch (error) {
                        console.error("Sign out failed:", error)
                        window.alert(error instanceof Error ? error.message : "Could not sign out.")
                      }
                    }}
                    className="flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive outline-none transition-colors data-[highlighted]:bg-destructive/10"
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
            <Link
              href="/sign-in"
              className="hidden h-9 items-center rounded-xl border border-border/60 px-4 text-sm font-medium hover:bg-secondary transition-colors sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className={cn(
                "inline-flex h-9 items-center rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground",
                "transition-all hover:bg-primary/90 hover:shadow-md",
              )}
            >
              Sign up
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
