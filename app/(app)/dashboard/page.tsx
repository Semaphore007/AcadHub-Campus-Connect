import Link from "next/link"
import { ArrowRight, Bot, Compass, MessageCircle, Plus, Sparkles, Users } from "lucide-react"

const QUICK_LINKS = [
  {
    href: "/communities",
    title: "Find your community",
    description: "Explore campus spaces built around the things you want to learn and make.",
    icon: Compass,
    accent: "bg-primary/10 text-primary",
  },
  {
    href: "/feed",
    title: "Browse campus goals",
    description: "See the latest projects, discussions, and collaboration requests.",
    icon: Sparkles,
    accent: "bg-accent/10 text-accent",
  },
  {
    href: "/submit",
    title: "Start something",
    description: "Share an idea and invite the right people to build it with you.",
    icon: Plus,
    accent: "bg-success/10 text-success",
  },
]

const SHORTCUTS = [
  { href: "/friends", label: "Connect with students", icon: Users },
  { href: "/messages", label: "Open messages", icon: MessageCircle },
  { href: "/ai", label: "Ask the AI Study Buddy", icon: Bot },
]

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-8 sm:px-6 lg:py-12">
      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-primary/10 p-6 shadow-sm sm:p-9">
        <div aria-hidden className="pointer-events-none absolute -right-16 -top-24 size-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              <span className="size-1.5 rounded-full bg-primary" aria-hidden />
              Your campus workspace
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Your Dashboard</h1>
            <p className="mt-3 text-base leading-relaxed text-muted-foreground">
              Find people who share your interests, discover active campus goals, and turn your next idea into a team project.
            </p>
          </div>
          <Link
            href="/submit"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            <Plus className="size-4" aria-hidden />
            Create a goal
          </Link>
        </div>
      </header>

      <section aria-labelledby="dashboard-start-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Get started</p>
            <h2 id="dashboard-start-heading" className="mt-1 text-2xl font-semibold tracking-tight text-foreground">
              Make your next move
            </h2>
          </div>
          <Link href="/feed" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:inline-flex">
            View all goals <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {QUICK_LINKS.map(({ href, title, description, icon: Icon, accent }) => (
            <Link
              key={href}
              href={href}
              className="group flex min-h-52 flex-col rounded-2xl border border-border/60 bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg"
            >
              <span className={`mb-5 inline-flex size-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="dashboard-shortcuts-heading" className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
        <div className="mb-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">Your tools</p>
          <h2 id="dashboard-shortcuts-heading" className="mt-1 text-xl font-semibold text-foreground">Quick shortcuts</h2>
        </div>
        <div className="grid gap-2 sm:grid-cols-3">
          {SHORTCUTS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 text-sm font-medium text-muted-foreground transition hover:border-border/60 hover:bg-secondary hover:text-foreground"
            >
              <Icon className="size-4 text-primary" aria-hidden />
              {label}
              <ArrowRight className="ml-auto size-4 opacity-50" aria-hidden />
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
