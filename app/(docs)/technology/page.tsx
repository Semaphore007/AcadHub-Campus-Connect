import type { Metadata } from "next"
import { Container, PageHeader, Section } from "@/components/layout/primitives"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TECHNOLOGIES, type Tech } from "@/data/documentation/technology"

export const metadata: Metadata = { title: "Technology", description: "The AcadHub technology stack and the reason for each choice." }

const LAYERS: Tech["layer"][] = ["Frontend", "Backend", "Data", "Security", "Tooling"]
const STATUS = { "Current repository": "outline", "Recommended redesign": "accent", Both: "success" } as const

export default function TechnologyPage() {
  return (
    <>
      <PageHeader crumb="Technology" eyebrow="Stack" title="Open-source tools, chosen on purpose." description="Every technology earns its place by being free, well-documented and easy for students to maintain." />
      <Section>
        <Container className="flex flex-col gap-14">
          {LAYERS.map((layer) => {
            const items = TECHNOLOGIES.filter((t) => t.layer === layer)
            if (!items.length) return null
            return (
              <section key={layer} aria-labelledby={`layer-${layer}`} className="flex flex-col gap-4">
                <h2 id={`layer-${layer}`} className="font-mono text-xs uppercase tracking-[0.18em] text-accent">{layer}</h2>
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((t) => (
                    <li key={t.id}>
                      <Card className="flex h-full flex-col gap-3 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-semibold text-foreground">{t.name}</h3>
                          <Badge variant={STATUS[t.status]}>{t.status}</Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-muted-foreground">{t.why}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              </section>
            )
          })}
        </Container>
      </Section>
    </>
  )
}
