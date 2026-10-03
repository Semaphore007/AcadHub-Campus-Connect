import type { Metadata } from "next"
import { Callout, Container, PageHeader, Section, SectionHeading } from "@/components/layout/primitives"
import { CodeBlock } from "@/components/documentation/code-block"

export const metadata: Metadata = { title: "Manual", description: "Install, configure and operate AcadHub." }

const STEPS = [
  { title: "Clone the repository", code: "git clone https://github.com/Semaphore007/AcadHub-Campus-Connect.git\ncd AcadHub-Campus-Connect" },
  { title: "Set up the backend", code: "cd backend\nnpm install\ncp .env.example .env   # DATABASE_URL, JWT_SECRET, CLIENT_URL\nnpm run dev" },
  { title: "Run the documentation site", code: "cd ..\nnpm install\nnpm run dev   # http://localhost:3000" },
  { title: "Connect site to backend (optional)", code: "# .env.local\nNEXT_PUBLIC_API_BASE_URL=http://localhost:5000" },
]

const USAGE = [
  ["Sign up", "Create an account with your college email, branch and skills."],
  ["Post a goal", "Choose a category, list required skills, set slots and a deadline."],
  ["Join a goal", "Browse the feed, filter by skill, and send a join request."],
  ["Collaborate", "Use the group thread and pinned resources to work together."],
  ["Complete", "Mark the goal complete. The group archives automatically."],
]

export default function ManualPage() {
  return (
    <>
      <PageHeader crumb="Manual" eyebrow="Operator & user guide" title="Set up and use AcadHub." description="Installation for developers, then a five-step guide for students." />
      <Section>
        <Container className="flex max-w-4xl flex-col gap-10">
          <SectionHeading eyebrow="For developers" title="Installation" />
          <ol className="flex flex-col gap-6">
            {STEPS.map((s, i) => (
              <li key={s.title} className="flex flex-col gap-3">
                <h3 className="flex items-center gap-3 font-semibold text-foreground">
                  <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary font-mono text-xs text-primary-foreground">{i + 1}</span>
                  {s.title}
                </h3>
                <CodeBlock code={s.code} language="bash" />
              </li>
            ))}
          </ol>
          <Callout type="tip" title="No backend? No problem.">
            Without NEXT_PUBLIC_API_BASE_URL every simulation runs on built-in mock data, so the site always works.
          </Callout>
          <SectionHeading eyebrow="For students" title="Using the platform" />
          <ol className="grid gap-3 sm:grid-cols-2">
            {USAGE.map(([t, d], i) => (
              <li key={t} className="flex gap-4 rounded-xl border border-border p-5">
                <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-foreground">{t}</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
    </>
  )
}
