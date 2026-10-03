"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from "lucide-react"
import { authClient, signIn } from "@/lib/auth-client"
import { BrandMark } from "@/components/navigation/brand"
import { cn } from "@/lib/utils"

const schema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

type FormValues = z.infer<typeof schema>

export default function SignInPage() {
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
    formState: { errors, isSubmitting, isValid, dirtyFields },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
  })

  const onSubmit = async (data: FormValues) => {
    setServerError(null)
    if (!authReadiness?.ready) {
      setServerError(authReadiness?.message ?? "Checking account storage. Please wait and try again.")
      return
    }

    try {
      if (authReadiness.demoMode) {
        const localName = data.email.split("@")[0]?.trim() || "Unknown"
        const username = (localName.toLowerCase().replace(/[^a-z0-9_]/g, "_").slice(0, 20) || "demo_user").padEnd(3, "_")
        const response = await fetch("/api/auth/demo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: localName.length >= 2 ? localName.slice(0, 50) : `${localName} Student`,
            email: data.email,
            username,
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

      const res = await signIn.email({ email: data.email, password: data.password })
      if (res.error) {
        setServerError(res.error.message ?? "Invalid credentials. Please try again.")
        return
      }
      router.push("/dashboard")
      router.refresh()
    } catch (caught) {
      setServerError(caught instanceof Error ? caught.message : "Sign-in failed. Please try again.")
    }
  }

  const signInWithGoogle = async () => {
    setServerError(null)
    if (!authReadiness?.ready || authReadiness.demoMode) {
      setServerError(authReadiness?.message ?? "Checking account storage. Please wait and try again.")
      return
    }
    setSocialPending(true)
    try {
      const result = await authClient.signIn.social({ provider: "google", callbackURL: "/dashboard" })
      if (result.error) {
        setServerError(result.error.message ?? "Google sign-in failed. Please try again.")
        setSocialPending(false)
      }
    } catch (caught) {
      setServerError(caught instanceof Error ? caught.message : "Google sign-in failed. Please try again.")
      setSocialPending(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark className="size-16" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Welcome back</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Sign in to AcadHub — Campus Connect
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-border/60 bg-card p-8 shadow-xl shadow-primary/5">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
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

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={cn(
                    "h-11 w-full rounded-xl border bg-secondary/50 pl-10 pr-4 text-sm outline-none",
                    "transition-all placeholder:text-muted-foreground",
                    "focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
                    errors.email ? "border-destructive/60 bg-destructive/5" : "border-border/60",
                  )}
                  {...register("email")}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <p id="email-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs text-accent hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className={cn(
                    "h-11 w-full rounded-xl border bg-secondary/50 pl-10 pr-11 text-sm outline-none",
                    "transition-all placeholder:text-muted-foreground",
                    "focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
                    errors.password ? "border-destructive/60 bg-destructive/5" : "border-border/60",
                  )}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "pwd-error" : undefined}
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
              {errors.password && (
                <p id="pwd-error" role="alert" className="flex items-center gap-1 text-xs text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

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
                  Signing in…
                </>
              ) : (
                authReadiness?.demoMode ? "Continue to preview" : "Sign in"
              )}
            </button>
          </form>

          {process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true" && !authReadiness?.demoMode && (
            <>
              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-xs text-muted-foreground">or continue with</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>
              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={socialPending || authReadiness?.ready !== true}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-card text-sm font-semibold text-foreground transition hover:bg-secondary disabled:opacity-60"
              >
                {socialPending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
                Continue with Google
              </button>
            </>
          )}

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          {/* AI promo */}
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-primary/10 via-accent/5 to-transparent border border-primary/20 p-3.5">
            <Sparkles className="size-5 shrink-0 text-accent" aria-hidden />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sign in to access{" "}
              <span className="font-semibold text-foreground">Hub AI Study Buddy</span>,
              join communities, and connect with fellow students.
            </p>
          </div>
        </div>

        {/* Sign up link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-semibold text-primary hover:underline">
            Create one free
          </Link>
        </p>
      </div>
    </div>
  )
}
