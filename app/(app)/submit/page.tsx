"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { CalendarDays, ChevronDown, Loader2, Plus, Target, Users, X } from "lucide-react"
import { cn } from "@/lib/utils"

const schema = z.object({
  title: z.string().min(10, "Title must be at least 10 characters").max(120, "Title is too long"),
  body: z.string().min(30, "Description must be at least 30 characters").max(2000, "Too long"),
  community: z.string().min(1, "Please select a community"),
  type: z.enum(["goal", "discussion", "resource"]),
  slots: z.string().optional(),
  deadline: z.string().optional(),
})

type Values = z.infer<typeof schema>

const COMMUNITIES = [
  { slug: "aiml", name: "AI & Machine Learning", emoji: "🤖" },
  { slug: "webdev", name: "Web Development", emoji: "🌐" },
  { slug: "dsa", name: "DSA & Competitive", emoji: "🏆" },
  { slug: "hackathons", name: "Hackathons", emoji: "⚡" },
  { slug: "iot", name: "IoT & Electronics", emoji: "🔌" },
  { slug: "research", name: "Research", emoji: "📚" },
  { slug: "design", name: "Design", emoji: "🎨" },
  { slug: "campus", name: "Campus Life", emoji: "🏫" },
]

const SKILL_SUGGESTIONS = ["Python", "React", "Node.js", "Arduino", "TensorFlow", "Figma", "C++", "Java", "PostgreSQL", "MQTT", "ESP32", "OpenCV", "TypeScript", "Next.js"]

const TYPE_OPTIONS = [
  { id: "goal", label: "Goal / Project", desc: "Need collaborators to achieve a specific outcome", emoji: "🎯" },
  { id: "discussion", label: "Discussion", desc: "Share thoughts, ask questions, spark conversation", emoji: "💬" },
  { id: "resource", label: "Resource / Study Group", desc: "Share notes, links, or organize a study group", emoji: "📖" },
] as const

export default function SubmitPage() {
  const router = useRouter()
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting, isValid } } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { type: "goal" },
    mode: "onChange",
  })

  const type = watch("type")
  const isGoal = type === "goal"

  const addSkill = (skill: string) => {
    const s = skill.trim()
    if (s && !skills.includes(s) && skills.length < 8) {
      setSkills((prev) => [...prev, s])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => setSkills((prev) => prev.filter((s) => s !== skill))

  const onSubmit = async (data: Values) => {
    await new Promise((r) => setTimeout(r, 800))
    setSubmitted(true)
    setTimeout(() => router.push("/feed"), 1500)
  }

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex size-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-3xl shadow-lg shadow-primary/30">🎯</div>
        <h2 className="text-2xl font-bold text-foreground">Goal Posted!</h2>
        <p className="text-muted-foreground">Redirecting you to the feed…</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Create a Post</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">Share a goal, discussion or resource with your community</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        {/* Type selector */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">Type</label>
          <div className="grid gap-2 sm:grid-cols-3">
            {TYPE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setValue("type", opt.id)}
                aria-pressed={type === opt.id}
                className={cn(
                  "flex flex-col gap-1.5 rounded-2xl border p-3.5 text-left transition-all",
                  type === opt.id
                    ? "border-primary/50 bg-primary/8 ring-1 ring-primary/20"
                    : "border-border/60 bg-card hover:border-primary/25 hover:bg-secondary/40",
                )}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-sm font-semibold text-foreground">{opt.label}</span>
                <span className="text-xs leading-relaxed text-muted-foreground">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Community */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="community" className="text-sm font-medium text-foreground">Community</label>
          <div className="relative">
            <select
              id="community"
              className={cn(
                "h-11 w-full appearance-none rounded-xl border bg-secondary/50 pl-4 pr-10 text-sm outline-none transition-all",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                errors.community ? "border-destructive/60" : "border-border/60",
              )}
              {...register("community")}
            >
              <option value="">Select a community…</option>
              {COMMUNITIES.map((c) => (
                <option key={c.slug} value={c.slug}>{c.emoji} {c.name}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          </div>
          {errors.community && <p className="text-xs text-destructive">{errors.community.message}</p>}
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="title" className="text-sm font-medium text-foreground">
            {isGoal ? "Goal title" : "Title"}
          </label>
          <input
            id="title"
            type="text"
            placeholder={isGoal ? "e.g. Build an IoT smart energy monitor with ESP32" : "e.g. Best resources for learning graph algorithms?"}
            className={cn(
              "h-11 w-full rounded-xl border bg-secondary/50 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground",
              "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
              errors.title ? "border-destructive/60" : "border-border/60",
            )}
            {...register("title")}
          />
          {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="body" className="text-sm font-medium text-foreground">Description</label>
          <textarea
            id="body"
            rows={5}
            placeholder={isGoal ? "Describe the goal, what skills are needed, your plan, and what collaborators will learn…" : "Share your thoughts, questions or resources…"}
            className={cn(
              "w-full rounded-xl border bg-secondary/50 px-4 py-3 text-sm outline-none resize-y transition-all placeholder:text-muted-foreground",
              "focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20",
              errors.body ? "border-destructive/60" : "border-border/60",
            )}
            {...register("body")}
          />
          {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
        </div>

        {/* Goal-specific fields */}
        {isGoal && (
          <>
            {/* Skills */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-foreground">Required skills</label>
              <div className={cn("min-h-[2.75rem] w-full flex-wrap flex items-center gap-2 rounded-xl border border-border/60 bg-secondary/50 px-3 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all")}>
                {skills.map((skill) => (
                  <span key={skill} className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                    {skill}
                    <button type="button" onClick={() => removeSkill(skill)} aria-label={`Remove ${skill}`} className="hover:text-destructive">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(skillInput) } }}
                  placeholder={skills.length === 0 ? "Add skills (Enter to add)…" : ""}
                  className="min-w-24 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="flex flex-wrap gap-1.5">
                {SKILL_SUGGESTIONS.filter((s) => !skills.includes(s)).slice(0, 8).map((s) => (
                  <button key={s} type="button" onClick={() => addSkill(s)} className="rounded-lg border border-border/60 px-2 py-0.5 text-xs text-muted-foreground hover:border-primary/40 hover:text-primary transition-colors">
                    + {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Slots + deadline */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="slots" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <Users className="size-4 text-muted-foreground" /> Team slots (including you)
                </label>
                <input
                  id="slots"
                  type="number"
                  min="2"
                  max="10"
                  defaultValue={3}
                  className="h-11 w-full rounded-xl border border-border/60 bg-secondary/50 px-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  {...register("slots")}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="deadline" className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                  <CalendarDays className="size-4 text-muted-foreground" /> Application deadline
                </label>
                <input
                  id="deadline"
                  type="date"
                  className="h-11 w-full rounded-xl border border-border/60 bg-secondary/50 px-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                  {...register("deadline")}
                />
              </div>
            </div>
          </>
        )}

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className={cn(
              "flex h-12 flex-1 items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
              "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
              "disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
            )}
          >
            {isSubmitting ? (
              <><Loader2 className="size-4 animate-spin" /> Posting…</>
            ) : (
              <><Target className="size-4" /> Post {type === "goal" ? "Goal" : type === "discussion" ? "Discussion" : "Resource"}</>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="h-12 rounded-xl border border-border/60 px-5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
