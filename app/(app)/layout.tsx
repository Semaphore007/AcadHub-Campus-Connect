import { RequireAuth } from "@/components/demo/require-auth"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <RequireAuth>{children}</RequireAuth>
}
