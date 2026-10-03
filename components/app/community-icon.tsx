import { Book, Brain, Code, FlaskConical, Globe, Palette, Sparkles, Trophy, Users, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const ICONS: Record<string, LucideIcon> = {
  code: Code,
  globe: Globe,
  brain: Brain,
  trophy: Trophy,
  book: Book,
  sparkles: Sparkles,
  flask: FlaskConical,
  palette: Palette,
  users: Users,
}

const COLORS: Record<string, string> = {
  blue: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  cyan: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400",
  violet: "bg-violet-500/15 text-violet-600 dark:text-violet-400",
  amber: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  green: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  rose: "bg-rose-500/15 text-rose-600 dark:text-rose-400",
  teal: "bg-teal-500/15 text-teal-600 dark:text-teal-400",
  pink: "bg-pink-500/15 text-pink-600 dark:text-pink-400",
}

export const COMMUNITY_ICON_KEYS = Object.keys(ICONS)
export const COMMUNITY_COLOR_KEYS = Object.keys(COLORS)

export function CommunityIcon({ icon, color, className }: { icon: string; color: string; className?: string }) {
  const Icon = ICONS[icon] ?? Users
  return (
    <span
      aria-hidden="true"
      className={cn("inline-flex size-8 shrink-0 items-center justify-center rounded-lg", COLORS[color] ?? COLORS.blue, className)}
    >
      <Icon className="size-[55%]" />
    </span>
  )
}
