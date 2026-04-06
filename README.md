# Arc Ecosystem Registry & Review Terminal

A professional, institutional-grade web application for tracking, reviewing, and analyzing onchain applications within the **@Arc ecosystem** — the Internet Financial System.

## Overview

The Arc Registry serves as a technical directory and review platform for builders ("Architects") contributing to the Arc infrastructure. It provides project discovery, submission workflows, admin management, and secure authentication — all wrapped in a bold, editorial design language.

---

## Features

### 🏛️ Project Registry
- Searchable directory of projects building on @Arc
- Each entry includes name, category, summary, status, and infrastructure details
- Filter by category: Internet Capital Markets, Stablecoin-native Infrastructure, Programmable Settlement, and more
- Featured project highlights on the homepage hero grid

### 📝 Project Submissions
- Authenticated users can submit new projects for review
- Submissions include contract address, problem solved, documentation links, and infrastructure details
- Admin approval workflow — submissions start with `pending` status

### 🔐 Authentication & Email Verification
- Email + password registration and login
- **Email verification required** — new accounts receive a verification link and must confirm before signing in
- Auth context with role-based access (admin / user)
- Redirect to homepage after successful login

### 🛡️ Admin Panel (`/admin`)
- **Projects Tab**: Review, approve, or manage submitted projects
- **Submissions Tab**: View and moderate pending project submissions
- **Users Tab**: View all registered architects, grant or revoke admin roles
- Self-protection: admins cannot revoke their own access

### 👤 User Roles
- Roles stored in a dedicated `user_roles` table (not on profiles) to prevent privilege escalation
- `has_role()` security-definer function for safe RLS policy checks
- Two roles: `admin` and `user`
- Default role (`user`) assigned automatically on registration via database trigger

### 🎨 Design
- Dark, editorial aesthetic with monospace accents and bold typography
- Animated hero grid with featured project cards
- Fully responsive layout
- Custom design tokens via CSS variables and Tailwind config

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS v3, shadcn/ui, Framer Motion |
| Backend | Lovable Cloud (Supabase) |
| Auth | Email + password with email verification |
| Database | PostgreSQL with Row-Level Security |
| Routing | React Router v6 |
| State | TanStack React Query |

---

## Project Structure

```
src/
├── components/       # Shared UI components (Header, Footer, ProjectCard, etc.)
│   └── ui/           # shadcn/ui primitives
├── contexts/         # AuthContext with role-based access
├── data/             # Static project seed data
├── hooks/            # Custom hooks (toast, mobile detection)
├── integrations/     # Supabase client & auto-generated types
├── pages/            # Route pages (Index, Auth, Submit, Admin, ProjectDetail)
└── lib/              # Utility functions
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | User display names and avatars, linked to `auth.users` |
| `user_roles` | Role assignments (`admin` / `user`) per user |
| `projects` | Approved project registry entries |
| `project_submissions` | Pending submissions awaiting admin review |
| `project_insights` | User-contributed commentary on projects |

---

## Routes

| Path | Access | Description |
|------|--------|-------------|
| `/` | Public | Homepage with hero grid and project directory |
| `/auth` | Public | Login and registration |
| `/submit` | Authenticated | Submit a new project |
| `/project/:id` | Public | Project detail and insights |
| `/admin` | Admin only | Management dashboard |

---

## Governance Disclosure

> This platform is an independent editorial resource for the @Arc ecosystem. Reviews focus on technical utility and infrastructure. No content should be construed as financial advice or token speculation.
