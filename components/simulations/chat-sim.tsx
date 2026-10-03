"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Avatar, SimFrame } from "./sim-frame"

type Message = { id: number; author: string; initials: string; text: string; me?: boolean }

const SEED: Message[] = [
  { id: 1, author: "Priya", initials: "PR", text: "I have an ADXL345 from last semester's lab. Can we use it?" },
  { id: 2, author: "Rahul", initials: "RA", text: "Yes — ESP32 can read it over I2C. I'll push the firmware sketch tonight." },
]

export function ChatSim() {
  const [messages, setMessages] = useState<Message[]>(SEED)
  const [draft, setDraft] = useState("")

  const send = () => {
    const text = draft.trim()
    if (!text) return
    setMessages((m) => [...m, { id: Date.now(), author: "You", initials: "YO", text, me: true }])
    setDraft("")
  }

  return (
    <SimFrame id="chat" index="05" title="Group discussion" description="Each goal has a focused thread, so conversations stay attached to the work.">
      <div className="flex flex-col overflow-hidden rounded-xl border border-border">
        <div className="flex items-center justify-between border-b border-border bg-muted px-4 py-2.5">
          <p className="text-sm font-medium text-foreground"># iot-vib-24</p>
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="size-2 rounded-full bg-success" aria-hidden /> 3 online
          </span>
        </div>
        <ul className="flex h-72 flex-col gap-3 overflow-y-auto p-4" aria-live="polite" aria-label="Messages">
          {messages.map((m) => (
            <li key={m.id} className={cn("flex items-end gap-2", m.me && "flex-row-reverse")}>
              <Avatar initials={m.initials} className={cn("size-8", m.me && "bg-primary text-primary-foreground")} />
              <div className={cn("max-w-[75%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed", m.me ? "rounded-br-sm bg-primary text-primary-foreground" : "rounded-bl-sm bg-secondary text-secondary-foreground")}>
                {!m.me && <p className="mb-0.5 text-xs font-semibold opacity-70">{m.author}</p>}
                {m.text}
              </div>
            </li>
          ))}
        </ul>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send()
          }}
          className="flex gap-2 border-t border-border p-3"
        >
          <label htmlFor="chat-input" className="sr-only">Message</label>
          <input
            id="chat-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.nativeEvent.isComposing || e.keyCode === 229)) e.preventDefault()
            }}
            placeholder="Write a message…"
            className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-accent"
          />
          <Button type="submit" disabled={!draft.trim()} aria-label="Send message">
            <Send aria-hidden />
          </Button>
        </form>
      </div>
    </SimFrame>
  )
}
