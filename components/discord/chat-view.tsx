"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { AtSign, Hash, Menu, Pencil, Search, SendHorizontal, Trash2, Users } from "lucide-react"
import { toast } from "react-toastify"
import { UserAvatar } from "@/components/app/user-avatar"
import { discord, errorMessage, useDemo } from "@/lib/demo/store"
import type { ChannelMessage, DemoUser } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { formatStamp, formatTime } from "./utils"

type Props = {
  me: DemoUser
  channelId: string
  title: string
  topic?: string
  kind: "channel" | "dm"
  canPost: boolean
  joinPrompt?: React.ReactNode
  onOpenNav: () => void
  showMembers?: boolean
  onToggleMembers?: () => void
}

const GROUP_WINDOW = 7 * 60_000

export function ChatView({ me, channelId, title, topic, kind, canPost, joinPrompt, onOpenNav, showMembers, onToggleMembers }: Props) {
  const all = useDemo((s) => s.channelMessages)
  const users = useDemo((s) => s.users)
  const [query, setQuery] = useState("")
  const [draft, setDraft] = useState("")
  const [editing, setEditing] = useState<{ id: string; text: string } | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const messages = useMemo(() => all.filter((m) => m.channelId === channelId), [all, channelId])
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? messages.filter((m) => m.text.toLowerCase().includes(q)) : messages
  }, [messages, query])
  const userById = useMemo(() => new Map(users.map((u) => [u.id, u])), [users])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
    discord.markRead(channelId)
  }, [channelId, messages.length])

  const send = () => {
    if (!draft.trim()) return
    try {
      discord.sendMessage(channelId, draft)
      setDraft("")
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  const saveEdit = () => {
    if (!editing) return
    discord.editMessage(editing.id, editing.text)
    setEditing(null)
  }

  const placeholder = kind === "channel" ? `Message #${title}` : `Message @${title}`

  return (
    <section className="flex min-w-0 flex-1 flex-col bg-card" aria-label={title}>
      <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border/60 px-3">
        <button type="button" onClick={onOpenNav} className="rounded p-1 text-muted-foreground hover:text-foreground md:hidden" aria-label="Open navigation">
          <Menu className="size-5" aria-hidden />
        </button>
        {kind === "channel" ? <Hash className="size-5 shrink-0 text-muted-foreground" aria-hidden /> : <AtSign className="size-5 shrink-0 text-muted-foreground" aria-hidden />}
        <h1 className="truncate font-semibold">{title}</h1>
        {topic ? (
          <>
            <span className="hidden h-5 w-px bg-border sm:block" aria-hidden />
            <p className="hidden truncate text-sm text-muted-foreground sm:block">{topic}</p>
          </>
        ) : null}
        <div className="ml-auto flex items-center gap-2">
          {onToggleMembers ? (
            <button
              type="button"
              onClick={onToggleMembers}
              aria-pressed={showMembers}
              aria-label="Toggle member list"
              className={cn("hidden rounded p-1 lg:inline-flex", showMembers ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              <Users className="size-5" aria-hidden />
            </button>
          ) : null}
          <div className="relative hidden sm:block">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search"
              aria-label="Search messages"
              className="h-7 w-36 rounded bg-background pr-7 pl-2 text-sm outline-none transition-all placeholder:text-muted-foreground focus:w-52 focus-visible:ring-2 focus-visible:ring-ring"
            />
            <Search className="pointer-events-none absolute top-1/2 right-2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col justify-end pb-4">
          <div className="px-4 pt-10 pb-4">
            <span className="mb-3 flex size-16 items-center justify-center rounded-full bg-secondary">
              {kind === "channel" ? <Hash className="size-9" aria-hidden /> : <AtSign className="size-9" aria-hidden />}
            </span>
            <h2 className="text-3xl font-bold text-balance">{kind === "channel" ? `Welcome to #${title}!` : title}</h2>
            <p className="mt-1 text-muted-foreground">
              {kind === "channel" ? `This is the start of the #${title} channel.` : `This is the beginning of your direct message history with ${title}.`}
            </p>
          </div>
          {query && visible.length === 0 ? <p className="px-4 text-sm text-muted-foreground">No messages match &quot;{query}&quot;.</p> : null}
          <ol aria-live="polite" className="flex flex-col">
            {visible.map((m, i) => {
              const prev = visible[i - 1]
              const grouped = Boolean(prev && prev.authorId === m.authorId && new Date(m.createdAt).getTime() - new Date(prev.createdAt).getTime() < GROUP_WINDOW)
              const author = userById.get(m.authorId)
              return (
                <MessageRow
                  key={m.id}
                  message={m}
                  authorName={author?.name ?? "Unknown user"}
                  grouped={grouped}
                  mine={m.authorId === me.id}
                  editing={editing?.id === m.id ? editing.text : null}
                  onEditChange={(text) => setEditing({ id: m.id, text })}
                  onStartEdit={() => setEditing({ id: m.id, text: m.text })}
                  onCancelEdit={() => setEditing(null)}
                  onSaveEdit={saveEdit}
                  onDelete={() => {
                    if (window.confirm("Delete this message?")) discord.deleteMessage(m.id)
                  }}
                />
              )
            })}
          </ol>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-5">
        {canPost ? (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              send()
            }}
            className="flex items-end gap-2 rounded-lg bg-secondary px-4 py-2.5"
          >
            <label htmlFor="composer" className="sr-only">{placeholder}</label>
            <textarea
              id="composer"
              rows={1}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  e.preventDefault()
                  send()
                }
              }}
              placeholder={placeholder}
              maxLength={2000}
              className="max-h-48 min-h-6 flex-1 resize-none bg-transparent text-[15px] leading-6 outline-none [field-sizing:content] placeholder:text-muted-foreground"
            />
            <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="text-muted-foreground transition-colors hover:text-primary disabled:opacity-40">
              <SendHorizontal className="size-5" aria-hidden />
            </button>
          </form>
        ) : (
          joinPrompt
        )}
      </div>
    </section>
  )
}

