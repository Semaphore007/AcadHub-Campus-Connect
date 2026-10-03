"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { Hash, Search, Volume2, X } from "lucide-react"
import { toast } from "react-toastify"
import { discord, errorMessage, useDemo } from "@/lib/demo/store"
import type { ChannelType } from "@/lib/demo/types"
import { cn } from "@/lib/utils"
import { serverInitials } from "./utils"

function Shell({
  open,
  onOpenChange,
  title,
  description,
  children,
  wide,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  wide?: boolean
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-black/70" />
        <Dialog.Content
          className={cn(
            "fixed top-1/2 left-1/2 z-[61] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 text-card-foreground shadow-2xl outline-none",
            wide ? "max-w-2xl" : "max-w-md",
          )}
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <Dialog.Title className="text-xl font-bold text-balance">{title}</Dialog.Title>
              {description ? <Dialog.Description className="mt-1 text-sm text-muted-foreground">{description}</Dialog.Description> : null}
            </div>
            <Dialog.Close className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Close">
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const inputClass =
  "h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
const labelClass = "mb-1.5 block text-xs font-bold uppercase tracking-wide text-muted-foreground"
const primaryBtn =
  "inline-flex h-10 items-center justify-center rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"

export function CreateServerDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const server = discord.createServer({ name, description })
      toast.success(`Created ${server.name}`)
      setName("")
      setDescription("")
      onOpenChange(false)
      router.push(`/channels/${server.id}`)
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  return (
    <Shell open={open} onOpenChange={onOpenChange} title="Create a server" description="Your server is where you and your study group hang out.">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="server-name" className={labelClass}>Server name</label>
          <input id="server-name" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="e.g. OS Exam Prep" maxLength={40} required autoFocus />
        </div>
        <div>
          <label htmlFor="server-desc" className={labelClass}>Description</label>
          <input id="server-desc" value={description} onChange={(e) => setDescription(e.target.value)} className={inputClass} placeholder="What is this server about?" maxLength={160} />
        </div>
        <div className="flex justify-end gap-2">
          <Dialog.Close className="h-10 rounded-md px-4 text-sm font-medium hover:underline">Cancel</Dialog.Close>
          <button type="submit" className={primaryBtn} disabled={name.trim().length < 2}>Create</button>
        </div>
      </form>
    </Shell>
  )
}

export function CreateChannelDialog({
  serverId,
  open,
  onOpenChange,
}: {
  serverId: string
  open: boolean
  onOpenChange: (o: boolean) => void
}) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [type, setType] = useState<ChannelType>("text")

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const channel = discord.createChannel(serverId, { name, type })
      setName("")
      onOpenChange(false)
      if (channel.type === "text") router.push(`/channels/${serverId}/${channel.id}`)
    } catch (err) {
      toast.error(errorMessage(err))
    }
  }

  return (
    <Shell open={open} onOpenChange={onOpenChange} title="Create channel">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <fieldset>
          <legend className={labelClass}>Channel type</legend>
          <div className="flex flex-col gap-2">
            {(["text", "voice"] as const).map((t) => (
              <label
                key={t}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-md border px-3 py-2.5 transition-colors",
                  type === t ? "border-primary bg-primary/10" : "border-border hover:bg-secondary",
                )}
              >
                <input type="radio" name="channel-type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                {t === "text" ? <Hash className="size-5 text-muted-foreground" aria-hidden /> : <Volume2 className="size-5 text-muted-foreground" aria-hidden />}
                <span className="flex flex-col">
                  <span className="text-sm font-semibold">{t === "text" ? "Text" : "Voice"}</span>
                  <span className="text-xs text-muted-foreground">
                    {t === "text" ? "Send messages, links and opinions" : "Hang out together with voice"}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="channel-name" className={labelClass}>Channel name</label>
          <div className="relative">
            {type === "text" ? <Hash className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden /> : <Volume2 className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />}
            <input id="channel-name" value={name} onChange={(e) => setName(e.target.value)} className={cn(inputClass, "pl-9")} placeholder="new-channel" maxLength={32} required autoFocus />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Dialog.Close className="h-10 rounded-md px-4 text-sm font-medium hover:underline">Cancel</Dialog.Close>
          <button type="submit" className={primaryBtn} disabled={!name.trim()}>Create Channel</button>
        </div>
      </form>
    </Shell>
  )
}

export function ExploreServersDialog({ meId, open, onOpenChange }: { meId: string; open: boolean; onOpenChange: (o: boolean) => void }) {
  const router = useRouter()
  const servers = useDemo((s) => s.servers)
  const [q, setQ] = useState("")
  const filtered = useMemo(
    () => servers.filter((s) => `${s.name} ${s.description}`.toLowerCase().includes(q.trim().toLowerCase())),
    [servers, q],
  )

  return (
    <Shell open={open} onOpenChange={onOpenChange} title="Discover servers" description="Find communities on your campus." wide>
      <div className="relative mb-4">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search servers" aria-label="Search servers" className={cn(inputClass, "pl-9")} />
      </div>
      <ul className="grid max-h-[55vh] grid-cols-1 gap-3 overflow-y-auto sm:grid-cols-2">
        {filtered.map((s) => {
          const joined = s.memberIds.includes(meId)
          return (
            <li key={s.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-background">
              <div className="h-14" style={{ backgroundColor: s.color }} aria-hidden />
              <div className="-mt-6 flex flex-1 flex-col gap-2 p-4 pt-0">
                <span
                  className="flex size-12 items-center justify-center rounded-2xl border-4 border-background text-sm font-bold text-white"
                  style={{ backgroundColor: s.color }}
                  aria-hidden
                >
                  {serverInitials(s.name)}
                </span>
                <p className="font-semibold">{s.name}</p>
                <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{s.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.memberIds.length} members</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (!joined) {
                        discord.joinServer(s.id)
                        toast.success(`Joined ${s.name}`)
                      }
                      onOpenChange(false)
                      router.push(`/channels/${s.id}`)
                    }}
                    className={cn(
                      "h-8 rounded-md px-3 text-xs font-semibold",
                      joined ? "bg-secondary text-foreground hover:bg-secondary/80" : "bg-success text-white hover:bg-success/90",
                    )}
                  >
                    {joined ? "Open" : "Join"}
                  </button>
                </div>
              </div>
            </li>
          )
        })}
        {filtered.length === 0 ? <li className="col-span-full py-8 text-center text-sm text-muted-foreground">No servers match.</li> : null}
      </ul>
    </Shell>
  )
}
