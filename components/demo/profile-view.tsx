"use client"

import { useState } from "react"
import { toast } from "react-toastify"
import { Pencil, Save, X } from "lucide-react"
import { UserAvatar } from "@/components/app/user-avatar"
import { SkillChip } from "@/components/goals/goal-meta"
import { actions, errorMessage, useCurrentUser, useDemo } from "@/lib/demo/store"
import type { DemoUser } from "@/lib/demo/types"

const field =
  "w-full rounded-xl border border-border/60 bg-secondary/50 px-3.5 py-2.5 text-sm outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"

const toList = (v: string) => Array.from(new Set(v.split(",").map((s) => s.trim()).filter(Boolean))).slice(0, 12)

function Editor({ me, onDone }: { me: DemoUser; onDone: () => void }) {
  const [form, setForm] = useState({
    name: me.name,
    bio: me.bio,
    branch: me.branch,
    year: me.year,
    skills: me.skills.join(", "),
    interests: me.interests.join(", "),
  })
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const save = (e: React.FormEvent) => {
    e.preventDefault()
    if (form.name.trim().length < 2) return toast.error("Name must be at least 2 characters")
    try {
      actions.updateProfile({ ...form, name: form.name.trim(), bio: form.bio.trim().slice(0, 300), skills: toList(form.skills), interests: toList(form.interests) })
      toast.success("Profile saved")
      onDone()
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  return (
    <form onSubmit={save} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5 sm:col-span-3">
          <label htmlFor="p-name" className="text-sm font-medium">Name</label>
          <input id="p-name" value={form.name} onChange={set("name")} maxLength={50} className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-branch" className="text-sm font-medium">Branch</label>
          <input id="p-branch" value={form.branch} onChange={set("branch")} className={field} />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="p-year" className="text-sm font-medium">Year</label>
          <input id="p-year" value={form.year} onChange={set("year")} className={field} />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="p-bio" className="text-sm font-medium">Bio</label>
        <textarea id="p-bio" rows={3} value={form.bio} onChange={set("bio")} maxLength={300} className={field} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="p-skills" className="text-sm font-medium">Skills</label>
        <input id="p-skills" value={form.skills} onChange={set("skills")} placeholder="React, Python, UI Design" className={field} />
        <p className="text-xs text-muted-foreground">Comma separated. Used to match you with goals.</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="p-interests" className="text-sm font-medium">Interests</label>
        <input id="p-interests" value={form.interests} onChange={set("interests")} placeholder="AI, Robotics, Open source" className={field} />
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onDone} className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/60 px-4 text-sm font-medium hover:bg-secondary">
          <X className="size-4" aria-hidden /> Cancel
        </button>
        <button type="submit" className="inline-flex h-10 items-center gap-1.5 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Save className="size-4" aria-hidden /> Save
        </button>
      </div>
    </form>
  )
}

export function ProfileView() {
  const me = useCurrentUser()
  const goals = useDemo((s) => s.goals)
  const [editing, setEditing] = useState(false)
  if (!me) return null
  const myGoals = goals.filter((g) => g.memberIds.includes(me.id))

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6">
      <section className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <UserAvatar name={me.name} seed={me.id} className="size-20 text-2xl" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{me.name}</h1>
                <p className="text-sm text-muted-foreground">u/{me.username} · {me.branch} · {me.year} year</p>
              </div>
              {!editing ? (
                <button type="button" onClick={() => setEditing(true)} className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-xl border border-border/60 px-3 text-sm font-medium hover:bg-secondary">
                  <Pencil className="size-3.5" aria-hidden /> Edit
                </button>
              ) : null}
            </div>
            {!editing ? (
              <div className="mt-4 flex flex-col gap-4">
                <p className="text-sm leading-relaxed text-muted-foreground">{me.bio || "No bio yet."}</p>
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Skills</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {me.skills.length ? me.skills.map((s) => <SkillChip key={s} skill={s} matched />) : <span className="text-sm text-muted-foreground">Add skills to get matched.</span>}
                  </div>
                </div>
                <div>
                  <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interests</h2>
                  <div className="flex flex-wrap gap-1.5">
                    {me.interests.length ? me.interests.map((s) => <SkillChip key={s} skill={s} />) : <span className="text-sm text-muted-foreground">None listed.</span>}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
        {editing ? <div className="mt-6 border-t border-border/60 pt-6"><Editor me={me} onDone={() => setEditing(false)} /></div> : null}
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-6">
        <h2 className="mb-3 text-lg font-semibold">Teams ({myGoals.length})</h2>
        <ul className="flex flex-col divide-y divide-border/60">
          {myGoals.map((g) => (
            <li key={g.id} className="flex items-center justify-between gap-3 py-3">
              <a href={`/goals/${g.id}`} className="truncate text-sm font-medium hover:text-primary">{g.title}</a>
              <span className="shrink-0 text-xs capitalize text-muted-foreground">{g.ownerId === me.id ? "Owner" : "Member"} · {g.status}</span>
            </li>
          ))}
          {myGoals.length === 0 ? <li className="py-3 text-sm text-muted-foreground">No teams yet.</li> : null}
        </ul>
      </section>
    </div>
  )
}
