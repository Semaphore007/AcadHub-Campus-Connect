import type { Metadata } from "next"
import { Container, PageHeader, Section } from "@/components/layout/primitives"
import { LifecycleSim } from "@/components/simulations/lifecycle-sim"
import { MatchingSim } from "@/components/simulations/matching-sim"
import { GroupSim } from "@/components/simulations/group-sim"
import { FeedSim } from "@/components/simulations/feed-sim"
import { ChatSim } from "@/components/simulations/chat-sim"
import { RequestSim } from "@/components/simulations/request-sim"

export const metadata: Metadata = { title: "Live Simulations", description: "Interactive demonstrations of AcadHub's core flows." }

const TOC = [
  ["lifecycle", "Goal lifecycle"],
  ["matching", "Skill matching"],
  ["group", "Group formation"],
  ["feed", "Discovery feed"],
  ["chat", "Group discussion"],
  ["request", "Request lifecycle"],
]

export default function SimulationsPage() {
  return (
    <>
      <PageHeader crumb="Simulations" eyebrow="Interactive" title="See AcadHub work, step by step." description="Six simulations, from the basic goal lifecycle to an advanced trace of a single API request.">
        <nav aria-label="Simulations">
          <ul className="flex flex-wrap gap-2">
            {TOC.map(([id, label], i) => (
              <li key={id}>
                <a href={`#${id}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground hover:border-accent">
                  <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </PageHeader>
      <Section>
        <Container className="flex flex-col gap-8">
          <LifecycleSim />
          <MatchingSim />
          <GroupSim />
          <FeedSim />
          <ChatSim />
          <RequestSim />
        </Container>
      </Section>
    </>
  )
}
