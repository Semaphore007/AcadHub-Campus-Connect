import type { Metadata } from "next"
import { ArrowDown } from "lucide-react"
import { Callout, Container, PageHeader, Section, SectionHeading } from "@/components/layout/primitives"
import { Badge } from "@/components/ui/badge"
import { RequestSim } from "@/components/simulations/request-sim"

export const metadata: Metadata = { title: "Architecture", description: "AcadHub system architecture: current repository and recommended redesign." }

const LAYERS = [
  { name: "Client", current: "React + Vite SPA", next: "Next.js App Router (RSC + client islands)" },
  { name: "API", current: "Express.js REST · /api/v1", next: "Express REST kept; typed client + SWR" },
  { name: "Security", current: "JWT · bcrypt · CSRF token", next: "HttpOnly cookies · CSRF · rate limiting" },
  { name: "Data", current: "PostgreSQL", next: "PostgreSQL with indexed skill & category columns" },
  { name: "Hosting", current: "Manual deploy", next: "Vercel (web) + free-tier API host" },
]

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader crumb="Architecture" eyebrow="System design" title="Three layers. Clear boundaries." description="A client, a REST API and a relational database — the simplest architecture that supports the goal lifecycle." />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Diagram" title="How the pieces connect" />
            <ol className="flex flex-col items-stretch gap-2">
              {LAYERS.slice(0, 4).map((l, i) => (
                <li key={l.name} className="flex flex-col items-center gap-2">
                  <div className="w-full rounded-xl border border-border bg-card p-5">
                    <p className="font-mono text-xs uppercase tracking-wider text-accent">{l.name}</p>
                    <p className="mt-1 font-semibold text-foreground">{l.current}</p>
                  </div>
                  {i < 3 && <ArrowDown className="size-4 text-muted-foreground" aria-hidden />}
                </li>
              ))}
            </ol>
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Comparison" title="Current vs. redesign" />
            <ul className="flex flex-col gap-3">
              {LAYERS.map((l) => (
                <li key={l.name} className="grid gap-3 rounded-xl border border-border p-4 sm:grid-cols-[110px_1fr]">
                  <p className="font-semibold text-foreground">{l.name}</p>
                  <div className="flex flex-col gap-2 text-sm">
                    <p className="flex flex-wrap items-center gap-2 text-muted-foreground"><Badge variant="outline">Now</Badge>{l.current}</p>
                    <p className="flex flex-wrap items-center gap-2 text-foreground"><Badge variant="accent">Next</Badge>{l.next}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Callout type="tip" title="Why not microservices?">
              One API and one database are enough for a campus. Fewer moving parts means lower cost and easier maintenance — the frugal choice.
            </Callout>
          </div>
        </Container>
      </Section>
      <Section className="border-t border-border bg-muted">
        <Container>
          <RequestSim />
        </Container>
      </Section>
    </>
  )
}
