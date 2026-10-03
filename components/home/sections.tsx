import Link from "next/link"
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Boxes,
  CheckCircle2,
  Code2,
  Compass,
  FlaskConical,
  Github,
  Layers,
  Lightbulb,
  Linkedin,
  Network,
  PiggyBank,
  Recycle,
  Server,
  Star,
  Send,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Container, Section, SectionHeading } from "@/components/layout/primitives"
import { DEVELOPER } from "@/lib/constants/site"

const PROBLEMS = [
  {
    icon: Compass,
    title: "Skills are invisible",
    text: "A student who knows ESP32 and one who needs it rarely meet — talent sits in separate hostels and branches.",
    color: "text-red-500 bg-red-500/10",
  },
  {
    icon: Network,
    title: "Groups never close",
    text: "WhatsApp groups outlive their purpose. Context drowns, and finding past work becomes impossible.",
    color: "text-orange-500 bg-orange-500/10",
  },
  {
    icon: Boxes,
    title: "Resources are scattered",
    text: "Lab kits, notes and past projects exist, but nobody knows where — so students rebuild from zero.",
    color: "text-yellow-600 bg-yellow-500/10",
  },
]

const STEPS = [
  { icon: Target, label: "01", title: "Post a goal", text: "Describe what you want to build or learn and the skills it needs.", color: "bg-violet-600" },
  { icon: Users, label: "02", title: "Match & join", text: "Students with matching skills request to join until slots fill.", color: "bg-blue-600" },
  { icon: Layers, label: "03", title: "Collaborate", text: "A temporary group with focused discussion and shared resources.", color: "bg-indigo-600" },
  { icon: Trophy, label: "04", title: "Complete & archive", text: "The group closes; its knowledge stays searchable for the next batch.", color: "bg-purple-600" },
]

const FRUGAL = [
  { icon: Recycle, title: "Reuse what exists", text: "Campus labs, seniors, notes and open-source tools — no new hardware.", stat: "0 new hardware" },
  { icon: PiggyBank, title: "Near-zero cost", text: "Runs on free-tier hosting with an open-source Postgres stack.", stat: "Free to run" },
  { icon: Server, title: "Simple infrastructure", text: "One Express API, one database, one web client. Easy to maintain.", stat: "3 services total" },
]

const DOCS = [
  { href: "/implementation", icon: Code2, title: "Implementation", text: "Walk through the repository, folders and code paths.", color: "text-blue-500" },
  { href: "/architecture", icon: Layers, title: "Architecture", text: "Current system compared with the redesign.", color: "text-purple-500" },
  { href: "/manual", icon: BookOpen, title: "Manual", text: "Install, configure and operate the platform.", color: "text-emerald-500" },
  { href: "/simulations", icon: FlaskConical, title: "Simulations", text: "Six interactive demos of the core flows.", color: "text-orange-500" },
]

// Platform preview mock cards
const PREVIEW_GOALS = [
  {
    title: "IoT Vibration Monitoring System",
    skills: ["ESP32", "Python", "MQTT"],
    members: 2,
    max: 4,
    votes: 34,
    deadline: "3 days left",
    tag: "Electronics",
  },
  {
    title: "ML-Based Crop Disease Detection",
    skills: ["Python", "TensorFlow", "OpenCV"],
    members: 3,
    max: 5,
    votes: 61,
    deadline: "1 week left",
    tag: "AI/ML",
  },
  {
    title: "College App for Event Management",
    skills: ["React", "Node.js", "PostgreSQL"],
    members: 1,
    max: 3,
    votes: 22,
    deadline: "2 weeks left",
    tag: "Web Dev",
  },
]

export function ProblemSection() {
  return (
    <Section aria-labelledby="problem-title" id="problem">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          id="problem-title"
          eyebrow="The problem"
          title="Campus talent exists. It just never finds each other."
          description="Students want to build things together, but the tools they use were never designed around goals."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PROBLEMS.map(({ icon: Icon, title, text, color }) => (
            <Card key={title} className="flex flex-col gap-4 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className={`inline-flex size-11 items-center justify-center rounded-xl ${color}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
            </Card>
          ))}
        </div>
        <Link href="/problem" className="inline-flex w-fit items-center gap-1.5 text-sm font-medium text-accent hover:underline">
          Read the full problem statement <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Container>
    </Section>
  )
}

