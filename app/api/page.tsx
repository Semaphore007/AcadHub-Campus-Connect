import type { Metadata } from "next"
import { Container, PageHeader, Section } from "@/components/layout/primitives"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/documentation/code-block"
import { ENDPOINT_GROUPS, type HttpMethod } from "@/data/documentation/endpoints"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "API Reference", description: "REST endpoints of the AcadHub backend." }

const METHOD: Record<HttpMethod, string> = {
  GET: "bg-success/10 text-success",
  POST: "bg-accent/10 text-accent",
  PUT: "bg-warning/10 text-warning",
  DELETE: "bg-destructive/10 text-destructive",
}

export default function ApiPage() {
  return (
    <>
      <PageHeader crumb="API Reference" eyebrow="REST · /api/v1" title="API reference" description="Every endpoint, its authentication level and an example response." />
      <Section>
        <Container className="flex flex-col gap-14">
          {ENDPOINT_GROUPS.map((g) => (
            <section key={g.id} id={g.id} aria-labelledby={`${g.id}-h`} className="flex scroll-mt-24 flex-col gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 id={`${g.id}-h`} className="text-2xl font-semibold tracking-tight text-foreground">{g.title}</h2>
                <p className="font-mono text-xs text-muted-foreground">{g.base} · {g.file}</p>
              </div>
              <ul className="flex flex-col gap-3">
                {g.endpoints.map((e) => (
                  <li key={e.method + e.path}>
                    <details className="group rounded-xl border border-border bg-card open:border-accent/40">
                      <summary className="flex cursor-pointer list-none flex-wrap items-center gap-3 p-4">
                        <span className={cn("rounded-md px-2 py-0.5 font-mono text-xs font-semibold", METHOD[e.method])}>{e.method}</span>
                        <code className="font-mono text-sm text-foreground">{g.base}{e.path}</code>
                        <span className="text-sm text-muted-foreground">{e.description}</span>
                        <Badge variant="outline" className="ml-auto">{e.auth}</Badge>
                      </summary>
                      <div className="border-t border-border p-4">
                        <CodeBlock code={JSON.stringify(e.mockResponse, null, 2)} language="json" title={`${e.mockStatus} response`} />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </Container>
      </Section>
    </>
  )
}
