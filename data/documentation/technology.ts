export type TechStatus = "Current repository" | "Recommended redesign" | "Both"

export type Tech = {
  id: string
  name: string
  layer: "Frontend" | "Backend" | "Data" | "Security" | "Tooling"
  status: TechStatus
  why: string
}

export const TECHNOLOGIES: Tech[] = [
  { id: "nextjs", name: "Next.js", layer: "Frontend", status: "Recommended redesign", why: "App Router gives server-rendered, multi-page documentation with route-level code splitting." },
  { id: "react", name: "React", layer: "Frontend", status: "Both", why: "Component model used by the existing Vite frontend and the redesign alike." },
  { id: "typescript", name: "TypeScript", layer: "Frontend", status: "Both", why: "Typed API contracts between frontend and backend reduce integration mistakes." },
  { id: "tailwind", name: "Tailwind CSS", layer: "Frontend", status: "Both", why: "Utility styling with design tokens; no separate CSS framework to maintain." },
  { id: "shadcn", name: "shadcn/ui", layer: "Frontend", status: "Both", why: "Accessible Radix-based components copied into the codebase, not a black-box dependency." },
  { id: "lucide", name: "Lucide", layer: "Frontend", status: "Both", why: "Consistent, tree-shakeable open-source icons." },
  { id: "motion", name: "Motion", layer: "Frontend", status: "Recommended redesign", why: "Used sparingly for layout transitions in simulations and the back-to-top control." },
  { id: "expressjs", name: "Express.js", layer: "Backend", status: "Current repository", why: "Minimal Node.js HTTP layer; routes, middleware and controllers stay easy to read." },
  { id: "postgresql", name: "PostgreSQL", layer: "Data", status: "Current repository", why: "Open-source relational database for users, groups, memberships, threads and resources." },
  { id: "sequelize", name: "Sequelize", layer: "Data", status: "Current repository", why: "Model definitions and associations for the relational schema." },
  { id: "jwt", name: "JWT", layer: "Security", status: "Current repository", why: "Stateless access tokens with refresh tokens stored server-side, plus CSRF protection." },
  { id: "oauth", name: "OAuth (GitHub)", layer: "Security", status: "Current repository", why: "Passport GitHub strategy lets students sign in with an account they already own." },
  { id: "zod", name: "Zod", layer: "Tooling", status: "Recommended redesign", why: "Lightweight schema validation for forms and API payloads in the redesign." },
]
