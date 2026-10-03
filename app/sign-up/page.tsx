"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  AtSign,
  Check,
  Code2,
  Eye,
  EyeOff,
  GraduationCap,
  Loader2,
  Lock,
  Mail,
  User,
  X,
} from "lucide-react"
import { authClient, signUp } from "@/lib/auth-client"
import { BrandMark } from "@/components/navigation/brand"
import { cn } from "@/lib/utils"

const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name is too long"),
    email: z.email("Enter a valid email address"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(20, "Username can be at most 20 characters")
      .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
    academicBranch: z.string().trim().min(2, "Enter your academic branch").max(80, "Branch is too long"),
    graduationYear: z.string().regex(/^(19|20|21)\d{2}$/, "Enter a valid 4-digit year"),
    technicalInterests: z.string().trim().min(2, "Add at least one interest").max(200, "Keep interests under 200 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirm: z.string(),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  })

type FormValues = z.infer<typeof schema>

const STRENGTH_RULES = [
  { test: (p: string) => p.length >= 8, label: "At least 8 characters" },
  { test: (p: string) => /[A-Z]/.test(p), label: "One uppercase letter" },
  { test: (p: string) => /[0-9]/.test(p), label: "One number" },
  { test: (p: string) => /[^a-zA-Z0-9]/.test(p), label: "One special character (bonus)" },
]

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null
  const passed = STRENGTH_RULES.filter((r) => r.test(password)).length
  const color = passed <= 1 ? "bg-destructive" : passed <= 2 ? "bg-warning" : passed <= 3 ? "bg-yellow-500" : "bg-success"
  const label = passed <= 1 ? "Weak" : passed <= 2 ? "Fair" : passed <= 3 ? "Good" : "Strong"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className={cn("h-1.5 flex-1 rounded-full transition-colors", i <= passed ? color : "bg-border/60")} />
          ))}
        </div>
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      </div>
      <ul className="grid grid-cols-2 gap-1">
        {STRENGTH_RULES.map(({ test, label }) => (
          <li key={label} className={cn("flex items-center gap-1.5 text-xs transition-colors", test(password) ? "text-success" : "text-muted-foreground")}>
            {test(password) ? <Check className="size-3" aria-hidden /> : <X className="size-3 opacity-40" aria-hidden />}
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function SignUpPage() {
  const router = useRouter()
  const [showPwd, setShowPwd] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [socialPending, setSocialPending] = useState(false)
  const [authReadiness, setAuthReadiness] = useState<{ ready: boolean; demoMode: boolean; message: string } | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch("/api/auth/status")
      .then(async (response) => {
        const result = (await response.json()) as { ready?: boolean; demoMode?: boolean; message?: string }
        if (!cancelled) {
          setAuthReadiness({
            ready: response.ok && result.ready === true,
            demoMode: result.demoMode === true,
            message: result.message ?? "Account storage is unavailable. Check the server configuration.",
          })
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthReadiness({
            ready: false,
            demoMode: false,
            message: "Could not verify account storage. Check the server and try again.",
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const password = watch("password", "")
  const username = watch("username", "")

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    if (!authReadiness?.ready) {
      setServerError(authReadiness?.message ?? "Checking account storage. Please wait and try again.")
      return
    }

    try {
      if (authReadiness.demoMode) {
        const response = await fetch("/api/auth/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            username: data.username,
            academicBranch: data.academicBranch,
            graduationYear: data.graduationYear,
            technicalInterests: data.technicalInterests,
          }),
        })
        const result = (await response.json()) as { message?: string }
        if (!response.ok) {
          setServerError(result.message ?? "Could not start local demo access.")
          return
        }
        router.replace("/dashboard")
        router.refresh()
        return
      }

      const res = await signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
        username: data.username,
        academicBranch: data.academicBranch,
        graduationYear: data.graduationYear,
        technicalInterests: data.technicalInterests,
      })
      if (res.error) {
        setServerError(res.error.message ?? "Failed to create account. Please try again.")
        return
      }
      if (!res.data?.user) {
        setServerError("Account creation did not return a saved user. Please try again.")
        return
      }
      router.replace("/dashboard")
      router.refresh()
    } catch (caught) {
      setServerError(caught instanceof Error ? caught.message : "Failed to create account. Please try again.")
    }
  }

  const signUpWithGoogle = async () => {
    setServerError(null)
    if (!authReadiness?.ready || authReadiness.demoMode) {
      setServerError(authReadiness?.message ?? "Checking account storage. Please wait and try again.")
      return
    }
    setSocialPending(true)
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })
      if (result.error) {
        setServerError(result.error.message ?? "Google sign-up failed. Please try again.")
        setSocialPending(false)
      }
    } catch (caught) {
      setServerError(caught instanceof Error ? caught.message : "Google sign-up failed. Please try again.")
      setSocialPending(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-start justify-center p-4 pt-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark className="size-16" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Join AcadHub</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Connect with students. Build together.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-xl shadow-primary/5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {/* Server error */}
            {serverError && (
              <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {serverError}
              </div>
            )}
            {authReadiness && !authReadiness.demoMode && !authReadiness.ready && (
              <div role="alert" className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-foreground">
                {authReadiness.message}
              </div>
            )}

            {/* Full name */}
            <FormField
              id="name"
              label="Full name"
              icon={<User className="size-4" />}
              error={errors.name?.message}
              input={
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Unknown"
                  className={inputClass(!!errors.name)}
                  {...register("name")}
                />
              }
            />

            {/* Email */}
            <FormField
              id="email"
              label="Email address"
              icon={<Mail className="size-4" />}
              error={errors.email?.message}
              input={
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@iiitdharwad.ac.in"
                  className={inputClass(!!errors.email)}
                  {...register("email")}
                />
              }
            />

            {/* Username */}
            <FormField
              id="username"
              label="Username"
              icon={<AtSign className="size-4" />}
              error={errors.username?.message}
              hint={username && !errors.username ? `u/${username}` : undefined}
              input={
                <input
                  id="username"
                  type="text"
                  autoComplete="username"
                  placeholder="coolstudent_23"
                  className={inputClass(!!errors.username)}
                  {...register("username")}
                />
              }
            />

            {/* Academic profile */}
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                id="academicBranch"
                label="Academic branch"
                icon={<GraduationCap className="size-4" />}
                error={errors.academicBranch?.message}
                input={
                  <input
                    id="academicBranch"
                    type="text"
                    autoComplete="organization-title"
                    placeholder="Computer Science"
                    className={inputClass(!!errors.academicBranch)}
                    {...register("academicBranch")}
                  />
                }
              />
              <FormField
                id="graduationYear"
                label="Graduation year"
                icon={<GraduationCap className="size-4" />}
                error={errors.graduationYear?.message}
                input={
                  <input
                    id="graduationYear"
                    type="text"
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="2028"
                    className={inputClass(!!errors.graduationYear)}
                    {...register("graduationYear")}
                  />
                }
              />
            </div>

            <FormField
              id="technicalInterests"
              label="Technical interests"
              icon={<Code2 className="size-4" />}
              error={errors.technicalInterests?.message}
              hint="Separate interests with commas, e.g. AI, design, robotics"
              input={
                <input
                  id="technicalInterests"
                  type="text"
                  placeholder="AI, design, robotics"
                  className={inputClass(!!errors.technicalInterests)}
                  {...register("technicalInterests")}
                />
              }
            />

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={cn(inputClass(!!errors.password), "pr-11")}
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPwd ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
              {errors.password && <p role="alert" className="text-xs text-destructive">{errors.password.message}</p>}
              <PasswordStrength password={password} />
            </div>

            {/* Confirm password */}
            <FormField
              id="confirm"
              label="Confirm password"
              icon={<Lock className="size-4" />}
              error={errors.confirm?.message}
              input={
                <input
                  id="confirm"
                  type="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className={inputClass(!!errors.confirm)}
                  {...register("confirm")}
                />
              }
            />

            {/* Terms */}
            <p className="text-xs text-muted-foreground">
              By signing up you agree to our{" "}
              <Link href="/terms" className="text-accent hover:underline">Terms</Link>
              {" "}and{" "}
              <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
            </p>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting || !isValid || authReadiness?.ready !== true}
              className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
                "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "active:scale-[0.98]",
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Creating account…
                </>
              ) : (
                authReadiness?.demoMode ? "Open demo preview" : "Create free account"
              )}
            </button>
          </form>
          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && !authReadiness?.demoMode && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-muted-foreground">or</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <button
                type="button"
                onClick={signUpWithGoogle}
                disabled={socialPending || authReadiness?.ready !== true}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-card text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-60"
              >
                {socialPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Continue with Google
              </button>
            </>
          )}
        </div>

        {/* Sign in link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

// ─── Helper components ────────────────────────────────────────────────────────

function inputClass(hasError: boolean) {
  return cn(
    "h-11 w-full rounded-xl border bg-secondary/50 pl-10 pr-4 text-sm outline-none",
    "transition-all placeholder:text-muted-foreground",
    "focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
    hasError ? "border-destructive/60 bg-destructive/5" : "border-border/60",
  )
}

function FormField({
  id,
  label,
  icon,
  error,
  hint,
  input,
}: {
  id: string
  label: string
  icon: React.ReactNode
  error?: string
  hint?: string
  input: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden>
          {icon}
        </span>
        {input}
      </div>
      {error ? (
        <p role="alert" className="text-xs text-destructive">{error}</p>
      ) : hint ? (
        <p className="text-xs text-success">{hint}</p>
      ) : null}
    </div>
  )
}
