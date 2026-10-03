import type { Metadata } from "next"
import Image from "next/image"
import { Container, FrugalPrinciple, PageHeader, Section, SectionHeading } from "@/components/layout/primitives"
import { Button } from "@/components/ui/button"
import { IMAGES, RESOURCES, SITE } from "@/lib/constants/site"

export const metadata: Metadata = { title: "About", description: "The concept, principles and repository behind AcadHub." }

export default function AboutPage() {
  return (
    <>
      <PageHeader crumb="About" eyebrow="About the project" title="Built at IIIT Dharwad, for every campus." description={SITE.description} />
      <Section>
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border">
            <Image src={IMAGES.campus} alt="IIIT Dharwad campus building" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col gap-6">
            <SectionHeading eyebrow="Concept" title="Students already have what they need." description="AcadHub only connects them: the right people, the right goal, and the resources the campus already owns." />
            <p className="text-lg font-medium text-foreground">{SITE.finalPrinciple}</p>
            <Button asChild className="w-fit">
              <a href={SITE.repo} target="_blank" rel="noreferrer">View repository</a>
            </Button>
          </div>
        </Container>
      </Section>
      <FrugalPrinciple />
      <Section>
        <Container className="flex flex-col gap-6">
          <SectionHeading eyebrow="Resources" title="References" />
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((r) => (
              <li key={r.href}>
                <a href={r.href} target="_blank" rel="noreferrer" className="block rounded-xl border border-border p-4 text-sm font-medium text-foreground transition-colors hover:border-accent">
                  {r.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  )
}
