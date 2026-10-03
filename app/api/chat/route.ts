import {
  streamText,
  type UIMessage,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
} from "ai"
import { auth } from "@/lib/auth"

export const maxDuration = 30

const SYSTEM = `You are Hub, the friendly AI study buddy inside AcadHub Campus Connect, a community platform for college students.
Help students study, explain concepts clearly with examples, debug code, plan projects, prepare for hackathons and exams,
write good posts, and find the right people or communities to collaborate with.
Available communities: DSA & Competitive Coding, Web Development, AI & Machine Learning, Hackathons, Study Groups, Campus Life, Research, Design & UI/UX.
Keep answers concise, encouraging and well formatted with short paragraphs and bullet points. Use code blocks for code.`

export async function POST(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  if (!session?.user) return new Response("Unauthorized", { status: 401 })

  const { messages }: { messages: UIMessage[] } = await req.json()
  const result = streamText({
    model: "openai/gpt-5.4-mini",
    system: `${SYSTEM}\nThe student's name is ${session.user.name}.`,
    messages: await convertToModelMessages(messages.slice(-20)),
  })
  return createUIMessageStreamResponse({ stream: toUIMessageStream({ stream: result.stream }) })
}
