/**
 * Per-page detail content for practices and solutions.
 *
 * Without this every detail page rendered the same sentences with one word
 * swapped. Each entry carries its own headline, lead, section headings and
 * differentiators, plus a `variant` that selects a different layout, a `vanta`
 * background and an `accent` — so the pages differ in structure and colour,
 * not only in the name at the top.
 */

export type Variant = "split" | "stack" | "mosaic" | "rail";

export type DetailContent = {
  headline: string;      // hero, last word takes the brand italic
  lead: string;          // hero subhead
  variant: Variant;
  vanta: "waves" | "rings" | "net" | "globe" | "fog" | "halo" | "dots" | "cells" | "topology" | "trunk" | "clouds";
  accent: number;        // index into the prism palette
  whatHeading: string;   // heading for the opening section
  what: string;          // the opening paragraph, written for this page
  capHeading: string;    // heading above the capability grid
  points: { title: string; body: string }[];  // three differentiators
};

export const PRACTICE_DETAIL: Record<string, DetailContent> = {
  salesforce: {
    headline: "Customer data that finally agrees with itself.",
    lead: "Sales, service and experience on one platform — configured for the way your teams actually work, not the way a demo suggests they should.",
    variant: "split", vanta: "globe", accent: 1,
    whatHeading: "Adoption, not just deployment",
    what: "Most Salesforce programmes do not fail on configuration. They fail because the people expected to use the system were never designed into it. We start with the journeys your agents and sellers run every day, then shape the org around them — objects, automation and integration in service of that, rather than the other way round.",
    capHeading: "Where we go deep",
    points: [
      { title: "Service that resolves", body: "Console layouts, knowledge and case routing built so an agent answers in one screen rather than four." },
      { title: "Integration first", body: "Billing, ERP and legacy records surfaced in context, so Salesforce is the front door and not another silo." },
      { title: "Clean migration", body: "De-duplication and reconciliation before cutover, because a new platform on old data buys you nothing." },
    ],
  },
  sap: {
    headline: "S/4HANA without betting the close.",
    lead: "Greenfield, brownfield or selective — sequenced so finance, supply chain and operations keep running while the core moves underneath them.",
    variant: "rail", vanta: "net", accent: 0,
    whatHeading: "The core, moved carefully",
    what: "An ERP migration is a business continuity exercise wearing a technology costume. We assess the current estate, agree what must not break, and phase the move so month-end closes on schedule throughout. FI/CO, MM/SD and PP get the attention they need; ABAP work is kept to what genuinely cannot be configured.",
    capHeading: "Across the core modules",
    points: [
      { title: "Continuity planning", body: "The close is protected first. Every phase is designed around what finance and operations cannot lose." },
      { title: "Selective migration", body: "Move what earns the move. Not every process needs to be rebuilt to reach S/4HANA." },
      { title: "Process before code", body: "Configuration and process redesign exhausted before custom ABAP is written." },
    ],
  },
  oracle: {
    headline: "Finance, supply chain and HR on one ledger.",
    lead: "E-Business Suite hardened, or Oracle Cloud implemented cleanly — Financials, SCM, Procurement and HCM connected rather than coexisting.",
    variant: "mosaic", vanta: "dots", accent: 4,
    whatHeading: "Connected enterprise operations",
    what: "Oracle estates tend to grow in layers: a cloud module here, an on-premise extension there, and integrations written to survive rather than to scale. We map what you actually run, decide what moves and what stays, and build the connective tissue so procurement, finance and supply chain finally read from the same source.",
    capHeading: "Capability areas",
    points: [
      { title: "Cloud on your terms", body: "Move Financials, SCM or HCM when the business case is clear — not because a roadmap slide said so." },
      { title: "Extend safely", body: "Custom development that survives the next upgrade instead of blocking it." },
      { title: "Managed steady state", body: "Support and optimization after go-live, when most of the value is actually realised." },
    ],
  },
  workday: {
    headline: "One record for every person you employ.",
    lead: "HCM and Financials deployed, configured and optimized — so HR, payroll, talent and planning stop reconciling spreadsheets.",
    variant: "stack", vanta: "waves", accent: 3,
    whatHeading: "People data that holds up",
    what: "Workday rewards organisations that decide their structures before configuring them. We work through supervisory organisations, security groups and business processes with the people who own them, then configure once — because unpicking a rushed foundation costs more than the original build.",
    capHeading: "Deployment and beyond",
    points: [
      { title: "Foundation first", body: "Organisations, security and business processes agreed before a tenant is configured." },
      { title: "Integration discipline", body: "Payroll, benefits and downstream systems connected with monitoring, not fire-and-forget files." },
      { title: "Post-production care", body: "Release readiness twice a year, so upgrades stop being an event." },
    ],
  },
  infor: {
    headline: "CloudSuite that matches how the plant runs.",
    lead: "Industry-specific ERP implemented, upgraded and re-engineered for manufacturing, distribution and service operations.",
    variant: "split", vanta: "topology", accent: 2,
    whatHeading: "Built for operations",
    what: "Infor's strength is that it already understands your industry. The work is making sure the implementation reflects how your plant, warehouse and service teams actually operate — rather than forcing them into a reference model written for someone else's factory.",
    capHeading: "Where it pays off",
    points: [
      { title: "Process re-engineering", body: "The operating model examined before configuration, so the system encodes the better way." },
      { title: "Upgrade paths", body: "Moving off heavily customised estates without losing the logic that mattered." },
      { title: "Supply chain visibility", body: "Planning, inventory and finance reading the same numbers on the same day." },
    ],
  },
  "application-development": {
    headline: "Software your teams will actually use.",
    lead: "Custom web, mobile and enterprise applications — designed around the work, engineered to be maintained long after launch.",
    variant: "mosaic", vanta: "halo", accent: 5,
    whatHeading: "Built to be maintained",
    what: "Most internal software fails slowly: it ships, it works, and then nobody can change it. We build with the second year in mind — clear boundaries, tests that catch regressions, and documentation written while the decisions are still fresh.",
    capHeading: "What we build",
    points: [
      { title: "Product thinking", body: "Scope shaped by the outcome, with the smallest useful release first." },
      { title: "API-first", body: "Every capability exposed cleanly, so the next system can reuse it instead of duplicating it." },
      { title: "Legacy replacement", body: "Strangler-pattern migration that lets the old system retire gradually rather than all at once." },
    ],
  },
  "cloud-devops": {
    headline: "Cloud with the business case written first.",
    lead: "Migration, architecture, CI/CD, infrastructure automation and cost discipline across AWS, Azure and Google Cloud.",
    variant: "rail", vanta: "clouds", accent: 4,
    whatHeading: "Lift, shift, or leave it",
    what: "Not every workload earns a migration. We assess the estate against cost, risk and change velocity, then move what benefits and modernise what needs it — with the automation and guardrails in place before the traffic arrives, not after the first incident.",
    capHeading: "Across the lifecycle",
    points: [
      { title: "Landing zones", body: "Accounts, networking, identity and policy set up once, properly, before workloads land." },
      { title: "Pipelines that hold", body: "CI/CD with real gates — tests, security scanning and rollback that has been rehearsed." },
      { title: "Cost as a feature", body: "Tagging, budgets and rightsizing from day one, so the bill does not become the story." },
    ],
  },
  "data-analytics": {
    headline: "Answers the business actually asked for.",
    lead: "Data engineering, architecture, warehousing, BI and governance — built backwards from the decisions they need to support.",
    variant: "stack", vanta: "dots", accent: 3,
    whatHeading: "Start from the question",
    what: "Data programmes drift when they start from the data. We start from the questions leadership cannot currently answer, work back to the sources that would answer them, and build only that — then extend. It produces a narrower first release and a far higher chance it gets used.",
    capHeading: "The foundation",
    points: [
      { title: "Modelled, not dumped", body: "A warehouse designed around business entities, not a copy of every source schema." },
      { title: "Trust by construction", body: "Lineage, quality checks and ownership defined before the first dashboard ships." },
      { title: "Self-service that lasts", body: "Semantic models that let teams answer their own questions without re-deriving the truth." },
    ],
  },
  "ai-automation": {
    headline: "AI where the payback is obvious.",
    lead: "Use-case identification, governed solution design, workflow integration and process automation — starting with the work that repeats.",
    variant: "split", vanta: "net", accent: 5,
    whatHeading: "Governed, and grounded",
    what: "The hard part of enterprise AI is not the model. It is grounding it in your data, governing what it is allowed to do, and integrating it into a workflow someone already follows. We pick use cases where the process is well understood and the cost of the current manual effort is measurable.",
    capHeading: "How we apply it",
    points: [
      { title: "Use-case triage", body: "Candidates scored on value, data readiness and risk before anything is built." },
      { title: "Guardrails first", body: "Scope, escalation and human review designed in, so the system fails safely." },
      { title: "Automation around it", body: "RPA and workflow automation for the deterministic steps, models only where judgement is needed." },
    ],
  },
  "quality-engineering": {
    headline: "Quality built in, not inspected in.",
    lead: "Functional, automation, performance, security and API testing woven into the lifecycle rather than bolted on before release.",
    variant: "rail", vanta: "waves", accent: 0,
    whatHeading: "Shift it left, and mean it",
    what: "Testing at the end of a delivery finds defects when they are most expensive to fix. We move coverage into the pipeline — unit and contract tests owned by engineers, automated regression that runs on every merge, and performance work that starts before the load test is a crisis.",
    capHeading: "Coverage that counts",
    points: [
      { title: "Automation strategy", body: "The right tests at the right layer, rather than an expensive UI suite that nobody trusts." },
      { title: "Performance early", body: "Load and soak modelling against realistic profiles, long before go-live week." },
      { title: "Security in the pipeline", body: "SAST, dependency scanning and API abuse cases running as gates, not as reports." },
    ],
  },
  mulesoft: {
    headline: "An application network, not more point-to-point.",
    lead: "Anypoint-based System, Process and Experience APIs that make data reusable across cloud and on-premise estates.",
    variant: "mosaic", vanta: "globe", accent: 4,
    whatHeading: "Reuse is the whole point",
    what: "Integration projects justify themselves once. Application networks justify themselves every time the next team reuses an API instead of writing another bespoke connection. We design the layers deliberately so the second and third projects are faster than the first.",
    capHeading: "The layers",
    points: [
      { title: "API-led layering", body: "System, process and experience APIs with clear ownership and versioning." },
      { title: "Legacy unlocked", body: "Mainframe and on-premise data exposed safely, without rewriting the system of record." },
      { title: "Managed runtime", body: "Monitoring, alerting and policy applied centrally rather than per integration." },
    ],
  },
  "api-integration": {
    headline: "Interfaces that other teams can trust.",
    lead: "API strategy, design, development, management and governance — connecting applications, partners and digital experiences.",
    variant: "stack", vanta: "rings", accent: 1,
    whatHeading: "Contracts, not connections",
    what: "An API is a promise to another team. We design the contract first, version it honestly, and put the security and rate limits in place before the first consumer depends on it — so integrations stop being the thing that breaks every release.",
    capHeading: "From design to runtime",
    points: [
      { title: "Design-first", body: "Specifications agreed and mocked before implementation, so consumers can build in parallel." },
      { title: "Governance that scales", body: "Standards, naming and security policy applied consistently across every interface." },
      { title: "Partner-ready", body: "External APIs with the documentation, onboarding and observability partners actually need." },
    ],
  },
  "enterprise-integration": {
    headline: "A backbone the whole estate can lean on.",
    lead: "Integration architecture connecting ERP, CRM, cloud, legacy and bespoke systems — with monitoring and governance built in.",
    variant: "rail", vanta: "topology", accent: 2,
    whatHeading: "Architecture before tooling",
    what: "Integration platforms get chosen too early. We map the flows, the ownership and the failure modes first, then select the pattern — event-driven where it earns it, batch where that is genuinely fine — so the architecture reflects the business rather than a vendor's reference diagram.",
    capHeading: "How it holds together",
    points: [
      { title: "Event-driven where it fits", body: "Real time when the business needs it, scheduled when it does not — decided deliberately." },
      { title: "Data synchronisation", body: "Bi-directional flows with conflict rules agreed up front rather than discovered in production." },
      { title: "Observable by default", body: "Every flow monitored, with reconciliation that proves the two sides still agree." },
    ],
  },
};

