export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE"
export type AuthLevel = "None" | "JWT" | "JWT + CSRF" | "OAuth"

export type Endpoint = {
  method: HttpMethod
  path: string
  auth: AuthLevel
  description: string
  mockStatus: number
  mockResponse: unknown
}

export type EndpointGroup = {
  id: string
  title: string
  base: string
  file: string
  endpoints: Endpoint[]
}

const ok = (message: string, data?: unknown) => ({ success: true, message, ...(data ? { data } : {}) })

export const ENDPOINT_GROUPS: EndpointGroup[] = [
  {
    id: "auth",
    title: "Authentication",
    base: "/api/v1/auth",
    file: "backend/routes/authrouter.js",
    endpoints: [
      { method: "POST", path: "/signup", auth: "None", description: "Register a new student account (validated input).", mockStatus: 201, mockResponse: ok("User registered") },
      { method: "POST", path: "/login", auth: "None", description: "Email + password login. Sets access/refresh token cookies.", mockStatus: 200, mockResponse: ok("Login successful") },
      { method: "GET", path: "/github", auth: "OAuth", description: "Starts the Passport GitHub OAuth flow.", mockStatus: 302, mockResponse: { redirect: "https://github.com/login/oauth/authorize?..." } },
      { method: "POST", path: "/logout", auth: "None", description: "Clears session cookies for the current device.", mockStatus: 200, mockResponse: ok("Logged out") },
      { method: "POST", path: "/refresh-token", auth: "JWT + CSRF", description: "Issues a new access token from the refresh token.", mockStatus: 200, mockResponse: ok("Token refreshed") },
      { method: "POST", path: "/otp-auth", auth: "None", description: "Sends a one-time password via Nodemailer.", mockStatus: 200, mockResponse: ok("OTP sent to email") },
      { method: "POST", path: "/otp-verify", auth: "None", description: "Verifies the emailed OTP.", mockStatus: 200, mockResponse: ok("OTP verified") },
      { method: "POST", path: "/password-reset", auth: "None", description: "Sends a password reset message.", mockStatus: 200, mockResponse: ok("Reset link sent") },
    ],
  },
  {
    id: "groups",
    title: "Groups (Goals)",
    base: "/api/v1/group",
    file: "backend/routes/grouprouter.js",
    endpoints: [
      { method: "GET", path: "/groups", auth: "JWT + CSRF", description: "List study groups / goals visible to the user.", mockStatus: 200, mockResponse: ok("Groups fetched", [{ groupCode: "IOT-VIB-24", name: "IoT Vibration Monitoring System", members: 2 }]) },
      { method: "POST", path: "/create", auth: "JWT + CSRF", description: "Create a group. Multipart; up to 10 additional resources.", mockStatus: 201, mockResponse: ok("Goal created", { groupCode: "IOT-VIB-24" }) },
      { method: "GET", path: "/details/:groupCode", auth: "None", description: "Public details for a group by its code.", mockStatus: 200, mockResponse: ok("Group details", { groupCode: "IOT-VIB-24", skills: ["ESP32", "Python", "MQTT"] }) },
      { method: "POST", path: "/join/:groupCode", auth: "JWT + CSRF", description: "Join a group. Optional isAnonymous in body.", mockStatus: 200, mockResponse: ok("Joined group successfully.") },
      { method: "POST", path: "/leave/:groupCode", auth: "JWT + CSRF", description: "Leave a group.", mockStatus: 200, mockResponse: ok("Left group") },
      { method: "GET", path: "/:groupCode/resources", auth: "JWT + CSRF", description: "List shared resources for a group.", mockStatus: 200, mockResponse: ok("Resources", [{ id: 1, name: "esp32-pinout.pdf" }]) },
      { method: "POST", path: "/:groupCode/resources/add", auth: "JWT + CSRF", description: "Upload resources (multipart, up to 10 files).", mockStatus: 201, mockResponse: ok("Resources added") },
    ],
  },
  {
    id: "forum",
    title: "Forum",
    base: "/api/v1/forum",
    file: "backend/routes/forumrouter.js",
    endpoints: [
      { method: "GET", path: "/groups/:groupCode/forum", auth: "JWT + CSRF", description: "Get the discussion forum of a group.", mockStatus: 200, mockResponse: ok("Forum", { threads: 2 }) },
      { method: "POST", path: "/groups/:groupCode/threads", auth: "JWT + CSRF", description: "Start a new discussion thread.", mockStatus: 201, mockResponse: ok("Thread created", { id: "t-103" }) },
      { method: "GET", path: "/threads/:threadId", auth: "JWT + CSRF", description: "Thread with its replies.", mockStatus: 200, mockResponse: ok("Thread", { id: "t-101", replies: 4 }) },
      { method: "POST", path: "/threads/:threadId/replies", auth: "JWT + CSRF", description: "Reply to a thread.", mockStatus: 201, mockResponse: ok("Reply posted") },
    ],
  },
]
