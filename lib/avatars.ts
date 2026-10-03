export const AVATAR_PRESETS = [
  { id: "aurora", label: "Aurora", from: "#6366f1", to: "#22d3ee" },
  { id: "sunset", label: "Sunset", from: "#f97316", to: "#ec4899" },
  { id: "forest", label: "Forest", from: "#10b981", to: "#84cc16" },
  { id: "ocean", label: "Ocean", from: "#0ea5e9", to: "#1e3a8a" },
  { id: "grape", label: "Grape", from: "#8b5cf6", to: "#d946ef" },
  { id: "ember", label: "Ember", from: "#ef4444", to: "#f59e0b" },
  { id: "mint", label: "Mint", from: "#14b8a6", to: "#a7f3d0" },
  { id: "slate", label: "Slate", from: "#475569", to: "#94a3b8" },
] as const

export type AvatarPreset = (typeof AVATAR_PRESETS)[number]

export function getPreset(image: string | null | undefined): AvatarPreset | null {
  if (!image?.startsWith("preset:")) return null
  const id = image.slice("preset:".length)
  return AVATAR_PRESETS.find((p) => p.id === id) ?? null
}

export function presetForId(seed: string): AvatarPreset {
  let hash = 0
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0
  return AVATAR_PRESETS[Math.abs(hash) % AVATAR_PRESETS.length]
}

export function fileUrl(pathname: string) {
  return `/api/file?pathname=${encodeURIComponent(pathname)}`
}

export function avatarSrc(image: string | null | undefined): string | null {
  if (!image || image.startsWith("preset:")) return null
  if (image.startsWith("blob:")) return fileUrl(image.slice("blob:".length))
  return image
}

export function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "?"
  )
}

export function timeAgo(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date
  const s = Math.floor((Date.now() - d.getTime()) / 1000)
  if (s < 45) return "just now"
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const days = Math.floor(h / 24)
  if (days < 30) return `${days}d ago`
  return d.toLocaleDateString()
}
