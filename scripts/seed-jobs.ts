/* Seeds a starter set of published job vacancies so /careers is populated.
   Everything is editable afterwards from /admin/jobs. Run: npm run seed:jobs */
import "dotenv/config";
import { q, one } from "../lib/db";
import { cuid } from "../lib/id";
import { slugify } from "../lib/jobs";

type Seed = {
  title: string; practice: string; location: string; employment_type: string;
  workplace: string; experience: string; summary: string; description: string;
  responsibilities: string; requirements: string;
};

const BENEFITS = [
  "Funded certifications across Salesforce, SAP, Oracle, Infor, and Workday",
  "Senior mentorship from day one on real client transformations",
  "Global mobility across US, nearshore Mexico, and offshore India delivery centers",
  "Ownership culture — consultants are treated as partners, not resources",
].join("\n");

const SEEDS: Seed[] = [
  {
    title: "Senior Salesforce Developer",
    practice: "Salesforce", location: "Frisco, TX", employment_type: "Full-time",
    workplace: "Remote", experience: "5+ years",
    summary: "Build and extend Sales Cloud, Service Cloud, and Experience Cloud for enterprise clients — engineered for adoption, not just deployment.",
    description: "You will own custom development on the Salesforce platform across multiple client engagements, partnering with functional consultants and architects to turn requirements into resilient, well-tested solutions.",
    responsibilities: "Design and build Apex, LWC, and Flow solutions on Sales & Service Cloud\nLead integrations with ERP and middleware via REST/SOAP and platform events\nReview code and mentor mid-level developers\nPartner with architects on data model and scalability decisions",
    requirements: "5+ years of Salesforce development (Apex, LWC, SOQL)\nPlatform Developer I certification (PD II a plus)\nExperience with CI/CD, SFDX, and test automation\nStrong communication with client stakeholders",
  },
  {
    title: "SAP S/4HANA Consultant (FI/CO)",
    practice: "SAP", location: "Noida, India", employment_type: "Full-time",
    workplace: "Hybrid", experience: "6+ years",
    summary: "Deliver S/4HANA finance transformations end to end — greenfield, brownfield, and selective migration.",
    description: "Join our SAP practice to configure and deploy core finance processes for manufacturing and utilities clients moving to S/4HANA.",
    responsibilities: "Configure FI/CO: GL, AP, AR, asset accounting, cost center and profitability analysis\nRun workshops and prepare functional specs for ABAP development\nSupport data migration, cutover, and hypercare\nTroubleshoot production issues within SLA",
    requirements: "6+ years SAP FI/CO with at least one S/4HANA project\nStrong grasp of integration with MM and SD\nExperience with New Asset Accounting and Universal Journal\nBachelor's in finance, accounting, or engineering",
  },
  {
    title: "Workday HCM Consultant",
    practice: "Workday", location: "Remote — US", employment_type: "Contract",
    workplace: "Remote", experience: "4+ years",
    summary: "Deploy and optimize Workday HCM — core HR, business processes, security, and integrations.",
    description: "Support Workday deployments and post-production optimization for higher-education and enterprise clients.",
    responsibilities: "Configure core HCM, compensation, and business processes\nBuild and maintain EIB and Core Connector integrations\nDefine security groups and domain/business-process policies\nRun testing cycles and knowledge transfer",
    requirements: "4+ years hands-on Workday HCM configuration\nWorkday Pro or partner certification\nExperience with calculated fields and custom reports\nStrong client-facing skills",
  },
  {
    title: "MuleSoft Integration Engineer",
    practice: "MuleSoft", location: "Visakhapatnam, India", employment_type: "Full-time",
    workplace: "On-site", experience: "3+ years",
    summary: "Design API-led application networks on Anypoint that make enterprise data reusable.",
    description: "Build and operate integrations connecting ERP, CRM, and legacy systems in real time.",
    responsibilities: "Design System, Process, and Experience APIs following API-led connectivity\nBuild flows with DataWeave, connectors, and error handling\nSet up CI/CD, monitoring, and alerting on CloudHub / RTF\nDocument APIs in Anypoint Exchange",
    requirements: "3+ years building MuleSoft integrations\nMCD Level 1 certification\nSolid understanding of REST, OAuth2, and messaging patterns\nExperience with CloudHub or Runtime Fabric",
  },
  {
    title: "Oracle Cloud SCM Lead",
    practice: "Oracle Apps", location: "Monterrey, México", employment_type: "Full-time",
    workplace: "Hybrid", experience: "8+ years",
    summary: "Lead Oracle Fusion Cloud SCM implementations across procurement, inventory, and order management.",
    description: "Own the functional workstream for Oracle Cloud SCM engagements, from design through go-live and support.",
    responsibilities: "Lead requirements and design workshops for SCM modules\nConfigure procurement, inventory, and order management\nCoordinate offshore build and testing teams\nManage client relationship and scope",
    requirements: "8+ years Oracle SCM (Cloud and/or EBS) with 2+ Cloud implementations\nExperience leading a functional team\nStrong knowledge of procure-to-pay and order-to-cash\nOracle Cloud SCM certification preferred",
  },
  {
    title: "Engagement Manager — Delivery",
    practice: "Delivery", location: "Frisco, TX", employment_type: "Full-time",
    workplace: "On-site", experience: "10+ years",
    summary: "Own delivery health, margin, and client satisfaction across a portfolio of enterprise application projects.",
    description: "Lead multi-workstream programs across our Salesforce, SAP, and Oracle practices, aligning business objectives with technical execution.",
    responsibilities: "Own project P&L, staffing, and risk across a portfolio\nRun steering committees and executive status reporting\nCoach scrum masters and tech leads on delivery discipline\nGrow accounts through trusted client relationships",
    requirements: "10+ years delivering enterprise software projects\nPMP or Certified Scrum Master\nExperience managing distributed onshore/offshore teams\nStrong commercial and communication skills",
  },
];

async function main() {
  console.log("Seeding job vacancies…");
  for (const s of SEEDS) {
    const base = slugify(s.title);
    let slug = base;
    for (let i = 2; await one("SELECT id FROM jobs WHERE slug = $1", [slug]); i++) slug = `${base}-${i}`;

    await q(
      `INSERT INTO jobs
        (id, title, slug, practice, location, employment_type, workplace, experience,
         summary, description, responsibilities, requirements, benefits, status,
         post_linkedin, post_naukri, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'published',true,true,$14)`,
      [
        cuid(), s.title, slug, s.practice, s.location, s.employment_type, s.workplace,
        s.experience, s.summary, s.description, s.responsibilities, s.requirements,
        BENEFITS, SEEDS.indexOf(s) * 10,
      ]
    );
    console.log(`✓ ${s.title}  (/careers/${slug})`);
  }
  console.log("✓ Done. Manage these at /admin/jobs.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Failed to seed jobs:", e);
  process.exit(1);
});
