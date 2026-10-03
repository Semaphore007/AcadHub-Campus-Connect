import type { Metadata } from "next"
import {
  Archive, Bell, BookMarked, Filter, KeyRound, LayoutDashboard, MessageSquare, Search, ShieldCheck, Sparkles, Target, UserCircle, Users,
} from "lucide-react"
import { Container, PageHeader, Section } from "@/components/layout/primitives"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = { title: "Features", description: "Thirteen focused capabilities of AcadHub." }

const FEATURES = [
  { icon: KeyRound, title: "Secure sign-up & login", text: "JWT sessions with hashed passwords and validated input.", level: "Basic" },
  { icon: UserCircle, title: "Student profiles", text: "Branch, year and skills that power matching.", level: "Basic" },
  { icon: Target, title: "Create a goal", text: "Title, category, required skills, slots and deadline.", level: "Basic" },
  { icon: Search, title: "Discovery feed", text: "Browse every open goal across the campus.", level: "Basic" },
  { icon: Filter, title: "Smart filters", text: "Filter by category, skill or beginner-friendly.", level: "Intermediate" },
  { icon: Users, title: "Join requests", text: "Request, approve and track group membership.", level: "Intermediate" },
  { icon: MessageSquare, title: "Group discussion", text: "A focused thread attached to each goal.", level: "Intermediate" },
  { icon: BookMarked, title: "Shared resources", text: "Links, notes and lab kits pinned to the group.", level: "Intermediate" },
  { icon: Bell, title: "Notifications", text: "Know when someone joins or a deadline nears.", level: "Intermediate" },
  { icon: Sparkles, title: "Skill matching", text: "Surface students whose skills fit a goal.", level: "Advanced" },
  { icon: Archive, title: "Goal archive", text: "Completed goals become searchable knowledge.", level: "Advanced" },
  { icon: LayoutDashboard, title: "Personal dashboard", text: "All your active and past goals in one view.", level: "Advanced" },
  { icon: ShieldCheck, title: "CSRF & rate limits", text: "Hardened state-changing endpoints.", level: "Advanced" },
] as const

const LEVEL = { Basic: "success", Intermediate: "accent", Advanced: "warning" } as const

export default function FeaturesPage() {
  return (
    <>
      <PageHeader crumb="Features" eyebrow="Capabilities" title="Thirteen features. Nothing extra." description="Each feature serves the goal lifecycle — from basics every student uses, to advanced capabilities that make the platform smart." />
      <Section>
        <Container>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, text, level }) => (
              <li key={title}>
                <Card className="flex h-full flex-col gap-4 p-6">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <Badge variant={LEVEL[level]}>{level}</Badge>
                  </div>
                  <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{text}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  )
}
