"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import * as NavigationMenu from "@radix-ui/react-navigation-menu"
import { ChevronDown, Github, Menu, X } from "lucide-react"
import { MORE_NAV, NAV_GROUPS, PRIMARY_NAV, SITE } from "@/lib/constants/site"
import { cn } from "@/lib/utils"
import { Brand } from "./brand"
import { SearchCommand } from "./search-command"
import { ThemeToggle } from "./theme-toggle"
import { ScrollProgress } from "@/components/layout/scroll-ui"

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href)
}

export function Navbar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => setMobileOpen(false), [pathname])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/60 transition-all duration-300",
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-sm"
          : "bg-background/85 backdrop-blur-md",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded-xl focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Brand className="shrink-0" />

        {/* Desktop primary nav */}
        <NavigationMenu.Root className="relative hidden flex-1 justify-center xl:flex" aria-label="Primary">
          <NavigationMenu.List className="flex items-center gap-0.5">
            {PRIMARY_NAV.slice(0, 7).map((item) => (
              <NavigationMenu.Item key={item.href}>
                <NavigationMenu.Link asChild active={isActive(pathname, item.href)}>
                  <Link
                    href={item.href}
                    className={cn(
                      "relative rounded-xl px-3 py-2 text-sm font-medium transition-all hover:text-foreground",
                      isActive(pathname, item.href)
                        ? "text-primary after:absolute after:inset-x-2.5 after:-bottom-[13px] after:h-0.5 after:rounded-full after:bg-primary"
                        : "text-muted-foreground hover:bg-secondary/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </NavigationMenu.Link>
              </NavigationMenu.Item>
            ))}

            {/* More dropdown */}
            <NavigationMenu.Item>
              <NavigationMenu.Trigger className="group inline-flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary/60 hover:text-foreground data-[state=open]:text-foreground transition-colors">
                More
                <ChevronDown className="size-3.5 transition-transform group-data-[state=open]:rotate-180" aria-hidden />
              </NavigationMenu.Trigger>
              <NavigationMenu.Content className="absolute right-0 top-full mt-3 w-[640px] rounded-2xl border border-border/70 bg-popover p-2.5 shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
                <div className="grid grid-cols-2 gap-2">
                  {NAV_GROUPS.map((group) => (
                    <div key={group.title} className="flex flex-col">
                      <p className="mb-1 border-b border-border/60 px-3 pb-2 pt-1.5 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {group.title}
                      </p>
                      <ul className="flex flex-col gap-0.5 pt-1">
                        {group.items.map((item) => (
                          <li key={item.href}>
                            <NavigationMenu.Link asChild>
                              <Link
                                href={item.href}
                                className={cn(
                                  "flex flex-col rounded-xl border-l-2 border-transparent px-3 py-2 transition-all hover:border-primary hover:bg-secondary/60",
                                  isActive(pathname, item.href) && "border-primary bg-secondary/60",
                                )}
                              >
                                <span className="text-sm font-medium text-foreground">{item.label}</span>
                                <span className="text-xs text-muted-foreground">{item.description}</span>
                              </Link>
                            </NavigationMenu.Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          </NavigationMenu.List>
        </NavigationMenu.Root>

        {/* Right actions */}
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden lg:block">
            <SearchCommand />
          </div>
          <div className="lg:hidden">
            <SearchCommand compact />
          </div>
          <ThemeToggle />
          <a
            href={SITE.repo}
            target="_blank"
            rel="noreferrer"
            className="hidden h-9 items-center gap-2 rounded-xl bg-primary px-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-md sm:inline-flex"
          >
            <Github className="size-4" aria-hidden />
            GitHub
          </a>

          {/* Mobile menu trigger */}
          <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
            <Dialog.Trigger asChild>
              <button
                type="button"
                aria-label="Open menu"
                className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors xl:hidden"
              >
                <Menu className="size-4" aria-hidden />
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
              <Dialog.Content className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col border-l border-border/60 bg-background shadow-2xl data-[state=open]:animate-in data-[state=open]:slide-in-from-right">
                <div className="flex h-16 items-center justify-between border-b border-border/60 px-5">
                  <Dialog.Title className="sr-only">Site navigation</Dialog.Title>
                  <Dialog.Description className="sr-only">Browse AcadHub documentation pages</Dialog.Description>
                  <Brand />
                  <Dialog.Close
                    aria-label="Close menu"
                    className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                  >
                    <X className="size-4" aria-hidden />
                  </Dialog.Close>
                </div>
                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-6">
                  <ul className="flex flex-col">
                    {[...PRIMARY_NAV, ...MORE_NAV].map((item, i) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-baseline gap-4 border-b border-border/40 py-4 text-base font-medium transition-colors hover:text-primary",
                            isActive(pathname, item.href) ? "text-primary" : "text-foreground",
                          )}
                        >
                          <span className="w-6 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
                <div className="flex items-center gap-2 border-t border-border/60 p-4">
                  <ThemeToggle withLabel className="flex-1" />
                  <a
                    href={SITE.repo}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-9 flex-1 items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
                  >
                    <Github className="size-4" aria-hidden />
                    GitHub
                  </a>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      </div>
      <ScrollProgress />
    </header>
  )
}