/* ------------------------------------------------------------------ *
 * Solutions. Same idea, written separately — a solution page answers a
 * business problem, where a practice page answers a platform question.
 * ------------------------------------------------------------------ */

export const SOLUTION_DETAIL: Record<string, DetailContent> = {
  "digital-transformation": {
    headline: "Transformation that survives contact with the business.",
    lead: "Strategy, process, technology, data and people connected into a path from where you are to something measurably better.",
    variant: "rail", vanta: "fog", accent: 1,
    whatHeading: "Sequenced, not announced",
    what: "Most transformation programmes are announced before they are sequenced, and they stall around month nine when the easy work runs out. We define the target operating model, then order the work so each phase funds and de-risks the next — and so the organisation can absorb it while still running.",
    capHeading: "How the work is ordered",
    points: [
      { title: "Assess what is actually there", body: "Current-state process, data and system reality — including the spreadsheets nobody mentions in the steering committee." },
      { title: "Agree the target operating model", body: "How the organisation should work once the technology changes, decided before tooling is selected." },
      { title: "Phase for absorption", body: "A roadmap paced to what the business can adopt, not to what a Gantt chart allows." },
    ],
  },
  "enterprise-application-services": {
    headline: "The systems that run the business, kept running.",
    lead: "Consulting, implementation, integration, development, testing and ongoing optimization across your enterprise application estate.",
    variant: "split", vanta: "net", accent: 4,
    whatHeading: "From project to steady state",
    what: "Enterprise applications spend a few months being implemented and then years being lived with. We work across both: the implementation that lands cleanly, and the support model that keeps it healthy through releases, regulation changes and the inevitable request that was out of scope the first time.",
    capHeading: "Across the lifecycle",
    points: [
      { title: "Implementation that lands", body: "Scope, configuration and cutover planned around the business calendar rather than the project one." },
      { title: "Extension without lock-in", body: "Customisation confined to what configuration genuinely cannot do, so upgrades stay possible." },
      { title: "Managed support", body: "A steady-state model with named people, SLAs and a backlog the business can see." },
    ],
  },
  "application-modernization": {
    headline: "Retire the legacy system without stopping the business.",
    lead: "Assess, refactor, re-platform, replace or integrate — with a roadmap built around business risk rather than technical preference.",
    variant: "stack", vanta: "topology", accent: 2,
    whatHeading: "The honest assessment first",
    what: "Not every legacy application deserves a rewrite. Some should be re-platformed, some wrapped behind an API and left alone, and a few genuinely need replacing. We assess the portfolio against business value, change frequency and risk, then modernise in the order that removes the most risk earliest.",
    capHeading: "Four honest options",
    points: [
      { title: "Wrap and leave", body: "Stable systems exposed behind an API, so the rest of the estate can move without touching them." },
      { title: "Re-platform", body: "Same logic, modern runtime — the cheapest route when the business rules still hold." },
      { title: "Replace incrementally", body: "Strangler-pattern migration so the old system retires function by function, never in one weekend." },
    ],
  },
  "cloud-transformation": {
    headline: "Move the workloads that earn the move.",
    lead: "Cloud strategy, migration, architecture, modernization, DevOps and security — with the business case written before anything migrates.",
    variant: "mosaic", vanta: "clouds", accent: 5,
    whatHeading: "The case before the migration",
    what: "Cloud programmes that start with a migration factory tend to end with a larger bill and the same architecture. We start with the portfolio: what benefits from elasticity, what carries regulatory weight, what should simply be retired. Then we build the landing zone properly before the first workload arrives.",
    capHeading: "In this order",
    points: [
      { title: "Portfolio triage", body: "Each workload scored on cost, risk and change velocity before a destination is chosen." },
      { title: "Landing zone first", body: "Identity, networking, policy and guardrails established before migration begins." },
      { title: "Cost discipline built in", body: "Tagging, budgets and rightsizing from day one, so the finance conversation stays calm." },
    ],
  },
  "data-analytics-solutions": {
    headline: "A data foundation people actually trust.",
    lead: "Engineering, governance, analytics, reporting and visualization connected into a strategy the business can act on.",
    variant: "rail", vanta: "dots", accent: 3,
    whatHeading: "Trust is the deliverable",
    what: "A dashboard nobody believes is worse than no dashboard, because it moves the argument from the decision to the data. We build lineage, quality checks and clear ownership alongside the pipelines, so when a number is questioned there is an answer rather than an investigation.",
    capHeading: "What we put in place",
    points: [
      { title: "Model the business, not the sources", body: "A warehouse structured around entities the business recognises, rather than a mirror of every source schema." },
      { title: "Quality you can point at", body: "Lineage, tests and ownership so a disputed number has a traceable history." },
      { title: "Self-service that holds", body: "Semantic layers that let teams answer their own questions without re-deriving the truth each time." },
    ],
  },
  "ai-automation-solutions": {
    headline: "AI applied where the cost of the manual work is visible.",
    lead: "Use-case identification, governed design, workflow integration and process automation — starting where the payback can be measured.",
    variant: "split", vanta: "halo", accent: 0,
    whatHeading: "Boring problems first",
    what: "The most valuable early AI work is rarely the most exciting. It is the repeated, well-understood process where the manual cost is already measured and the data already exists. We start there, prove the pattern, and put the governance in place before expanding into judgement-heavy territory.",
    capHeading: "How we choose and build",
    points: [
      { title: "Score before you build", body: "Candidate use cases ranked on value, data readiness and risk — most do not survive the triage." },
      { title: "Grounded and governed", body: "Retrieval over your own content, with scope, escalation and human review designed in from the start." },
      { title: "Automate the deterministic parts", body: "RPA and workflow automation where rules are enough, models only where judgement is genuinely required." },
    ],
  },
  "integration-solutions": {
    headline: "One fabric instead of forty point-to-point connections.",
    lead: "Integration strategy connecting enterprise applications, cloud platforms, data sources, legacy systems and digital experiences.",
    variant: "mosaic", vanta: "globe", accent: 4,
    whatHeading: "Architecture, then platform",
    what: "Integration estates rarely fail loudly. They accumulate — a file here, a nightly job there — until nobody can say with confidence which system is authoritative. We map the flows and the ownership first, then choose patterns deliberately, so the architecture reflects the business rather than a vendor diagram.",
    capHeading: "The building blocks",
    points: [
      { title: "Establish the source of truth", body: "For each entity, one authoritative system and an agreed direction of travel." },
      { title: "Right pattern per flow", body: "Event-driven where the business needs real time, scheduled where it genuinely does not." },
      { title: "Observable and reconcilable", body: "Every flow monitored, with reconciliation that proves both sides still agree." },
    ],
  },

  "staff-augmentation": {
    headline: "Specialists on your team, under your direction.",
    lead: "Qualified technology professionals across engineering, enterprise platforms, cloud, data, QA, security and delivery — added to the team you already have.",
    variant: "split", vanta: "waves", accent: 1,
    whatHeading: "Your process, our people",
    what: "Augmentation works when the people arriving fit the way your team already works. We calibrate against your stack, your rituals and your definition of done — then submit a short list you can actually assess, rather than a volume of profiles that pushes the screening cost back onto you.",
    capHeading: "How we keep the bar",
    points: [
      { title: "Technical calibration", body: "A real screen against your stack before a profile reaches you, so the shortlist is short." },
      { title: "Fits your rituals", body: "People who join your standups and your branching model, not a parallel process beside it." },
      { title: "Scales both directions", body: "Ramping down handled as carefully as ramping up, including handover of what they knew." },
    ],
  },
  "contingent-workforce": {
    headline: "Flex the team without inheriting the overhead.",
    lead: "Project-based hiring, temporary skills and changing demand — with compliance, payrolling and employer-of-record handled.",
    variant: "stack", vanta: "cells", accent: 3,
    whatHeading: "The admin is the service",
    what: "Finding a contractor is the easy part. The work is classification, multi-state tax, benefits eligibility, insurance and the paperwork that follows someone from onboarding to final invoice. We carry that so your managers are choosing skills rather than administering employment.",
    capHeading: "What we carry",
    points: [
      { title: "Classification done properly", body: "Worker status assessed before engagement, not corrected after an audit." },
      { title: "Payroll and compliance", body: "Multi-state tax, I-9 and E-Verify, insurance and ACA handled end to end." },
      { title: "Clean exits", body: "Offboarding, access removal and final invoicing handled on a schedule, not on a reminder." },
    ],
  },
  "direct-hire": {
    headline: "A shortlist you can actually interview.",
    lead: "Identify, qualify and recruit technology professionals for permanent roles, with a process built around technical fit and how your team works.",
    variant: "rail", vanta: "rings", accent: 5,
    whatHeading: "Fewer candidates, better ones",
    what: "Sending ten profiles is easy and moves the screening cost to you. We run a structured intake, calibrate on the first two candidates, and then submit three to five people who have each been assessed against the role as written — including the parts of it that were never in the job description.",
    capHeading: "The process",
    points: [
      { title: "Structured intake", body: "Time with the hiring manager to establish what the role genuinely requires versus what the posting says." },
      { title: "Calibrated early", body: "The first submissions used to sharpen the brief, so the shortlist converges quickly." },
      { title: "Through to start date", body: "Offer support, counter-offer handling and contact through notice, where most searches quietly fail." },
    ],
  },
  "sow-project-teams": {
    headline: "Buy the outcome, not the timesheet.",
    lead: "Specialized teams assembled around defined objectives, deliverables, timelines and governance — with one party accountable for the result.",
    variant: "mosaic", vanta: "trunk", accent: 2,
    whatHeading: "Accountability in one place",
    what: "Staff augmentation puts delivery risk on you. A statement of work moves it to us. That only works if the scope is genuinely definable, so we spend real effort on the front end — deliverables, acceptance criteria and the change process — before anyone signs.",
    capHeading: "What makes it work",
    points: [
      { title: "Scope worth signing", body: "Deliverables and acceptance criteria written precisely enough that done is not a debate." },
      { title: "Governance that is used", body: "Milestones, reporting and escalation agreed at the start and actually followed." },
      { title: "One throat to choke", body: "A named delivery lead accountable for the outcome rather than for hours supplied." },
    ],
  },
  "managed-workforce": {
    headline: "See your whole contingent workforce at once.",
    lead: "Workforce planning, talent acquisition, resource coordination, compliance and reporting across every vendor and every engagement.",
    variant: "split", vanta: "topology", accent: 4,
    whatHeading: "One view across vendors",
    what: "Contingent labour spreads quietly across departments and suppliers until nobody can answer how many people are engaged, at what rate, or whether their paperwork is current. We consolidate the programme — requisition flow, rate cards, compliance and reporting — so those questions have one answer.",
    capHeading: "Programme components",
    points: [
      { title: "Requisition and rate governance", body: "A single flow with agreed rate cards, so pricing stops depending on which manager called which vendor." },
      { title: "Compliance visibility", body: "Status, documentation and expiry tracked centrally rather than in each supplier's system." },
      { title: "Consolidated reporting", body: "Spend, headcount and diversity reporting in one place, including for public-sector requirements." },
    ],
  },
};

