# AcadHub — Campus Connect

A campus-focused collaboration platform designed to help students find the right people, resources, and goals for learning, project work, and research.

AcadHub is built around the idea that students already have the skills, ideas, and resources they need — they just need a simple way to connect them. The platform helps students create or join goal-based groups, coordinate work, share materials, and learn together without relying on heavy infrastructure or complicated tools.

## Overview

AcadHub is a frugal, student-first platform for campus collaboration. It supports:

- Goal-based project and study coordination
- Skill discovery and team formation
- Resource sharing and structured information exchange
- Community-driven discussions and project updates
- Secure, profile-based access for student users

The project combines a modern Next.js experience for the user-facing application with a supporting Express backend and PostgreSQL data layer.

## Key Features

- Goal creation and discovery
  - Create academic or project goals with category, skills, slots, and deadline
  - Browse open opportunities across the campus community
  - Filter matches by skill, category, and suitability

- Student profiles
  - Store branch, year, skills, and interests
  - Match students to relevant goals and teams more effectively

- Collaboration workflow
  - Join requests and team coordination
  - Group discussions tied to each goal
  - Shared resource links and project materials

- Dashboard and notifications
  - Personal overview of active and completed goals
  - Track participation and updates
  - Keep members informed of progress and milestones

- Security and authentication
  - Email/password authentication and OAuth support
  - JWT-based sessions and protected routes
  - CSRF and validation safeguards for sensitive actions

- Documentation and product storytelling
  - Built-in documentation pages for problem, innovation, architecture, implementation, and technology
  - Product narrative and onboarding guidance for contributors and stakeholders

## Tech Stack

### Core application
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui-inspired component system

### Backend and data
- Express.js
- PostgreSQL
- Sequelize ORM
- Better Auth
- JWT and OAuth support

### Supporting tools
- Vite (legacy frontend tooling)
- Drizzle SQL assets for schema setup
- Nodemailer for email flows
- Vercel Blob support for file uploads

## Architecture

The project follows a simple layered structure:

1. Client layer
   - Main web experience built with Next.js app routing
   - User dashboard, auth flows, docs, and campus pages

2. API layer
   - Express endpoints for auth, groups, resources, and coordination flows
   - Separate backend services for business logic

3. Data layer
   - PostgreSQL for persistent data
   - Structured models for users, groups, memberships, topics, and resources

This keeps the system easy to maintain while supporting a campus-scale collaboration use case without unnecessary complexity.

## Project Structure

```bash
AcadHub-Campus-Connect/
├── app/                         # Next.js application pages and docs
│   ├── (app)/                  # authenticated product experience
│   ├── (docs)/                 # product documentation pages
│   ├── api/                    # API routes for auth and app endpoints
│   ├── onboarding/            # onboarding screens
│   ├── sign-in/                # sign-in pages
│   ├── sign-up/                # sign-up flow
│   └── page.tsx               # home page
├── backend/                    # Express API and business logic
│   ├── config/                 # database and app config
│   ├── controllers/            # request handlers
│   ├── middlewares/            # auth, validation, CSRF logic
│   ├── models/                 # DB models and schema
│   ├── routes/                 # route definitions
│   ├── services/               # service logic
│   ├── utils/                  # helper utilities
│   ├── validator/              # request validation
│   ├── app.js                  # Express app setup
│   └── server.js               # backend entry point
├── components/                 # UI blocks for the Next.js app
├── data/                       # static content and demo data
├── drizzle/                    # SQL migration files and schema setup
├── frontend/                   # legacy React/Vite frontend workspace
├── lib/                        # shared app utilities and types
├── public/                     # static assets
├── .env.example                # sample environment file
├── .gitignore
├── AGENTS.md                   # repository guidance
├── next.config.mjs             # Next configuration
├── package.json                # project scripts and dependencies
├── tsconfig.json               # TypeScript configuration
├── README.md                   # project documentation
└── LICENSE                     # if present in the repo
```

