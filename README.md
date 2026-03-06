# 💬 Tars — Real-Time Chat Application

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Convex](https://img.shields.io/badge/Convex-Realtime-EE342F?style=for-the-badge)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=for-the-badge&logo=clerk)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?style=for-the-badge&logo=tailwindcss)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)

**A modern, real-time chat application built with Next.js, Convex, and Clerk.**  
_Submitted as part of the Tars Full Stack Engineer Internship Coding Challenge._

[🚀 Live Demo](https://tars.abhaybansal.site/) · [📁 GitHub Repository](https://github.com/Targter/CHATAPP-TARS) · [🧑‍💻 Portfolio](https://abhaybansal.in/)

</div>

---

## 📌 Project Overview

**Tars** is a full-stack, real-time chat application inspired by the clean, modern interfaces of ChatGPT, Intercom, and Linear. It supports one-to-one and group conversations with instant message delivery powered by Convex's reactive database — no polling, no WebSocket boilerplate.

Built as part of the **Tars Full Stack Engineer Internship Coding Challenge**, this project demonstrates end-to-end product engineering: authentication, real-time data sync, a scalable backend, and a polished, accessible UI.

---

## ✨ Features

### 🔐 Authentication

- Clerk-powered login and signup flows
- Secure session handling with JWT tokens
- Protected routes and server-side auth guards

### 👥 User System

- Users automatically stored in Convex on first sign-in
- Discover and browse other registered users
- Search users by name to start a conversation

### 💬 Chat System

- **Real-time messaging** — messages appear instantly using Convex's reactive queries
- **One-to-one conversations** — private DMs between any two users
- **Group conversations** — create named groups with multiple participants
- **Persistent message history** — all messages stored and retrieved from Convex

### 🎨 UI / UX

- Modern AI-style interface inspired by ChatGPT, Intercom, and Linear
- Dark and light theme toggle via `next-themes`
- Fully responsive layout — works on desktop and mobile
- Clean, minimal chat UI with smooth interactions

---

## 🛠 Tech Stack

### Frontend

| Technology                                                | Purpose                     |
| --------------------------------------------------------- | --------------------------- |
| [Next.js 16](https://nextjs.org/) (App Router)            | Full-stack React framework  |
| [React 19](https://react.dev/)                            | UI component library        |
| [TypeScript](https://www.typescriptlang.org/)             | Static typing               |
| [Tailwind CSS v4](https://tailwindcss.com/)               | Utility-first styling       |
| [shadcn/ui](https://ui.shadcn.com/)                       | Accessible UI components    |
| [Lucide Icons](https://lucide.dev/)                       | Icon library                |
| [next-themes](https://github.com/pacocoursey/next-themes) | Dark/light theme management |

### Backend

| Technology                        | Purpose                                                 |
| --------------------------------- | ------------------------------------------------------- |
| [Convex](https://www.convex.dev/) | Reactive database, server functions, and real-time sync |

### Authentication

| Technology                  | Purpose                                               |
| --------------------------- | ----------------------------------------------------- |
| [Clerk](https://clerk.com/) | Authentication, user management, and session handling |

### Deployment

| Technology                              | Purpose                    |
| --------------------------------------- | -------------------------- |
| [Vercel](https://vercel.com/)           | Frontend hosting and CI/CD |
| [Convex Cloud](https://www.convex.dev/) | Backend hosting            |

---

## ⚙️ Installation

### Prerequisites

Ensure you have the following installed:

- **Node.js** `>= 18.x`
- **npm** or **pnpm**
- A [Convex](https://www.convex.dev/) account
- A [Clerk](https://clerk.com/) account

### Clone the Repository

```bash
git clone https://github.com/Targter/CHATAPP-TARS.git
cd CHATAPP-TARS
```

### Install Dependencies

```bash
npm install
# or
pnpm install
```

---

## 🔑 Environment Variables

Create a `.env.local` file in the root of the project and populate it with the following:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

### Where to Find These Values

| Variable                            | Source                                                                    |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | [Clerk Dashboard](https://dashboard.clerk.com/) → API Keys                |
| `CLERK_SECRET_KEY`                  | [Clerk Dashboard](https://dashboard.clerk.com/) → API Keys                |
| `CONVEX_DEPLOYMENT`                 | Auto-generated by `npx convex dev`                                        |
| `NEXT_PUBLIC_CONVEX_URL`            | [Convex Dashboard](https://dashboard.convex.dev/) → your project settings |

> ⚠️ **Never commit your `.env.local` file.** It is already listed in `.gitignore`.

---

## 🚀 Running Locally

You need **two terminal windows** — one for Convex and one for Next.js.

### Terminal 1 — Start Convex Dev Server

```bash
npx convex dev
```

This watches your `convex/` directory for changes, syncs schema and functions to the cloud, and keeps your local environment in sync.

### Terminal 2 — Start Next.js Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
CHATAPP-TARS/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── layout.tsx              # Root layout with providers
│   │   ├── page.tsx                # Home / redirect page
│   │   └── (chat)/                 # Protected chat routes
│   │       └── page.tsx
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base components
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── sidebar/                # Sidebar navigation
│   │   │   └── Sidebar.tsx
│   │   ├── chat/                   # Core chat UI
│   │   │   ├── ConversationList.tsx
│   │   │   ├── MessageList.tsx
│   │   │   ├── MessageInput.tsx
│   │   │   └── CreateGroupDialog.tsx
│   │   └── shared/                 # Reusable components
│   │       └── Avatar.tsx
│   └── lib/
│       └── utils.ts                # Utility functions
│
├── convex/
│   ├── schema.ts                   # Database schema (tables & indexes)
│   ├── users.ts                    # User queries and mutations
│   ├── conversations.ts            # Conversation queries and mutations
│   ├── messages.ts                 # Message queries and mutations
│   └── auth.config.ts              # Clerk + Convex auth configuration
│
├── public/                         # Static assets
├── .env.local                      # Environment variables (not committed)
├── next.config.ts                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
└── package.json
```

### How Convex Works with Next.js

Convex acts as the **entire backend** for this application — replacing a traditional REST API, database ORM, and WebSocket server in one.

```
┌─────────────────────────────────────────────┐
│              Next.js (Frontend)             │
│                                             │
│  useQuery(api.messages.list)  ──────────►  │
│  useMutation(api.messages.send) ─────────► │
└───────────────────┬─────────────────────────┘
                    │  Reactive subscription
                    ▼
┌─────────────────────────────────────────────┐
│              Convex Cloud (Backend)         │
│                                             │
│  ● Server functions (queries & mutations)   │
│  ● Reactive database (auto re-renders UI)   │
│  ● Clerk JWT verification                   │
└─────────────────────────────────────────────┘
```

- **`useQuery`** — subscribes to a Convex query. When the underlying data changes, the component re-renders automatically — no polling needed.
- **`useMutation`** — calls a server-side function that writes to the database. The change propagates to all subscribed clients instantly.
- **Schema** (`convex/schema.ts`) defines typed tables, and TypeScript types are auto-generated — giving you end-to-end type safety from database to UI.

---

## 🌐 Deployment

### Deploy Frontend to Vercel

1. Push your code to GitHub.
2. Import the repository at [vercel.com/new](https://vercel.com/new).
3. Add all environment variables from `.env.local` to the Vercel project settings.
4. Vercel will automatically detect Next.js and deploy.

### Deploy Backend to Convex Cloud

```bash
npx convex deploy
```

This pushes your production schema and functions to Convex Cloud. The `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` values for production are available in your [Convex dashboard](https://dashboard.convex.dev/).

> 💡 Make sure your **production** Convex URL is set in Vercel's environment variables, not the dev URL.

---

## 🎥 Demo Video

> A walkthrough of the application showcasing authentication, one-to-one messaging, group chat creation, and the dark/light theme toggle.

🔗 [Watch Demo](https://tars.abhaybansal.site/)

---

## 👤 Author

**Abhay Bansal**

- 🌐 Portfolio: [abhaybansal.in](https://abhaybansal.in/)
- 💼 GitHub: [@Targter](https://github.com/Targter)
- 🚀 Live App: [tars.abhaybansal.site](https://tars.abhaybansal.site/)

---

## 📄 License

This project was built as part of a coding challenge and is intended for evaluation purposes.

---

<div align="center">
  Made with ❤️ by <a href="https://abhaybansal.in/">Abhay Bansal</a>
</div>
