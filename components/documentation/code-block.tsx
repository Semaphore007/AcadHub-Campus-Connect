"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { cn } from "@/lib/utils"

export function CopyButton({ value, className, label = "Copy code" }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {
          setCopied(false)
        }
      }}
      aria-label={copied ? "Copied" : label}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-xs text-code-foreground/70 transition-colors hover:bg-white/10 hover:text-code-foreground",
        className,
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
      <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
    </button>
  )
}

export function CodeBlock({ code, language = "bash", title }: { code: string; language?: string; title?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-code text-code-foreground">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <figcaption className="font-mono text-xs text-code-foreground/60">{title ?? language}</figcaption>
        <CopyButton value={code} />
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        <code>{code}</code>
      </pre>
    </figure>
  )
}
