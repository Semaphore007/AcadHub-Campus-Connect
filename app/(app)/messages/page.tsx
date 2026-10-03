"use client"

import { useState, useRef, useEffect } from "react"
import {
  Check,
  ChevronLeft,
  File,
  ImageIcon,
  Mic,
  MicOff,
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  SmilePlus,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  senderId: string
  text?: string
  type: "text" | "voice" | "image" | "file"
  duration?: number // for voice
  fileName?: string // for file/image
  timestamp: Date
  read: boolean
}

interface Conversation {
  id: string
  name: string
  avatar: string
  lastMsg: string
  lastTime: string
  unread: number
  online: boolean
  isGroup?: boolean
}

const CONVERSATIONS: Conversation[] = [
  { id: "1", name: "Arjun Sharma", avatar: "AS", lastMsg: "Sure, I'll add the MQTT broker code tonight", lastTime: "2m", unread: 2, online: true },
  { id: "2", name: "IoT Vibration Monitor", avatar: "🔌", lastMsg: "Priya: Sensor readings look good!", lastTime: "15m", unread: 0, online: true, isGroup: true },
  { id: "3", name: "Priya Nair", avatar: "PN", lastMsg: "Can you review my PR?", lastTime: "1h", unread: 1, online: true },
  { id: "4", name: "SIH 2026 Team", avatar: "⚡", lastMsg: "Meeting tomorrow at 10AM", lastTime: "3h", unread: 5, online: false, isGroup: true },
  { id: "5", name: "Rishi Dev", avatar: "RD", lastMsg: "Thanks for the graph tips!", lastTime: "Yesterday", unread: 0, online: false },
  { id: "6", name: "DSA Study Group", avatar: "🏆", lastMsg: "Today's problem: #2392", lastTime: "Yesterday", unread: 0, online: false, isGroup: true },
]

const INITIAL_MESSAGES: Message[] = [
  { id: "1", senderId: "other", text: "Hey! Are you working on the MQTT broker for our IoT project?", type: "text", timestamp: new Date(Date.now() - 3600000), read: true },
  { id: "2", senderId: "me", text: "Yeah, almost done. The sensor readings are streaming now.", type: "text", timestamp: new Date(Date.now() - 3500000), read: true },
  { id: "3", senderId: "other", type: "voice", duration: 12, timestamp: new Date(Date.now() - 3400000), read: true },
  { id: "4", senderId: "me", text: "Got your voice message. Makes sense. I'll push the dashboard code tonight.", type: "text", timestamp: new Date(Date.now() - 3300000), read: true },
  { id: "5", senderId: "other", type: "file", fileName: "esp32_vibration_code.ino", timestamp: new Date(Date.now() - 3000000), read: true },
  { id: "6", senderId: "other", text: "Sure, I'll add the MQTT broker code tonight", type: "text", timestamp: new Date(Date.now() - 120000), read: false },
]

function Avatar({ label, online, size = "md" }: { label: string; online?: boolean; size?: "sm" | "md" | "lg" }) {
  const isEmoji = /\p{Emoji}/u.test(label)
  const sizeClass = size === "sm" ? "size-8 text-xs" : size === "lg" ? "size-12 text-base" : "size-10 text-sm"
  return (
    <div className="relative shrink-0">
      <div className={cn("flex items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-accent/80 font-bold text-white", sizeClass)}>
        {label}
      </div>
      {online !== undefined && (
        <span className={cn("absolute bottom-0 right-0 rounded-full border-2 border-background", size === "sm" ? "size-2" : "size-2.5", online ? "bg-green-400" : "bg-border/60")} aria-label={online ? "Online" : "Offline"} />
      )}
    </div>
  )
}

function VoiceMessage({ duration, sent }: { duration: number; sent: boolean }) {
  const [playing, setPlaying] = useState(false)
  return (
    <div className={cn("flex items-center gap-3 rounded-2xl px-4 py-3", sent ? "bg-primary text-primary-foreground" : "bg-secondary")}>
      <button
        type="button"
        onClick={() => setPlaying((p) => !p)}
        aria-label={playing ? "Pause voice message" : "Play voice message"}
        className={cn("flex size-8 items-center justify-center rounded-full", sent ? "bg-white/20 hover:bg-white/30" : "bg-primary/10 hover:bg-primary/20")}
      >
        {playing ? <MicOff className="size-4" /> : <Mic className="size-4" />}
      </button>
      {/* Waveform bars */}
      <div className="flex items-center gap-0.5" aria-hidden>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={cn("w-0.5 rounded-full transition-all", sent ? "bg-white/70" : "bg-primary/50")}
            style={{ height: `${8 + Math.sin(i * 0.8) * 8 + Math.random() * 4}px` }}
          />
        ))}
      </div>
      <span className={cn("shrink-0 font-mono text-xs", sent ? "text-primary-foreground/70" : "text-muted-foreground")}>
        0:{String(duration).padStart(2, "0")}
      </span>
    </div>
  )
}

