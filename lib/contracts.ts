/**
 * Government contract vehicles.
 *
 * Public agencies rarely buy a service the way a company does. They buy through
 * a vehicle someone has already competed — a cooperative, a state term
 * contract, a federal schedule — so the agency can issue a purchase order
 * instead of running a fresh solicitation. This file is the content behind
 * /company/contract-vehicles.
 *
 * TIPS is the confirmed cooperative. Award numbers for the remaining vehicles
 * are shown as "provided on request" until the client supplies the real ones —
 * never invent a contract number on a procurement page, because buyers verify
 * them against the awarding body before they cite one on a requisition.
 */

export type Vehicle = {
  id: string;
  name: string;
  /** The awarding body, printed above the name. */
  authority: string;
  /** Award number where confirmed; omitted renders "Provided on request". */
  number?: string;
  /** One line for the ledger row, before the row is opened. */
  summary: string;
  /** Who is entitled to buy through it. */
  eligibility: string;
  /** What can be bought under it. */
  scope: string[];
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
      },
      {
        id: "naspo",
        name: "NASPO ValuePoint",
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
      },
      {
        id: "dir-dbits",
        name: "DIR DBITS — Deliverables-Based IT Services",
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
      },
      {
        id: "hub",
        name: "Texas HUB — Historically Underutilized Business",
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
      },
      {
        id: "sewp",
        name: "NASA SEWP",
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
      },
    ],
  },
];

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
