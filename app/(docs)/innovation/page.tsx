import type { Metadata } from "next"
import { Container, FrugalPrinciple, PageHeader, Section, SectionHeading } from "@/components/layout/primitives"
import { Card } from "@/components/ui/card"
import { LifecycleSim } from "@/components/simulations/lifecycle-sim"
import { MatchingSim } from "@/components/simulations/matching-sim"

export const metadata: Metadata = { title: "Innovation", description: "The frugal, goal-based collaboration model behind AcadHub." }

const PILLARS = [
  ["Goal-first", "Every group starts from a goal statement, not a chat. Purpose comes before people."],
  ["Temporary by design", "Groups dissolve on completion, keeping the campus feed clean and current."],
  ["Skill-aware", "Goals declare required skills so the right students surface automatically."],
  ["Knowledge that stays", "Archived goals become a searchable library for future students."],
  ["Resource reuse", "Points students to labs, kits and seniors that the campus already has."],
  ["Frugal stack", "Open-source tools on free-tier hosting — sustainable for a student team."],
]

export default function InnovationPage() {
  return (
    <>
      <PageHeader crumb="Innovation" eyebrow="Frugal innovation" title="A simple model: goals, not groups." description="AcadHub reframes campus collaboration around short-lived, purpose-driven teams that use existing resources." />
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow="Six pillars" title="What makes the model work" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map(([t, d]) => (
              <Card key={t} className="flex flex-col gap-2 p-6">
                <h3 className="text-lg font-semibold text-foreground">{t}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>
      <FrugalPrinciple />
      <Section>
        <Container className="flex flex-col gap-8">
          <LifecycleSim />
          <MatchingSim />
        </Container>
      </Section>
    </>
  )
}
