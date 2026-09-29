/**
 * Government contract vehicles.
 *
 * Public agencies rarely buy a service the way a company does. They buy through
 * a vehicle someone has already competed — a cooperative, a state term
 * contract, a federal schedule — so the agency can issue a purchase order
 * instead of running a fresh solicitation. This file is the content behind
 * /company/contract-vehicles and the page each vehicle gets of its own.
 *
 * TIPS is the confirmed cooperative. Award numbers for the remaining vehicles
 * read "Provided on request" until the client supplies the real ones — never
 * invent a contract number on a procurement page, because buyers verify them
 * against the awarding body before citing one on a requisition.
 */

type VantaEffect = "waves" | "rings" | "net" | "globe" | "fog" | "halo" | "dots" | "cells" | "topology" | "trunk";
type ArtVariant = "points" | "helix" | "cubes" | "shards" | "orbit";

export type Vehicle = {
  id: string;
  /** Full name, as the ledger prints it. */
  name: string;
  /** Shorter title for the vehicle's own page — the last word takes the brand italic. */
  short: string;
  /** The awarding body, printed above the name. */
  authority: string;
  /** Award number where confirmed; omitted renders "Provided on request". */
  number?: string;
  /** One line for the ledger row. */
  summary: string;
  /** Who is entitled to buy through it. */
  eligibility: string;
  /** What can be bought under it. */
  scope: string[];

  /* ---- the vehicle's own page ---- */
  lead: string;
  body: string[];
  facts: { label: string; value: string }[];
  points: { title: string; body: string }[];
  /** The awarding body's own site, so a buyer can verify us at the source. */
  vendor?: { label: string; href: string; note: string };
  /** Each vehicle gets its own background, geometry and accent so the set does
      not read as one page repeated seven times. */
  vanta: VantaEffect;
  art: ArtVariant;
  accent: number;
  /** Two page layouts, alternated across the set. */
  variant: "dossier" | "brief";
};

export type VehicleGroup = {
  id: string;
  title: string;
  /** Why a buyer would reach for this class of vehicle. */
  note: string;
  vehicles: Vehicle[];
};

