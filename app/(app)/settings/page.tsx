"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Check, Loader2, LogOut, Save, Shield, UserRound } from "lucide-react"
import { AVATAR_PRESETS } from "@/lib/avatars"
import { authClient, signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

type ProfileFields = {
  username?: string | null
  bio?: string | null
  academicBranch?: string | null
  graduationYear?: number | null
  technicalInterests?: string | null
  profilePublic?: boolean
}

type DemoUser = {
  name: string
  email: string
  username: string | null
  academicBranch?: string
  graduationYear?: string
  technicalInterests?: string
  isDemo: boolean
}

export default function SettingsPage() {
  const router = useRouter()
  const { data: session, isPending } = useSession()
  const [demoUser, setDemoUser] = useState<DemoUser | null>(null)
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [academicBranch, setAcademicBranch] = useState("")
  const [graduationYear, setGraduationYear] = useState("")
  const [technicalInterests, setTechnicalInterests] = useState("")
  const [profilePublic, setProfilePublic] = useState(true)
  const [image, setImage] = useState("preset:aurora")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch("/api/auth/demo")
      .then(async (response) => {
        if (!response.ok) return
        const result = (await response.json()) as { demoMode?: boolean; user?: DemoUser | null }
        if (result.demoMode && result.user?.isDemo) setDemoUser(result.user)
      })
      .catch((caught: unknown) => {
        console.error("Could not load demo profile settings:", caught)
      })
  }, [])

  useEffect(() => {
    if (!session?.user) return
    const profile = session.user as typeof session.user & ProfileFields
    setName(profile.name)
    setUsername(profile.username ?? "")
    setBio(profile.bio ?? "")
    setAcademicBranch(profile.academicBranch ?? "")
    setGraduationYear(profile.graduationYear ?? "")
    setTechnicalInterests(profile.technicalInterests ?? "")
    setProfilePublic(profile.profilePublic ?? true)
    setImage(profile.image ?? "preset:aurora")
  }, [session])

  const saveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage("")
    setError("")

    const cleanUsername = username.trim().toLowerCase()
    if (!/^[a-z0-9_]{3,20}$/.test(cleanUsername)) {
      setError("Username must be 3–20 characters and use lowercase letters, numbers, or underscores.")
      return
    }
    if (name.trim().length < 2 || name.trim().length > 50) {
      setError("Name must be between 2 and 50 characters.")
      return
    }
    if (graduationYear && (!/^\d{4}$/.test(graduationYear) || Number(graduationYear) < 1950 || Number(graduationYear) > 2100)) {
      setError("Enter a valid graduation year.")
      return
    }

    setSaving(true)
    try {
      const result = await authClient.updateUser({
        name: name.trim(),
        username: cleanUsername,
        bio: bio.trim(),
        academicBranch: academicBranch.trim(),
        graduationYear,
        technicalInterests: technicalInterests.trim(),
        profilePublic,
        image,
      })
      if (result.error) {
        setError(result.error.message ?? "Could not save your profile.")
        return
      }
      setMessage("Your profile settings have been saved.")
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not save your profile.")
    } finally {
      setSaving(false)
    }
  }

  const logOut = async () => {
    setError("")
    try {
      if (demoUser) {
        const response = await fetch("/api/auth/demo", { method: "DELETE" })
        if (!response.ok) throw new Error("Could not end the local demo session.")
        router.replace("/sign-in")
        router.refresh()
        return
      }

      const result = await signOut()
      if (result.error) {
        setError(result.error.message ?? "Could not log out. Please try again.")
        return
      }
      router.replace("/sign-in")
      router.refresh()
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not log out. Please try again.")
    }
  }

  if (demoUser && !session?.user) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
        <header>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Preview profile</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="mt-2 text-sm text-muted-foreground">Profile details for this preview session.</p>
        </header>

        <section aria-labelledby="demo-profile-heading" className="rounded-2xl border border-border/60 bg-card p-5 sm:p-7">
          <h2 id="demo-profile-heading" className="text-lg font-semibold text-foreground">Profile preview</h2>
          <dl className="mt-5 grid gap-4 sm:grid-cols-2">
            <DemoDetail label="Display name" value={demoUser.name} />
            <DemoDetail label="Username" value={demoUser.username ? `u/${demoUser.username}` : "Not provided"} />
            <DemoDetail label="Email address" value={demoUser.email} />
            <DemoDetail label="Academic branch" value={demoUser.academicBranch || "Not provided"} />
            <DemoDetail label="Graduation year" value={demoUser.graduationYear || "Not provided"} />
            <DemoDetail label="Technical interests" value={demoUser.technicalInterests || "Not provided"} />
          </dl>
        </section>

        <div>
          <button type="button" onClick={logOut} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border/60 px-4 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <LogOut className="size-4" aria-hidden />
            End preview
          </button>
        </div>
      </div>
    )
  }

  if (isPending || !session?.user) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center" role="status" aria-label="Loading account settings">
        <Loader2 className="size-6 animate-spin text-primary" aria-hidden />
      </div>
    )
  }

  const selectedPreset = AVATAR_PRESETS.find((preset) => `preset:${preset.id}` === image)

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">Your account</p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">Manage your profile, campus details, and privacy.</p>
      </header>

      {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">{message}</p>}

      <form onSubmit={saveProfile} className="flex flex-col gap-6">
        <section aria-labelledby="profile-settings-heading" className="rounded-2xl border border-border/60 bg-card p-5 sm:p-7">
          <h2 id="profile-settings-heading" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <UserRound className="size-5 text-primary" aria-hidden />
            Profile
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field label="Display name">
              <input required minLength={2} maxLength={50} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
            </Field>
            <Field label="Username">
              <div className="flex h-11 items-center rounded-xl border border-border/60 bg-secondary/50 focus-within:border-primary/60">
                <span className="pl-3 text-sm text-muted-foreground">u/</span>
                <input required minLength={3} maxLength={20} value={username} onChange={(e) => setUsername(e.target.value.toLowerCase())} className="h-full min-w-0 flex-1 bg-transparent px-2 text-sm outline-none" />
              </div>
            </Field>
            <Field label="Email address">
              <input type="email" value={session.user.email} disabled className={`${inputClass} cursor-not-allowed opacity-65`} />
              <span className="text-xs text-muted-foreground">Email changes require verification and aren’t available here yet.</span>
            </Field>
            <Field label="Academic branch">
              <input value={academicBranch} onChange={(e) => setAcademicBranch(e.target.value)} maxLength={100} placeholder="e.g. Computer Science and Engineering" className={inputClass} />
            </Field>
            <Field label="Graduation year">
              <input type="number" min={1950} max={2100} value={graduationYear} onChange={(e) => setGraduationYear(e.target.value)} placeholder="e.g. 2027" className={inputClass} />
            </Field>
            <Field label="Technical interests / expertise">
              <input value={technicalInterests} onChange={(e) => setTechnicalInterests(e.target.value)} maxLength={300} placeholder="e.g. Web development, AI, IoT" className={inputClass} />
            </Field>
            <Field label="Bio" className="sm:col-span-2">
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} maxLength={300} rows={3} placeholder="A short introduction about you" className={`${inputClass} h-auto resize-y py-3`} />
              <span className="text-right text-xs text-muted-foreground">{bio.length}/300</span>
            </Field>
          </div>

          <fieldset className="mt-6">
            <legend className="text-sm font-medium text-foreground">Avatar</legend>
            <p className="mt-1 text-xs text-muted-foreground">Choose a color avatar. Your selection appears beside your posts and messages.</p>
            <div className="mt-3 flex flex-wrap gap-3">
              {AVATAR_PRESETS.map((preset) => {
                const value = `preset:${preset.id}`
                const selected = value === image
                return (
                  <button
                    key={preset.id}
                    type="button"
                    aria-label={`${preset.label} avatar`}
                    aria-pressed={selected}
                    onClick={() => setImage(value)}
                    className={cn(
                      "flex size-12 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm transition hover:scale-105",
                      selected && "ring-2 ring-primary ring-offset-2 ring-offset-card",
                    )}
                    style={{ backgroundImage: `linear-gradient(135deg, ${preset.from}, ${preset.to})` }}
                  >
                    {selected ? <Check className="size-5" aria-hidden /> : preset.label.slice(0, 1)}
                  </button>
                )
              })}
            </div>
            <span className="sr-only" aria-live="polite">{selectedPreset ? `${selectedPreset.label} avatar selected` : "Avatar selected"}</span>
          </fieldset>
        </section>

        <section aria-labelledby="privacy-heading" className="rounded-2xl border border-border/60 bg-card p-5 sm:p-7">
          <h2 id="privacy-heading" className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Shield className="size-5 text-primary" aria-hidden />
            Privacy
          </h2>
          <label className="mt-5 flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-secondary/30 p-4">
            <input type="checkbox" checked={profilePublic} onChange={(e) => setProfilePublic(e.target.checked)} className="mt-1 size-4 accent-primary" />
            <span>
              <span className="block text-sm font-medium text-foreground">Show my profile to other students</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                When disabled, your profile is private. Your posts and messages in joined communities may still be visible to those members.
              </span>
            </span>
          </label>
        </section>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button type="button" onClick={logOut} className="inline-flex h-11 items-center gap-2 rounded-xl border border-border/60 px-4 text-sm font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <LogOut className="size-4" aria-hidden />
            Log out
          </button>
          <button type="submit" disabled={saving} className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60">
            {saving ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Save className="size-4" aria-hidden />}
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

const inputClass =
  "h-11 w-full rounded-xl border border-border/60 bg-secondary/50 px-3 text-sm text-foreground outline-none transition focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed"

function Field({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={cn("flex flex-col gap-1.5 text-sm font-medium text-foreground", className)}>
      {label}
      {children}
    </label>
  )
}

function DemoDetail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
    </div>
  )
}
