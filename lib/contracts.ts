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
  /** The awarding body's own logo, shown beside the vendor band. */
  image?: { src: string; alt: string };
  /** A photograph of the setting the contract belongs to. Per vehicle, so the
      Texas page and the Florida page do not show the same building. */
  photo?: { src: string; alt: string; caption: string };
  /** A full-width footage band, with one line set over it. */
  band?: { src: string; alt: string; line: string };
  /** A site_images slot to prefer over `image.src` — the official mark, kept in
      the database so it can be replaced without a deploy. */
  imageSlot?: string;
  /** Each vehicle gets its own background and accent so the set does not read
      as one page repeated seven times. */
  vanta: VantaEffect;
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
        /* The award is for Staffing Services specifically, so the page says so
           rather than implying the whole services catalogue sits under it. */
        number: "260703 (Staffing Services)",
        name: "TIPS (The Interlocal Purchasing System)",
        short: "The Interlocal Purchasing System",
        authority: "Region 8 Education Service Center · Pittsburg, Texas",
        summary:
          "Awarded Vendor Contract 260703 for Staffing Services, members place orders for technology people without running their own solicitation.",
        eligibility:
          "Open to TIPS members nationwide: public and private schools, colleges and universities, cities, counties, state agencies, and non-profits. Membership is free and an agency can join at any point before it issues an order.",
        scope: [
          "Technology staffing, engineers, architects, analysts and project roles",
          "Contract, contract-to-hire and direct placement",
          "Project teams supplied against a statement of work",
          "Managed staffing for an ongoing programme",
        ],
        lead:
          "TIPS is a national purchasing cooperative that gives its members access to contracts it has already competed on their behalf. Our award under it is Vendor Contract 260703, for Staffing Services, and it is housed at and managed by the Region 8 Education Service Center in Pittsburg, Texas.",
        body: [
          "The cooperative model exists because most public agencies cannot afford to run a full solicitation every time they need people. A district that has to staff a student-system upgrade, or a city that needs two data engineers for nine months, would otherwise spend months on procurement before anyone starts. TIPS absorbs that once, on behalf of every member.",
          "What a member gets under 260703 is staffing whose terms and rates have already been through a competitive process and been awarded. Our rates are published rather than negotiated per deal, so the quote one member receives for a role is the quote every member receives. There is nothing left to haggle over and nothing for an auditor to question later.",
          "It is a staffing award, and that decides who is accountable. The agency directs the work (priorities, cadence, acceptance) and we supply people who meet the role and bill at the contracted rate. Where an agency wants an outcome on a fixed date rather than named people, that is a different instrument and we will say so.",
          "Membership is free and carries no minimum. Agencies commonly join because a specific need has come up, and the paperwork is short enough that it rarely holds up a start date. Tell us before the scoping conversation if you are not a member yet and we will run both tracks together.",
        ],
        facts: [
          { label: "Administered by", value: "Region 8 ESC, Pittsburg, Texas" },
          { label: "Reach", value: "National, all 50 states" },
          { label: "Membership cost", value: "Free, no minimum spend" },
        ],
        points: [
          {
            title: "Engineering and platform roles",
            body: "Developers, architects, cloud and integration engineers across Salesforce, SAP, Oracle, Workday and custom stacks, billed at the contracted rate for the role.",
          },
          {
            title: "Programme and analysis roles",
            body: "Project managers, scrum masters, business analysts and data analysts added to a programme the agency is running itself.",
          },
          {
            title: "Project teams",
            body: "Where a whole team is needed rather than individuals, supplied together against a statement of work with a named lead.",
          },
          {
            title: "Contract to hire",
            body: "Where an agency wants the option to take someone permanently, placements can be structured for conversion from the start.",
          },
        ],
        vendor: {
          label: "Visit TIPS",
          href: "https://www.tips-usa.com/",
          note: "Look up contract 260703 in the TIPS vendor directory, confirm the award, or start a membership application, all from the cooperative's own site.",
        },
        image: { src: "/vehicles/tips-logo.png", alt: "TIPS" },
        imageSlot: "tips-awarded-vendor",
        vanta: "globe",
        accent: 1,
        photo: {
          src: "/vehicles/public-sector.jpg",
          alt: "A state capitol building",
          caption: "Public sector",
        },
        variant: "dossier",
      },
    ],
  },
  {
    id: "florida",
    title: "State of Florida",
    note:
      "Florida runs most agency technology buying through state term contracts held by the Department of Management Services. An agency orders against the contract rather than running its own solicitation.",
    vehicles: [
      {
        id: "florida-dms-itsa",
        number: "ITB No. 23-80101507-ITB",
        name: "Florida DMS IT Staff Augmentation Contract",
        short: "Staff augmentation for Florida",
        authority: "Florida Department of Management Services",
        summary:
          "The state term contract Florida agencies use to bring contract technical staff onto a programme.",
        eligibility:
          "Florida state agencies and eligible users of state term contracts, counties, municipalities, school districts, state universities and colleges, and other political subdivisions registered to buy from them.",
        scope: [
          "Developers, architects and engineers by job title and rate",
          "Project and programme management",
          "Business and data analysis",
          "Quality engineering and test",
        ],
        lead:
          "This is how a Florida agency adds technical people to work it is running itself. The job titles, the rate ceilings and the terms are set by the Department of Management Services before anyone is named.",
        body: [
          "A state term contract exists so that an agency does not have to compete the same requirement over and over. DMS runs the solicitation, awards to a pool of vendors, and publishes the job titles and the maximum rate for each. An agency then issues a request to that pool and places an order.",
          "It is a staffing instrument, and that decides who is accountable. The agency directs the work: it sets priorities, runs the cadence, accepts the output and carries the schedule. We supply people who meet the published job title and bill at or below the published rate.",
          "That makes it right when you have a programme with its own leadership and a gap in a specific skill. It is the wrong instrument when what you actually want is a fixed deliverable on a fixed date, because nobody on a staffing order is contractually responsible for producing one.",
        ],
        facts: [
          { label: "Administered by", value: "Florida Department of Management Services" },
          { label: "Buyers", value: "Florida agencies and eligible users of state term contracts" },
          { label: "Pricing", value: "Published rate ceiling per job title" },
          { label: "Accountability", value: "Agency directs the work" },
        ],
        /* Written to the mechanics of a Florida state term contract: the order
           names a published job title and bills at or below its ceiling rate.
           The title families below should be checked against the contract's own
           price sheet before this page goes live. */
        points: [
          {
            title: "Roles by job title",
            body: "An order names a job title from the contract, not a description we wrote. We put forward people who meet that title's stated qualifications, application developers, systems and network engineers, database, cloud and integration specialists, and bill at or below its rate ceiling.",
          },
          {
            title: "Programme and analysis",
            body: "Project managers, business and systems analysts and scrum masters for agencies running their own delivery, under the same published titles and the same ceilings.",
          },
          {
            title: "Quality and release",
            body: "Test leads, automation engineers and accessibility specialists, usually added ahead of a release window rather than borrowed from the build team once a date is already at risk.",
          },
          {
            title: "Ordered off the state term contract",
            body: "An eligible user issues a purchase order against ITB No. 23-80101507-ITB. No separate solicitation, no new negotiation: the titles, the ceilings and the terms are the ones the Department of Management Services already competed.",
          },
        ],
        vendor: {
          label: "Visit Florida DMS",
          href: "https://www.dms.myflorida.com/business_operations/state_purchasing",
          note: "Read the state term contract terms, the job titles and the current vendor list at the awarding agency.",
        },
        band: {
          src: "/videos/flag.mp4",
          alt: "A United States flag moving in the wind",
          line: "Ordered against a contract the state has already competed.",
        },
        photo: {
          src: "/vehicles/florida-capitol.jpg",
          alt: "The Historic Florida Capitol in Tallahassee, with the modern Capitol tower behind it",
          caption: "Tallahassee, Florida",
        },
        vanta: "waves",
        accent: 4,
        variant: "brief",
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
      "Tell us which agency you buy for and we will confirm which of the vehicles above you are entitled to use. Where a cooperative membership is missing, it is a short form and it is free, no agency has ever been blocked at this step.",
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
