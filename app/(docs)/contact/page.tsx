import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Github, Linkedin, Send } from "lucide-react"
import { Container, PageHeader, Section } from "@/components/layout/primitives"
import { DEVELOPER, SITE } from "@/lib/constants/site"

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the developer of AcadHub — Campus Connect.",
}

const LINKS = [
  {
    href: DEVELOPER.github,
    label: "GitHub",
    handle: "@Semaphore007",
    icon: Github,
    color: "hover:border-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200",
  },
  {
    href: DEVELOPER.linkedin,
    label: "LinkedIn",
    handle: "Siddharth Gautam",
    icon: Linkedin,
    color: "hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400",
  },
  {
    href: DEVELOPER.telegram,
    label: "Telegram",
    handle: "@TheOutlier_2003",
    icon: Send,
    color: "hover:border-sky-400 hover:text-sky-500",
  },
]

export default function ContactPage() {
  return (
    <>
      <PageHeader
        crumb="Contact"
        eyebrow="Developer"
        title="Get in touch."
        description="Questions, feedback or want to bring AcadHub to your campus? Reach out directly."
      />
      <Section id="developer" className="scroll-mt-20">
        <Container className="grid min-w-0 items-start gap-6 md:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-8">
          <div className="flex min-w-0 flex-col gap-4">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-[240px] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-2xl shadow-primary/15">
              <Image
                src={DEVELOPER.portrait}
                alt={`Portrait of ${DEVELOPER.name}, AcadHub developer`}
                fill
                sizes="(min-width: 768px) 240px, 90vw"
                className="object-cover object-top"
                priority
              />
              <div               className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent px-5 pb-5 pt-20">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/70">AcadHub developer</p>
                <p className="mt-2 text-xl font-bold text-white">{DEVELOPER.name}</p>
                <p className="mt-1 text-sm text-white/75">IIIT Dharwad</p>
              </div>
            </div>
            {/* Implementation link */}
            <a
              href={SITE.repo}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-12 min-w-0 items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-3 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-md"
            >
              <Github className="size-4 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 text-center leading-snug [overflow-wrap:anywhere]">
                View implementation repository
              </span>
              <ArrowUpRight className="size-3.5 shrink-0" aria-hidden />
            </a>
          </div>

          {/* Info */}
          <div className="flex min-w-0 flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{DEVELOPER.name}</h2>
              <p className="text-base text-muted-foreground">{DEVELOPER.institution}</p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  B.Tech CSE
                </span>
                <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                  Frugal Innovation
                </span>
                <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                  Open Source
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-foreground">About the project</p>
              <p className="text-sm leading-relaxed text-muted-foreground">
                AcadHub is a Frugal Innovation project built as part of coursework at IIIT Dharwad.
                The goal is to connect scattered student skills and interests through temporary, goal-based collaboration —
                using only the resources students already have.
              </p>
            </div>

            {/* Contact links */}
            <ul className="grid min-w-0 gap-2.5 sm:grid-cols-3">
              {LINKS.map(({ href, label, handle, icon: Icon, color }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className={`group flex min-w-0 flex-col gap-2 rounded-2xl border border-border/60 bg-card p-3 transition-all hover:-translate-y-0.5 hover:shadow-md ${color}`}
                  >
                    <Icon className="size-5 text-accent transition-colors group-hover:text-current" aria-hidden />
                    <span className="font-semibold text-foreground">{label}</span>
                    <span className="text-sm text-muted-foreground">{handle}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Note */}
            <p className="border-t border-border/60 pt-3 text-xs text-muted-foreground">
              This is a student project. Not an official IIIT Dharwad service.
              The implementation repository is available on{" "}
              <a href={SITE.repo} target="_blank" rel="noreferrer" className="text-accent hover:underline">
                GitHub
              </a>.
            </p>
          </div>
        </Container>
      </Section>
    </>
  )
}
