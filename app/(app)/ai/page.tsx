"use client"

import { useState, useRef, useEffect } from "react"
import { Bot, Send, Sparkles, RotateCcw, BookOpen, Code2, Brain, Zap, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const QUICK_PROMPTS = [
  { icon: Brain, text: "Explain recursion with a simple example" },
  { icon: Code2, text: "Debug my Python code: def fib(n): return fib(n-1) + fib(n-2)" },
  { icon: BookOpen, text: "Help me plan a study schedule for exams" },
  { icon: Zap, text: "What hackathon project ideas are trending?" },
]

const WELCOME_MESSAGES: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: `Hey there! 👋 I'm **Hub**, your AI Study Buddy on AcadHub.

I can help you with:
- 📚 **Understanding concepts** — explain anything in simple terms
- 💻 **Code debugging** — find bugs and suggest fixes  
- 🏆 **Hackathon prep** — brainstorm ideas and plan projects
- 📅 **Study planning** — create effective schedules
- 🤝 **Finding collaborators** — suggest communities to join

What would you like to explore today?`,
    timestamp: new Date(),
  },
]

// Free Gemini API via fetch (uses NEXT_PUBLIC_GEMINI_API_KEY if available, else demo mode)
async function callGeminiFree(messages: Message[]): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
  if (!apiKey) {
    // Demo mode — no real API needed
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 600))
    const lastMsg = messages[messages.length - 1].content.toLowerCase()

    if (lastMsg.includes("recursion") || lastMsg.includes("fib")) {
      return `Great question! **Recursion** is when a function calls itself to solve a smaller version of the same problem.

\`\`\`python
def factorial(n):
    # Base case: stop the recursion
    if n <= 1:
        return 1
    # Recursive case: n! = n × (n-1)!
    return n * factorial(n - 1)

print(factorial(5))  # 5 × 4 × 3 × 2 × 1 = 120
\`\`\`

**Key rule:** Always have a base case, or it runs forever! 🔁

Think of it like looking up a word in a dictionary — if the definition uses another word you don't know, you look that up too, until you find a word you understand. That final word is your "base case"!`
    }

    if (lastMsg.includes("hackathon") || lastMsg.includes("project idea")) {
      return `Here are some trending hackathon ideas for 2026 🚀

**AI/ML Track:**
- Crop disease detection using phone camera + ML
- Student mental health check-in bot
- Personalized learning path generator

**IoT Track:**
- Smart energy monitoring for college hostels
- Attendance system with facial recognition
- Campus safety alert system

**Social Impact:**
- Scholarship finder for rural students  
- Local language learning app

**Frugal Innovation (perfect for AcadHub!):**
- Skill-sharing marketplace with barter system
- Campus resource booking with zero cost

Which direction interests you most? I can help you dive deeper! 🎯`
    }

    if (lastMsg.includes("study") || lastMsg.includes("schedule") || lastMsg.includes("exam")) {
      return `Here's an effective study schedule framework for exams 📚

**The Pomodoro-Based Plan:**
\`\`\`
Morning (6 AM – 12 PM):
  ✅ 25 min: Study hardest subject
  ✅  5 min: Short break
  ✅ Repeat × 4 blocks

Afternoon (2 PM – 6 PM):
  ✅ Practice problems + past papers
  ✅ Group study for tricky concepts

Evening (7 PM – 9 PM):
  ✅ Review notes from today
  ✅ Make flashcards for tomorrow
\`\`\`

**Top tips:**
1. Study the hardest topic when your brain is freshest (morning)
2. Teach concepts to someone — if you can explain it, you know it
3. Use spaced repetition — review after 1 day, 3 days, 1 week
4. Sleep 7–8 hours — memory consolidates during sleep!

Need a custom schedule for specific subjects? Tell me what exams you have! 🎯`
    }

    if (lastMsg.includes("debug") || lastMsg.includes("error") || lastMsg.includes("code")) {
      return `I spotted the issue! Your Fibonacci function is missing a **base case** ⚠️

\`\`\`python
# ❌ This runs forever (stack overflow!)
def fib(n):
    return fib(n-1) + fib(n-2)

# ✅ Fixed with base cases
def fib(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fib(n-1) + fib(n-2)

# 🚀 Even better — memoized for performance
from functools import lru_cache

@lru_cache(maxsize=None)
def fib_fast(n):
    if n <= 1:
        return n
    return fib_fast(n-1) + fib_fast(n-2)

print(fib_fast(100))  # Instantly fast!
\`\`\`

Without base cases, recursion never stops and crashes. The \`@lru_cache\` version is much faster for large inputs too! 💡`
    }

    return `That's a great question! Here's what I know about **"${messages[messages.length - 1].content}"**:

This is a topic with many interesting aspects to explore. Let me break it down for you:

1. **Core concept** — Understanding the fundamentals is key. Start with the basics before moving to advanced material.

2. **Practical application** — Try implementing what you learn with small projects. Hands-on practice accelerates learning significantly.

3. **Community learning** — AcadHub has communities where students discuss this topic. Check out the **Explore** section to find relevant groups!

4. **Resources** — Look for open courseware (MIT OCW, NPTEL) for structured learning on this topic.

Want me to explain any specific aspect in more detail? Or would you like help finding collaborators on AcadHub for a related project? 🚀

> 💡 *Note: Set \`NEXT_PUBLIC_GEMINI_API_KEY\` in your .env to enable full AI responses via Google Gemini.*`
  }

  // Real Gemini API call
  const history = messages.slice(-10).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }))

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [
            {
              text: "You are Hub, a friendly AI study buddy for college students on AcadHub Campus Connect. Help with studying, coding, projects, and collaboration. Keep answers clear, practical, and encouraging. Use markdown formatting.",
            },
          ],
        },
        contents: history,
        generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
      }),
    },
  )

  if (!res.ok) throw new Error(`Gemini API error: ${res.statusText}`)
  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I had trouble generating a response. Please try again."
}