export default function MessagesPage() {
  const [selected, setSelected] = useState<Conversation | null>(CONVERSATIONS[0])
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [text, setText] = useState("")
  const [mobileView, setMobileView] = useState<"list" | "chat">("list")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMsg = () => {
    if (!text.trim()) return
    setMessages((m) => [...m, { id: crypto.randomUUID(), senderId: "me", text: text.trim(), type: "text", timestamp: new Date(), read: false }])
    setText("")
    // Simulate reply
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), senderId: "other", text: "Got it! I'll check it out.", type: "text", timestamp: new Date(), read: false },
      ])
    }, 1200)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMsg() }
  }

  const selectConvo = (c: Conversation) => {
    setSelected(c)
    setMobileView("chat")
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] overflow-hidden">
      {/* Sidebar: conversation list */}
      <aside className={cn("flex w-full flex-col border-r border-border/60 md:w-72 lg:w-80", mobileView === "chat" ? "hidden md:flex" : "flex")}>
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <h1 className="text-lg font-bold text-foreground">Messages</h1>
        </div>
        {/* Search */}
        <div className="relative px-3 py-2.5 border-b border-border/60">
          <Search className="pointer-events-none absolute left-6 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input
            type="search"
            placeholder="Search conversations…"
            className="h-9 w-full rounded-xl border border-border/60 bg-secondary/50 pl-8 pr-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        {/* Conversations */}
        <ul className="flex flex-col overflow-y-auto">
          {CONVERSATIONS.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => selectConvo(c)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/60",
                  selected?.id === c.id && "bg-primary/8 border-r-2 border-primary",
                )}
              >
                <Avatar label={c.avatar} online={c.online} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-foreground">{c.name}</span>
                    <span className="shrink-0 text-[10px] text-muted-foreground">{c.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-xs text-muted-foreground">{c.lastMsg}</p>
                    {c.unread > 0 && (
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {c.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Chat area */}
      {selected ? (
        <div className={cn("flex flex-1 flex-col", mobileView === "list" ? "hidden md:flex" : "flex")}>
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-border/60 bg-background/90 px-4 py-3 backdrop-blur">
            <button type="button" onClick={() => setMobileView("list")} className="md:hidden text-muted-foreground hover:text-foreground transition-colors" aria-label="Back">
              <ChevronLeft className="size-5" />
            </button>
            <Avatar label={selected.avatar} online={selected.online} />
            <div className="flex flex-1 flex-col">
              <span className="font-semibold text-foreground">{selected.name}</span>
              <span className="text-xs text-muted-foreground">{selected.online ? "Online" : "Last seen recently"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" aria-label="Voice call" className="size-9 flex items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Phone className="size-4" />
              </button>
              <button type="button" aria-label="Video call" className="size-9 flex items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <Video className="size-4" />
              </button>
              <button type="button" aria-label="More options" className="size-9 flex items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                <MoreVertical className="size-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
            {messages.map((msg) => {
              const sent = msg.senderId === "me"
              return (
                <div key={msg.id} className={cn("flex gap-2", sent ? "flex-row-reverse" : "flex-row")}>
                  {!sent && <Avatar label={selected.avatar} size="sm" />}
                  <div className={cn("flex max-w-[70%] flex-col gap-1", sent ? "items-end" : "items-start")}>
                    {msg.type === "text" && (
                      <div className={cn("rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm", sent ? "rounded-tr-sm bg-primary text-primary-foreground" : "rounded-tl-sm bg-card border border-border/60")}>
                        {msg.text}
                      </div>
                    )}
                    {msg.type === "voice" && <VoiceMessage duration={msg.duration!} sent={sent} />}
                    {(msg.type === "file") && (
                      <div className={cn("flex items-center gap-2.5 rounded-2xl px-4 py-3 text-sm shadow-sm", sent ? "bg-primary text-primary-foreground" : "bg-card border border-border/60")}>
                        <File className="size-5 shrink-0" />
                        <span className="font-medium">{msg.fileName}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 px-1">
                      <span className="text-[10px] text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      {sent && <Check className={cn("size-3", msg.read ? "text-primary" : "text-muted-foreground")} aria-hidden />}
                    </div>
                  </div>
                </div>
              )
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input bar */}
          <div className="border-t border-border/60 bg-background/90 px-4 py-3 backdrop-blur">
            <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card px-3 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <button type="button" aria-label="Attach file" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                <Paperclip className="size-5" />
              </button>
              <button type="button" aria-label="Attach image" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                <ImageIcon className="size-5" />
              </button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Message…"
                rows={1}
                className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground"
                aria-label="Message input"
                onInput={(e) => {
                  const t = e.currentTarget
                  t.style.height = "auto"
                  t.style.height = `${Math.min(t.scrollHeight, 128)}px`
                }}
              />
              <button type="button" aria-label="Send voice message" className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                <Mic className="size-5" />
              </button>
              <button
                type="button"
                onClick={sendMsg}
                disabled={!text.trim()}
                aria-label="Send message"
                className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl transition-all", text.trim() ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md" : "bg-secondary text-muted-foreground cursor-not-allowed")}
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden flex-1 items-center justify-center text-muted-foreground md:flex">
          <p className="text-sm">Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  )
}
