import type { Metadata } from "next"
import { Callout, Container, FileTree, PageHeader, Section, SectionHeading } from "@/components/layout/primitives"
import { CodeBlock } from "@/components/documentation/code-block"

export const metadata: Metadata = { title: "Implementation", description: "A walkthrough of the AcadHub repository structure and code paths." }

const TREE = `AcadHub-Campus-Connect/
├── backend/
│   ├── controllers/     # request handlers (auth, groups, users)
│   ├── middlewares/     # JWT auth, CSRF, validation
│   ├── models/          # PostgreSQL queries
│   ├── routes/          # authrouter.js, grouprouter.js, userrouter.js
│   └── index.js         # Express app entry
├── frontend/            # React client
└── app/ components/ lib/ data/   # this Next.js documentation site`

const ROUTE = `// backend/routes/grouprouter.js
router.post("/create", verifyJWT, verifyCSRF, validate(groupSchema), createGroup)
router.get("/", listGroups)
router.post("/:code/join", verifyJWT, verifyCSRF, requestJoin)`

const CLIENT = `// lib/api/client.ts — falls back to mock data when no backend is configured
export async function getGroups() {
  if (!API_BASE) return { source: "mock", data: MOCK_GROUPS }
  const res = await fetch(\`\${API_BASE}/api/v1/groups\`, { credentials: "include" })
  return { source: "backend", data: (await res.json()).data }
}`

export default function ImplementationPage() {
  return (
    <>
      <PageHeader crumb="Implementation" eyebrow="Repository" title="Walk through the code." description="Where each part of AcadHub lives and how a feature flows from route to database." />
      <Section>
        <Container className="flex max-w-4xl flex-col gap-10">
          <SectionHeading eyebrow="Step 1" title="Repository structure" />
          <FileTree label="tree">{TREE}</FileTree>
          <SectionHeading eyebrow="Step 2" title="A route, end to end" description="Middleware runs in order: authenticate, protect against CSRF, validate, then handle." />
          <CodeBlock code={ROUTE} language="js" title="grouprouter.js" />
          <SectionHeading eyebrow="Step 3" title="The frontend client" description="Simulations call the real API when NEXT_PUBLIC_API_BASE_URL is set, and use mock data otherwise." />
          <CodeBlock code={CLIENT} language="ts" title="lib/api/client.ts" />
          <Callout type="warning" title="Keep secrets on the server">
            JWT secrets and database URLs belong in backend environment variables — never in NEXT_PUBLIC_ variables.
          </Callout>
        </Container>
      </Section>
    </>
  )
}
