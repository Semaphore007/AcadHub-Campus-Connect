"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import {
  BookOpen,
  Bot,
  ChevronDown,
  CircleUser,
  Compass,
  Target,
  Flame,
  Home,
  Mail,
  MessageCircle,
  Plus,
  Settings as SettingsIcon,
  Sparkles,
  UserPlus,
  type LucideIcon,
} from "lucide-react"
import { CommunityIcon } from "@/components/app/community-icon"
import { NAV_GROUPS } from "@/lib/constants/site"
import { useCurrentUser } from "@/lib/demo/store"
import { cn } from "@/lib/utils"

export type ShellCommunity = { id: number; slug: string; name: string; icon: string; color: string }

type Props = {
  signedIn: boolean
  communities: ShellCommunity[]
  pendingRequests: number
  onNavigate?: () => void
  headerOffset?: boolean
}

const MAIN: { href: string; label: string; icon: LucideIcon; match?: (p: string, sort: string | null) => boolean; badge?: string }[] = [
  { href: "/dashboard", label: "Home", icon: Home, match: (p) => p === "/dashboard" },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/feed?sort=top", label: "Popular", icon: Flame, match: (p, s) => p === "/feed" && s === "top" },
  { href: "/communities", label: "Explore", icon: Compass },
  { href: "/profile", label: "Profile", icon: CircleUser },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/friends", label: "Friends", icon: UserPlus },
  { href: "/settings", label: "Settings", icon: SettingsIcon },
  { href: "/contact", label: "Contact", icon: Mail },
  { href: "/ai", label: "AI Study Buddy", icon: Bot, badge: "AI" },
]

function NavLink({
  href,
  active,
  children,
  onNavigate,
}: {
  href: string
  active: boolean
  children: React.ReactNode
  onNavigate?: () => void
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary/12 text-primary dark:bg-primary/20 shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
      )}
    >
      {children}
      {active && (
        <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
      )}
    </Link>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60">
      {children}
    </p>
  )
}

function Group({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="flex flex-col gap-0.5">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex items-center justify-between px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
      >
        {title}
        <ChevronDown className={cn("size-3 transition-transform", !open && "-rotate-90")} aria-hidden />
      </button>
      {open ? <div className="flex flex-col gap-0.5">{children}</div> : null}
    </div>
  )
}

export function Sidebar({ communities, pendingRequests, onNavigate, headerOffset = true }: Props) {
  const signedIn = useCurrentUser() !== null
  const pathname = usePathname()
  const sort = useSearchParams().get("sort")

  return (
    <div className="flex h-full flex-col">
      {headerOffset ? <div className="h-14 shrink-0 border-b border-border/50" aria-hidden /> : null}

      <nav aria-label="Primary" className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4 pb-6">
        {/* Main navigation */}
        <div className="flex flex-col gap-0.5">
          {MAIN.map((item) => {
            const active = item.match ? item.match(pathname, sort) : pathname.startsWith(item.href)
            return (
              <NavLink key={item.href} href={item.href} active={active} onNavigate={onNavigate}>
                <item.icon
                  className={cn(
                    "size-[18px] shrink-0 transition-colors",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                    item.href === "/ai" && "text-accent",
                  )}
                  aria-hidden
                />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent">
                    {item.badge}
                  </span>
                )}
                {item.href === "/friends" && pendingRequests > 0 ? (
                  <span className="pulse-ring rounded-full bg-hot px-1.5 py-0.5 text-[10px] font-bold leading-none text-hot-foreground">
                    {pendingRequests}
                  </span>
                ) : null}
              </NavLink>
            )
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" aria-hidden />

        {/* User's communities */}
        {signedIn ? (
          <Group title="Your Communities">
            {communities.map((c) => (
              <NavLink key={c.id} href={`/c/${c.slug}`} active={pathname === `/c/${c.slug}`} onNavigate={onNavigate}>
                <CommunityIcon icon={c.icon} color={c.color} className="size-6 shrink-0 rounded-lg" />
                <span className="truncate">c/{c.slug}</span>
              </NavLink>
            ))}
            <NavLink href="/communities?create=1" active={false} onNavigate={onNavigate}>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-dashed border-border/70 bg-secondary/60">
                <Plus className="size-3.5" aria-hidden />
              </span>
              <span className="text-muted-foreground">Create community</span>
            </NavLink>
          </Group>
        ) : null}

        {/* Documentation links */}
        {NAV_GROUPS.map((group) => (
          <Group key={group.title} title={group.title} defaultOpen={false}>
            {group.items.map((item) => (
              <NavLink key={item.href} href={item.href} active={pathname === item.href} onNavigate={onNavigate}>
                <BookOpen
                  className={cn(
                    "size-4 shrink-0",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                  aria-hidden
                />
                <span className="truncate">{item.label}</span>
              </NavLink>
            ))}
          </Group>
        ))}

        {/* AI Promo strip at bottom */}
        {!signedIn && (
          <div className="mt-auto rounded-xl bg-gradient-to-br from-primary/15 via-accent/10 to-transparent border border-primary/20 p-3.5 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Sparkles className="size-3.5 text-accent" aria-hidden />
              <span className="font-semibold text-foreground">AI Study Buddy</span>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Get instant help with any topic from your AI tutor.
            </p>
            <Link
              href="/ai"
              className="mt-2 inline-flex items-center gap-1 text-accent font-medium hover:underline"
            >
              Try it free →
            </Link>
          </div>
        )}
      </nav>
    </div>
  )
}
