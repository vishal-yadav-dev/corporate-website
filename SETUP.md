# Noblesoft — Setup & Deployment

A full-stack Next.js (App Router, TypeScript, Tailwind v4) rebuild of the Noblesoft
site, with a public marketing site and a complete admin panel.

## What's included

**Public site** (`/`) — Home, Company, Practices, Industries, Services,
Careers, Contact. Dark, 3D-styled theme on the Noblesoft prism palette with
Vanta.js animated backgrounds (light/dark toggle, WebGL disabled on mobile),
big kinetic type, scroll animations, a scoped AI chatbot, working
contact/enquiry forms, job listings + apply-with-CV, and newsletter signup.

**Admin panel** (`/admin`) — sign-in gated, multiple admin users:
- **Dashboard** — live counts of leads, employees, subscribers, images.
- **Leads** — contact + enquiry submissions; filter, mark read/archived, delete, CSV export.
- **Employees** — add / deactivate / delete team members, and an **onboarding
  announcement** flow: add a hire → preview the welcome email → pick recipients
  (active colleagues + admins) → confirm send.
- **Subscribers** — newsletter list, CSV export, delete.
- **Jobs & Applications** — post roles with full JD + LinkedIn/Naukri share packs;
  candidate applications with CV download and CSV export.
- **Leadership** — CMS-managed leaders (photo, bio, order).
- **Site content** — partners, offices, practices, Services blocks, awards,
  About copy, hero banners (per-banner Vanta effect), and key site copy.
- **Images** — upload / delete images (stored in Postgres), assign a "slot".
- **Email** — send announcements/newsletters with attachments + CC/BCC, AI draft
  assist (Gemini, capped at 5 drafts/thread), editable HTML templates.
- **Admin users** — add/remove admins with per-section permissions
  (owner / admin / editor). Only the owner can create or delete an owner.

## Prerequisites
- Node.js **20.9+** (Next 16 requirement; Vercel uses Node 22)
- A Neon Postgres database (or any Postgres) — https://neon.tech
- Optional: SMTP credentials for sending onboarding emails
- Optional: a Google Gemini API key for AI email drafting + the site chatbot

## 1. Install
```bash
npm install
```

## 2. Configure environment
Copy the example and fill it in:
```bash
cp .env.example .env
```

Set these in `.env` (see `.env.example` for the full annotated list):

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Your Neon connection string (pooled URL, keep `?sslmode=require`). **Leave empty for local dev** — the app falls back to an in-process database at `./.pgdata`. |
| `AUTH_SECRET` | Session-signing secret. Generate: `openssl rand -base64 32` |
| `NEXT_PUBLIC_SITE_URL` | Public origin (e.g. `https://www.noblesoft.com`) — used for absolute links in emails and job share URLs. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | Your first admin login (used by the seed script). |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` / `SMTP_REPLY_TO` | SMTP for onboarding email. **If unset, emails are composed but not sent** (safe for dev). |
| `GEMINI_API_KEY` | Google Gemini key for AI email drafting + chatbot. **If unset, those features return a friendly 503.** Free key: https://aistudio.google.com/apikey |

> Never commit `.env`. It's already in `.gitignore`.

### Gmail / Google Workspace SMTP
Use `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER=you@yourdomain.com`,
and for `SMTP_PASS` use an **App Password** (Google Account → Security → App
Passwords), not your normal password.

## 3. Create tables & first admin
```bash
npm run db:setup   # applies db/schema.sql to your database
npm run seed       # creates the first admin from SEED_ADMIN_* vars
```

## 4. Run
```bash
npm run dev        # http://localhost:3000
```
- Public site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin` → sign in with your seeded admin.

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel: **Add New → Project → Import** the GitHub repo. Framework preset
   auto-detects as **Next.js**; leave build/output settings at their defaults.
3. Under **Environment Variables**, add (Production + Preview):

   | Variable | Notes |
   |---|---|
   | `DATABASE_URL` | Neon **pooled** connection string, `...-pooler...?sslmode=require` |
   | `AUTH_SECRET` | `openssl rand -base64 32` — a fresh value, not the dev one |
   | `NEXT_PUBLIC_SITE_URL` | Your production URL (e.g. `https://corporate-website.vercel.app` or the custom domain) |
   | `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` / `SEED_ADMIN_NAME` | first admin login |
   | `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` / `SMTP_REPLY_TO` | optional — omit to disable sending |
   | `GEMINI_API_KEY` | optional — omit to disable AI features |

4. Deploy. Vercel builds `main` as **production** and every other branch/PR as a
   **preview** deployment.
5. **One-time DB init** — from your machine, with the production `DATABASE_URL`
   exported (Node 20.9+):
   ```bash
   npm run db:setup      # apply db/schema.sql
   npm run seed          # create the first admin
   npm run seed:site && npm run seed:banners && npm run seed:jobs \
     && npm run seed:leaders && npm run seed:staffing && npm run seed:awards
   ```
6. Sign in at `https://<your-domain>/admin` and change the seeded password.

## Architecture notes
- **Data layer** (`lib/db.ts`) uses `pg` when `DATABASE_URL` is set (Neon /
  production) and an in-process PGlite database for local dev — same SQL both ways.
- **Auth** (`lib/auth.ts`) — bcrypt password hashing + JWT session in an httpOnly
  cookie; `proxy.ts` guards `/admin/*`.
- **Email** (`lib/email.ts`) — Nodemailer; swap providers by changing env vars only.
- **Images** are stored as bytes in Postgres and served from `/api/images/[id]`.
  For heavy media, swap this for Vercel Blob / S3 (one function to change).

## Security checklist before go-live
- [ ] Change the seeded admin password after first login.
- [ ] Set a strong `AUTH_SECRET` in production (not the dev default).
- [ ] Restrict `SMTP_FROM` to a domain you control (SPF/DKIM) so mail isn't flagged.
- [ ] Review `db/schema.sql` and back up your Neon database.
