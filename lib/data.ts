export const NAV = [
  {
    label: "Company",
    href: "/company",
    children: [
      { label: "About Us", href: "/company#about" },
      { label: "Leadership", href: "/company#leadership" },
      { label: "Awards", href: "/company#awards" },
      { label: "Delivery Centers", href: "/company#delivery" },
      { label: "CSR", href: "/company#csr" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "Utilities", href: "/industries#utilities" },
      { label: "Manufacturing", href: "/industries#manufacturing" },
      { label: "Warehousing", href: "/industries#warehousing" },
      { label: "State & Local", href: "/industries#state" },
      { label: "Higher Education", href: "/industries#edu" },
    ],
  },
  {
    label: "Practices",
    href: "/practices",
    children: [
      { label: "Salesforce", href: "/practices#salesforce" },
      { label: "SAP", href: "/practices#sap" },
      { label: "Oracle Apps", href: "/practices#oracle" },
      { label: "Infor", href: "/practices#infor" },
      { label: "Workday", href: "/practices#workday" },
    ],
  },
  {
    label: "Augmentation",
    href: "/us-staffing",
    children: [
      { label: "Contract Staffing", href: "/us-staffing#contract" },
      { label: "Direct Hire", href: "/us-staffing#direct-hire" },
      { label: "Statement of Work", href: "/us-staffing#sow" },
      { label: "MSP / VMS", href: "/us-staffing#msp-vms" },
      { label: "Compliance", href: "/us-staffing#compliance" },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Why Join Us", href: "/careers#why" },
      { label: "Benefits", href: "/careers#benefits" },
      { label: "Job Listings", href: "/careers#jobs" },
    ],
  },
  { label: "Contact", href: "/contact", children: [] },
] as const;

export const STAFFING = [
  { id: "contract", name: "Contract Staffing", line: "W-2 and 1099 talent, deployed fast",
    body: "Vetted IT and enterprise-application consultants on your terms — short-term surge, long-term augmentation, or contract-to-hire. We carry the employment, benefits, and payroll; you get productive people in days, not months.",
    points: ["48–72 hr first submittals", "W-2, 1099 & C2C", "Contract-to-hire conversions", "Nationwide coverage"] },
  { id: "direct-hire", name: "Direct Hire", line: "Permanent placement, retained or contingent",
    body: "Executive and specialist search for roles you need to own outright. Structured intake, calibrated shortlists, and a replacement guarantee — across Salesforce, SAP, Oracle, Workday, data, and leadership.",
    points: ["Retained & contingent", "90-day replacement guarantee", "Calibrated 3–5 person shortlists", "Offer & onboarding support"] },
  { id: "sow", name: "Statement of Work", line: "Outcome-based delivery pods",
    body: "When you want a deliverable, not a timesheet. We scope, staff, and manage a dedicated pod against milestones — onshore, nearshore Mexico, or offshore India — with a single point of accountability.",
    points: ["Fixed-scope & fixed-fee options", "Blended onshore/offshore rates", "Managed delivery & reporting", "IP and security controls"] },
  { id: "msp-vms", name: "MSP / VMS", line: "Program-level contingent workforce management",
    body: "We plug into your Vendor Management System or run a Managed Service Program — req distribution, rate cards, compliance, and consolidated billing across your whole contingent labor spend.",
    points: ["Fieldglass, Beeline, Coupa & more", "Rate-card governance", "Consolidated invoicing", "Diversity spend reporting"] },
  { id: "compliance", name: "Compliance & Payrolling",
    line: "E-Verify, ACA, co-employment covered",
    body: "Bring your own candidate and we'll employ them. Full payrolling and Employer-of-Record services with E-Verify, I-9, ACA, workers' comp, and multi-state tax handled end to end.",
    points: ["E-Verify & I-9 management", "ACA & multi-state tax", "Workers' comp & EPLI", "1099 reclassification review"] },
];

