export const SITE = {
  name: "AcadHub",
  subtitle: "Campus Connect",
  fullTitle: "AcadHub — Campus Connect",
  title: "AcadHub — Campus Connect | Frugal Student Collaboration",
  description:
    "A frugal, goal-based student collaboration platform connecting college students around projects, learning, research and campus goals.",
  tagline: "Find People. Build Together. Complete Goals.",
  principle: "Do more with the resources that already exist.",
  finalPrinciple: "Simple infrastructure. Existing resources. Maximum usefulness.",
  repo: "https://github.com/Semaphore007/AcadHub-Campus-Connect",
  demoUrl: process.env.NEXT_PUBLIC_DEMO_URL || "",
} as const

export const DEVELOPER = {
  name: "Siddharth Gautam",
  institution: "Indian Institute of Information Technology Dharwad",
  portrait: "/images/siddharth-gautam.png",
  github: "https://github.com/Semaphore007",
  linkedin: "https://www.linkedin.com/in/siddharth-gautam-883539238/",
  telegram: "https://t.me/TheOutlier_2003",
} as const

export const IMAGES = {
  logo: "/images/iiit-dharwad-logo.png",
  campus: "/images/iiit-dharwad-campus.png",
} as const

export type NavItem = { href: string; label: string; description?: string }

export const PRIMARY_NAV: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/problem", label: "Problem" },
  { href: "/innovation", label: "Innovation" },
  { href: "/implementation", label: "Implementation" },
  { href: "/manual", label: "Manual" },
  { href: "/simulations", label: "Simulations" },
  { href: "/architecture", label: "Architecture" },
  { href: "/technology", label: "Technology" },
  { href: "/contact", label: "Contact" },
]

export const NAV_GROUPS: { title: string; items: NavItem[] }[] = [
  {
    title: "The Project",
    items: [
      { href: "/problem", label: "Problem", description: "Why student skills stay scattered" },
      { href: "/innovation", label: "Innovation", description: "The frugal, goal-based model" },
      { href: "/features", label: "Features", description: "What the platform does" },
      { href: "/about", label: "About", description: "Concept and principles" },
      { href: "/contact", label: "Contact", description: "Reach the developer" },
    ],
  },
  {
    title: "Documentation",
    items: [
      { href: "/implementation", label: "Implementation", description: "Repository walkthrough" },
      { href: "/architecture", label: "Architecture", description: "Current vs. redesign" },
      { href: "/manual", label: "Manual", description: "Setup and operation" },
      { href: "/api", label: "API Reference", description: "REST endpoints" },
      { href: "/technology", label: "Technology", description: "Stack and rationale" },
      { href: "/simulations", label: "Live Simulations", description: "Interactive demonstration" },
    ],
  },
]

export const MORE_NAV: NavItem[] = [
  { href: "/features", label: "Features", description: "Thirteen focused capabilities" },
  { href: "/api", label: "API Reference", description: "Documented REST endpoints" },
  { href: "/about", label: "About", description: "Concept, principle and repository" },
]

export const FOOTER_EXPLORE: NavItem[] = [
  { href: "/problem", label: "Problem" },
  { href: "/innovation", label: "Innovation" },
  { href: "/features", label: "Features" },
  { href: "/architecture", label: "Architecture" },
  { href: "/implementation", label: "Implementation" },
  { href: "/manual", label: "Manual" },
  { href: "/simulations", label: "Simulations" },
]

export const RESOURCES = [
  { label: "Implementation repository", href: "https://github.com/Semaphore007/AcadHub-Campus-Connect" },
  { label: "Next.js App Router docs", href: "https://nextjs.org/docs/app" },
  { label: "shadcn/ui docs", href: "https://ui.shadcn.com/docs" },
  { label: "Motion for React", href: "https://motion.dev/docs/react" },
  { label: "Vercel docs", href: "https://vercel.com/docs" },
  { label: "v0", href: "https://v0.dev/" },
]
