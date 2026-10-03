"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "react-toastify"
import { Eye, EyeOff, Loader2, Lock, Mail, User, Zap } from "lucide-react"
import { BrandMark } from "@/components/navigation/brand"
import { auth, errorMessage } from "@/lib/demo/store"
import { cn } from "@/lib/utils"

const signInSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

const signUpSchema = signInSchema.extend({
  name: z.string().trim().min(2, "Enter your full name").max(50),
  branch: z.string().min(1, "Choose your branch"),
  year: z.string().min(1, "Choose your year"),
})

type SignUpValues = z.infer<typeof signUpSchema>

const BRANCHES = ["CSE", "ECE", "DSAI", "Mechanical", "Civil", "Other"]
const YEARS = ["1st", "2nd", "3rd", "4th", "Postgrad"]

const inputClass = (invalid: boolean) =>
  cn(
    "h-11 w-full rounded-xl border bg-secondary/50 px-4 text-sm outline-none transition-all placeholder:text-muted-foreground",
    "focus:border-primary/60 focus:bg-background focus:ring-2 focus:ring-primary/20",
    invalid ? "border-destructive/60" : "border-border/60",
  )

function Field({ id, label, error, children }: { id: string; label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const next = useSearchParams().get("next")
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard"
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isSignUp = mode === "sign-up"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpValues>({
    resolver: zodResolver(isSignUp ? signUpSchema : signInSchema) as never,
    defaultValues: { branch: "", year: "" },
  })

  const onSubmit = async (data: SignUpValues) => {
    setError(null)
    try {
      const user = isSignUp ? auth.signUp(data) : auth.signIn(data.email, data.password)
      toast.success(isSignUp ? `Account created. Welcome, ${user.name.split(" ")[0]}!` : `Welcome back, ${user.name.split(" ")[0]}!`)
      router.replace(destination)
    } catch (e) {
      setError(errorMessage(e))
    }
  }

  const continueAsGuest = () => {
    const user = auth.signInGuest()
    toast.success(`Signed in as ${user.name}`)
    router.replace(destination)
  }

  return (
    <div className="flex min-h-[calc(100dvh-3.5rem)] items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <BrandMark className="size-14" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{isSignUp ? "Create your account" : "Welcome back"}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {isSignUp ? "Find teammates for your next campus goal." : "Sign in to AcadHub — Campus Connect"}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-xl shadow-primary/5 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
            {error ? (
              <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            ) : null}

            {isSignUp ? (
              <Field id="name" label="Full name" error={errors.name?.message}>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                  <input id="name" autoComplete="name" placeholder="Priya Kumar" className={cn(inputClass(!!errors.name), "pl-10")} {...register("name")} aria-invalid={!!errors.name} />
                </div>
              </Field>
            ) : null}

            <Field id="email" label="Email address" error={errors.email?.message}>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input id="email" type="email" autoComplete="email" placeholder="you@campus.edu" className={cn(inputClass(!!errors.email), "pl-10")} {...register("email")} aria-invalid={!!errors.email} />
              </div>
            </Field>

            <Field id="password" label="Password" error={errors.password?.message}>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <input
                  id="password"
                  type={showPwd ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder="At least 6 characters"
                  className={cn(inputClass(!!errors.password), "pl-10 pr-11")}
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  aria-label={showPwd ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                >
                  {showPwd ? <EyeOff className="size-4" aria-hidden /> : <Eye className="size-4" aria-hidden />}
                </button>
              </div>
            </Field>

            {isSignUp ? (
              <div className="grid grid-cols-2 gap-3">
                <Field id="branch" label="Branch" error={errors.branch?.message}>
                  <select id="branch" className={inputClass(!!errors.branch)} {...register("branch")}>
                    <option value="">Select</option>
                    {BRANCHES.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </Field>
                <Field id="year" label="Year" error={errors.year?.message}>
                  <select id="year" className={inputClass(!!errors.year)} {...register("year")}>
                    <option value="">Select</option>
                    {YEARS.map((y) => (
                      <option key={y}>{y}</option>
                    ))}
                  </select>
                </Field>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="size-4 animate-spin" aria-hidden /> : null}
              {isSignUp ? "Create account" : "Sign in"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border/60" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border/60" />
          </div>

          <button
            type="button"
            onClick={continueAsGuest}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-border/60 bg-background text-sm font-semibold text-foreground transition hover:bg-secondary"
          >
            <Zap className="size-4 text-accent" aria-hidden />
            Continue as guest
          </button>
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Demo mode: accounts and data are saved in this browser only.
          </p>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-semibold text-primary hover:underline">
            {isSignUp ? "Sign in" : "Create one free"}
          </Link>
        </p>
      </div>
    </div>
  )
}
