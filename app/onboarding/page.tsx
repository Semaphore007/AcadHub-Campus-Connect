"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check, ChevronRight, Loader2, Sparkles, Upload } from "lucide-react"
import { useSession } from "@/lib/auth-client"
import { BrandMark } from "@/components/navigation/brand"
import { cn } from "@/lib/utils"

const DEFAULT_AVATARS = [
  { id: "A", bg: "from-violet-500 to-purple-600", label: "Violet" },
  { id: "B", bg: "from-blue-500 to-cyan-600", label: "Blue" },
  { id: "C", bg: "from-emerald-500 to-teal-600", label: "Emerald" },
  { id: "D", bg: "from-orange-500 to-red-600", label: "Orange" },
  { id: "E", bg: "from-pink-500 to-rose-600", label: "Pink" },
  { id: "F", bg: "from-amber-500 to-yellow-600", label: "Amber" },
]

const SUGGESTED_COMMUNITIES = [
  { slug: "dsa", name: "DSA & Competitive Coding", emoji: "🏆", members: "2.4k" },
  { slug: "webdev", name: "Web Development", emoji: "🌐", members: "3.1k" },
  { slug: "aiml", name: "AI & Machine Learning", emoji: "🤖", members: "1.9k" },
  { slug: "hackathons", name: "Hackathons & Competitions", emoji: "⚡", members: "1.2k" },
  { slug: "research", name: "Research & Academia", emoji: "📚", members: "890" },
  { slug: "design", name: "Design & UI/UX", emoji: "🎨", members: "760" },
  { slug: "study", name: "Study Groups", emoji: "📖", members: "2.8k" },
  { slug: "campus", name: "Campus Life", emoji: "🏫", members: "4.2k" },
]

type Step = "avatar" | "bio" | "communities" | "done"

const STEPS: Step[] = ["avatar", "bio", "communities", "done"]
const STEP_LABELS = { avatar: "Avatar", bio: "About you", communities: "Communities", done: "Done!" }

