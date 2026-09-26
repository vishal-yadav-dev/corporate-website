/* DEMO content for case studies and testimonials so the proof sections render
   in the demo build. Every client name here is fictional and every outcome is
   qualitative — no invented metrics. Replace with client-approved material
   before production; `npx tsx scripts/seed-proof.ts --purge` clears it.
   Run: npx tsx scripts/seed-proof.ts */
import "dotenv/config";
import { q } from "../lib/db";
import { cuid } from "../lib/id";

const CASES = [
  {
    slug: "utility-service-consolidation", title: "One service view for a regional utility",
    client: "Cascade Power & Light (demo)", industry: "Utilities",
    challenge: "Customer records lived across a legacy CIS, a separate outage tool and a call-centre spreadsheet, so agents opened three systems to answer one question.",
    approach: "We mapped the agent journey before touching the platform, then designed a single service console with the outage feed and billing history surfaced in context.",
    solution: "Salesforce Service Cloud with an integration layer to the billing system and the outage management platform.",
    technology: "Salesforce Service Cloud, MuleSoft, Data Migration",
    delivery_model: "Project delivery with a dedicated integration pod",
    outcome: "Agents now resolve billing and outage questions from a single console, and the same record is used by field and call-centre teams.",
    quote: "Our agents stopped apologising for the wait while they switched screens.",
    quote_by: "Director of Customer Operations, Cascade Power & Light (demo)",
    image_url: "/delivery/integrate.jpg",
  },
  {
    slug: "manufacturer-erp-modernization", title: "Plant floor and ledger telling the same story",
    client: "Pinecrest Industries (demo)", industry: "Manufacturing",
    challenge: "Production planning ran on spreadsheets alongside an ageing ERP, so finance closed the month on numbers the plant no longer recognised.",
    approach: "A current-state assessment first, then a phased roadmap that moved planning and inventory before touching finance, to keep the close intact throughout.",
    solution: "Infor CloudSuite implementation with supply-chain integration and reworked inventory processes.",
    technology: "Infor CloudSuite, Integration, Data & Analytics",
    delivery_model: "SOW delivery team with onsite process leads",
    outcome: "Planning, inventory and finance now read from one system, and month-end reconciliation no longer starts with a spreadsheet comparison.",
    quote: "The close stopped being an argument about whose number was right.",
    quote_by: "VP Finance, Pinecrest Industries (demo)",
    image_url: "/delivery/build.jpg",
  },
  {
    slug: "university-student-systems", title: "Connecting recruitment to retention on campus",
    client: "Alder State University (demo)", industry: "Higher Education",
    challenge: "Admissions, student records and alumni engagement each held part of the student story, and none of them talked to the others.",
    approach: "We started with the questions the institution could not answer, then designed the data flow that would answer them before selecting tooling.",
    solution: "Salesforce Education Cloud alongside Workday, with an integration layer carrying the student record end to end.",
    technology: "Salesforce Education Cloud, Workday, API Integration",
    delivery_model: "Consulting engagement moving into managed support",
    outcome: "Advisors see the full student record from enquiry through to alumni, and reporting no longer requires manual joins between departments.",
    quote: "We can finally follow a student through, rather than piecing them together.",
    quote_by: "CIO, Alder State University (demo)",
    image_url: "/delivery/discover.jpg",
  },
];

const CLIENT_QUOTES = [
  { quote: "They started with our business problem, not with a product they wanted to sell us.", person: "Director of Customer Operations", title: "", organization: "Cascade Power & Light (demo)", context: "Salesforce Service Cloud" },
  { quote: "The team stayed through hypercare. That is rarer than it should be.", person: "VP Finance", title: "", organization: "Pinecrest Industries (demo)", context: "Infor CloudSuite" },
  { quote: "Clear communication, and no surprises at the end of a sprint.", person: "CIO", title: "", organization: "Alder State University (demo)", context: "Education Cloud & Workday" },
  { quote: "They brought the specialists we could not hire fast enough ourselves.", person: "Head of IT", title: "", organization: "Northvale Health (demo)", context: "IT Staff Augmentation" },
];

const CANDIDATE_QUOTES = [
  { quote: "The recruiter understood the stack well enough to tell me what the role actually involved.", person: "Salesforce Developer", title: "", organization: "", context: "Salesforce" },
  { quote: "Interview prep was specific, not generic advice. It showed.", person: "Data Engineer", title: "", organization: "", context: "Data" },
  { quote: "Onboarding and payroll were handled properly from day one.", person: "SAP Consultant", title: "", organization: "", context: "SAP" },
  { quote: "They stayed in touch after placement rather than moving on to the next req.", person: "QA Automation Engineer", title: "", organization: "", context: "Quality Engineering" },
];

(async () => {
  if (process.argv.includes("--purge")) {
    await q("DELETE FROM case_studies");
    await q("DELETE FROM testimonials");
    console.log("✓ demo proof content removed");
    process.exit(0);
  }

  await q("DELETE FROM case_studies");
  for (let i = 0; i < CASES.length; i++) {
    const c = CASES[i];
    await q(
      `INSERT INTO case_studies (id, slug, title, client, industry, challenge, approach, solution,
        technology, delivery_model, outcome, quote, quote_by, image_url, sort_order, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,true)`,
      [cuid(), c.slug, c.title, c.client, c.industry, c.challenge, c.approach, c.solution,
       c.technology, c.delivery_model, c.outcome, c.quote, c.quote_by, c.image_url, i * 10]
    );
  }
  console.log(`case_studies   ${CASES.length} demo rows`);

  await q("DELETE FROM testimonials");
  let i = 0;
  for (const t of CLIENT_QUOTES) {
    await q(`INSERT INTO testimonials (id, kind, quote, person, title, organization, context, sort_order, is_active)
             VALUES ($1,'client',$2,$3,$4,$5,$6,$7,true)`,
      [cuid(), t.quote, t.person, t.title, t.organization, t.context, i * 10]); i++;
  }
  i = 0;
  for (const t of CANDIDATE_QUOTES) {
    await q(`INSERT INTO testimonials (id, kind, quote, person, title, organization, context, sort_order, is_active)
             VALUES ($1,'candidate',$2,$3,$4,$5,$6,$7,true)`,
      [cuid(), t.quote, t.person, t.title, t.organization, t.context, i * 10]); i++;
  }
  console.log(`testimonials   ${CLIENT_QUOTES.length} client + ${CANDIDATE_QUOTES.length} candidate demo rows`);
  process.exit(0);
})();
