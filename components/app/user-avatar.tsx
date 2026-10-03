import { avatarSrc, getPreset, initials, presetForId } from "@/lib/avatars"
import { cn } from "@/lib/utils"

type Props = {
  name: string
  image?: string | null
  seed?: string
  className?: string
  online?: boolean
}

export function UserAvatar({ name, image, seed, className, online }: Props) {
  const src = avatarSrc(image)
  const preset = getPreset(image) ?? presetForId(seed ?? name)
  return (
    <span className={cn("relative inline-flex size-9 shrink-0", className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="size-full rounded-full object-cover" />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-full items-center justify-center rounded-full text-[0.8em] font-semibold text-white"
          style={{ backgroundImage: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
        >
          {initials(name)}
        </span>
      )}
      <span className="sr-only">{name}</span>
      {online ? (
        <span className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-background bg-success" />
      ) : null}
    </span>
  )
}