## Prerequisites

Before running the project, ensure you have:

- Node.js 18+ or newer
- npm
- PostgreSQL installed and running
- A configured environment file for local development

Optional:

- Google OAuth client credentials
- Email credentials for auth flows
- Gemini API key for AI study assistance
- Vercel Blob token for upload support

## Getting Started

### 1) Clone the repository

```bash
git clone https://github.com/Semaphore007/AcadHub-Campus-Connect.git
cd AcadHub-Campus-Connect
```

### 2) Install dependencies

```bash
npm install
```

### 3) Set up environment variables

Copy the sample env file and update it with your local values:

```bash
cp .env.example .env
```

Example configuration:

```env
# PostgreSQL / app database
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=acadnet
PG_USER=postgres
PG_PASSWORD=your_password
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/acadnet

# Auth and security
BETTER_AUTH_SECRET=your_secure_secret
BETTER_AUTH_URL=http://localhost:3000
ACCESS_TOKEN_SECRET=your_access_token
REFRESH_TOKEN_SECRET=your_refresh_token

# API and app settings
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
NEXT_PUBLIC_DEMO_URL=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=false

# OAuth and email
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APP_EMAIL=
APP_PASSWORD=

# File storage
BLOB_READ_WRITE_TOKEN=
```

Notes:

- `DATABASE_URL` is required for Better Auth and persistent account data.
- `NEXT_PUBLIC_API_BASE_URL` is optional for documentation/demo behavior; if not set, the app can fall back to mock data.
- `NEXT_PUBLIC_GOOGLE_AUTH_ENABLED` should be set to `true` only when Google OAuth is fully configured.

### 4) Initialize the database

If you are using the project’s Better Auth schema, run the provided SQL files:

```bash
psql "$DATABASE_URL" -f drizzle/0000_better_auth_tables.sql
psql "$DATABASE_URL" -f drizzle/0001_user_profile_settings.sql
```

### 5) Run the app

Start the main Next.js app:

```bash
npm run dev
```

Visit:

- App: http://localhost:3000

If you want the legacy local frontend workspace or the Express backend separately, use the project scripts below.

## Available Scripts

```bash
npm run dev                 # Start the Next.js app
npm run build               # Production build
npm run start               # Run the production build
npm run backend             # Start Express backend with nodemon
npm run frontend:dev        # Start legacy Vite frontend
npm run frontend:build      # Build legacy frontend
npm run frontend:lint       # Run ESLint for legacy frontend
npm run frontend:preview    # Preview the Vite build
```

## Main Features in Practice

### Student workflow
1. Create an account or sign in
2. Fill out a profile with branch, interests, and skills
3. Create or join a goal-based collaboration group
4. Share resources and collaborate with teammates
5. Track activity and archive completed work

### Product goals
- Reduce the friction of finding people for campus projects
- Encourage peer learning and team-based execution
- Make useful resources easier to discover and share
- Create a lightweight collaboration system that works in a university environment

## Documentation

The repository includes product documentation pages under the `app/(docs)` section, covering:

- Problem statement
- Innovation and concept
- Features and value proposition
- Architecture overview
- Manual/setup guidance
- Technology rationale
- Simulations and interactive examples

## Development Notes

- The root project is a Next.js application with product pages and auth flows.
- The `backend/` folder contains a complementary Express API layer.
- The `frontend/` folder is a legacy React + Vite workspace and is not the primary app entry point for the main documentation/product experience.
- If you are building for persistence and accounts, configure the database and auth secrets before enabling real sign-ins.

## License

This project is distributed under the ISC license.

## Links

- Repository: https://github.com/Semaphore007/AcadHub-Campus-Connect
- Project concept: AcadHub — Campus Connect
- Developer: Siddharth Gautam, IIIT Dharwad

## Team / Credits

The project was developed as a student collaboration platform for campus-based learning and project work.