export const VEHICLE_GROUPS: VehicleGroup[] = [
  {
    id: "cooperative",
    title: "Cooperative Purchasing",
    note:
      "A cooperative competes a contract once and lets every member agency buy from it. For a school district or a city, this is usually the shortest path from a decision to a signed order.",
    vehicles: [
      {
        id: "tips",
        name: "TIPS — The Interlocal Purchasing System",
        short: "The Interlocal Purchasing System",
        authority: "Region 8 Education Service Center · Pittsburg, Texas",
        summary:
          "A national cooperative whose members buy from contracts already competed on their behalf.",
        eligibility:
          "Open to TIPS members nationwide: public and private schools, colleges and universities, cities, counties, state agencies, and non-profits. Membership is free and an agency can join at any point before it issues an order.",
        scope: [
          "Enterprise application implementation and support",
          "Cloud migration and managed services",
          "Data platform and analytics engagements",
          "IT staffing and project teams",
        ],
        lead:
          "TIPS is a national purchasing cooperative that gives its members access to contracts it has already competed on their behalf. It is housed at and managed by the Region 8 Education Service Center in Pittsburg, Texas.",
        body: [
          "The cooperative model exists because most public agencies cannot afford to run a full solicitation for every technology need. A district that wants to modernise a student system, or a city that needs a data platform rebuilt, would otherwise spend the better part of a year on the paperwork before a single hour of work is delivered. TIPS absorbs that year once, on behalf of every member.",
          "What the member gets is a contract whose scope, terms and pricing have already been through a competitive process and been awarded. Our rates under it are published rather than negotiated per deal, which means the quote an agency receives is the quote every other member receives for the same role. There is nothing left to haggle over and nothing for an auditor to question afterwards.",
          "Membership is free and carries no minimum. Agencies commonly join precisely because a specific project has come up, and the paperwork is short enough that it rarely holds up a start date. If your agency is not a member yet, tell us before the scoping conversation and we will run the two tracks in parallel.",
        ],
        facts: [
          { label: "Administered by", value: "Region 8 ESC, Pittsburg, Texas" },
          { label: "Reach", value: "National — all 50 states" },
          { label: "Membership cost", value: "Free, no minimum spend" },
          { label: "Order instrument", value: "Purchase order against the awarded contract" },
        ],
        points: [
          {
            title: "Enterprise platform work",
            body: "Salesforce, SAP, Oracle, Workday and Infor implementations, upgrades and ongoing support, scoped as a fixed deliverable or as a managed service.",
          },
          {
            title: "Cloud and modernisation",
            body: "Migration of ageing on-premise systems, landing-zone build-out, and the managed operation that follows once the workload is running.",
          },
          {
            title: "Data and reporting",
            body: "Warehouse and lakehouse builds, reporting layers for boards and legislatures, and the governance needed before public data is published.",
          },
          {
            title: "People on the programme",
            body: "Named engineers, architects and project managers added to your team, billed at the rates published on the contract.",
          },
        ],
        vendor: {
          label: "Visit TIPS",
          href: "https://www.tips-usa.com/",
          note: "Look us up in the TIPS vendor directory, confirm the award, or start a membership application — all from the cooperative's own site.",
        },
        vanta: "globe",
        art: "orbit",
        accent: 1,
        variant: "dossier",
      },
      {
        id: "naspo",
        name: "NASPO ValuePoint",
        short: "NASPO ValuePoint",
        authority: "National Association of State Procurement Officials",
        summary:
          "State-led cooperative contracts that participating states adopt through their own participating addenda.",
        eligibility:
          "State agencies, local government and public education in states that have executed a participating addendum for the master agreement.",
        scope: [
          "Technology professional services",
          "Cloud solutions",
          "Software value-added reseller services",
        ],
        lead:
          "NASPO ValuePoint is the cooperative arm of the National Association of State Procurement Officials. One state leads the solicitation, and every other state may adopt the resulting master agreement for its own buyers.",
        body: [
          "The structure is worth understanding before you order. A lead state runs the competition and awards a master agreement. Other states then decide, one at a time, whether to participate — and when they do, they sign a participating addendum that can add their own terms, their own reporting and occasionally their own pricing. The master agreement tells you what was competed; the addendum tells you what applies to you.",
          "For a buyer this means the first question is not whether the vehicle exists but whether your state has adopted it, and under what addendum. We check that before quoting, because a scope that is in the master agreement is not automatically in your state's version of it.",
          "Where your state participates, the advantage is the same as any cooperative: the competition is finished, the ceiling rates are published, and your purchasing office issues an order rather than a solicitation.",
        ],
        facts: [
          { label: "Administered by", value: "NASPO ValuePoint, on behalf of a lead state" },
          { label: "Reach", value: "Participating states and their local entities" },
          { label: "Adoption", value: "Per state, via a participating addendum" },
          { label: "Order instrument", value: "Order under your state's addendum" },
        ],
        points: [
          {
            title: "Technology professional services",
            body: "Architecture, build and integration work delivered against a statement of work written to the master agreement's categories.",
          },
          {
            title: "Cloud solutions",
            body: "Assessment, migration and managed operation, priced from the published cloud service categories.",
          },
          {
            title: "Reseller services",
            body: "Software and the configuration around it on a single order, where the addendum permits value-added reseller activity.",
          },
        ],
        vendor: {
          label: "Visit NASPO ValuePoint",
          href: "https://www.naspovaluepoint.org/",
          note: "Check whether your state participates, and read the master agreement and addendum that apply to you.",
        },
        vanta: "net",
        art: "points",
        accent: 4,
        variant: "brief",
      },
    ],
  },
  {
    id: "texas",
    title: "State of Texas",
    note:
      "Texas routes most agency and local technology spend through the Department of Information Resources. A DIR contract is pre-negotiated on price and terms, so a customer orders against it directly.",
    vehicles: [
      {
        id: "dir-itsac",
        name: "DIR ITSAC — IT Staff Augmentation Contract",
        short: "Staff augmentation for Texas",
        authority: "Texas Department of Information Resources",
        summary:
          "The vehicle Texas agencies use to bring contract technical staff onto a programme.",
        eligibility:
          "Texas state agencies, higher education institutions, public school districts, and local government, plus DIR customers outside Texas where reciprocity applies.",
        scope: [
          "Developers, architects and engineers by role and rate",
          "Project and programme management",
          "Business and data analysis",
          "Quality engineering and test",
        ],
        lead:
          "ITSAC is how a Texas agency adds technical people to a programme it is running itself. The roles, the rate ceilings and the terms are set by the Department of Information Resources before anyone is named.",
        body: [
          "ITSAC is a staffing vehicle, not a delivery vehicle, and the distinction decides who is accountable. Under ITSAC the agency directs the work: it sets priorities, runs the standups, accepts the output and carries the schedule risk. We supply people who meet the role definition and the rate published for it.",
          "That is the right instrument when you have a programme with its own leadership and a gap in a specific skill — a Salesforce developer for eight months, two data engineers through a migration, a test lead through a release. It is the wrong instrument when what you actually want is an outcome on a fixed date, because nobody on an ITSAC order is contractually responsible for delivering one. For that, DBITS is the vehicle.",
          "Rates are published by role, so the number you are quoted is the number on the contract. Candidate submission, interview and onboarding run through your own process, and a replacement follows the same route if a placement does not work out.",
        ],
        facts: [
          { label: "Administered by", value: "Texas Department of Information Resources" },
          { label: "Buyers", value: "Texas agencies, higher ed, districts, local government" },
          { label: "Pricing", value: "Published rate ceiling per role" },
          { label: "Accountability", value: "Agency directs the work" },
        ],
        points: [
          {
            title: "Engineering roles",
            body: "Application developers, platform engineers, cloud and integration specialists, matched to the ITSAC role definitions rather than to a generic job title.",
          },
          {
            title: "Programme roles",
            body: "Project managers, scrum masters and business analysts for agencies running their own delivery cadence.",
          },
          {
            title: "Assurance roles",
            body: "Test leads, automation engineers and accessibility specialists, usually added ahead of a release window.",
          },
        ],
        vendor: {
          label: "Visit Texas DIR",
          href: "https://dir.texas.gov/",
          note: "Read the ITSAC programme terms, the role catalogue and the current vendor list at the awarding agency.",
        },
        vanta: "waves",
        art: "helix",
        accent: 2,
        variant: "dossier",
      },
      {
        id: "dir-dbits",
        name: "DIR DBITS — Deliverables-Based IT Services",
        short: "Deliverables-based IT services",
        authority: "Texas Department of Information Resources",
        summary:
          "Fixed-deliverable technology projects rather than time-and-materials staffing.",
        eligibility:
          "The same DIR customer base. Used where the agency wants an outcome and a milestone schedule rather than named resources.",
        scope: [
          "Application maintenance and support",
          "Technology migration and upgrade",
          "System integration",
          "Enterprise resource planning projects",
        ],
        lead:
          "DBITS is the other half of the DIR pairing. Where ITSAC supplies people, DBITS buys outcomes: a defined deliverable, a milestone schedule, and acceptance criteria the agency signs against.",
        body: [
          "A DBITS statement of work reads differently from a staffing order. It names what will exist at the end, when each milestone lands, what evidence proves the milestone is met, and what happens if it is not. The agency is buying a result, and the risk of getting there sits with us rather than with the programme office.",
          "That makes it the right vehicle for a migration with a cutover date, a maintenance and support arrangement with a service level, or an integration that has to be working before a legislative session begins. It is less suited to exploratory work where the scope is still moving, because every change has to be handled as a written amendment.",
          "Payment follows acceptance rather than hours. In practice that means the milestone definition is the most important half-page in the document, and we spend real time on it with your team before anything is signed.",
        ],
        facts: [
          { label: "Administered by", value: "Texas Department of Information Resources" },
          { label: "Buyers", value: "Texas agencies, higher ed, districts, local government" },
          { label: "Pricing", value: "Fixed price per deliverable" },
          { label: "Accountability", value: "Vendor carries delivery risk" },
        ],
        points: [
          {
            title: "Maintenance and support",
            body: "Ongoing application support against a defined service level, with a monthly deliverable rather than a timesheet.",
          },
          {
            title: "Migration and upgrade",
            body: "Version upgrades, platform moves and data centre exits, structured around a cutover date and a rollback plan.",
          },
          {
            title: "Integration",
            body: "Interfaces between agency systems and third parties, delivered and accepted interface by interface.",
          },
          {
            title: "ERP projects",
            body: "Finance, HR and procurement platform work, phased so each module is accepted before the next begins.",
          },
        ],
        vendor: {
          label: "Visit Texas DIR",
          href: "https://dir.texas.gov/",
          note: "Read the DBITS service categories and the statement-of-work templates published by the awarding agency.",
        },
        vanta: "cells",
        art: "cubes",
        accent: 3,
        variant: "brief",
      },
      {
        id: "hub",
        name: "Texas HUB — Historically Underutilized Business",
        short: "Historically Underutilized Business",
        authority: "Texas Comptroller of Public Accounts",
        summary:
          "Certification that lets an agency count spend with us toward its HUB participation goals.",
        eligibility:
          "Any Texas agency or institution with HUB goals, whether we are prime or subcontractor on the award.",
        scope: [
          "Prime contracting on state awards",
          "Subcontracting to primes with HUB participation targets",
          "HUB subcontracting plan support",
        ],
        lead:
          "HUB is a certification rather than a purchasing contract, but it changes the arithmetic on an award. Spend with a certified business counts toward the participation goals a Texas agency reports against.",
        body: [
          "The Texas Comptroller sets annual HUB participation goals by procurement category, and agencies report their performance against them. For information technology services the goal is meaningful enough that most agencies plan for it at the solicitation stage rather than trying to reach it afterwards.",
          "Certification matters in two directions. When we contract directly with an agency, the whole value counts. When a larger systems integrator is prime and needs a HUB subcontracting plan to make its bid responsive, our share of the work counts toward that plan — which is why a good part of our public sector work in Texas arrives through a prime rather than through the agency.",
          "None of this is a substitute for the technical evaluation, and it should not be. It resolves a constraint the agency already has, on work it has already decided to buy.",
        ],
        facts: [
          { label: "Certified by", value: "Texas Comptroller of Public Accounts" },
          { label: "Applies to", value: "State agencies and institutions with HUB goals" },
          { label: "Counts as", value: "Prime value or subcontracted share" },
          { label: "Type", value: "Certification, not a purchasing contract" },
        ],
        points: [
          {
            title: "Prime awards",
            body: "Where we contract with the agency directly, the full contract value counts toward the agency's reported participation.",
          },
          {
            title: "Subcontracting plans",
            body: "We work as a named subcontractor inside a prime's HUB subcontracting plan, with the documentation the plan requires.",
          },
          {
            title: "Good-faith effort support",
            body: "Where an agency or prime must evidence its outreach, we provide the certification records and scope detail that go into the file.",
          },
        ],
        vendor: {
          label: "Visit the Texas Comptroller",
          href: "https://comptroller.texas.gov/purchasing/vendor/hub/",
          note: "Search the state HUB directory and read the current participation goals by procurement category.",
        },
        vanta: "halo",
        art: "shards",
        accent: 5,
        variant: "dossier",
      },
    ],
  },
  {
    id: "federal",
    title: "Federal",
    note:
      "Federal buyers work from schedules and government-wide acquisition contracts. These carry pre-set labour categories and ceiling rates, so a contracting officer can place an order without a new competition.",
    vehicles: [
      {
        id: "gsa-mas",
        name: "GSA Multiple Award Schedule",
        short: "GSA Multiple Award Schedule",
        authority: "U.S. General Services Administration",
        summary:
          "The federal government's broadest commercial schedule, covering IT professional services.",
        eligibility:
          "All federal agencies, and state and local government under the Cooperative Purchasing and Disaster Recovery programmes for the IT special item numbers.",
        scope: [
          "IT professional services (54151S)",
          "Cloud and cloud-related services (518210C)",
          "Highly adaptive cybersecurity services (54151HACS)",
          "Order-level materials",
        ],
        lead:
          "The Multiple Award Schedule is the federal government's general-purpose commercial contract. A contracting officer orders against it using the special item numbers that match the work.",
        body: [
          "MAS consolidated what used to be dozens of separate schedules into one contract with many special item numbers. The SIN is the part that matters operationally: it defines what may be ordered and which labour categories and ceiling rates apply. A statement of work has to sit inside a SIN we hold, and that is the first thing we check.",
          "Ordering procedures are set by the Federal Acquisition Regulation rather than by us. For most services orders the contracting officer seeks quotes from a few schedule holders, evaluates them against the stated criteria and places the order — a process measured in weeks, not in the months an open-market competition would take.",
          "The Cooperative Purchasing programme extends the IT and cybersecurity SINs to state and local government, so a city or a state agency can order from MAS even though it is a federal schedule. This is a frequent surprise to buyers who assume the schedule is closed to them.",
        ],
        facts: [
          { label: "Administered by", value: "U.S. General Services Administration" },
          { label: "Buyers", value: "Federal agencies; state and local under Cooperative Purchasing" },
          { label: "Pricing", value: "Ceiling rates by labour category and SIN" },
          { label: "Ordering", value: "FAR 8.4 procedures" },
        ],
        points: [
          {
            title: "IT professional services",
            body: "Design, build, integrate and support work ordered under the professional services SIN against named labour categories.",
          },
          {
            title: "Cloud services",
            body: "Migration and managed cloud operation ordered under the cloud SIN, priced per the schedule.",
          },
          {
            title: "Cybersecurity",
            body: "High value asset assessment, risk and vulnerability work under the highly adaptive cybersecurity SIN.",
          },
        ],
        vendor: {
          label: "Visit GSA",
          href: "https://www.gsa.gov/buy-through-us/purchasing-programs/gsa-multiple-award-schedule",
          note: "Read the schedule's ordering procedures and look up special item numbers and current holders.",
        },
        vanta: "rings",
        art: "cubes",
        accent: 0,
        variant: "brief",
      },
      {
        id: "sewp",
        name: "NASA SEWP",
        short: "Solutions for Enterprise-Wide Procurement",
        authority: "NASA Solutions for Enterprise-Wide Procurement",
        summary:
          "A government-wide acquisition contract for technology products and the services attached to them.",
        eligibility:
          "Every federal agency and their authorised contractors, through the SEWP programme office.",
        scope: [
          "Technology product acquisition",
          "Installation, configuration and integration",
          "Lifecycle support attached to the product order",
        ],
        lead:
          "SEWP is a government-wide acquisition contract run by NASA on behalf of the whole federal government. It is built around technology products and the services that make them work.",
        body: [
          "SEWP is unusual among GWACs in how it is administered. The programme office runs a quote tool that puts a request in front of every contract holder at once, and the resulting quotes come back inside a published turnaround. Fees are low and disclosed, and the office publishes its own performance metrics — which is why agencies with a hard fiscal-year deadline reach for it.",
          "Because the contract is product-centred, the services it carries are the ones attached to a product purchase: installation, configuration, integration into the existing estate, and the lifecycle support that follows. Standalone consulting does not belong on a SEWP order, and a contracting officer will say so.",
          "Where a programme needs both — hardware or software plus the work to put it into service — SEWP keeps it on a single order rather than splitting it across two vehicles and two acceptance processes.",
        ],
        facts: [
          { label: "Administered by", value: "NASA SEWP Program Office" },
          { label: "Buyers", value: "All federal agencies and authorised contractors" },
          { label: "Centred on", value: "Technology products and attached services" },
          { label: "Ordering", value: "Request for quote through the SEWP tool" },
        ],
        points: [
          {
            title: "Product acquisition",
            body: "Hardware and software sourced through the contract, with the quote turnaround the programme office publishes.",
          },
          {
            title: "Installation and integration",
            body: "Putting what was bought into service inside the existing estate, on the same order as the product.",
          },
          {
            title: "Attached lifecycle support",
            body: "Maintenance, refresh and support that stays tied to the acquisition rather than becoming a separate contract.",
          },
        ],
        vendor: {
          label: "Visit NASA SEWP",
          href: "https://www.sewp.nasa.gov/",
          note: "Read the ordering guide, the fee structure and the programme office's published turnaround metrics.",
        },
        vanta: "dots",
        art: "points",
        accent: 4,
        variant: "dossier",
      },
    ],
  },
];