export default function OnboardingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<Step>("avatar")
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [bio, setBio] = useState("")
  const [selectedCommunities, setSelectedCommunities] = useState<Set<string>>(new Set())
  const [saving, setSaving] = useState(false)

  const stepIdx = STEPS.indexOf(step)
  const name = session?.user?.name ?? "Student"

  const toggleCommunity = (slug: string) => {
    setSelectedCommunities((prev) => {
      const next = new Set(prev)
      if (next.has(slug)) next.delete(slug)
      else next.add(slug)
      return next
    })
  }

  const next = async () => {
    const currentIdx = STEPS.indexOf(step)
    if (step === "communities") {
      setSaving(true)
      // In production: save avatar, bio, community memberships
      await new Promise((r) => setTimeout(r, 800))
      setSaving(false)
      setStep("done")
      return
    }
    if (step === "done") {
      router.push("/feed")
      return
    }
    setStep(STEPS[currentIdx + 1])
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark className="size-12" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {step === "done" ? "You're all set! 🎉" : `Welcome, ${name.split(" ")[0]}!`}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {step === "done"
                ? "Your AcadHub profile is ready."
                : "Let's set up your profile in 3 quick steps."}
            </p>
          </div>

          {/* Progress dots */}
          {step !== "done" && (
            <div className="flex items-center gap-2">
              {STEPS.slice(0, -1).map((s, i) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "flex size-7 items-center justify-center rounded-full text-xs font-bold transition-all",
                      STEPS.indexOf(step) > i
                        ? "bg-success text-white"
                        : STEPS.indexOf(step) === i
                          ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                          : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {STEPS.indexOf(step) > i ? <Check className="size-3.5" /> : i + 1}
                  </div>
                  {i < 2 && <ChevronRight className="size-3.5 text-muted-foreground" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-xl shadow-primary/5">
          {/* Step: Avatar */}
          {step === "avatar" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Choose your avatar</h2>
                <p className="mt-1 text-sm text-muted-foreground">Pick a default avatar or upload your own photo.</p>
              </div>

              {/* Default avatars */}
              <div className="grid grid-cols-3 gap-3">
                {DEFAULT_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => setSelectedAvatar(av.id)}
                    aria-label={`Select ${av.label} avatar`}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-2xl text-4xl font-bold text-white transition-all",
                      `bg-gradient-to-br ${av.bg}`,
                      selectedAvatar === av.id
                        ? "ring-4 ring-primary ring-offset-2 scale-105"
                        : "hover:scale-105 hover:shadow-lg",
                    )}
                  >
                    {av.id}
                    {selectedAvatar === av.id && (
                      <span className="absolute -right-1.5 -top-1.5 flex size-6 items-center justify-center rounded-full bg-primary">
                        <Check className="size-3.5 text-white" />
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Upload option */}
              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border/60 py-4 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Upload className="size-4" aria-hidden />
                Upload photo (JPG, PNG — max 5MB)
              </button>
            </div>
          )}

          {/* Step: Bio */}
          {step === "bio" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Tell us about yourself</h2>
                <p className="mt-1 text-sm text-muted-foreground">A brief bio helps others understand your skills and interests.</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="bio" className="text-sm font-medium text-foreground">
                  Bio <span className="text-muted-foreground">(optional)</span>
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. 3rd year CS student. Into IoT and competitive programming. Looking for hackathon teams!"
                  maxLength={200}
                  rows={4}
                  className={cn(
                    "w-full rounded-xl border border-border/60 bg-secondary/50 p-3 text-sm outline-none resize-none",
                    "transition-all placeholder:text-muted-foreground",
                    "focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
                  )}
                />
                <p className="text-right text-xs text-muted-foreground">{bio.length}/200</p>
              </div>
            </div>
          )}

          {/* Step: Communities */}
          {step === "communities" && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-semibold text-foreground">Join communities</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Pick communities that match your interests. You can join more later.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SUGGESTED_COMMUNITIES.map((c) => (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => toggleCommunity(c.slug)}
                    aria-pressed={selectedCommunities.has(c.slug)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                      selectedCommunities.has(c.slug)
                        ? "border-primary/50 bg-primary/10 ring-1 ring-primary/30"
                        : "border-border/60 bg-card hover:border-primary/30 hover:bg-secondary/60",
                    )}
                  >
                    <span className="text-2xl" aria-hidden>{c.emoji}</span>
                    <span className="flex flex-1 flex-col">
                      <span className="text-sm font-semibold text-foreground">{c.name}</span>
                      <span className="text-xs text-muted-foreground">{c.members} members</span>
                    </span>
                    {selectedCommunities.has(c.slug) && (
                      <Check className="size-4 shrink-0 text-primary" aria-hidden />
                    )}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedCommunities.size === 0 ? "Select at least one to continue" : `${selectedCommunities.size} selected`}
              </p>
            </div>
          )}

          {/* Step: Done */}
          {step === "done" && (
            <div className="flex flex-col items-center gap-6 py-4 text-center">
              <div className="flex size-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                <Sparkles className="size-10 text-white" aria-hidden />
              </div>
              <div>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Your profile is set up. You can now discover goals, join communities, chat with students, and use the AI Study Buddy.
                </p>
              </div>
              <ul className="flex flex-col gap-2 text-sm text-left w-full">
                {["Discover student goals & projects", "Join your chosen communities", "Chat & collaborate with peers", "Ask Hub AI for study help"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-muted-foreground">
                    <Check className="size-4 shrink-0 text-success" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Next button */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={next}
            disabled={saving || (step === "communities" && selectedCommunities.size === 0)}
            className={cn(
              "inline-flex h-12 items-center gap-2 rounded-xl px-8 font-semibold text-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "active:scale-[0.98]",
            )}
          >
            {saving ? (
              <>Saving… <Loader2 className="size-4 animate-spin" aria-hidden /></>
            ) : step === "done" ? (
              "Go to AcadHub →"
            ) : (
              "Continue →"
            )}
          </button>
        </div>

        {/* Skip */}
        {step !== "done" && (
          <p className="mt-3 text-center">
            <button
              type="button"
              onClick={() => router.push("/feed")}
              className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-colors"
            >
              Skip for now
            </button>
          </p>
        )}
      </div>
    </div>
  )
}
