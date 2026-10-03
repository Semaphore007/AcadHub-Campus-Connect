import Link from "next/link"
import { useId } from "react"
import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  const gradientId = `acadhub-mark-${useId().replaceAll(":", "")}`

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="AcadHub"
      className={cn("size-10 shrink-0 drop-shadow-sm", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="5" y1="4" x2="43" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-logo-from)" />
          <stop offset="1" stopColor="var(--brand-logo-to)" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="15" fill={`url(#${gradientId})`} />
      <path d="m8 15 16-7 16 7-16 7-16-7Z" fill="var(--brand-logo-cap)" />
      <path d="m13 18.5 11 4.8 11-4.8v3.7c0 4.7-4.9 8.5-11 8.5s-11-3.8-11-8.5v-3.7Z" fill="var(--brand-logo-cap)" />
      <path d="M38 16v9" stroke="var(--brand-logo-cap)" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="38" cy="27" r="2" fill="var(--brand-logo-cap)" />
      <path
        d="M11 30.5c0-2.5 2-4.5 4.5-4.5h17c2.5 0 4.5 2 4.5 4.5v3.2c0 2.5-2 4.5-4.5 4.5H24l-5.2 3.1c-.8.5-1.8-.1-1.8-1v-2.1h-1.5c-2.5 0-4.5-2-4.5-4.5v-3.2Z"
        fill="var(--brand-logo-bubble)"
      />
      <circle cx="20" cy="32.5" r="1.5" fill="var(--brand-logo-dot)" />
      <circle cx="24" cy="32.5" r="1.5" fill="var(--brand-logo-dot)" />
      <circle cx="28" cy="32.5" r="1.5" fill="var(--brand-logo-dot)" />
    </svg>
  )
}

export function Brand({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring", className)}
      aria-label="AcadHub — Campus Connect, home"
    >
      <BrandMark className={cn("transition-transform duration-200 group-hover:scale-[1.04]", compact ? "size-9" : "size-12")} />
      <span className={cn("ml-2 flex min-w-0 flex-col gap-0.5 leading-none", compact && "hidden sm:flex")}>
        <span className="bg-gradient-to-r from-[#10294f] via-primary to-[#1764db] bg-clip-text text-base font-black tracking-tight text-transparent dark:from-[#e7f0ff] dark:via-[#9bbcff] dark:to-[#c9a7ff]">
          AcadHub
        </span>
        <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Campus Connect</span>
      </span>
    </Link>
  )
}