/**
 * A line of substance under each capability card. Without these the cards were
 * a number and a single word, which told a buyer nothing.
 */
export const CAPABILITY_NOTES: Record<string, Record<string, string>> = {
  salesforce: {
    "Consulting": "Org review, licence rationalisation and a roadmap that sequences what to fix first.",
    "Implementation": "Sales, Service and Experience Cloud configured around the journeys your teams already run.",
    "Development": "Apex, LWC and Flow where configuration genuinely runs out — kept upgrade-safe.",
    "Integration": "Billing, ERP and legacy records surfaced in the console rather than in a second tab.",
  },
  sap: {
    "S/4HANA": "Greenfield, brownfield or selective conversion, chosen on business risk rather than fashion.",
    "Implementation": "FI/CO, MM/SD and PP configured with the month-end close protected throughout.",
    "Integration": "Clean interfaces to the systems around the core, monitored rather than assumed.",
    "SAP Cloud": "BTP extensions and cloud services added without dragging custom code into the core.",
  },
  oracle: {
    "Oracle Cloud": "Fusion Financials, SCM and HCM moved when the case is clear, module by module.",
    "ERP": "General ledger, payables and receivables configured to close on schedule.",
    "SCM": "Planning, inventory and order management connected to the ledger they report into.",
    "Procurement": "Sourcing and purchasing flows that buyers will follow without a workaround.",
  },
  workday: {
    "HCM": "Supervisory organisations, job architecture and security designed before configuration.",
    "Financials": "Accounting structure and reporting aligned to how the organisation is actually run.",
    "Integration": "Payroll, benefits and downstream feeds built with monitoring and alerting.",
    "Configuration": "Business processes configured with the owners in the room, then documented.",
  },
  infor: {
    "CloudSuite": "Industry editions implemented against your operating model, not the reference one.",
    "Implementation": "Plant, warehouse and service processes mapped before the system is configured.",
    "Integration": "Shop floor, logistics and finance connected so the numbers reconcile daily.",
    "Upgrades": "Moving off heavily customised estates while keeping the logic that mattered.",
  },
  "application-development": {
    "Custom Applications": "Purpose-built systems where no product fits, scoped to the smallest useful release.",
    "Web & Mobile": "Responsive, accessible interfaces tested on the devices your users actually carry.",
    "API Development": "Documented, versioned interfaces so the next team reuses rather than rebuilds.",
    "Legacy Modernization": "Strangler-pattern migration that retires the old system function by function.",
  },
  "cloud-devops": {
    "AWS": "Landing zones, networking and identity set up before the first workload lands.",
    "Azure": "Subscription design, policy and hybrid connectivity for estates with on-premise weight.",
    "Google Cloud": "Data and analytics workloads placed where they run best rather than uniformly.",
    "CI/CD": "Pipelines with real gates — tests, scanning and a rollback that has been rehearsed.",
  },
  "data-analytics": {
    "Data Engineering": "Ingestion and transformation with lineage, so a number can be traced to its source.",
    "Data Warehousing": "Modelled around business entities, not a mirror of every source schema.",
    "Business Intelligence": "Reports built for the decision being made, then retired when it changes.",
    "Data Governance": "Ownership, quality rules and access defined before the first dashboard ships.",
  },
  "ai-automation": {
    "Generative AI": "Grounded in your own content, with scope and escalation designed in from the start.",
    "Process Automation": "The deterministic steps automated first, where the manual cost is already measured.",
    "RPA": "Bots for systems with no API, built to fail loudly rather than silently.",
    "AI Integration": "Models wired into the workflow someone already follows, not beside it.",
  },
  "quality-engineering": {
    "Automation Testing": "The right tests at the right layer, rather than a brittle UI suite nobody trusts.",
    "Performance": "Load and soak modelling against realistic profiles, long before go-live week.",
    "Security Testing": "SAST, dependency scanning and abuse cases running as pipeline gates.",
    "API Testing": "Contract tests that catch a breaking change before a consumer does.",
  },
  mulesoft: {
    "Anypoint": "Runtime, policy and monitoring managed centrally instead of per integration.",
    "API Strategy": "System, process and experience layers with clear ownership and versioning.",
    "API Management": "Throttling, security and analytics applied consistently across the estate.",
    "Data Integration": "Legacy and mainframe data exposed safely without rewriting the system of record.",
  },
  "api-integration": {
    "API Design": "Specifications agreed and mocked first, so consumers can build in parallel.",
    "API Management": "Gateways, keys and quotas that protect the systems behind them.",
    "System Connectivity": "Reliable links between applications, partners and digital channels.",
    "Security & Governance": "Authentication, authorisation and standards applied to every interface.",
  },
  "enterprise-integration": {
    "Integration Architecture": "Flows, ownership and failure modes mapped before a platform is chosen.",
    "ERP/CRM Integration": "The two systems most businesses run on, kept in agreement.",
    "Event-Driven": "Real time where the business needs it, scheduled where it genuinely does not.",
    "Data Synchronization": "Bi-directional flows with conflict rules agreed up front, not in production.",
  },
};

