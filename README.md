# MailCraft AI — AI Email Generator

> Generate professional, personalized emails in seconds with the power of Gemini AI.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8?style=flat-square&logo=tailwindcss)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat-square&logo=mongodb)

## Overview

MailCraft AI is a full-stack SaaS MVP that lets users generate professional emails
using Google Gemini AI. Users can choose the topic, tone, and length — and get a
ready-to-send email in seconds.

## Features

- **AI Email Generation** — Powered by Google Gemini 1.5 Flash
- **5 Tone Options** — Professional, Friendly, Formal, Casual, Persuasive
- **3 Length Options** — Short (~100w), Medium (~200w), Long (~350w)
- **JWT Authentication** — Secure register / login / logout
- **Free & Premium Plans** — 10 emails/day free, unlimited on Premium
- **Dark Mode** — System-aware with manual toggle
- **Responsive Design** — Mobile-first, works on all devices
- **In-Memory Fallback** — Runs without MongoDB for demo purposes
- **Copy / Regenerate / Clear** — Full result management

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, React, TypeScript, TailwindCSS |
| UI Components | shadcn/ui (Radix UI), Framer Motion |
| Forms | React Hook Form + Zod |
| Backend | Next.js API Routes |
| Database | MongoDB Atlas + Mongoose (in-memory fallback) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | Google Gemini 1.5 Flash |
| Deployment | Vercel |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Login & Register pages
│   ├── (dashboard)/        # Protected Dashboard & Profile
│   ├── api/                # API Routes
│   │   ├── auth/           # register / login / me
│   │   ├── email/generate/ # AI generation endpoint
│   │   └── profile/        # Profile update
│   ├── pricing/            # Pricing page
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Base UI components
│   ├── layout/             # Navbar, Footer
│   ├── landing/            # Hero, Features, Benefits, FAQ, CTA
│   └── dashboard/          # EmailGenerator, ResultCard
├── context/                # AuthContext
├── hooks/                  # useToast
├── lib/                    # auth, db, utils, validations
├── models/                 # Mongoose User model
├── services/ai/            # Gemini service + interface
├── store/                  # In-memory user store
└── types/                  # Global TypeScript types
```

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/ai-email-generator.git
cd ai-email-generator
npm install
```

### 2. Environment Variables

```bash
cp .env.example .env.local
```

Fill in your values:

| Variable | Required | Description |
|---|---|---|
| `JWT_SECRET` | ✅ | Random secret string for JWT signing |
| `GEMINI_API_KEY` | ✅ | Get from [Google AI Studio](https://aistudio.google.com) |
| `MONGODB_URI` | ⬜ | MongoDB Atlas URI (optional, app works without it) |

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. Build for Production

```bash
npm run build
npm start
```

## API Reference

### Auth

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login with email/password |
| GET | `/api/auth/me` | Get current user (Bearer token) |

### Email

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/email/generate` | ✅ | Generate email with AI |

**Body:** `{ topic: string, tone: string, length: string }`

### Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| PATCH | `/api/profile` | ✅ | Update user name |

## Deployment to Vercel

1. Push to GitHub
2. Import project at [vercel.com](https://vercel.com)
3. Add environment variables:
   - `JWT_SECRET`
   - `GEMINI_API_KEY`
   - `MONGODB_URI` (optional)
4. Deploy — Vercel auto-detects Next.js

## Architectural Decisions

### In-Memory Fallback
The app works without MongoDB using an in-memory store. This allows instant
demo deployment without database setup. `connectDB()` returns `false` when
no `MONGODB_URI` is set, and all routes fall back to `inMemoryStore`.

### AI Service Layer
The AI generation is abstracted behind an `AIEmailService` interface.
Swapping Gemini for OpenAI or Claude requires only changing `src/services/ai/index.ts`
— zero changes to UI or API routes.

### JWT in localStorage
JWT is stored in `localStorage` for simplicity in this MVP. For production,
consider `httpOnly` cookies to prevent XSS exposure.

### App Router with Route Groups
- `(auth)` — unauthenticated pages (login, register)
- `(dashboard)` — protected pages with auth guard in layout

## License

MIT