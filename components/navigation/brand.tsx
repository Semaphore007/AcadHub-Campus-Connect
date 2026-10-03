import Link from "next/link"
import { useId } from "react"
import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  const uid = useId().replaceAll(":", "")
  const gradientId = `acadhub-mark-${uid}`
  const glossId = `acadhub-gloss-${uid}`

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="AcadHub"
      className={cn("size-10 shrink-0 drop-shadow-md", className)}
    >
      <defs>
        <linearGradient id={gradientId} x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="var(--brand-logo-from)" />
          <stop offset="0.55" stopColor="var(--brand-logo-via)" />
          <stop offset="1" stopColor="var(--brand-logo-to)" />
        </linearGradient>
        <linearGradient id={glossId} x1="24" y1="2" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill={`url(#${gradientId})`} />
      <rect x="2" y="2" width="44" height="22" rx="14" fill={`url(#${glossId})`} />
      <rect x="2.5" y="2.5" width="43" height="43" rx="13.5" fill="none" stroke="#ffffff" strokeOpacity="0.25" />
      <path
        d="M14.5 21.5Q24 18.5 33.5 21.5L36.8 32.6Q35.6 37.2 31.2 37.4L29.2 34.4Q24 35.9 18.8 34.4L16.8 37.4Q12.4 37.2 11.2 32.6Z"
        fill="var(--brand-logo-cap)"
      />
      <ellipse cx="19.6" cy="28.2" rx="2.5" ry="2.9" fill="var(--brand-logo-via)" />
      <ellipse cx="28.4" cy="28.2" rx="2.5" ry="2.9" fill="var(--brand-logo-via)" />
      <path d="M17 15.5V19.6Q24 23 31 19.6V15.5Z" fill="var(--brand-logo-capshade)" />
      <path d="M24 7.5 39 13 24 18.5 9 13Z" fill="var(--brand-logo-cap)" />
      <path d="M24 13 35.6 14.6V21" fill="none" stroke="var(--brand-logo-bubble)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="13" r="1.6" fill="var(--brand-logo-via)" />
      <path d="M34.2 21h2.8l.6 3.4h-4Z" fill="var(--brand-logo-bubble)" />
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
