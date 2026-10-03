"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { ArrowLeft, CalendarClock, ExternalLink, Link2, ListTodo, LogOut, MessageSquare, Send, Trash2, Users } from "lucide-react"
import { UserAvatar } from "@/components/app/user-avatar"
import { timeAgo } from "@/lib/avatars"
import { actions, errorMessage, useCurrentUser, useDemo } from "@/lib/demo/store"
import type { DemoUser, Goal, GoalStatus, TaskStatus } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { daysLeft, SkillChip, StatusBadge } from "./goal-meta"

type Tab = "chat" | "tasks" | "resources" | "team"

function run(fn: () => void, success?: string) {
  try {
    fn()
    if (success) toast.success(success)
  } catch (e) {
    toast.error(errorMessage(e))
  }
}

const fieldClass =
  "h-10 flex-1 rounded-xl border border-border/60 bg-secondary/50 px-3.5 text-sm outline-none focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20"

function Chat({ goal, me, users }: { goal: Goal; me: DemoUser; users: DemoUser[] }) {
  const messages = useDemo((s) => s.messages).filter((m) => m.goalId === goal.id)
  const [text, setText] = useState("")
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" })
  }, [messages.length])

  const send = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return
    run(() => actions.sendMessage(goal.id, text))
    setText("")
  }

  return (
    <div className="flex h-[min(60dvh,520px)] flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite">
        {messages.length === 0 ? <p className="py-10 text-center text-sm text-muted-foreground">No messages yet. Say hi to your team.</p> : null}
        {messages.map((m) => {
          const author = users.find((u) => u.id === m.authorId)
          const mine = m.authorId === me.id
          return (
            <div key={m.id} className={cn("flex gap-2.5", mine && "flex-row-reverse")}>
              <UserAvatar name={author?.name ?? "?"} seed={m.authorId} className="size-8 shrink-0" />
              <div className={cn("flex max-w-[75%] flex-col gap-1", mine && "items-end")}>
                <span className="text-xs text-muted-foreground">
                  {mine ? "You" : author?.name} · {timeAgo(m.createdAt)}
                </span>
                <p className={cn("rounded-2xl px-3.5 py-2 text-sm leading-relaxed", mine ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground")}>
                  {m.text}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
      <form onSubmit={send} className="flex gap-2 border-t border-border/60 p-3">
        <label htmlFor="chat-input" className="sr-only">Message</label>
        <input id="chat-input" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} placeholder="Write a message..." className={fieldClass} autoComplete="off" />
        <button type="submit" disabled={!text.trim()} aria-label="Send message" className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
          <Send className="size-4" aria-hidden />
        </button>
      </form>
    </div>
  )
}

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: "todo", label: "To do" },
  { id: "doing", label: "In progress" },
  { id: "done", label: "Done" },
]

function Tasks({ goal, users }: { goal: Goal; users: DemoUser[] }) {
  const tasks = useDemo((s) => s.tasks).filter((t) => t.goalId === goal.id)
  const [title, setTitle] = useState("")
  const add = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    run(() => actions.addTask(goal.id, title))
    setTitle("")
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <form onSubmit={add} className="flex gap-2">
        <label htmlFor="task-input" className="sr-only">New task</label>
        <input id="task-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={140} placeholder="Add a task..." className={fieldClass} />
        <button type="submit" className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Add</button>
      </form>
      <div className="grid gap-3 md:grid-cols-3">
        {COLUMNS.map((col) => {
          const items = tasks.filter((t) => t.status === col.id)
          return (
            <section key={col.id} aria-label={col.label} className="flex flex-col gap-2 rounded-xl bg-secondary/40 p-3">
              <h3 className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.label}
                <span className="rounded-full bg-background px-2 py-0.5">{items.length}</span>
              </h3>
              {items.map((t) => {
                const assignee = users.find((u) => u.id === t.assigneeId)
                return (
                  <div key={t.id} className="flex flex-col gap-2 rounded-lg border border-border/60 bg-card p-3">
                    <p className={cn("text-sm", t.status === "done" && "text-muted-foreground line-through")}>{t.title}</p>
                    <div className="flex items-center justify-between gap-2">
                      {assignee ? (
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <UserAvatar name={assignee.name} seed={assignee.id} className="size-5" />
                          {assignee.name.split(" ")[0]}
                        </span>
                      ) : (
                        <button type="button" onClick={() => run(() => actions.assignTaskToMe(t.id))} className="text-xs font-medium text-primary hover:underline">
                          Assign to me
                        </button>
                      )}
                      <div className="flex items-center gap-1">
                        <label htmlFor={`status-${t.id}`} className="sr-only">Status</label>
                        <select
                          id={`status-${t.id}`}
                          value={t.status}
                          onChange={(e) => run(() => actions.setTaskStatus(t.id, e.target.value as TaskStatus))}
                          className="rounded-md border border-border/60 bg-background px-1.5 py-0.5 text-xs"
                        >
                          {COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                        </select>
                        <button type="button" aria-label={`Delete ${t.title}`} onClick={() => run(() => actions.deleteTask(t.id))} className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                          <Trash2 className="size-3.5" aria-hidden />
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function Resources({ goal, users }: { goal: Goal; users: DemoUser[] }) {
  const resources = useDemo((s) => s.resources).filter((r) => r.goalId === goal.id)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const add = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      actions.addResource(goal.id, title, url)
      setTitle("")
      setUrl("")
      toast.success("Resource added")
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }
  return (
    <div className="flex flex-col gap-4 p-4">
      <form onSubmit={add} className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor="res-title" className="sr-only">Title</label>
        <input id="res-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" className={fieldClass} />
        <label htmlFor="res-url" className="sr-only">URL</label>
        <input id="res-url" type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className={fieldClass} />
        <button type="submit" className="h-10 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Add</button>
      </form>
      {resources.length === 0 ? <p className="py-6 text-center text-sm text-muted-foreground">Share docs, repos and references with your team.</p> : null}
      <ul className="flex flex-col gap-2">
        {resources.map((r) => (
          <li key={r.id} className="flex items-center gap-3 rounded-xl border border-border/60 bg-card p-3">
            <Link2 className="size-4 shrink-0 text-accent" aria-hidden />
            <div className="min-w-0 flex-1">
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 truncate text-sm font-medium hover:text-primary">
                {r.title}
                <ExternalLink className="size-3" aria-hidden />
              </a>
              <p className="truncate text-xs text-muted-foreground">
                {users.find((u) => u.id === r.addedBy)?.name ?? "Someone"} · {timeAgo(r.createdAt)}
              </p>
            </div>
            <button type="button" aria-label={`Remove ${r.title}`} onClick={() => run(() => actions.deleteResource(r.id))} className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="size-4" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Team({ goal, users }: { goal: Goal; users: DemoUser[] }) {
  const team = goal.memberIds.map((id) => users.find((u) => u.id === id)).filter(Boolean) as DemoUser[]
  return (
    <ul className="grid gap-3 p-4 sm:grid-cols-2">
      {team.map((u) => (
        <li key={u.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-3">
          <UserAvatar name={u.name} seed={u.id} className="size-10" />
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold">
              {u.name}
              {u.id === goal.ownerId ? <span className="rounded-full bg-accent/15 px-1.5 py-0.5 text-[10px] font-bold text-accent">Owner</span> : null}
            </p>
            <p className="text-xs text-muted-foreground">{u.branch} · {u.year} year</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {u.skills.slice(0, 4).map((s) => <SkillChip key={s} skill={s} matched={goal.skills.some((g) => g.toLowerCase() === s.toLowerCase())} />)}
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

const TABS: { id: Tab; label: string; icon: typeof MessageSquare }[] = [
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "tasks", label: "Tasks", icon: ListTodo },
  { id: "resources", label: "Resources", icon: Link2 },
  { id: "team", label: "Team", icon: Users },
]

export function GoalRoom({ goalId }: { goalId: string }) {
  const me = useCurrentUser()
  const goal = useDemo((s) => s.goals.find((g) => g.id === goalId))
  const users = useDemo((s) => s.users)
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("chat")

  if (!me) return null
  if (!goal) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <h1 className="text-xl font-semibold">Goal not found</h1>
        <p className="text-sm text-muted-foreground">It may have been deleted.</p>
        <Link href="/goals" className="text-sm font-semibold text-primary hover:underline">Back to goals</Link>
      </div>
    )
  }

  const isMember = goal.memberIds.includes(me.id)
  const isOwner = goal.ownerId === me.id
  const owner = users.find((u) => u.id === goal.ownerId)
  const full = goal.memberIds.length >= goal.slots
  const closed = goal.status === "archived" || goal.status === "completed"

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
      <Link href="/goals" className="inline-flex items-center gap-1.5 self-start text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        All goals
      </Link>

      <header className="flex flex-col gap-4 rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-accent">{goal.category}</span>
          <StatusBadge status={goal.status} />
        </div>
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">{goal.title}</h1>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">{goal.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {goal.skills.map((s) => <SkillChip key={s} skill={s} matched={me.skills.some((m) => m.toLowerCase() === s.toLowerCase())} />)}
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Users className="size-4" aria-hidden />{goal.memberIds.length}/{goal.slots} members</span>
          <span className="flex items-center gap-1.5"><CalendarClock className="size-4" aria-hidden />{daysLeft(goal.deadline)}</span>
          {owner ? <span>Posted by {isOwner ? "you" : owner.name}</span> : null}
        </div>
        <div className="flex flex-wrap gap-2 border-t border-border/60 pt-4">
          {!isMember ? (
            <button
              type="button"
              disabled={full || closed}
              onClick={() => run(() => actions.joinGoal(goal.id), "You joined the team")}
              className="h-10 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
            >
              {closed ? "Closed" : full ? "Team full" : "Join team"}
            </button>
          ) : null}
          {isOwner ? (
            <>
              <label htmlFor="goal-status" className="sr-only">Goal status</label>
              <select
                id="goal-status"
                value={goal.status}
                onChange={(e) => run(() => actions.setGoalStatus(goal.id, e.target.value as GoalStatus), "Status updated")}
                className="h-10 rounded-xl border border-border/60 bg-background px-3 text-sm"
              >
                {(["open", "active", "completed", "archived"] as GoalStatus[]).map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("Delete this goal and its team room?")) return
                  run(() => actions.deleteGoal(goal.id), "Goal deleted")
                  router.push("/goals")
                }}
                className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-destructive/40 px-4 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" aria-hidden />
                Delete
              </button>
            </>
          ) : isMember ? (
            <button
              type="button"
              onClick={() => run(() => actions.leaveGoal(goal.id), "You left the team")}
              className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-border/60 px-4 text-sm font-medium hover:bg-secondary"
            >
              <LogOut className="size-4" aria-hidden />
              Leave team
            </button>
          ) : null}
        </div>
      </header>

      {isMember ? (
        <section className="overflow-hidden rounded-2xl border border-border/60 bg-card" aria-label="Team room">
          <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-border/60 p-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                type="button"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition",
                  tab === t.id ? "bg-primary/12 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <t.icon className="size-4" aria-hidden />
                {t.label}
              </button>
            ))}
          </div>
          {tab === "chat" ? <Chat goal={goal} me={me} users={users} /> : null}
          {tab === "tasks" ? <Tasks goal={goal} users={users} /> : null}
          {tab === "resources" ? <Resources goal={goal} users={users} /> : null}
          {tab === "team" ? <Team goal={goal} users={users} /> : null}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-border p-8 text-center">
          <p className="text-sm text-muted-foreground">Join the team to access chat, tasks and shared resources.</p>
          <div className="mt-4"><Team goal={goal} users={users} /></div>
        </section>
      )}
    </div>
  )
}
