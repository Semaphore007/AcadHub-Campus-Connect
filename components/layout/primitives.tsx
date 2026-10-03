import * as React from "react"
import Link from "next/link"
import { ChevronRight, Info, Lightbulb, TriangleAlert } from "lucide-react"
import { cn } from "@/lib/utils"

export function Container({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)} {...props} />
}

export function Section({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={cn("py-10 md:py-14", className)} {...props} />
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={cn("font-mono text-xs font-medium uppercase tracking-[0.18em] text-accent", className)}>{children}</p>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}: {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: "left" | "center"
  id?: string
}) {
  return (
    <div className={cn("flex max-w-3xl flex-col gap-3", align === "center" && "mx-auto items-center text-center")}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 id={id} className="text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
        {title}
      </h2>
      {description && <p className="text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
        </li>
        {items.map((item) => (
          <li key={item.label} className="flex items-center gap-1.5">
            <ChevronRight className="size-3.5" aria-hidden />
            {item.href ? (
              <Link href={item.href} className="hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  crumb,
  children,
}: {
  eyebrow: string
  title: string
  description: string
  crumb: string
  children?: React.ReactNode
}) {
  return (
    <header className="relative overflow-hidden border-b border-border bg-muted">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <Container className="relative flex flex-col gap-4 py-6 md:py-8">
        <Breadcrumbs items={[{ label: crumb }]} />
        <div className="flex max-w-4xl flex-col gap-3">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">{title}</h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground">{description}</p>
        </div>
        {children}
      </Container>
    </header>
  )
}

const CALLOUT = {
  info: { icon: Info, className: "border-accent/30 bg-accent/5", iconClass: "text-accent" },
  tip: { icon: Lightbulb, className: "border-success/30 bg-success/5", iconClass: "text-success" },
  warning: { icon: TriangleAlert, className: "border-warning/40 bg-warning/5", iconClass: "text-warning" },
}

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof CALLOUT
  title: string
  children: React.ReactNode
}) {
  const { icon: Icon, className, iconClass } = CALLOUT[type]
  return (
    <aside className={cn("flex gap-3 rounded-xl border p-4", className)}>
      <Icon className={cn("mt-0.5 size-5 shrink-0", iconClass)} aria-hidden />
      <div className="flex flex-col gap-1 text-sm leading-relaxed">
        <p className="font-semibold text-foreground">{title}</p>
        <div className="text-muted-foreground">{children}</div>
      </div>
    </aside>
  )
}

export function FrugalPrinciple({ className }: { className?: string }) {
  return (
    <div className={cn("border-y border-border bg-primary text-primary-foreground", className)}>
      <Container className="flex flex-col items-start justify-between gap-4 py-10 md:flex-row md:items-center">
        <p className="font-mono text-xs uppercase tracking-[0.18em] opacity-70">Frugal innovation principle</p>
        <p className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">
          {"\u201C"}Do more with the resources that already exist.{"\u201D"}
        </p>
      </Container>
    </div>
  )
}

export function FileTree({ children, label }: { children: string; label?: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-border bg-code text-code-foreground">
      {label && (
        <figcaption className="border-b border-white/10 px-4 py-2 font-mono text-xs text-code-foreground/60">{label}</figcaption>
      )}
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-6">
        <code>{children}</code>
      </pre>
    </figure>
  )
}
