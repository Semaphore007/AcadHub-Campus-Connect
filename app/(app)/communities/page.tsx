"use client"

import { useState } from "react"
import { Check, Compass, Search, TrendingUp, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const CATEGORIES = ["All", "Tech", "Research", "Creative", "Campus Life", "Sports"]

const COMMUNITIES = [
  { slug: "aiml", name: "AI & Machine Learning", emoji: "🤖", members: "1.9k", description: "Deep learning, NLP, Computer Vision projects and study groups.", category: "Tech", joined: false, activeGoals: 8 },
  { slug: "webdev", name: "Web Development", emoji: "🌐", members: "3.1k", description: "Full-stack, frontend, backend — build real products together.", category: "Tech", joined: true, activeGoals: 14 },
  { slug: "dsa", name: "DSA & Competitive", emoji: "🏆", members: "2.4k", description: "LeetCode, Codeforces, ICPC prep — solve problems as a team.", category: "Tech", joined: true, activeGoals: 6 },
  { slug: "hackathons", name: "Hackathons", emoji: "⚡", members: "1.2k", description: "SIH, HackWithInfy, Flipkart Grid — find your team here.", category: "Tech", joined: false, activeGoals: 4 },
  { slug: "iot", name: "IoT & Electronics", emoji: "🔌", members: "890", description: "Arduino, ESP32, Raspberry Pi — build smart things.", category: "Tech", joined: false, activeGoals: 7 },
  { slug: "research", name: "Research & Academia", emoji: "📚", members: "760", description: "Papers, literature reviews, thesis help — academic collaboration.", category: "Research", joined: false, activeGoals: 5 },
  { slug: "design", name: "Design & UI/UX", emoji: "🎨", members: "640", description: "Figma, Canva, product design — make things beautiful.", category: "Creative", joined: false, activeGoals: 3 },
  { slug: "study", name: "Study Groups", emoji: "📖", members: "2.8k", description: "Exam prep, subject groups, notes sharing.", category: "Campus Life", joined: true, activeGoals: 20 },
  { slug: "campus", name: "Campus Life", emoji: "🏫", members: "4.2k", description: "Events, clubs, announcements and student activities.", category: "Campus Life", joined: false, activeGoals: 12 },
  { slug: "data", name: "Data Science", emoji: "📊", members: "720", description: "Pandas, SQL, visualization — data-driven projects.", category: "Tech", joined: false, activeGoals: 6 },
  { slug: "os", name: "Open Source", emoji: "💻", members: "540", description: "Contribute to open source, build your portfolio.", category: "Tech", joined: false, activeGoals: 9 },
  { slug: "music", name: "Music & Arts", emoji: "🎵", members: "380", description: "Band formation, music collaborations, arts projects.", category: "Creative", joined: false, activeGoals: 2 },
]

export default function CommunitiesPage() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [joinedState, setJoinedState] = useState<Record<string, boolean>>(
    Object.fromEntries(COMMUNITIES.map((c) => [c.slug, c.joined]))
  )

  const filtered = COMMUNITIES.filter((c) => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || c.description.toLowerCase().includes(query.toLowerCase())
    const matchesCat = category === "All" || c.category === category
    return matchesQuery && matchesCat
  })

  const toggleJoin = (slug: string) => {
    setJoinedState((prev) => ({ ...prev, [slug]: !prev[slug] }))
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-foreground">
            <Compass className="size-6 text-primary" aria-hidden />
            Explore Communities
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Find communities that match your skills and interests</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="size-4 text-primary" aria-hidden />
          <span><strong className="text-foreground">{COMMUNITIES.reduce((a, c) => a + parseInt(c.members), 0).toLocaleString()}</strong> members total</span>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input
          type="search"
          placeholder="Search communities…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="h-12 w-full rounded-2xl border border-border/60 bg-card pl-11 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
        />
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            aria-pressed={category === cat}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-all",
              category === cat
                ? "bg-primary text-primary-foreground shadow-sm"
                : "border border-border/60 bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground",
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <div
            key={c.slug}
            className="group flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/15 text-2xl shadow-sm">
                {c.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground leading-tight">{c.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Users className="size-3" aria-hidden />
                  <span>{c.members} members</span>
                  <span>·</span>
                  <span className="text-primary">{c.activeGoals} active goals</span>
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">{c.description}</p>

            {/* Join button */}
            <button
              type="button"
              onClick={() => toggleJoin(c.slug)}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all",
                joinedState[c.slug]
                  ? "border border-success/40 bg-success/10 text-success hover:bg-success/20"
                  : "bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground",
              )}
            >
              {joinedState[c.slug] ? (
                <><Check className="size-4" /> Joined</>
              ) : (
                <>Join Community</>
              )}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-20 text-center text-muted-foreground">
          <span className="text-5xl">🔍</span>
          <p className="font-medium">No communities found</p>
          <p className="text-sm">Try a different search or category</p>
        </div>
      )}
    </div>
  )
}