function MarkdownText({ text }: { text: string }) {
  // Simple inline markdown renderer
  const rendered = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`([^`]+)`/g, "<code class='rounded bg-secondary px-1 py-0.5 font-mono text-xs text-foreground'>$1</code>")
    .replace(/^## (.+)$/gm, "<h3 class='font-semibold text-foreground mt-3 mb-1'>$1</h3>")
    .replace(/^### (.+)$/gm, "<h4 class='font-medium text-foreground mt-2 mb-1'>$1</h4>")
    .replace(/^- (.+)$/gm, "<li class='ml-4 list-disc text-sm'>$1</li>")
    .replace(/^\d+\. (.+)$/gm, "<li class='ml-4 list-decimal text-sm'>$1</li>")
    .replace(/^> (.+)$/gm, "<blockquote class='border-l-2 border-primary/40 pl-3 text-muted-foreground italic text-sm'>$1</blockquote>")
    .replace(/```(\w*)\n([\s\S]*?)```/g, "<pre class='overflow-x-auto rounded-xl bg-code text-code-foreground p-4 font-mono text-xs my-2 leading-relaxed'><code>$2</code></pre>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")

  return (
    <div
      className="prose prose-sm max-w-none text-sm leading-relaxed [&_strong]:font-semibold [&_strong]:text-foreground [&_code]:font-mono"
      dangerouslySetInnerHTML={{ __html: rendered }}
    />
  )
}

export default function AIPage() {
  const [messages, setMessages] = useState<Message[]>(WELCOME_MESSAGES)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const send = async (text?: string) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content, timestamp: new Date() }
    setMessages((m) => [...m, userMsg])
    setInput("")
    setLoading(true)
    setError(null)

    try {
      const allMsgs = [...messages, userMsg]
      const reply = await callGeminiFree(allMsgs)
      const assistantMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: reply, timestamp: new Date() }
      setMessages((m) => [...m, assistantMsg])
    } catch (e) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const reset = () => {
    setMessages(WELCOME_MESSAGES)
    setInput("")
    setError(null)
  }

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex h-[calc(100dvh-3.5rem)] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md">
            <Bot className="size-5 text-white" aria-hidden />
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full border-2 border-background bg-green-400" aria-hidden />
          </div>
          <div>
            <p className="font-semibold text-foreground leading-tight">Hub</p>
            <p className="text-xs text-muted-foreground">
              AI Study Buddy ·{" "}
              <span className="text-green-500">Online</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent sm:block">
            Powered by Gemini
          </span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex size-9 items-center justify-center rounded-xl border border-border/60 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            aria-label="Start new conversation"
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="mx-auto max-w-2xl space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-xl",
                  msg.role === "assistant"
                    ? "bg-gradient-to-br from-primary to-accent shadow-md"
                    : "bg-secondary border border-border/60",
                )}
              >
                {msg.role === "assistant" ? (
                  <Sparkles className="size-4 text-white" aria-hidden />
                ) : (
                  <span className="text-xs font-bold text-foreground">U</span>
                )}
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-3 shadow-sm",
                  msg.role === "assistant"
                    ? "rounded-tl-sm bg-card border border-border/60"
                    : "rounded-tr-sm bg-primary text-primary-foreground",
                )}
              >
                {msg.role === "assistant" ? (
                  <MarkdownText text={msg.content} />
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
                <p className={cn("mt-1.5 text-[10px]", msg.role === "assistant" ? "text-muted-foreground" : "text-primary-foreground/60")}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-md">
                <Sparkles className="size-4 text-white animate-pulse" aria-hidden />
              </div>
              <div className="rounded-2xl rounded-tl-sm bg-card border border-border/60 px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="size-2 rounded-full bg-muted-foreground/40 wave-bar"
                      style={{ animationDelay: `${i * 0.15}s` }}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Quick prompts */}
      {messages.length <= 1 && (
        <div className="border-t border-border/60 px-4 py-3 sm:px-6">
          <div className="mx-auto max-w-2xl">
            <p className="mb-2 text-xs font-medium text-muted-foreground">Quick prompts:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_PROMPTS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => send(text)}
                  className="flex items-center gap-1.5 rounded-xl border border-border/60 bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground hover:bg-secondary"
                >
                  <Icon className="size-3.5 shrink-0 text-accent" aria-hidden />
                  {text.length > 40 ? text.slice(0, 40) + "…" : text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t border-border/60 bg-background/90 px-4 py-4 backdrop-blur sm:px-6">
        <div className="mx-auto max-w-2xl">
          <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card px-4 py-2 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all shadow-sm">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Hub anything... (Enter to send, Shift+Enter for new line)"
              rows={1}
              className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent py-1.5 text-sm outline-none placeholder:text-muted-foreground"
              aria-label="Message Hub"
              style={{ height: "auto" }}
              onInput={(e) => {
                const t = e.currentTarget
                t.style.height = "auto"
                t.style.height = `${Math.min(t.scrollHeight, 128)}px`
              }}
            />
            <button
              type="button"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              className={cn(
                "mb-1 flex size-9 shrink-0 items-center justify-center rounded-xl transition-all",
                input.trim() && !loading
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                  : "bg-secondary text-muted-foreground cursor-not-allowed",
              )}
              aria-label="Send message"
            >
              <Send className="size-4" aria-hidden />
            </button>
          </div>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            Hub can make mistakes. Set{" "}
            <code className="font-mono">NEXT_PUBLIC_GEMINI_API_KEY</code> for full AI responses.
          </p>
        </div>
      </div>
    </div>
  )
}