export function HowItWorks() {
  return (
    <Section id="how-it-works" aria-labelledby="how-title" className="scroll-mt-20 border-y border-border bg-muted/50">
      <Container className="flex flex-col gap-12">
        <SectionHeading id="how-title" eyebrow="How it works" title="One goal. One temporary group. One outcome." align="center" />
        <ol className="grid gap-4 md:grid-cols-4">
          {STEPS.map(({ icon: Icon, label, title, text, color }, i) => (
            <li key={title} className="relative flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex items-start justify-between">
                <span className={`inline-flex size-12 items-center justify-center rounded-2xl ${color} text-white shadow-md`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="font-mono text-3xl font-bold text-muted-foreground/20">{label}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              {i < STEPS.length - 1 && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute -right-2.5 top-1/2 hidden -translate-y-1/2 text-muted-foreground/30 md:block text-xl"
                >
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

export function PlatformPreview() {
  return (
    <Section aria-labelledby="preview-title">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          id="preview-title"
          eyebrow="Platform preview"
          title="A Reddit-style feed, built for campus goals."
          description="Browse and join goals, see required skills, member counts and deadlines — all in one place."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {PREVIEW_GOALS.map((goal) => (
            <div
              key={goal.title}
              className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
            >
              {/* Tag + votes */}
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
                  {goal.tag}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="size-3 fill-current text-yellow-500" aria-hidden />
                  {goal.votes}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-semibold leading-snug text-foreground">{goal.title}</h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {goal.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg bg-secondary px-2 py-0.5 font-mono text-xs text-muted-foreground"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="size-3" aria-hidden />
                  {goal.members}/{goal.max} members
                </span>
                <span className="flex items-center gap-1 text-orange-500">
                  <Zap className="size-3" aria-hidden />
                  {goal.deadline}
                </span>
              </div>

              {/* Join button */}
              <button
                type="button"
                className="w-full rounded-xl bg-primary/10 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20 group-hover:bg-primary group-hover:text-primary-foreground"
              >
                Request to Join
              </button>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function WhyFrugal() {
  return (
    <Section id="why-frugal" aria-labelledby="frugal-title" className="scroll-mt-20">
      <Container className="grid gap-12 lg:grid-cols-5">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <SectionHeading
            id="frugal-title"
            eyebrow="Why frugal"
            title="Innovation through constraint, not expense."
            description="AcadHub does not add hardware or expensive SaaS. It organises what a campus already has."
          />
          <Button asChild variant="outline" className="w-fit">
            <Link href="/innovation">
              <Lightbulb aria-hidden />
              Explore the innovation
            </Link>
          </Button>
        </div>
        <ul className="flex flex-col gap-3 lg:col-span-3">
          {FRUGAL.map(({ icon: Icon, title, text, stat }) => (
            <li key={title} className="flex gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <Icon className="size-5" aria-hidden />
              </span>
              <div className="flex flex-1 flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-semibold text-success">
                    {stat}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  )
}

export function DocsGrid() {
  return (
    <Section aria-labelledby="docs-title" className="border-t border-border bg-muted/40">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          id="docs-title"
          eyebrow="Documentation"
          title="From basics to advanced."
          description="Start with the idea, then go as deep as you need — down to the request lifecycle."
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DOCS.map(({ href, icon: Icon, title, text, color }) => (
            <Link key={href} href={href} className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Card interactive className="flex h-full flex-col gap-4 p-6 transition-all group-hover:-translate-y-1">
                <Icon className={`size-7 ${color}`} aria-hidden />
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-semibold text-foreground">{title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-foreground">
                  Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  )
}

export function WhatStudentsGet() {
  const benefits = [
    "Find collaborators by skill, not just by friendship",
    "Join goal-specific groups — no permanent commitment",
    "Archived knowledge from completed projects",
    "AI Study Buddy for instant academic help",
    "Text and voice messaging with fellow students",
    "Share files, images and resources in one place",
  ]
  return (
    <Section aria-labelledby="benefits-title" className="border-y border-border">
      <Container>
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <SectionHeading
            id="benefits-title"
            eyebrow="What students get"
            title="Everything you need to collaborate, in one campus-first platform."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" aria-hidden />
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}

export function ContactSection() {
  return (
    <Section aria-labelledby="home-contact-title" className="border-t border-border bg-muted/40">
      <Container className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)]">
        <SectionHeading
          id="home-contact-title"
          eyebrow="Let’s connect"
          title="Have an idea for your campus?"
          description="Questions, feedback, or interested in bringing AcadHub to your community? Reach out to the developer."
        />
        <div className="rounded-3xl border border-border/60 bg-card p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">Developer</p>
              <h3 className="mt-1 text-lg font-semibold text-foreground">{DEVELOPER.name}</h3>
              <p className="text-sm text-muted-foreground">IIIT Dharwad · AcadHub</p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Contact
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-5 flex gap-2 border-t border-border/60 pt-4">
            {[
              { label: "GitHub", href: DEVELOPER.github, icon: Github },
              { label: "LinkedIn", href: DEVELOPER.linkedin, icon: Linkedin },
              { label: "Telegram", href: DEVELOPER.telegram, icon: Send },
            ].map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-xl border border-border/60 bg-background text-muted-foreground transition hover:border-primary/40 hover:text-primary"
              >
                <Icon className="size-4" aria-hidden />
              </a>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  )
}
