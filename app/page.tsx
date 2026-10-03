import { Hero } from "@/components/home/hero"
import {
  DocsGrid,
  HowItWorks,
  PlatformPreview,
  ProblemSection,
  ContactSection,
  WhatStudentsGet,
  WhyFrugal,
} from "@/components/home/sections"

export default function HomePage() {
  return (
    <main className="home-page">
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <PlatformPreview />
      <WhyFrugal />
      <WhatStudentsGet />
      <DocsGrid />
      <ContactSection />
    </main>
  )
}
