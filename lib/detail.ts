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
  art?: "points" | "helix" | "cubes" | "shards" | "orbit";
  accent: number;        // index into the prism palette
  image?: string;
  whatHeading: string;   // heading for the opening section
  what: string;          // the opening paragraph, written for this page
  capHeading: string;    // heading above the capability grid
  points: { title: string; body: string }[];  // three differentiators
};

export const PRACTICE_DETAIL: Record<string, DetailContent> = {
  salesforce: {
    headline: "Customer data that finally agrees with itself.",
    lead: "Sales, service and experience on one platform — configured for the way your teams actually work, not the way a demo suggests they should.",
    variant: "split", vanta: "globe", art: "orbit", accent: 1, image: "/delivery/discover.jpg",
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
    variant: "rail", vanta: "net", art: "cubes", accent: 0, image: "/delivery/build.jpg",
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
    variant: "mosaic", vanta: "dots", art: "shards", accent: 4, image: "/delivery/integrate.jpg",
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
    variant: "stack", vanta: "waves", art: "helix", accent: 3, image: "/delivery/run.jpg",
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
    variant: "split", vanta: "topology", art: "cubes", accent: 2, image: "/delivery/build.jpg",
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
    variant: "mosaic", vanta: "halo", art: "points", accent: 5, image: "/delivery/build.jpg",
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
    variant: "rail", vanta: "clouds", art: "orbit", accent: 4, image: "/delivery/integrate.jpg",
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
    variant: "stack", vanta: "dots", art: "shards", accent: 3, image: "/delivery/run.jpg",
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
    variant: "split", vanta: "net", art: "points", accent: 5, image: "/delivery/discover.jpg",
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
    variant: "rail", vanta: "waves", art: "helix", accent: 0, image: "/delivery/build.jpg",
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
    variant: "mosaic", vanta: "globe", art: "orbit", accent: 4, image: "/delivery/integrate.jpg",
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
    variant: "stack", vanta: "rings", art: "points", accent: 1, image: "/delivery/integrate.jpg",
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
    variant: "rail", vanta: "topology", art: "cubes", accent: 2, image: "/delivery/build.jpg",
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