export const STAFFING_STATS = [
  { value: "48h", label: "Median time to first qualified submittal" },
  { value: "92%", label: "Contract extension / conversion rate" },
  { value: "50", label: "States with active payroll & compliance" },
  { value: "MBE", label: "Certified Minority Business Enterprise" },
];

export const PRACTICES = [
  { id: "salesforce", name: "Salesforce", tag: "CRM & Digital Experience",
    body: "Full-lifecycle delivery across Sales Cloud, Service Cloud, and Experience Cloud. We handle custom development in Apex, LWC, and Visualforce, deep configuration, and integration — engineered for adoption, not just deployment.",
    stack: ["Sales Cloud", "Service Cloud", "Apex / LWC", "Experience Cloud"] },
  { id: "sap", name: "SAP", tag: "ERP & Industry Solutions",
    body: "S/4HANA transformations end to end — greenfield, brownfield, and selective migration. Core strength in FI/CO, MM/SD, and PP, with ABAP development that streamlines finance, supply chain, and operations.",
    stack: ["S/4HANA", "FI / CO", "MM / SD", "ABAP"] },
  { id: "oracle", name: "Oracle Apps", tag: "EBS & Cloud",
    body: "Implementation, managed services, and optimization across Oracle E-Business Suite and Oracle Cloud. We move Financials, SCM, and HCM to the cloud cleanly, or harden and extend what you already run on-prem.",
    stack: ["Fusion Cloud", "E-Business Suite", "SCM", "Financials"] },
  { id: "infor", name: "Infor", tag: "Industry-Specific ERP",
    body: "CloudSuite implementations, upgrades, and process re-engineering for manufacturing, distribution, and services. We turn Infor's specialized applications into operational visibility and tighter supply chains.",
    stack: ["CloudSuite", "M3 / LN", "Process Design", "Upgrades"] },
  { id: "workday", name: "Workday", tag: "HCM & Financials",
    body: "End-to-end Workday for HCM and Financial Management — deployment, configuration, and post-production optimization. One source of truth across HR, payroll, talent, and financial planning.",
    stack: ["HCM", "Payroll", "Financials", "Integrations"] },
  { id: "mulesoft", name: "MuleSoft", tag: "API-Led Integration",
    body: "Anypoint-based application networks that make data reusable. We design, build, and manage APIs that unlock legacy systems and connect cloud and on-prem apps in real time.",
    stack: ["Anypoint", "API Design", "DataWeave", "Runtime"] },
  { id: "edu", name: "Higher Education", tag: "Enrollment & Student Success",
    body: "Enterprise systems tuned for campus reality — Education Cloud for recruitment and enrollment, Workday for HR and finance, and SAP for core campus operations. Built to lift student success and alumni engagement.",
    stack: ["Education Cloud", "SIS", "Workday", "SAP"] },
  { id: "integration", name: "Integration", tag: "Cross-Platform Strategy",
    body: "API-led connectivity that keeps ERP, CRM, and bespoke systems in sync. We architect the integration backbone so mission-critical platforms talk to each other reliably and in real time.",
    stack: ["API-Led", "Event Streams", "iPaaS", "Data Sync"] },
];

/** Platform wordmark for each practice id (files in /public/logos). */
export const PRACTICE_LOGOS: Record<string, string> = {
  salesforce: "/logos/salesforce.svg",
  sap: "/logos/sap.svg",
  oracle: "/logos/oracle.svg",
  infor: "/logos/infor.svg",
  workday: "/logos/workday.svg",
  mulesoft: "/logos/mulesoft.svg",
};

