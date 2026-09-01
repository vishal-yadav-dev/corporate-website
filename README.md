# Noblesoft — corporate website

Full-stack **Next.js 16** (App Router, TypeScript, Tailwind v4) rebuild of the
Noblesoft Technologies site: a dark, 3D-styled public marketing site with
Vanta.js animated backgrounds, plus a complete CMS/admin panel.

- **Public site** — Home, Company, Practices, Industries, Services, Careers,
  Contact. Light/dark toggle, scoped AI chatbot, contact/enquiry forms, job
  listings with apply-and-upload-CV, newsletter signup.
- **Admin** (`/admin`) — leads, employees + onboarding email, subscribers, jobs &
  applications, leadership, full site-content CMS, image library, email
  broadcasts with AI draft assist, and role-based admin users
  (owner / admin / editor).

## Quick start

```bash
npm install
cp .env.example .env        # fill in DATABASE_URL etc. (or leave DATABASE_URL empty for a local PGlite DB)
npm run db:setup && npm run seed
npm run dev                 # http://localhost:3000
```

Requires **Node 20.9+**.

## Deployment

See [SETUP.md](./SETUP.md) for the full environment-variable reference and the
Vercel deploy walkthrough.

## Architecture

- `app/` — App Router pages (`(site)` route group for the public site) and API
  route handlers, which are thin re-exports of `lib/controllers/*` → `lib/services/*`.
- `lib/db.ts` — one SQL API over `pg` (Neon / production) or in-process PGlite (dev).
- `lib/auth.ts` + `proxy.ts` — bcrypt + JWT session cookie; `proxy.ts` guards `/admin/*`.
- `lib/permissions.ts` — section-level RBAC.
- `components/VantaBg.tsx` — lazy, theme-aware WebGL/p5 backgrounds (disabled on mobile / reduced-motion).
- `db/schema.sql` — idempotent schema, applied by `npm run db:setup`.
