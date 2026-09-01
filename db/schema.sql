-- Testsoft admin schema (Postgres / Neon compatible)

CREATE TABLE IF NOT EXISTS admins (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  password    TEXT NOT NULL,           -- bcrypt hash
  role        TEXT NOT NULL DEFAULT 'admin',  -- 'owner' | 'admin' | 'editor'
  permissions TEXT NOT NULL DEFAULT '[]',     -- JSON array of section keys (used when role = 'editor')
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE admins ADD COLUMN IF NOT EXISTS permissions TEXT NOT NULL DEFAULT '[]';

CREATE TABLE IF NOT EXISTS leads (
  id          TEXT PRIMARY KEY,
  source      TEXT NOT NULL DEFAULT 'contact',  -- 'contact' | 'enquiry'
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  company     TEXT,
  phone       TEXT,
  practice    TEXT,
  message     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new',       -- 'new' | 'read' | 'archived'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leads_source_idx ON leads (source);
CREATE INDEX IF NOT EXISTS leads_status_idx ON leads (status);
CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC);

CREATE TABLE IF NOT EXISTS subscribers (
  id          TEXT PRIMARY KEY,
  email       TEXT UNIQUE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'unsubscribed'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS site_images (
  id          TEXT PRIMARY KEY,
  slot        TEXT,
  alt         TEXT NOT NULL DEFAULT '',
  mime_type   TEXT NOT NULL,
  data        BYTEA NOT NULL,
  size        INTEGER NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS site_images_slot_idx ON site_images (slot);

CREATE TABLE IF NOT EXISTS content (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS employees (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  title       TEXT,
  department  TEXT,
  location    TEXT,
  start_date  DATE,
  status      TEXT NOT NULL DEFAULT 'active',    -- 'active' | 'inactive'
  photo_id    TEXT REFERENCES site_images(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS employees_status_idx ON employees (status);

-- Log of onboarding announcements sent (audit trail)
CREATE TABLE IF NOT EXISTS announcements (
  id           TEXT PRIMARY KEY,
  employee_id  TEXT REFERENCES employees(id) ON DELETE SET NULL,
  subject      TEXT NOT NULL,
  body         TEXT NOT NULL,
  recipients   TEXT NOT NULL,        -- JSON array of emails
  sent_count   INTEGER NOT NULL DEFAULT 0,
  status       TEXT NOT NULL DEFAULT 'sent',   -- 'sent' | 'skipped' | 'failed'
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Carousel banners for hero section
CREATE TABLE IF NOT EXISTS banners (
  id          TEXT PRIMARY KEY,
  title       TEXT NOT NULL DEFAULT '',
  subtitle    TEXT NOT NULL DEFAULT '',
  cta_text    TEXT NOT NULL DEFAULT '',
  cta_url     TEXT NOT NULL DEFAULT '',
  media_id    TEXT REFERENCES site_images(id) ON DELETE SET NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS banners_sort_idx ON banners (sort_order);
CREATE INDEX IF NOT EXISTS banners_active_idx ON banners (is_active);
ALTER TABLE banners ADD COLUMN IF NOT EXISTS background_fx TEXT NOT NULL DEFAULT '';

-- Job vacancies (managed from /admin/jobs, shown on /careers)
CREATE TABLE IF NOT EXISTS jobs (
  id               TEXT PRIMARY KEY,
  title            TEXT NOT NULL,
  slug             TEXT UNIQUE NOT NULL,
  practice         TEXT,
  location         TEXT,
  employment_type  TEXT NOT NULL DEFAULT 'Full-time',   -- Full-time | Contract | Part-time | Internship
  workplace        TEXT NOT NULL DEFAULT 'On-site',     -- On-site | Hybrid | Remote
  experience       TEXT,
  salary_range     TEXT,
  summary          TEXT NOT NULL DEFAULT '',            -- short teaser for cards
  description      TEXT NOT NULL DEFAULT '',            -- full JD body
  responsibilities TEXT NOT NULL DEFAULT '',            -- one bullet per line
  requirements     TEXT NOT NULL DEFAULT '',            -- one bullet per line
  benefits         TEXT NOT NULL DEFAULT '',            -- one bullet per line
  status           TEXT NOT NULL DEFAULT 'draft',       -- draft | published | closed
  post_linkedin    BOOLEAN NOT NULL DEFAULT false,
  post_naukri      BOOLEAN NOT NULL DEFAULT false,
  linkedin_posted_at TIMESTAMPTZ,
  naukri_posted_at   TIMESTAMPTZ,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS jobs_status_idx ON jobs (status);
CREATE INDEX IF NOT EXISTS jobs_sort_idx ON jobs (sort_order);

-- Candidate applications (basic details + CV, submitted from /careers/[slug])
CREATE TABLE IF NOT EXISTS applications (
  id           TEXT PRIMARY KEY,
  job_id       TEXT REFERENCES jobs(id) ON DELETE SET NULL,
  job_title    TEXT NOT NULL DEFAULT '',                -- denormalised snapshot
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  phone        TEXT,
  location     TEXT,
  linkedin_url TEXT,
  cover_note   TEXT,
  cv_filename  TEXT NOT NULL,
  cv_mime_type TEXT NOT NULL,
  cv_data      BYTEA NOT NULL,
  cv_size      INTEGER NOT NULL,
  status       TEXT NOT NULL DEFAULT 'new',             -- new | reviewing | shortlisted | rejected | archived
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS applications_job_idx ON applications (job_id);
CREATE INDEX IF NOT EXISTS applications_status_idx ON applications (status);
CREATE INDEX IF NOT EXISTS applications_created_idx ON applications (created_at DESC);

-- Leadership team (managed from /admin/leadership, shown on /company#leadership)
CREATE TABLE IF NOT EXISTS leaders (
  id           TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  title        TEXT NOT NULL DEFAULT '',
  bio          TEXT NOT NULL DEFAULT '',
  linkedin_url TEXT NOT NULL DEFAULT '',
  photo_id     TEXT REFERENCES site_images(id) ON DELETE SET NULL,
  photo_url    TEXT NOT NULL DEFAULT '',      -- external image URL fallback
  sort_order   INTEGER NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS leaders_sort_idx ON leaders (sort_order);
CREATE INDEX IF NOT EXISTS leaders_active_idx ON leaders (is_active);

-- Partners & clients logo strip (managed from /admin/partners)
CREATE TABLE IF NOT EXISTS partners (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  kind        TEXT NOT NULL DEFAULT 'partner',   -- 'partner' | 'client'
  logo_id     TEXT REFERENCES site_images(id) ON DELETE SET NULL,
  logo_url    TEXT NOT NULL DEFAULT '',
  website     TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS partners_sort_idx ON partners (sort_order);

-- Office locations (managed from /admin/offices, shown on contact + footer)
CREATE TABLE IF NOT EXISTS offices (
  id          TEXT PRIMARY KEY,
  region      TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  address     TEXT NOT NULL DEFAULT '',
  tel         TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS offices_sort_idx ON offices (sort_order);

-- Practices (managed from /admin/practices, shown on /practices + homepage)
CREATE TABLE IF NOT EXISTS practices (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  tag         TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  stack       TEXT NOT NULL DEFAULT '',           -- comma-separated chips
  logo_id     TEXT REFERENCES site_images(id) ON DELETE SET NULL,
  logo_url    TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS practices_sort_idx ON practices (sort_order);

-- US Staffing services (managed from /admin/site, shown on /us-staffing)
CREATE TABLE IF NOT EXISTS staffing (
  id          TEXT PRIMARY KEY,
  slug        TEXT UNIQUE NOT NULL,
  name        TEXT NOT NULL,
  line        TEXT NOT NULL DEFAULT '',
  body        TEXT NOT NULL DEFAULT '',
  points      TEXT NOT NULL DEFAULT '',            -- one bullet per line
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS staffing_sort_idx ON staffing (sort_order);

-- Awards & recognition (managed from /admin/site, shown on /company#awards)
CREATE TABLE IF NOT EXISTS awards (
  id          TEXT PRIMARY KEY,
  year        TEXT NOT NULL DEFAULT '',
  title       TEXT NOT NULL,
  image_id    TEXT REFERENCES site_images(id) ON DELETE SET NULL,
  image_url   TEXT NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS awards_sort_idx ON awards (sort_order);

-- Password reset / admin-invite tokens
CREATE TABLE IF NOT EXISTS password_tokens (
  id          TEXT PRIMARY KEY,
  admin_id    TEXT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
  token_hash  TEXT NOT NULL,                   -- sha256 of the emailed token
  purpose     TEXT NOT NULL DEFAULT 'reset',   -- 'reset' | 'invite'
  expires_at  TIMESTAMPTZ NOT NULL,
  used_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS password_tokens_hash_idx ON password_tokens (token_hash);
CREATE INDEX IF NOT EXISTS password_tokens_admin_idx ON password_tokens (admin_id);

-- Editable email templates (HTML), keyed by slug
CREATE TABLE IF NOT EXISTS email_templates (
  slug        TEXT PRIMARY KEY,               -- 'admin-invite' | 'password-reset' | 'newsletter'
  name        TEXT NOT NULL,
  subject     TEXT NOT NULL DEFAULT '',
  html        TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Newsletter campaigns sent to subscribers (audit trail)
CREATE TABLE IF NOT EXISTS newsletters (
  id          TEXT PRIMARY KEY,
  subject     TEXT NOT NULL,
  html        TEXT NOT NULL,
  sent_count  INTEGER NOT NULL DEFAULT 0,
  status      TEXT NOT NULL DEFAULT 'sent',   -- 'sent' | 'skipped' | 'failed'
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