export const INDUSTRIES = [
  { id: "utilities", name: "Utilities", line: "CRM for gas & power distribution",
    body: "Customer platforms and billing-adjacent CRM for gas and power distributors — engineered on Salesforce and SAP to handle regulated, high-volume operations.",
    metric: "Grid-scale", metricLabel: "customer operations" },
  { id: "manufacturing", name: "Manufacturing", line: "ERP for the plant floor and beyond",
    body: "Production planning, supply chain, and financials unified across SAP and Infor — so the plant floor, the warehouse, and the ledger tell the same story.",
    metric: "End-to-end", metricLabel: "production visibility" },
  { id: "warehousing", name: "Warehousing", line: "Inventory, orders, and logistics",
    body: "Warehouse, inventory, and order management tuned for throughput — bar-scanning, distribution, and transportation flows that hold up at volume.",
    metric: "Real-time", metricLabel: "inventory accuracy" },
  { id: "state", name: "State & Local", line: "SLED-ready enterprise delivery",
    body: "Enterprise application delivery for state, local, and education clients — compliant, auditable, and built for public-sector procurement and accountability.",
    metric: "Compliant", metricLabel: "public-sector delivery" },
  { id: "edu", name: "Higher Education", line: "Admissions, enrollment, engagement",
    body: "Campus engagement, admissions, and enrollment platforms that connect recruitment to retention — modern EdTech on Salesforce, Workday, and SAP.",
    metric: "Campus-wide", metricLabel: "student lifecycle" },
];

export const LEADERSHIP = [
  { name: "Prasad Peetha", role: "Chief Executive Officer", linkedin: "https://www.linkedin.com/in/prasad-peetha-5bb39a98/",
    bio: "Technology entrepreneur and business strategist focused on building and scaling people-centric technology businesses. Prasad drives growth through strategic vision, business development, and long-term partnerships — building a culture where people and the business grow together." },
  { name: "Phani Gaddamanugu", role: "Engagement Manager, Projects & Delivery", linkedin: "https://www.linkedin.com/in/phanigaddamanugu/",
    bio: "Leads software project delivery and client engagement, aligning business objectives with technical execution. A Certified Scrum Master, Phani pairs staffing expertise with agile methodology to strengthen project outcomes and organizational growth." },
  { name: "Rahul Agarwal", role: "Business Unit Head, SI", linkedin: "https://www.linkedin.com/in/rahul-agarwal-4364ba7a/",
    bio: "Staffing leader with deep expertise in client engagement, delivery operations, and recruitment. Rahul builds efficient, process-driven delivery models that consistently deliver compliant, on-time talent for enterprise clients." },
  { name: "Gyan Pandey", role: "Business Unit Head — Delivery & Operations", linkedin: "https://www.linkedin.com/in/gyanendu-pandey/",
    bio: "Delivery and operations leader who turns people, process, and partnerships into measurable results. Gyan drives delivery excellence, builds high-performing teams, and cultivates lasting client relationships." },
  { name: "Sonali Khanduri", role: "HR Manager", linkedin: "https://www.linkedin.com/in/sonali-khanduri-895b0421b/",
    bio: "Human resources leader driving organizational performance through strategic, people-centric leadership — talent strategy, workforce transformation, employee engagement, and HR governance built to scale." },
  { name: "Anuj Singh Sarkari", role: "Sr Sales Manager — Projects", linkedin: "https://www.linkedin.com/",
    bio: "Drives client acquisition, strategic partnerships, and business growth — connecting clients with premier talent and technology while navigating complex RFPs, RFIs, and ITQs." },
  { name: "James Liley", role: "Sr Product Manager", linkedin: "https://www.linkedin.com/",
    bio: "Owns the product lifecycle, leveraging market trends and modern methodologies to deliver robust, scalable software solutions." },
  { name: "Venkat Yerubandi", role: "Founder", linkedin: "https://www.linkedin.com/in/vyerubandi",
    bio: "Founded Noblesoft with a vision to provide premier enterprise application consulting and to build an Inc. 500-recognized organization." },
];

export const CLIENTS = [
  "Schneider Electric", "University of Arizona", "CST Pharma", "SAIMA Global",
  "University of Connecticut", "GreenTransfo", "Arizona State University", "DMG Wholesale",
  "University of California", "MuleSoft", "SAP", "Oracle", "Infor", "Salesforce", "Workday",
];

/* Partner / platform + client logos shown in the homepage trust strip.
   `logo` is a file in /public/logos rendered with currentColor (monochrome). */
