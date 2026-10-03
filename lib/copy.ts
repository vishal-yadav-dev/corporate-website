import "server-only";

/**
 * Every page string the client is allowed to change.
 *
 * One registry rather than strings scattered through the page files: the admin
 * UI is generated from this, so adding an editable field is a single entry here
 * plus one `copy[...]` in the page — the editor, its grouping and its labels
 * follow automatically and cannot drift from what the site actually renders.
 *
 * `value` is the fallback. Nothing is seeded into the database, so a key the
 * client has never touched keeps rendering this, and "Reset" simply deletes the
 * row.
 */
export type CopyField = {
  key: string;
  label: string;
  /** which page the field belongs to, for the editor's navigation */
  page: string;
  /** the section within that page */
  section: string;
  value: string;
  /** a long field gets a textarea */
  multiline?: boolean;
  /** anchor on the page, so the editor can jump the preview to it */
  anchor?: string;
};

export const COPY_FIELDS: CopyField[] = [
  /* ---------------- Home ---------------- */
  { page: "Home", section: "Practices", key: "home.practices.eyebrow", label: "Eyebrow", value: "Practices" },
  { page: "Home", section: "Practices", key: "home.practices.title", label: "Heading", value: "The platforms we live in." },
  { page: "Home", section: "Practices", key: "home.practices.intro", label: "Intro", multiline: true,
    value: "Full-lifecycle delivery on the enterprise platforms your business runs on." },
  { page: "Home", section: "Practices", key: "home.practices.cta", label: "Link text", value: "All practices" },

  { page: "Home", section: "SLED spotlight", key: "home.sled.eyebrow", label: "Eyebrow", value: "State, Local & Education" },
  { page: "Home", section: "SLED spotlight", key: "home.sled.title", label: "Heading", value: "Technology for the public sector." },
  { page: "Home", section: "SLED spotlight", key: "home.sled.body", label: "Body", multiline: true,
    value: "We help government agencies, public institutions, and education organizations modernize technology, strengthen digital capabilities, and access specialized technology talent, with the auditability and procurement discipline public work demands." },

  { page: "Home", section: "Workforce solutions", key: "home.workforce.eyebrow", label: "Eyebrow", value: "Technology Workforce Solutions" },
  { page: "Home", section: "Workforce solutions", key: "home.workforce.title", label: "Heading", value: "The right people to execute it." },
  { page: "Home", section: "Workforce solutions", key: "home.workforce.body", label: "Body", multiline: true,
    value: "Great technology strategies require the right people to execute them. We provide flexible workforce solutions that help organizations access specialized technology talent when and where they need it." },

  { page: "Home", section: "Industries", key: "home.industries.eyebrow", label: "Eyebrow", value: "Industry Expertise" },
  { page: "Home", section: "Industries", key: "home.industries.title", label: "Heading", value: "Technology solutions built around your industry." },
  { page: "Home", section: "Industries", key: "home.industries.cta", label: "Link text", value: "All industries" },

  { page: "Home", section: "How we deliver", key: "home.delivery.eyebrow", label: "Eyebrow", value: "How we deliver" },
  { page: "Home", section: "How we deliver", key: "home.delivery.title", label: "Heading", value: "From strategy to execution." },
];

/** The shape `getCopy` wants: key → fallback. */
export const COPY_DEFAULTS: Record<string, string> = Object.fromEntries(
  COPY_FIELDS.map((f) => [f.key, f.value])
);
