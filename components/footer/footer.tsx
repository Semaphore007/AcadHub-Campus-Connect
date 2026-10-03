import Link from "next/link"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { FOOTER_EXPLORE, RESOURCES, SITE } from "@/lib/constants/site"
import { Brand } from "@/components/navigation/brand"
import { BackToTopLink } from "@/components/layout/scroll-ui"

const CONNECT_LINKS = [
  { label: "Platform (App)", href: "/feed" },
  { label: "AI Study Buddy", href: "/ai" },
  { label: "Communities", href: "/communities" },
  { label: "Friends", href: "/friends" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-sidebar">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-12 lg:px-8">
        {/* Brand */}
        <div className="flex flex-col gap-5 lg:col-span-4">
          <Brand className="w-fit" />
          <p className="text-balance text-xl font-semibold tracking-tight text-foreground">{SITE.tagline}</p>
          <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
            A Frugal Innovation project by IIIT Dharwad students. Not an official IIIT Dharwad service.
          </p>
          <div className="flex items-center gap-1.5 rounded-xl bg-primary/10 px-3 py-2 text-xs font-medium text-primary w-fit">
            <Sparkles className="size-3.5" aria-hidden />
            <span>Free to use for all students</span>
          </div>
        </div>

        {/* Explore */}
        <nav aria-label="Explore" className="lg:col-span-2">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Explore</p>
          <ul className="flex flex-col gap-2.5">
            {FOOTER_EXPLORE.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Platform */}
        <nav aria-label="Platform" className="lg:col-span-2">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Platform</p>
          <ul className="flex flex-col gap-2.5">
            {CONNECT_LINKS.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Resources */}
        <nav aria-label="References" className="hidden lg:col-span-2 lg:block">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Resources</p>
          <ul className="flex flex-col gap-2.5">
            {RESOURCES.slice(0, 4).map((r) => (
              <li key={r.href}>
                <a
                  href={r.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {r.label}
                  <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                </a>
              </li>
            ))}
            <li>
              <a
                href={`${SITE.repo}/issues/new`}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Report an issue or bug
                <ArrowUpRight className="size-3 opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/40">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-4 px-4 py-5 text-xs text-muted-foreground sm:px-6 md:flex-row md:items-center lg:px-8">
          <p>© 2026 AcadHub — Campus Connect. Built as a Frugal Innovation project.</p>
          <div className="flex items-center gap-4">
            <BackToTopLink />
          </div>
        </div>
      </div>
    </footer>
  )
}