export const PARTNERS = [
  { name: "Salesforce", logo: "/logos/salesforce.svg" },
  { name: "SAP", logo: "/logos/sap.svg" },
  { name: "Oracle", logo: "/logos/oracle.svg" },
  { name: "Workday", logo: "/logos/workday.svg" },
  { name: "Infor", logo: "/logos/infor.svg" },
  { name: "MuleSoft", logo: "/logos/mulesoft.svg" },
  { name: "Schneider Electric", logo: "/logos/schneider-electric.svg" },
  { name: "University of Arizona", logo: "/logos/university-of-arizona.svg" },
  { name: "Arizona State University", logo: "/logos/arizona-state.svg" },
  { name: "University of Connecticut", logo: "/logos/uconn.svg" },
  { name: "University of California", logo: "/logos/university-of-california.svg" },
];

export const LOCATIONS = [
  { region: "Texas — USA", role: "Headquarters", address: "2601 Network Blvd, Ste 450, Frisco TX 75034, USA", tel: "+1 (972) 845 8400" },
  { region: "Monterrey — México", role: "Nearshore Delivery", address: "Planificadores #2802, Office 108, Empleados SFEO, Monterrey NL 64909, México", tel: "+1 (972) 845 8400" },
  { region: "Visakhapatnam — India", role: "Offshore Delivery", address: "1st Lane, Dwaraka Nagar, Visakhapatnam 530016, India", tel: "+1 (972) 845 8400" },
  { region: "Noida — India", role: "Offshore Delivery", address: "411 Block B, Plot A, 40, Sector 62, Noida 201309, India", tel: "+1 (972) 845 8400" },
];

/** Cycle the Noblesoft prism spectrum for stat numbers, chips, etc. */
export const PRISM_TEXT = [
  "text-prism-red", "text-brand", "text-prism-amber",
  "text-prism-green", "text-prism-blue", "text-prism-violet",
] as const;

export const METRICS = [
  { value: "Inc.500", label: "Fastest-growing private companies, USA" },
  { value: "4", label: "Delivery centers across 3 countries" },
  { value: "8+", label: "Enterprise platforms in practice" },
  { value: "10+", label: "Regulated markets served" },
];

export const AWARDS = [
  { year: "2020", title: "Inc. 500 — Fastest-Growing Private Companies in the USA" },
  { year: "2013", title: "EY Entrepreneur of the Year, New Jersey — Finalist" },
  { year: "2011", title: "EY Entrepreneur of the Year, New Jersey — Finalist" },
  { year: "2008", title: "EY Entrepreneur of the Year, New Jersey — Finalist" },
  { year: "Cert.", title: "Certified Minority Business Enterprise (MBE)" },
];

export const BENEFITS = [
  { title: "Continuous certification", body: "Funded certifications and training across Salesforce, SAP, Oracle, Infor, and Workday — your skill set stays ahead of the platform." },
  { title: "Mentorship that compounds", body: "Senior consultants invest in your growth from day one. You learn on real transformations, not sandbox exercises." },
  { title: "Global mobility", body: "Work across US, nearshore Mexico, and offshore India delivery centers — real projects, real clients, real scale." },
  { title: "Ownership culture", body: "We treat consultants as partners, not resources. Take ownership early and grow into the company's journey." },
];

export const JOBS = [
  { title: "Senior Salesforce Developer", location: "Frisco, TX / Remote", type: "Full-time", practice: "Salesforce" },
  { title: "SAP S/4HANA Consultant (FI/CO)", location: "Noida, India", type: "Full-time", practice: "SAP" },
  { title: "Workday HCM Consultant", location: "Remote — US", type: "Contract", practice: "Workday" },
  { title: "MuleSoft Integration Engineer", location: "Visakhapatnam, India", type: "Full-time", practice: "MuleSoft" },
  { title: "Oracle Cloud SCM Lead", location: "Monterrey, México", type: "Full-time", practice: "Oracle" },
  { title: "Engagement Manager — Delivery", location: "Frisco, TX", type: "Full-time", practice: "Delivery" },
];
