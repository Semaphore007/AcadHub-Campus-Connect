"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, Bot, Github, PlayCircle, Sparkles, Users, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/layout/primitives"
import { SITE } from "@/lib/constants/site"

const TYPEWRITER_LINES = [
  "I need 3 students for an IoT project 🔌",
  "Looking for beginners in Machine Learning 🤖",
  "Let's form a team for the hackathon! 🏆",
  "Need collaborators for a research topic 📚",
  "Anyone good at React for a startup idea? 💡",
]

const STATS = [
  { value: "1", label: "Goal per group", icon: Zap },
  { value: "0", label: "New infrastructure", icon: Sparkles },
  { value: "13", label: "Focused features", icon: Bot },
  { value: "6", label: "Live simulations", icon: Users },
]

function Typewriter() {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [paused, setPaused] = useState(false)
  const prefersReduced = useRef(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      prefersReduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    }
  }, [])

  useEffect(() => {
    if (prefersReduced.current) return

    if (paused) {
      const t = setTimeout(() => setPaused(false), 1600)
      return () => clearTimeout(t)
    }

    const current = TYPEWRITER_LINES[lineIdx]
    if (!deleting && charIdx === current.length) {
      setPaused(true)
      setTimeout(() => setDeleting(true), 1200)
      return
    }
    if (deleting && charIdx === 0) {
      setDeleting(false)
      setLineIdx((i) => (i + 1) % TYPEWRITER_LINES.length)
      return
    }

    const speed = deleting ? 28 : 52
    const t = setTimeout(() => {
      setCharIdx((c) => (deleting ? c - 1 : c + 1))
    }, speed)
    return () => clearTimeout(t)
  }, [charIdx, deleting, lineIdx, paused])

  const displayText = TYPEWRITER_LINES[lineIdx].slice(0, charIdx)
  const fullText = TYPEWRITER_LINES[0] // Accessible fallback

  return (
    <div className="relative flex min-h-[2.5rem] items-center">
      <div
        aria-hidden
        className="font-mono text-sm text-foreground sm:text-base dark:text-white/90"
        style={{ minHeight: "1.5em" }}
      >
        <span className="rounded bg-primary/10 px-2 py-0.5 dark:bg-white/10">{displayText || " "}</span>
        <span className="caret ml-0.5 inline-block w-px bg-primary align-middle dark:bg-white" aria-hidden>
          &nbsp;
        </span>
      </div>
      <span className="sr-only">{fullText}</span>
    </div>
  )
}

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-background text-foreground dark:text-white"
    >
      <div aria-hidden className="home-hero-gradient absolute inset-0 -z-10" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-[0.04] dark:opacity-10" />

      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 -z-10 size-96 rounded-full bg-primary/10 blur-3xl dark:bg-white/5"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 -left-24 -z-10 size-72 rounded-full bg-accent/10 blur-3xl dark:bg-white/10"
      />

      <Container className="relative flex justify-center py-12 md:py-16 lg:py-20">
        <div className="flex w-full max-w-4xl flex-col items-center gap-6 text-center">
          {/* Eyebrow badge */}
          <p className="inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-card/70 px-3 py-1 font-mono text-xs uppercase tracking-[0.18em] backdrop-blur dark:border-white/20 dark:bg-white/8">
            <span className="size-1.5 animate-pulse rounded-full bg-primary dark:bg-white/80" aria-hidden />
            Frugal Innovation · IIIT Dharwad
          </p>

          {/* Main heading */}
          <h1 id="hero-title" className="text-balance text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            {SITE.name}
            <span className="block text-primary dark:text-white/70">{SITE.subtitle}</span>
          </h1>

          {/* Tagline */}
          <p className="text-pretty text-xl font-semibold md:text-2xl">{SITE.tagline}</p>

          {/* Description */}
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground dark:text-white/75 md:text-lg">
            AcadHub connects college students around projects, learning activities, research, competitions and campus
            goals — using the skills, knowledge and infrastructure students already have.
          </p>

          {/* Live typewriter simulation */}
          <div className="flex w-full flex-col items-center gap-2">
            <p className="font-mono text-xs text-muted-foreground dark:text-white/55 uppercase tracking-wider">
              Live goal creation simulation:
            </p>
            <Typewriter />
          </div>

          {/* CTA buttons */}
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button asChild size="lg" className="shadow-lg font-semibold">
              <Link href="/simulations">
                <PlayCircle aria-hidden />
                Try live simulations
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-border bg-background/50 text-foreground hover:bg-secondary hover:text-foreground backdrop-blur dark:border-white/25 dark:bg-white/8 dark:text-white dark:hover:bg-white/15 dark:hover:text-white"
            >
              <Link href="/innovation">
                How it works
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-foreground hover:bg-secondary hover:text-foreground dark:text-white dark:hover:bg-white/10 dark:hover:text-white"
            >
              <a href={SITE.repo} target="_blank" rel="noreferrer">
                <Github aria-hidden />
                Repository
              </a>
            </Button>
          </div>

          <dl className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border/70 bg-border/50 sm:grid-cols-4 dark:border-white/15 dark:bg-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="group flex flex-col gap-2 bg-background/75 p-4 backdrop-blur transition-colors hover:bg-card dark:bg-white/8 dark:hover:bg-white/15">
                <s.icon className="size-4 text-muted-foreground dark:text-white/60" aria-hidden />
                <dd className="font-mono text-2xl font-bold">{s.value}</dd>
                <dt className="text-xs text-muted-foreground dark:text-white/65">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </section>
  )
}
