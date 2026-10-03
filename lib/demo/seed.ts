import type { DemoState, DemoUser, Goal } from "./types"

const day = 86_400_000
const iso = (offsetDays: number) => new Date(Date.now() + offsetDays * day).toISOString()

export const SEED_USERS: DemoUser[] = [
  { id: "u-arjun", name: "Arjun Sharma", email: "arjun@acadhub.dev", username: "arjun_ml", branch: "CSE", year: "3rd", bio: "ML enthusiast and hackathon regular.", skills: ["Python", "PyTorch", "FastAPI"], interests: ["AI", "Hackathons"], createdAt: iso(-90) },
  { id: "u-meera", name: "Meera Singh", email: "meera@acadhub.dev", username: "meera_ui", branch: "CSE", year: "2nd", bio: "Designing interfaces people enjoy.", skills: ["Figma", "React", "Tailwind"], interests: ["Design", "Web"], createdAt: iso(-80) },
  { id: "u-rohan", name: "Rohan Patel", email: "rohan@acadhub.dev", username: "rohan_iot", branch: "ECE", year: "3rd", bio: "Building things with ESP32 and duct tape.", skills: ["C++", "Arduino", "PCB Design"], interests: ["IoT", "Robotics"], createdAt: iso(-70) },
  { id: "u-ananya", name: "Ananya Rao", email: "ananya@acadhub.dev", username: "ananya_dsa", branch: "DSAI", year: "2nd", bio: "Codeforces Expert. Loves graphs.", skills: ["C++", "Algorithms", "SQL"], interests: ["DSA", "Data"], createdAt: iso(-60) },
  { id: "u-kabir", name: "Kabir Mehta", email: "kabir@acadhub.dev", username: "kabir_dev", branch: "CSE", year: "4th", bio: "Full-stack dev, open source contributor.", skills: ["TypeScript", "Next.js", "PostgreSQL"], interests: ["Open Source", "Web"], createdAt: iso(-50) },
]

const goal = (g: Omit<Goal, "createdAt"> & { createdOffset: number }): Goal => {
  const { createdOffset, ...rest } = g
  return { ...rest, createdAt: iso(createdOffset) }
}

export const SEED_GOALS: Goal[] = [
  goal({ id: "g-sih", title: "Smart India Hackathon 2026 team", description: "Building an AI-powered crop disease detector for SIH. Need a mobile dev and someone comfortable with model deployment.", category: "Hackathon", skills: ["Python", "React Native", "PyTorch"], slots: 6, deadline: iso(18), status: "open", ownerId: "u-arjun", memberIds: ["u-arjun", "u-ananya"], createdOffset: -4 }),
  goal({ id: "g-dsa", title: "DSA sprint for placement season", description: "Daily 2 problems + weekly mock contest. Graphs, DP and trees. Accountability group for 30 days.", category: "Study", skills: ["C++", "Algorithms"], slots: 8, deadline: iso(30), status: "active", ownerId: "u-ananya", memberIds: ["u-ananya", "u-kabir", "u-rohan"], createdOffset: -10 }),
  goal({ id: "g-campus-app", title: "Campus lost & found web app", description: "A simple Next.js app where students post lost or found items with photos and contact options.", category: "Project", skills: ["Next.js", "TypeScript", "Tailwind"], slots: 4, deadline: iso(25), status: "open", ownerId: "u-kabir", memberIds: ["u-kabir"], createdOffset: -2 }),
  goal({ id: "g-iot", title: "Smart hostel energy monitor", description: "ESP32 sensors on hostel floors with a live dashboard to reduce power wastage.", category: "Project", skills: ["Arduino", "C++", "React"], slots: 5, deadline: iso(40), status: "open", ownerId: "u-rohan", memberIds: ["u-rohan", "u-meera"], createdOffset: -6 }),
  goal({ id: "g-paper", title: "Literature review: LLMs in education", description: "Reading group to survey 20 papers and draft a short review for the department symposium.", category: "Research", skills: ["Research", "Writing", "Python"], slots: 4, deadline: iso(21), status: "active", ownerId: "u-meera", memberIds: ["u-meera", "u-arjun"], createdOffset: -12 }),
  goal({ id: "g-fest", title: "Tech fest website redesign", description: "Redesigning the annual tech fest site. Finished and shipped — archived for reference.", category: "Event", skills: ["Figma", "React"], slots: 3, deadline: iso(-5), status: "archived", ownerId: "u-meera", memberIds: ["u-meera", "u-kabir"], createdOffset: -45 }),
]

export const DEMO_STATE_VERSION = 1

export function createSeedState(): DemoState {
  return {
    version: DEMO_STATE_VERSION,
    sessionUserId: null,
    users: SEED_USERS,
    goals: SEED_GOALS,
    messages: [
      { id: "m1", goalId: "g-sih", authorId: "u-arjun", text: "Welcome! I have a baseline model at 87% accuracy already.", createdAt: iso(-3) },
      { id: "m2", goalId: "g-sih", authorId: "u-ananya", text: "Nice. I can handle the backend API and the dataset pipeline.", createdAt: iso(-2.9) },
      { id: "m3", goalId: "g-dsa", authorId: "u-ananya", text: "Today: Dijkstra + one DP problem. Post your solutions here.", createdAt: iso(-1) },
      { id: "m4", goalId: "g-dsa", authorId: "u-kabir", text: "Done with Dijkstra. DP one was tricky.", createdAt: iso(-0.8) },
    ],
    tasks: [
      { id: "t1", goalId: "g-sih", title: "Collect and clean dataset", status: "done", assigneeId: "u-ananya", createdAt: iso(-3) },
      { id: "t2", goalId: "g-sih", title: "Train baseline model", status: "doing", assigneeId: "u-arjun", createdAt: iso(-3) },
      { id: "t3", goalId: "g-sih", title: "Build mobile capture screen", status: "todo", assigneeId: null, createdAt: iso(-2) },
      { id: "t4", goalId: "g-dsa", title: "Week 1 mock contest", status: "done", assigneeId: "u-ananya", createdAt: iso(-8) },
      { id: "t5", goalId: "g-dsa", title: "Week 2 mock contest", status: "todo", assigneeId: null, createdAt: iso(-1) },
    ],
    resources: [
      { id: "r1", goalId: "g-sih", title: "PlantVillage dataset", url: "https://www.kaggle.com/datasets", addedBy: "u-ananya", createdAt: iso(-3) },
      { id: "r2", goalId: "g-dsa", title: "CP-31 problem sheet", url: "https://codeforces.com", addedBy: "u-ananya", createdAt: iso(-9) },
    ],
    activity: [
      { id: "a1", text: "Welcome to AcadHub. Explore goals and join a team.", href: "/goals", createdAt: iso(0), read: false },
    ],
    joinedCommunities: ["webdev", "dsa"],
  }
}
