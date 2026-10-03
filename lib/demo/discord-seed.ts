import type { Channel, ChannelMessage, DemoState, Friendship, Server } from "./types"

const minute = 60_000
const ago = (minutes: number) => new Date(Date.now() - minutes * minute).toISOString()

const SEED_IDS = ["u-arjun", "u-meera", "u-rohan", "u-ananya", "u-kabir"]

const text = (id: string, name: string, topic: string): Channel => ({ id, name, type: "text", topic })
const voice = (id: string, name: string): Channel => ({ id, name, type: "voice", topic: "" })

export const SEED_SERVERS: Server[] = [
  {
    id: "s-webdev",
    name: "Web Dev Guild",
    description: "Full-stack, frontend, backend. Build real products together.",
    color: "#5865f2",
    ownerId: "u-kabir",
    memberIds: ["u-kabir", "u-meera", "u-arjun"],
    channels: [
      text("c-web-general", "general", "Say hi and talk about anything web."),
      text("c-web-help", "help", "Stuck? Paste your error and ask."),
      text("c-web-showcase", "showcase", "Show off what you shipped."),
      voice("v-web-lounge", "Pair Programming"),
    ],
    createdAt: ago(60 * 24 * 40),
  },
  {
    id: "s-dsa",
    name: "DSA & Competitive",
    description: "LeetCode, Codeforces, ICPC prep. Solve problems as a team.",
    color: "#eb459e",
    ownerId: "u-ananya",
    memberIds: ["u-ananya", "u-kabir", "u-arjun", "u-rohan"],
    channels: [
      text("c-dsa-general", "general", "Daily problems and discussion."),
      text("c-dsa-contests", "contests", "Upcoming contests and post-contest talk."),
      text("c-dsa-resources", "resources", "Sheets, editorials and notes."),
      voice("v-dsa-room", "Mock Contest Room"),
    ],
    createdAt: ago(60 * 24 * 30),
  },
  {
    id: "s-aiml",
    name: "AI & ML Lab",
    description: "Deep learning, NLP and computer vision projects.",
    color: "#3ba55c",
    ownerId: "u-arjun",
    memberIds: ["u-arjun", "u-ananya"],
    channels: [
      text("c-ai-general", "general", "All things machine learning."),
      text("c-ai-papers", "papers", "Share and discuss research papers."),
      voice("v-ai-study", "Study Lounge"),
    ],
    createdAt: ago(60 * 24 * 20),
  },
  {
    id: "s-hardware",
    name: "IoT & Robotics",
    description: "Arduino, ESP32 and Raspberry Pi builders.",
    color: "#faa61a",
    ownerId: "u-rohan",
    memberIds: ["u-rohan", "u-meera"],
    channels: [text("c-iot-general", "general", "Build smart things."), voice("v-iot-lab", "Lab")],
    createdAt: ago(60 * 24 * 10),
  },
  {
    id: "s-campus",
    name: "Campus Life",
    description: "Events, clubs, announcements and student activities.",
    color: "#ed4245",
    ownerId: "u-meera",
    memberIds: SEED_IDS,
    channels: [
      text("c-campus-announcements", "announcements", "Official campus updates."),
      text("c-campus-general", "general", "Hang out with everyone on campus."),
      text("c-campus-events", "events", "Fests, workshops and meetups."),
      voice("v-campus-hangout", "Hangout"),
    ],
    createdAt: ago(60 * 24 * 50),
  },
]

const msg = (id: string, channelId: string, authorId: string, body: string, minutesAgo: number): ChannelMessage => ({
  id,
  channelId,
  authorId,
  text: body,
  createdAt: ago(minutesAgo),
})

export const SEED_CHANNEL_MESSAGES: ChannelMessage[] = [
  msg("cm1", "c-web-general", "u-kabir", "Welcome to the Web Dev Guild! Introduce yourself here.", 600),
  msg("cm2", "c-web-general", "u-meera", "Hey all, I'm working on a design system in Tailwind. Happy to review UI.", 590),
  msg("cm3", "c-web-general", "u-arjun", "Anyone tried the new Next.js 16 cache components yet?", 120),
  msg("cm4", "c-web-general", "u-kabir", "Yes! 'use cache' makes it so much cleaner than before.", 115),
  msg("cm5", "c-web-help", "u-meera", "Why does my flex child overflow? min-w-0 fixed it, posting for anyone else.", 300),
  msg("cm6", "c-dsa-general", "u-ananya", "Problem of the day: shortest path with at most k edges. Go!", 240),
  msg("cm7", "c-dsa-general", "u-rohan", "Bellman-Ford with k iterations?", 230),
  msg("cm8", "c-dsa-general", "u-ananya", "Exactly. Bonus if you can do it in O(k * E).", 228),
  msg("cm9", "c-dsa-contests", "u-kabir", "Codeforces Div 2 this Sunday, who's in?", 90),
  msg("cm10", "c-ai-general", "u-arjun", "Fine-tuned a small model on our crop dataset, 91% now.", 180),
  msg("cm11", "c-campus-announcements", "u-meera", "Tech fest registrations are open until Friday.", 1440),
  msg("cm12", "c-campus-general", "u-rohan", "Is the library open late during exams?", 60),
  msg("cm13", "c-campus-general", "u-meera", "Yes, till 2 AM from next week.", 55),
  msg("cm14", "c-iot-general", "u-rohan", "Got the ESP32 talking to the dashboard over MQTT.", 400),
]

export const SEED_FRIENDSHIPS: Friendship[] = [
  { id: "f-seed-1", requesterId: "u-arjun", addresseeId: "u-ananya", status: "accepted", createdAt: ago(9000) },
  { id: "f-seed-2", requesterId: "u-kabir", addresseeId: "u-meera", status: "accepted", createdAt: ago(8000) },
]

export function dmChannelId(a: string, b: string) {
  return `dm:${[a, b].sort().join(":")}`
}

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`

export function welcomeSocial(s: DemoState, userId: string): DemoState {
  if (SEED_IDS.includes(userId)) return s
  const has = (other: string) =>
    s.friendships.some(
      (f) => (f.requesterId === userId && f.addresseeId === other) || (f.requesterId === other && f.addresseeId === userId),
    )
  const friendships: Friendship[] = [...s.friendships]
  if (!has("u-arjun")) friendships.push({ id: uid("f"), requesterId: "u-arjun", addresseeId: userId, status: "accepted", createdAt: ago(5) })
  if (!has("u-kabir")) friendships.push({ id: uid("f"), requesterId: "u-kabir", addresseeId: userId, status: "accepted", createdAt: ago(4) })
  if (!has("u-meera")) friendships.push({ id: uid("f"), requesterId: "u-meera", addresseeId: userId, status: "pending", createdAt: ago(2) })

  const autoJoin = ["s-webdev", "s-dsa", "s-campus"]
  const servers = s.servers.map((sv) =>
    autoJoin.includes(sv.id) && !sv.memberIds.includes(userId) ? { ...sv, memberIds: [...sv.memberIds, userId] } : sv,
  )
  const dm = dmChannelId("u-arjun", userId)
  const channelMessages = s.channelMessages.some((m) => m.channelId === dm)
    ? s.channelMessages
    : [...s.channelMessages, { id: uid("m"), channelId: dm, authorId: "u-arjun", text: "Hey! Welcome to AcadHub. Ping me if you want to join our SIH team.", createdAt: ago(3) }]

  return { ...s, friendships, servers, channelMessages }
}
