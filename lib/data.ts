export const NAV = [
  {
    label: "Company",
    href: "/company",
    children: [
      { label: "Company Overview", href: "/company#about" },
      { label: "Leadership", href: "/company#leadership" },
      { label: "Our Approach", href: "/company#approach" },
      { label: "Delivery Model", href: "/company#delivery" },
      { label: "Why Noblesoft", href: "/company#why" },
      { label: "Certifications & Diversity", href: "/company#awards" },
      { label: "Locations", href: "/company#locations" },
    ],
  },
  {
    label: "Industries",
    href: "/industries",
    children: [
      { label: "SLED", href: "/industries#sled" },
      { label: "Healthcare", href: "/industries#healthcare" },
      { label: "Manufacturing", href: "/industries#manufacturing" },
      { label: "Utilities", href: "/industries#utilities" },
      { label: "Higher Education", href: "/industries#higher-education" },
      { label: "Enterprise", href: "/industries#enterprise" },
    ],
  },
  {
    label: "Practices",
    href: "/practices",
    children: [
      { label: "Salesforce", href: "/practices#salesforce" },
      { label: "SAP", href: "/practices#sap" },
      { label: "Oracle", href: "/practices#oracle" },
      { label: "Workday", href: "/practices#workday" },
      { label: "Infor", href: "/practices#infor" },
      { label: "Application Development", href: "/practices#application-development" },
      { label: "Cloud & DevOps", href: "/practices#cloud-devops" },
      { label: "Data & Analytics", href: "/practices#data-analytics" },
      { label: "AI & Automation", href: "/practices#ai-automation" },
      { label: "Quality Engineering", href: "/practices#quality-engineering" },
      { label: "MuleSoft", href: "/practices#mulesoft" },
      { label: "API Integration", href: "/practices#api-integration" },
      { label: "Enterprise Integration", href: "/practices#enterprise-integration" },
    ],
  },
  {
    label: "Solutions",
    href: "/us-staffing",
    children: [
      { label: "IT Staff Augmentation", href: "/us-staffing#staff-augmentation" },
      { label: "Contingent Workforce", href: "/us-staffing#contingent-workforce" },
      { label: "Direct Hire", href: "/us-staffing#direct-hire" },
      { label: "SOW / Project Teams", href: "/us-staffing#sow-project-teams" },
      { label: "Managed Workforce", href: "/us-staffing#managed-workforce" },
    ],
  },
  {
    label: "Careers",
    href: "/careers",
    children: [
      { label: "Why Join Noblesoft", href: "/careers#why" },
      { label: "Life at Noblesoft", href: "/careers#benefits" },
      { label: "Open Positions", href: "/careers#jobs" },
    ],
  },
  { label: "Contact", href: "/contact", children: [] },
] as const;

export const STAFFING = [
  { id: "staff-augmentation", name: "IT Staff Augmentation", line: "Scale your technology teams with specialized talent",
    body: "Access qualified technology professionals across software engineering, enterprise platforms, cloud, data, QA, cybersecurity, business analysis, and project delivery — added to your team, working under your direction.",
    points: ["Engineering & enterprise platforms", "Cloud, data & QA specialists", "Onshore, nearshore & offshore", "Scale up or down as demand changes"] },
  { id: "contingent-workforce", name: "Contingent Workforce", line: "Flexible workforce solutions for changing business needs",
    body: "Support project-based hiring, temporary workforce needs, specialized skills, and changing demand with a structured workforce model — including compliance, payrolling, and employer-of-record services.",
    points: ["Project-based & temporary hiring", "Specialized short-term skills", "Compliance & payrolling handled", "Structured onboarding and offboarding"] },
  { id: "direct-hire", name: "Direct Hire", line: "Find the technology talent you need for the long term",
    body: "Identify, qualify, and recruit technology professionals for permanent positions with a process designed around technical fit and cultural alignment.",
    points: ["Structured intake & calibration", "Qualified, shortlisted candidates", "Technical and cultural fit", "Offer and onboarding support"] },
  { id: "sow-project-teams", name: "SOW / Project Teams", line: "Outcome-focused technology delivery teams",
    body: "Assemble specialized teams around defined project objectives, deliverables, timelines, technology requirements, and governance — with a single point of accountability for the outcome.",
    points: ["Defined scope & deliverables", "Dedicated delivery team", "Milestone-based governance", "Single point of accountability"] },
  { id: "managed-workforce", name: "Managed Workforce", line: "A more strategic approach to technology workforce management",
    body: "Support workforce planning, talent acquisition, resource coordination, compliance, reporting, and workforce optimization across your contingent technology labour.",
    points: ["Workforce planning & coordination", "MSP / VMS program support", "Compliance & consolidated reporting", "Ongoing workforce optimization"] },
];