/** Flat list, for route generation and lookups. */
export const ALL_VEHICLES: Vehicle[] = VEHICLE_GROUPS.flatMap((g) => g.vehicles);

export function getVehicle(id: string): { vehicle: Vehicle; group: VehicleGroup } | undefined {
  for (const group of VEHICLE_GROUPS) {
    const vehicle = group.vehicles.find((v) => v.id === id);
    if (vehicle) return { vehicle, group };
  }
  return undefined;
}

/** How a public buyer actually gets from interest to kickoff. */
export const BUY_STEPS: { title: string; body: string }[] = [
  {
    title: "Confirm you are covered",
    body:
      "Tell us which agency you buy for and we will confirm which of the vehicles above you are entitled to use. Where a cooperative membership is missing, it is a short form and it is free — no agency has ever been blocked at this step.",
  },
  {
    title: "Choose the right vehicle",
    body:
      "Staffing, a fixed-deliverable project and a product purchase each sit under a different contract. We recommend the one that matches how you want to be billed and who you want to hold accountable, not the one that is easiest for us.",
  },
  {
    title: "Scope the work together",
    body:
      "We write the statement of work with your team: outcomes, milestones, named roles, rates drawn from the contract's published schedule, and the acceptance criteria your auditor will read later.",
  },
  {
    title: "Issue the order",
    body:
      "Your purchasing office issues a purchase order or task order against the vehicle. There is no solicitation to run, no evaluation committee to convene, and no protest window to wait out.",
  },
  {
    title: "Start inside two weeks",
    body:
      "Kickoff, environment access and the first delivery increment follow the order. Most engagements that come through a cooperative are working within ten business days of the PO.",
  },
];

/** Certifications a procurement officer checks before an award. */
export const CERTIFICATIONS: { label: string; body: string }[] = [
  {
    label: "MBE",
    body: "Minority Business Enterprise, certified through the National Minority Supplier Development Council.",
  },
  {
    label: "HUB",
    body: "Historically Underutilized Business, certified by the Texas Comptroller of Public Accounts.",
  },
  {
    label: "VAR",
    body: "Value-added reseller, so hardware, software and the services around them can sit on one order.",
  },
];
