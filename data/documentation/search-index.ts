export type SearchEntry = {
  title: string
  href: string
  kind: "Page" | "Section" | "Feature" | "Technology" | "Simulation"
  keywords?: string
}

export const SEARCH_INDEX: SearchEntry[] = [
  { title: "Home", href: "/", kind: "Page" },
  { title: "The Problem", href: "/problem", kind: "Page", keywords: "scattered skills whatsapp clubs" },
  { title: "Frugal Innovation", href: "/innovation", kind: "Page", keywords: "scarcity affordability sustainability" },
  { title: "Features", href: "/features", kind: "Page" },
  { title: "Architecture", href: "/architecture", kind: "Page", keywords: "diagram express postgres" },
  { title: "Implementation", href: "/implementation", kind: "Page", keywords: "repository github folder" },
  { title: "Manual", href: "/manual", kind: "Page", keywords: "install setup guide" },
  { title: "Live Simulations", href: "/simulations", kind: "Page", keywords: "demo interactive" },
  { title: "Technology", href: "/technology", kind: "Page", keywords: "stack" },
  { title: "API Reference", href: "/api", kind: "Page", keywords: "endpoints rest" },
  { title: "About", href: "/about", kind: "Page" },
  { title: "Contact", href: "/contact", kind: "Page", keywords: "siddharth developer linkedin telegram" },

  { title: "How AcadHub works", href: "/#how-it-works", kind: "Section" },
  { title: "Why it is frugal", href: "/#why-frugal", kind: "Section" },
  { title: "Scattered vs. connected", href: "/problem#scattered", kind: "Section" },
  { title: "Traditional vs. AcadHub", href: "/innovation#comparison", kind: "Section" },
  { title: "Repository structure", href: "/implementation#structure", kind: "Section" },
  { title: "Environment variables", href: "/manual#env", kind: "Section" },
  { title: "Installation", href: "/manual#installation", kind: "Section" },
  { title: "Troubleshooting", href: "/manual#troubleshooting", kind: "Section" },
  { title: "Hardware requirements", href: "/manual#hardware", kind: "Section" },
  { title: "Authentication endpoints", href: "/api#auth", kind: "Section" },
  { title: "Group endpoints", href: "/api#groups", kind: "Section" },
  { title: "Forum endpoints", href: "/api#forum", kind: "Section" },
  { title: "Typed API client", href: "/api#client", kind: "Section" },

  { title: "Goal Creation", href: "/features#goal-creation", kind: "Feature" },
  { title: "Skill Matching", href: "/features#skill-matching", kind: "Feature" },
  { title: "Temporary Groups", href: "/features#temporary-groups", kind: "Feature" },
  { title: "Real-time Collaboration", href: "/features#real-time-collaboration", kind: "Feature" },
  { title: "Archive", href: "/features#archive", kind: "Feature" },

  { title: "Next.js", href: "/technology#nextjs", kind: "Technology" },
  { title: "Express.js", href: "/technology#expressjs", kind: "Technology" },
  { title: "PostgreSQL", href: "/technology#postgresql", kind: "Technology" },
  { title: "Sequelize", href: "/technology#sequelize", kind: "Technology" },
  { title: "JWT", href: "/technology#jwt", kind: "Technology" },

  { title: "Goal Lifecycle simulation", href: "/simulations#lifecycle", kind: "Simulation" },
  { title: "Skill Matching simulation", href: "/simulations#matching", kind: "Simulation" },
  { title: "Temporary Group simulation", href: "/simulations#group", kind: "Simulation" },
  { title: "Discovery Feed simulation", href: "/simulations#feed", kind: "Simulation" },
  { title: "Collaboration Chat simulation", href: "/simulations#chat", kind: "Simulation" },
  { title: "API request simulation", href: "/simulations#request", kind: "Simulation" },
]