export const STAFFING_STATS = [
  { value: "48h", label: "Median time to first qualified submittal" },
  { value: "92%", label: "Contract extension / conversion rate" },
  { value: "50", label: "States with active payroll & compliance" },
  { value: "MBE", label: "Certified Minority Business Enterprise" },
];

export const PRACTICES = [
  { id: "salesforce", name: "Salesforce", tag: "CRM & Customer Experience",
    body: "Design, implement, integrate, customize, and optimize Salesforce environments that connect customer data, business processes, and teams.",
    stack: ["Consulting", "Implementation", "Development", "Integration"] },
  { id: "sap", name: "SAP", tag: "ERP & Enterprise Operations",
    body: "Modernize enterprise operations with SAP solutions designed around business processes, technology environments, and transformation objectives.",
    stack: ["S/4HANA", "Implementation", "Integration", "SAP Cloud"] },
  { id: "oracle", name: "Oracle", tag: "Cloud & Enterprise Applications",
    body: "Connect finance, supply chain, procurement, HR, data, and enterprise operations through Oracle technologies and delivery expertise.",
    stack: ["Oracle Cloud", "ERP", "SCM", "Procurement"] },
  { id: "workday", name: "Workday", tag: "HCM & Financials",
    body: "Support HR, finance, workforce, and organizational transformation through Workday implementation, integration, configuration, and optimization.",
    stack: ["HCM", "Financials", "Integration", "Configuration"] },
  { id: "infor", name: "Infor", tag: "Industry-Specific ERP",
    body: "Modernize industry-focused enterprise applications, improve processes, integrate data, and optimize operational systems.",
    stack: ["CloudSuite", "Implementation", "Integration", "Upgrades"] },
  { id: "application-development", name: "Application Development", tag: "Digital Products & Platforms",
    body: "Design and build modern applications that support customer experiences, internal operations, and new digital business models.",
    stack: ["Custom Applications", "Web & Mobile", "API Development", "Legacy Modernization"] },
  { id: "cloud-devops", name: "Cloud & DevOps", tag: "Migration, Architecture & Automation",
    body: "Support cloud migration, architecture, application modernization, DevOps, CI/CD, infrastructure automation, and operational improvement.",
    stack: ["AWS", "Azure", "Google Cloud", "CI/CD"] },
  { id: "data-analytics", name: "Data & Analytics", tag: "Data Foundations & Intelligence",
    body: "Build trusted data foundations, modern analytics, reporting, data architecture, and decision-support capabilities.",
    stack: ["Data Engineering", "Data Warehousing", "Business Intelligence", "Data Governance"] },
  { id: "ai-automation", name: "AI & Automation", tag: "Intelligent Workflows",
    body: "Apply AI and automation to practical business workflows, decision support, enterprise processes, and technology operations.",
    stack: ["Generative AI", "Process Automation", "RPA", "AI Integration"] },
  { id: "quality-engineering", name: "Quality Engineering", tag: "Testing Across the Lifecycle",
    body: "Integrate functional, automation, performance, security, and API testing into the software lifecycle.",
    stack: ["Automation Testing", "Performance", "Security Testing", "API Testing"] },
  { id: "mulesoft", name: "MuleSoft", tag: "API-Led Integration",
    body: "Build API-led integration architectures that connect applications, data, and experiences across cloud and on-premise environments.",
    stack: ["Anypoint", "API Strategy", "API Management", "Data Integration"] },
  { id: "api-integration", name: "API Integration", tag: "Connectivity & Data Exchange",
    body: "Design and implement reliable APIs that connect enterprise applications, data sources, partners, and digital experiences.",
    stack: ["API Design", "API Management", "System Connectivity", "Security & Governance"] },
  { id: "enterprise-integration", name: "Enterprise Integration", tag: "Integration Backbone",
    body: "Create an integration architecture that allows ERP, CRM, cloud, legacy, and bespoke systems to communicate reliably.",
    stack: ["Integration Architecture", "ERP/CRM Integration", "Event-Driven", "Data Synchronization"] },
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
  { id: "sled", name: "SLED", line: "State, local & education",
    body: "Noblesoft helps government agencies, public institutions, and education organizations modernize technology, strengthen digital capabilities, and access specialized technology talent.",
    metric: "Public sector", metricLabel: "delivery experience" },
  { id: "healthcare", name: "Healthcare", line: "Complex clinical & operational environments",
    body: "Support complex healthcare environments with technology, data, integration, application, and workforce capabilities built for regulated operations.",
    metric: "Regulated", metricLabel: "environments" },
  { id: "manufacturing", name: "Manufacturing", line: "Operations, supply chain & ERP",
    body: "Connect operations, enterprise applications, data, supply chain, and workforce capabilities to support modern manufacturing.",
    metric: "End-to-end", metricLabel: "operational visibility" },
  { id: "utilities", name: "Utilities", line: "Critical infrastructure",
    body: "Support utility organizations with reliable enterprise technology, integration, data, application, and workforce capabilities.",
    metric: "Critical", metricLabel: "infrastructure" },
  { id: "higher-education", name: "Higher Education", line: "Campus & student systems",
    body: "Help institutions modernize enterprise systems, improve digital experiences, connect data, and support campus technology initiatives.",
    metric: "Campus-wide", metricLabel: "student lifecycle" },
  { id: "enterprise", name: "Enterprise", line: "Complex technology landscapes",
    body: "Bring together enterprise platforms, digital engineering, integration, and specialized talent for organizations with complex technology landscapes.",
    metric: "Enterprise", metricLabel: "scale delivery" },
];

