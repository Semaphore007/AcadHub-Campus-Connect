"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import * as Dialog from "@radix-ui/react-dialog"
import { CornerDownLeft, FileText, Hash, Layers, PlayCircle, Search, Sparkles } from "lucide-react"
import { SEARCH_INDEX, type SearchEntry } from "@/data/documentation/search-index"
import { cn } from "@/lib/utils"

const KIND_ICON = { Page: FileText, Section: Hash, Feature: Sparkles, Technology: Layers, Simulation: PlayCircle }

export function SearchCommand({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [active, setActive] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SEARCH_INDEX.slice(0, 12)
    return SEARCH_INDEX.filter((e) => `${e.title} ${e.kind} ${e.keywords ?? ""}`.toLowerCase().includes(q)).slice(0, 20)
  }, [query])

  const go = (entry: SearchEntry) => {
    setOpen(false)
    setQuery("")
    router.push(entry.href)
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o)
        if (!o) setQuery("")
        setActive(0)
      }}
    >
      <Dialog.Trigger asChild>
        {compact ? (
          <button
            type="button"
            aria-label="Search documentation"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-border hover:bg-secondary"
          >
            <Search className="size-4" aria-hidden />
          </button>
        ) : (
          <button
            type="button"
            className="inline-flex h-9 w-56 items-center gap-2 rounded-lg border border-border bg-muted px-3 text-sm text-muted-foreground transition-colors hover:border-accent/40 hover:text-foreground"
          >
            <Search className="size-4" aria-hidden />
            <span className="flex-1 text-left">Search docs...</span>
            <kbd className="rounded border border-border bg-background px-1.5 font-mono text-[10px]">Ctrl K</kbd>
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-[12vh] z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
          <Dialog.Title className="sr-only">Search AcadHub documentation</Dialog.Title>
          <Dialog.Description className="sr-only">Filter pages, sections, features, technologies and simulations.</Dialog.Description>
          <div className="flex items-center gap-2 border-b border-border px-4">
            <Search className="size-4 text-muted-foreground" aria-hidden />
            <input
              autoFocus
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setActive(0)
              }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault()
                  setActive((a) => Math.min(a + 1, results.length - 1))
                } else if (e.key === "ArrowUp") {
                  e.preventDefault()
                  setActive((a) => Math.max(a - 1, 0))
                } else if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229 && results[active]) {
                  go(results[active])
                }
              }}
              placeholder="Search pages, features, simulations..."
              aria-label="Search"
              aria-controls="search-results"
              aria-activedescendant={results[active] ? `search-${active}` : undefined}
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            <kbd className="rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">Esc</kbd>
          </div>
          <ul id="search-results" role="listbox" className="max-h-[50vh] overflow-y-auto p-2">
            {results.length === 0 && (
              <li className="px-3 py-10 text-center text-sm text-muted-foreground">
                No results for {"\u201C"}
                {query}
                {"\u201D"}. Try {"\u201C"}simulation{"\u201D"} or {"\u201C"}API{"\u201D"}.
              </li>
            )}
            {results.map((entry, i) => {
              const Icon = KIND_ICON[entry.kind]
              return (
                <li
                  key={entry.href + entry.title}
                  id={`search-${i}`}
                  role="option"
                  aria-selected={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(entry)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm",
                    i === active ? "bg-secondary text-secondary-foreground" : "text-foreground",
                  )}
                >
                  <Icon className="size-4 text-muted-foreground" aria-hidden />
                  <span className="flex-1">{entry.title}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{entry.kind}</span>
                  {i === active && <CornerDownLeft className="size-3.5 text-muted-foreground" aria-hidden />}
                </li>
              )
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
