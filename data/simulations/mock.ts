import type { Group, Thread } from "@/lib/api/types"

export const MOCK_GROUPS: Group[] = [
  {
    groupCode: "IOT-VIB-24",
    name: "IoT Vibration Monitoring System",
    description: "Need 3 students to prototype a low-cost vibration sensor node for lab machines.",
    category: "Project",
    skills: ["ESP32", "Python", "MQTT", "IoT"],
    members: 2,
    maxMembers: 4,
    deadline: "In 3 weeks",
    status: "joining",
    beginnerFriendly: true,
  },
  {
    groupCode: "ML-BEGIN-07",
    name: "Machine Learning for Beginners",
    description: "A four-week study goal. Weekly notebooks, one mini project at the end.",
    category: "Learning",
    skills: ["Python", "NumPy", "scikit-learn"],
    members: 5,
    maxMembers: 8,
    deadline: "In 4 weeks",
    status: "open",
    beginnerFriendly: true,
  },
  {
    groupCode: "HACK-SPR-11",
    name: "Spring Hackathon Team",
    description: "Forming a team for the upcoming inter-college hackathon. Frontend and pitch roles open.",
    category: "Competition",
    skills: ["React", "UI/UX", "Pitching"],
    members: 3,
    maxMembers: 4,
    deadline: "In 10 days",
    status: "joining",
    beginnerFriendly: false,
  },
  {
    groupCode: "RES-NLP-03",
    name: "Survey: Low-resource Language NLP",
    description: "Collaborators wanted to review papers and draft a short literature survey.",
    category: "Research",
    skills: ["Research", "NLP", "LaTeX"],
    members: 1,
    maxMembers: 3,
    deadline: "In 6 weeks",
    status: "open",
    beginnerFriendly: true,
  },
]

export const MOCK_THREADS: Thread[] = [
  { id: "t-101", groupCode: "IOT-VIB-24", title: "Which accelerometer should we use?", author: "Priya", replies: 4, createdAt: "2h ago" },
  { id: "t-102", groupCode: "IOT-VIB-24", title: "MQTT broker on the lab Raspberry Pi", author: "Rahul", replies: 2, createdAt: "5h ago" },
]

export type SimStudent = {
  id: string
  name: string
  skill: string
  initials: string
}

export const SKILL_GOAL = {
  title: "Build an IoT Vibration Monitoring System",
  required: ["ESP32", "Python", "MQTT", "IoT"],
}

export const SIM_STUDENTS: SimStudent[] = [
  { id: "aarav", name: "Aarav", skill: "Python", initials: "AA" },
  { id: "priya", name: "Priya", skill: "IoT", initials: "PR" },
  { id: "rahul", name: "Rahul", skill: "ESP32", initials: "RA" },
  { id: "ananya", name: "Ananya", skill: "UI/UX", initials: "AN" },
]