function MessageRow({
  message,
  authorName,
  grouped,
  mine,
  editing,
  onEditChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
}: {
  message: ChannelMessage
  authorName: string
  grouped: boolean
  mine: boolean
  editing: string | null
  onEditChange: (t: string) => void
  onStartEdit: () => void
  onCancelEdit: () => void
  onSaveEdit: () => void
  onDelete: () => void
}) {
  return (
    <li className={cn("group relative flex gap-4 px-4 py-0.5 hover:bg-secondary/40", !grouped && "mt-4")}>
      <div className="w-10 shrink-0">
        {grouped ? (
          <span className="invisible block pt-1 text-right text-[10px] text-muted-foreground group-hover:visible">{formatTime(message.createdAt)}</span>
        ) : (
          <UserAvatar name={authorName} seed={message.authorId} className="mt-0.5 size-10" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        {!grouped ? (
          <p className="flex items-baseline gap-2">
            <span className="font-semibold">{authorName}</span>
            <time dateTime={message.createdAt} className="text-xs text-muted-foreground">{formatStamp(message.createdAt)}</time>
          </p>
        ) : null}
        {editing !== null ? (
          <div className="my-1">
            <textarea
              autoFocus
              aria-label="Edit message"
              value={editing}
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") onCancelEdit()
                if (e.key === "Enter" && !e.shiftKey) {
                  if (e.nativeEvent.isComposing || e.keyCode === 229) return
                  e.preventDefault()
                  onSaveEdit()
                }
              }}
              className="w-full resize-none rounded-md bg-secondary px-3 py-2 text-[15px] outline-none [field-sizing:content] focus-visible:ring-2 focus-visible:ring-ring"
            />
            <p className="text-xs text-muted-foreground">
              escape to <button type="button" onClick={onCancelEdit} className="text-primary hover:underline">cancel</button>
              {" • "}enter to <button type="button" onClick={onSaveEdit} className="text-primary hover:underline">save</button>
            </p>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap text-foreground/90">
            {message.text}
            {message.editedAt ? <span className="ml-1 text-[10px] text-muted-foreground">(edited)</span> : null}
          </p>
        )}
      </div>
      {mine && editing === null ? (
        <div className="absolute -top-3 right-4 hidden overflow-hidden rounded-md border border-border bg-popover shadow group-hover:flex group-focus-within:flex">
          <button type="button" onClick={onStartEdit} aria-label="Edit message" className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Pencil className="size-4" aria-hidden />
          </button>
          <button type="button" onClick={onDelete} aria-label="Delete message" className="p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive">
            <Trash2 className="size-4" aria-hidden />
          </button>
        </div>
      ) : null}
    </li>
  )
}
