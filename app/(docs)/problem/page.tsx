import type { Metadata } from "next"
import { Callout, Container, PageHeader, Section, SectionHeading } from "@/components/layout/primitives"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = { title: "Problem", description: "Why student skills and campus resources stay scattered." }

const PAINS = [
  ["Discovery", "There is no place to see who on campus knows Flutter, PCB design or ML — so students team up only with friends."],
  ["Coordination", "General chat groups mix ten topics. Decisions, files and deadlines are lost within days."],
  ["Continuity", "When a project ends, its notes vanish. Next year's batch starts from zero on the same idea."],
  ["Cost", "Paid collaboration tools and new hardware are out of reach for most student budgets."],
]

const COMPARE = [
  ["Organised around", "People and chats", "Goals"],
  ["Group lifespan", "Forever", "Until the goal completes"],
  ["Finding teammates", "Personal network", "Skill matching"],
  ["Knowledge after", "Lost in scrollback", "Archived and searchable"],
  ["Cost", "Free, but unstructured", "Free and structured"],
]

export default function ProblemPage() {
  return (
    <>
      <PageHeader crumb="Problem" eyebrow="Problem statement" title="Skills exist on campus. Connections don't." description="Students have the abilities and resources to build meaningful projects, but nothing connects the right people to the right goal at the right time." />
      <Section>
        <Container className="flex flex-col gap-12">
          <SectionHeading eyebrow="Four pain points" title="Where collaboration breaks down" />
          <div className="grid gap-4 md:grid-cols-2">
            {PAINS.map(([title, text], i) => (
              <Card key={title} className="flex flex-col gap-3 p-6">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="leading-relaxed text-muted-foreground">{text}</p>
              </Card>
            ))}
          </div>
          <SectionHeading eyebrow="Comparison" title="Chat groups vs. goal-based groups" />
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted text-foreground">
                <tr>
                  <th scope="col" className="p-4 font-semibold">Dimension</th>
                  <th scope="col" className="p-4 font-semibold">Typical chat group</th>
                  <th scope="col" className="p-4 font-semibold text-accent">AcadHub</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE.map(([d, a, b]) => (
                  <tr key={d} className="border-t border-border">
                    <th scope="row" className="p-4 font-medium text-foreground">{d}</th>
                    <td className="p-4 text-muted-foreground">{a}</td>
                    <td className="p-4 font-medium text-foreground">{b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout type="info" title="The core insight">
            The missing piece is not another chat app. It is a structure where every group has a clear purpose, the right skills, and an end.
          </Callout>
        </Container>
      </Section>
    </>
  )
}