export const LEADERSHIP = [
  { name: "Avery Sinclair", role: "Chief Executive Officer", linkedin: "https://www.linkedin.com/in/placeholder-avery-sinclair",
    bio: "Technology entrepreneur and business strategist focused on building and scaling people-centric technology businesses. Avery drives growth through strategic vision, business development, and long-term partnerships — building a culture where people and the business grow together." },
  { name: "Jordan Whitfield", role: "Engagement Manager, Projects & Delivery", linkedin: "https://www.linkedin.com/in/placeholder-jordan-whitfield",
    bio: "Leads software project delivery and client engagement, aligning business objectives with technical execution. A Certified Scrum Master, Jordan pairs staffing expertise with agile methodology to strengthen project outcomes and organizational growth." },
  { name: "Priya Raman", role: "Business Unit Head, SI", linkedin: "https://www.linkedin.com/in/placeholder-priya-raman",
    bio: "Staffing leader with deep expertise in client engagement, delivery operations, and recruitment. Priya builds efficient, process-driven delivery models that consistently deliver compliant, on-time talent for enterprise clients." },
  { name: "Marcus Ellery", role: "Business Unit Head — Delivery & Operations", linkedin: "https://www.linkedin.com/in/placeholder-marcus-ellery",
    bio: "Delivery and operations leader who turns people, process, and partnerships into measurable results. Marcus drives delivery excellence, builds high-performing teams, and cultivates lasting client relationships." },
  { name: "Nadia Brooks", role: "HR Manager", linkedin: "https://www.linkedin.com/in/placeholder-nadia-brooks",
    bio: "Human resources leader driving organizational performance through strategic, people-centric leadership — talent strategy, workforce transformation, employee engagement, and HR governance built to scale." },
  { name: "Caleb Ortiz", role: "Sr Sales Manager — Projects", linkedin: "https://www.linkedin.com/in/placeholder-caleb-ortiz",
    bio: "Drives client acquisition, strategic partnerships, and business growth — connecting clients with premier talent and technology while navigating complex RFPs, RFIs, and ITQs." },
  { name: "Devon Hartley", role: "Sr Product Manager", linkedin: "https://www.linkedin.com/in/placeholder-devon-hartley",
    bio: "Owns the product lifecycle, leveraging market trends and modern methodologies to deliver robust, scalable software solutions." },
  { name: "Rowan Vance", role: "Founder", linkedin: "https://www.linkedin.com/in/placeholder-rowan-vance",
    bio: "Founded Testsoft with a vision to provide premier enterprise application consulting and to build an Inc. 500-recognized organization." },
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
  { region: "Texas — USA", role: "Headquarters", address: "Texas, USA", tel: "+1 555 000 0101" },
  { region: "Monterrey — México", role: "Nearshore Delivery", address: "Nuevo León, México", tel: "+52 555 000 0102" },
  { region: "Visakhapatnam — India", role: "Offshore Delivery", address: "Andhra Pradesh, India", tel: "+91 555 000 0103" },
  { region: "Noida — India", role: "Offshore Delivery", address: "Uttar Pradesh, India", tel: "+91 555 000 0104" },
];

/** Cycle the Testsoft prism spectrum for stat numbers, chips, etc. */
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
