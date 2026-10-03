// The root layout now wraps all pages with AppShell and Footer.
// This docs layout simply renders children directly.
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