/* ------------------------------------------------------------------ *
 * Industries. `video` names a file in /public/videos; where a topic has
 * no footage the header falls back to the generated background.
 * ------------------------------------------------------------------ */

export type IndustryDetail = DetailContent & { video?: string; stats: { value: string; label: string }[] };

export const INDUSTRY_DETAIL: Record<string, IndustryDetail> = {
  sled: {
    headline: "Public technology, held to public standards.",
    lead: "Government agencies, public institutions and education organizations modernizing systems under procurement rules, audit scrutiny and budget cycles that do not move.",
    variant: "rail", vanta: "topology", accent: 4,
    stats: [
      { value: "MBE", label: "Certified Minority Business Enterprise" },
      { value: "50", label: "States with payroll and compliance coverage" },
      { value: "6", label: "Capability areas across SLED programmes" },
    ],
    whatHeading: "Procurement is part of the problem",
    what: "Public-sector delivery is not private-sector delivery with more paperwork. Funding arrives on a cycle, scope is fixed by a solicitation, and every decision has to survive an audit years later. We plan around those constraints rather than treating them as friction — which is usually the difference between a programme that renews and one that does not.",
    capHeading: "What SLED programmes need",
    points: [
      { title: "Auditable from day one", body: "Decisions, approvals and change records captured as the work happens, not reconstructed for an audit." },
      { title: "Built for the funding cycle", body: "Phasing that delivers something usable inside each budget period rather than a payoff two cycles away." },
      { title: "Accessible by default", body: "Public services have to work for everyone, so accessibility is a requirement in the build, not a remediation." },
      { title: "Supplier diversity", body: "Certified MBE status that counts toward diversity spend requirements in public procurement." },
    ],
  },
  manufacturing: {
    headline: "The plant and the ledger, finally agreeing.",
    lead: "Operations, enterprise applications, supply chain and data connected so production, warehouse and finance stop reconciling different versions of the same week.",
    variant: "split", vanta: "trunk", accent: 2, video: "plant",
    stats: [
      { value: "15+", label: "Years delivering for manufacturers" },
      { value: "6", label: "Capability areas on the plant floor and above it" },
      { value: "4", label: "ERP platforms in practice" },
    ],
    whatHeading: "Start where the work happens",
    what: "Manufacturing systems fail at the seams: between planning and the floor, between the floor and the warehouse, between all of it and finance. We start on the floor with the people running the process, then work outward — because an ERP configured from a conference room encodes the operating model someone wished for rather than the one that exists.",
    capHeading: "Across the operation",
    points: [
      { title: "Planning that reflects capacity", body: "Production schedules built on real constraints — changeover time, labour, tooling — not theoretical throughput." },
      { title: "Inventory you can trust", body: "Barcode scanning, lot and serial traceability, and counts that hold up between cycles." },
      { title: "Supply chain visibility", body: "Supplier, logistics and order data connected so a delay is visible before it becomes a shortage." },
      { title: "One version of the month", body: "Plant, warehouse and finance closing on the same numbers without a reconciliation spreadsheet." },
    ],
  },
  utilities: {
    headline: "Critical infrastructure, quietly modernised.",
    lead: "Customer platforms, integration, data and workforce capability for organisations where an outage is a public event and the regulator is always watching.",
    variant: "mosaic", vanta: "net", accent: 0, video: "pipeline",
    stats: [
      { value: "10+", label: "Years delivering for utilities" },
      { value: "6", label: "Capability areas across the estate" },
      { value: "24/7", label: "Operational reality the systems serve" },
    ],
    whatHeading: "Change without downtime",
    what: "Utility systems cannot be taken down for a weekend to see how the migration goes. Every change is planned around continuity — parallel running, staged cutover, and a rollback that has been rehearsed rather than documented. The interesting engineering is in making the change invisible to the customer.",
    capHeading: "Where the work concentrates",
    points: [
      { title: "One view for the agent", body: "Billing history, outage status and service records in a single console instead of three systems." },
      { title: "Integration under load", body: "Interfaces to metering, outage and billing platforms that hold when a storm triples the call volume." },
      { title: "Regulatory reporting", body: "Data captured and retained the way the regulator will eventually ask for it." },
      { title: "Field and office aligned", body: "The same record whether it is opened in a truck or at a desk." },
    ],
  },
  "higher-education": {
    headline: "One student record, from enquiry to alumni.",
    lead: "Campus systems, ERP, CRM, data and integration connected so recruitment, enrolment, support and advancement stop each holding a fragment of the same person.",
    variant: "stack", vanta: "globe", accent: 5, video: "edu",
    stats: [
      { value: "8+", label: "Years delivering for institutions" },
      { value: "6", label: "Capability areas across campus" },
      { value: "3", label: "Core platforms most campuses run" },
    ],
    whatHeading: "Follow the student, not the department",
    what: "Campuses are organised by department, and their systems inherit that shape: admissions holds one record, the SIS another, advancement a third. Nobody can follow a student through. We design around the student journey instead, then connect the departmental systems to it — which is harder politically than technically.",
    capHeading: "Across the student lifecycle",
    points: [
      { title: "Recruitment to enrolment", body: "Enquiry, application and matriculation on one platform, so a prospect never restarts the conversation." },
      { title: "Advising with context", body: "Advisors seeing academic, financial and support history together rather than in three tabs." },
      { title: "Campus ERP", body: "Workday or equivalent for HR and finance, integrated with the student systems rather than beside them." },
      { title: "Reporting without manual joins", body: "Institutional reporting that does not begin with exporting three systems into a spreadsheet." },
    ],
  },
  enterprise: {
    headline: "Complex estates, made legible.",
    lead: "Enterprise platforms, digital engineering, cloud, data and integration brought together for organisations whose technology landscape has grown faster than its documentation.",
    variant: "rail", vanta: "dots", accent: 3,
    stats: [
      { value: "13", label: "Technology practices to draw from" },
      { value: "5", label: "Workforce engagement models" },
      { value: "7", label: "Technology solution areas" },
    ],
    whatHeading: "Landscape before roadmap",
    what: "Large estates accumulate: an acquisition here, a departmental system there, integrations written to survive a deadline. Before recommending anything we map what is actually running, who owns it and what depends on it — because most enterprise roadmaps fail on a dependency nobody documented rather than on the technology chosen.",
    capHeading: "Where we help most",
    points: [
      { title: "Estate mapping", body: "Systems, owners and dependencies documented before a target architecture is proposed." },
      { title: "Platform consolidation", body: "Overlapping systems rationalised on evidence of use, not on licence renewal dates." },
      { title: "Integration backbone", body: "One fabric connecting ERP, CRM, cloud and legacy, with an agreed source of truth per entity." },
      { title: "Capacity when it is needed", body: "Specialists added to programme teams without restarting a hiring cycle each time scope moves." },
    ],
  },
};
