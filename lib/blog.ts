/**
 * Blog posts.
 *
 * The body lives here as structured sections rather than as a blob of HTML, so
 * the article template controls the typography and nothing in the copy can
 * break the page. Read time is counted from the text at render rather than
 * typed in, because a hand-typed figure goes stale the moment anyone edits a
 * paragraph and nobody remembers to update it.
 */

export type BlogSection = {
  heading?: string;
  paras?: string[];
  list?: string[];
};

export type BlogCategory = "Industry" | "Technology" | "Solutions";

export type BlogPost = {
  slug: string;
  tag: string;
  category?: BlogCategory;
  title: string;
  /** The card line on the homepage and the index. */
  excerpt: string;
  image: string;
  imageAlt: string;
  /** ISO, so it can go straight into <time dateTime> and the metadata. */
  date: string;
  author: { name: string; role: string };
  /** Index into the prism palette, so each post carries its own colour. */
  accent: number;
  intro: string;
  sections: BlogSection[];
  takeaways: string[];
};

export function getCategoryForTag(tag: string, existingCategory?: string): BlogCategory {
  if (existingCategory === "Industry" || existingCategory === "Technology" || existingCategory === "Solutions") {
    return existingCategory;
  }
  const t = (tag || "").toLowerCase();
  if (t.includes("public") || t.includes("sector") || t.includes("industry") || t.includes("government")) {
    return "Industry";
  }
  if (t.includes("workforce") || t.includes("culture") || t.includes("partner") || t.includes("managed") || t.includes("service") || t.includes("hire") || t.includes("sow")) {
    return "Solutions";
  }
  return "Technology";
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "staff-augmentation-vs-sow",
    tag: "Workforce",
    title: "Staff Augmentation vs. SOW",
    excerpt:
      "The two look similar on a rate card and are completely different on accountability. How to tell which one your work actually needs.",
    image: "/company/flexible-delivery.jpg",
    imageAlt: "A team working around a table",
    date: "2026-01-08",
    author: { name: "Priya Raman", role: "Business Unit Head, SI" },
    accent: 0,
    intro:
      "Both arrangements put people on your programme and both appear on an invoice as hours. The difference is who is answerable if the work is late, and that difference should decide which one you sign.",
    sections: [
      {
        heading: "Who carries the risk",
        paras: [
          "Staff augmentation puts delivery risk on you. You direct the work, set priorities, run the cadence and accept the output. We supply people who meet the role and fit the way your team already works.",
          "A statement of work moves that risk to us. We own the result, which only functions if the scope is genuinely definable: deliverables, acceptance criteria and a change process agreed before anyone starts.",
        ],
      },
      {
        heading: "When augmentation is the right call",
        paras: [
          "You have a programme with its own leadership, a cadence that works, and a specific skill missing. Adding capacity to that is straightforward and the overhead of defining a contractual deliverable would buy you nothing.",
          "It is also right when the work is genuinely exploratory. Nobody can fix a price on a scope that will be rewritten twice before it is understood.",
        ],
      },
      {
        heading: "When a statement of work is",
        paras: [
          "You want a defined outcome on a defined date and you are prepared to spend real effort on the front end describing it. That effort is the price of transferring the risk, and skipping it produces the worst of both arrangements: a fixed price against a scope nobody agreed.",
          "The honest test is whether you can write down what finished looks like. If you cannot, an SOW will become a change-request negotiation, and you would have been better off with augmentation.",
        ],
      },
    ],
    takeaways: [
      "Augmentation leaves delivery risk with you; an SOW moves it to the supplier.",
      "An SOW only works where the scope can genuinely be defined up front.",
      "If you cannot write down what finished looks like, do not buy a deliverable.",
    ],
  },
  {
    slug: "build-buy-or-partner",
    tag: "Technology",
    title: "Build, Buy, or Partner?",
    excerpt:
      "The decision is rarely about capability. It is about which of the three you can still afford to maintain in three years.",
    image: "/delivery/discover.jpg",
    imageAlt: "A discovery and planning session",
    date: "2026-01-22",
    author: { name: "Marcus Ellery", role: "Business Unit Head, Delivery & Operations" },
    accent: 2,
    intro:
      "Most organizations can build most things. The question that matters is which of them they will still be able to run, change and staff once the people who built it have moved on.",
    sections: [
      {
        heading: "Build what is actually yours",
        paras: [
          "If a process is how you compete, encoding it in someone else's product means configuring around their assumptions forever. That is the strongest case for building, and it is narrower than most roadmaps assume.",
          "Everything else is a cost centre you have chosen to own, including the hiring, the on-call and the upgrade you will be doing in year four.",
        ],
      },
      {
        heading: "Buy where the problem is solved",
        paras: [
          "Payroll, identity, ticketing and finance are solved problems with mature products and large talent pools. Building there buys differentiation nobody outside the organization will ever notice.",
          "The real cost of buying is rarely the licence. It is the integration and the data ownership, which is where these decisions should be examined.",
        ],
      },
      {
        heading: "Partner where the gap is durable",
        paras: [
          "Partnering makes sense when the capability is genuinely needed but not often enough to justify a permanent team, or where the skill is scarce enough that hiring would take longer than the window you have.",
          "The failure mode is partnering for something you will need every month for years, which is how organizations end up renting a core capability indefinitely.",
        ],
      },
    ],
    takeaways: [
      "Build only what is genuinely how you compete.",
      "The cost of buying is the integration and the data ownership, not the licence.",
      "Partner for durable gaps, not for capability you will need every month for years.",
    ],
  },
  {
    slug: "managed-services-vs-staff-augmentation",
    tag: "Workforce",
    title: "Managed Services vs. Staff Augmentation",
    excerpt:
      "One buys capacity, the other buys an outcome with a service level attached. Choosing wrongly shows up about four months in.",
    image: "/company/enterprise-mindset.jpg",
    imageAlt: "A meeting in progress",
    date: "2026-02-05",
    author: { name: "Jordan Whitfield", role: "Engagement Manager, Projects & Delivery" },
    accent: 3,
    intro:
      "Staff augmentation gives you people to direct. Managed services gives you a function someone else runs to an agreed standard. The second is more expensive per hour and frequently cheaper per year.",
    sections: [
      {
        heading: "What a service level actually commits",
        paras: [
          "A managed service is defined by what it guarantees: response times, availability, resolution and the reporting that proves it. Those commitments are what you are paying for, and they only mean something if someone reads the reports.",
          "Augmentation makes no such promise. If the person is unavailable, the work waits, and the gap is yours to manage.",
        ],
      },
      {
        heading: "Where managed wins",
        paras: [
          "Steady, continuous operational work with a predictable shape: monitoring, support, routine enhancement, patching. Nobody wants to build an internal rota for these, and they are exactly what a service model is designed to absorb.",
          "It also removes the hidden cost of coordination. A function that is run rather than staffed does not need daily direction from a manager who has other work.",
        ],
      },
      {
        heading: "Where it does not",
        paras: [
          "Work that changes shape weekly, or that requires sitting inside your team's context, is poorly served by a service boundary. Every change becomes a conversation about whether it is in scope.",
          "In that situation augmentation is both cheaper and faster, and the overhead of a service definition buys nothing.",
        ],
      },
    ],
    takeaways: [
      "A managed service is the commitment, not the headcount.",
      "Steady operational work suits a service; weekly-changing work does not.",
      "If every request becomes a scope conversation, you bought the wrong model.",
    ],
  },
  {
    slug: "the-real-cost-of-a-bad-technology-hire",
    tag: "Workforce",
    title: "The Real Cost of a Bad Technology Hire",
    excerpt:
      "The salary is the smallest line. The expensive part is the time of everyone around them and the decisions made in the meantime.",
    image: "/company/people-centered.jpg",
    imageAlt: "Colleagues working through a problem together",
    date: "2026-02-19",
    author: { name: "Nadia Brooks", role: "HR Manager" },
    accent: 5,
    intro:
      "A hire that does not work out is usually counted as the salary paid and the recruitment fee repeated. That figure is comfortable and wrong by a wide margin.",
    sections: [
      {
        heading: "The cost is other people's time",
        paras: [
          "Senior engineers absorb the shortfall quietly: reviewing more carefully, correcting afterwards, taking back work. Little of that is visible on a timesheet, and it is routinely larger than the salary involved.",
          "Delivery slips in a way nobody attributes to the hire, because the slip is distributed across a team that has been covering.",
        ],
      },
      {
        heading: "Decisions outlive the person",
        paras: [
          "Architecture and data decisions made in those months stay in the estate long after the individual has gone. Unpicking them is a project of its own and is rarely budgeted as part of the cost of the hire.",
        ],
      },
      {
        heading: "What reduces it",
        paras: [
          "A calibrated intake, a shorter list, and a first fortnight with a defined piece of work and a named reviewer. Most mismatches are visible inside two weeks if someone is positioned to see them, and almost none are visible from a CV.",
          "A trial-to-hire route removes much of the exposure where the role allows it, which is one of the few genuine advantages of a contract-first arrangement.",
        ],
      },
    ],
    takeaways: [
      "Most of the cost is the time of the people compensating, not the salary.",
      "Decisions made during those months stay in the estate.",
      "A defined first fortnight with a named reviewer surfaces a mismatch early.",
    ],
  },
  {
    slug: "ai-in-the-enterprise",
    tag: "AI",
    title: "AI in the Enterprise",
    excerpt:
      "Where it earns its place, where it does not, and why the answer usually comes back to the state of your data.",
    image: "/practices/conversational-ai.jpg",
    imageAlt: "An interface being used",
    date: "2026-03-05",
    author: { name: "Devon Hartley", role: "Sr Product Manager" },
    accent: 4,
    intro:
      "Enterprise AI has moved past the question of whether it works. The useful questions now are narrower: which tasks, grounded in what, reviewed by whom, and measured how.",
    sections: [
      {
        heading: "Narrow and grounded beats broad and impressive",
        paras: [
          "Summarising a long case history, drafting a reply someone edits, classifying an inbound request: each of these is bounded, verifiable and sits next to work a person was already doing.",
          "Pointing a model at an uncurated estate and asking it to be useful produces confident answers that are wrong, which costs more than no answer.",
        ],
      },
      {
        heading: "The data problem is the whole problem",
        paras: [
          "Answer quality is set by the material behind it. Most disappointing pilots are not model failures; they are an organization discovering what its knowledge base actually looks like.",
        ],
      },
      {
        heading: "Decide accountability before deployment",
        paras: [
          "Where a person reviews and sends, accountability is clear and the risk is contained. Where output reaches a customer unmediated, it needs the change control, monitoring and rollback of any production system, because that is what it has become.",
        ],
      },
    ],
    takeaways: [
      "Pick bounded, verifiable tasks next to work people already do.",
      "Answer quality is set by the knowledge behind it, not the model.",
      "Unmediated output is a production system and needs to be run like one.",
    ],
  },
  {
    slug: "what-employees-expect-from-employers",
    tag: "Culture",
    title: "What Employees Expect From Employers",
    excerpt:
      "Technology professionals have become specific about what they are looking for. Most of it costs less than the recruitment it replaces.",
    image: "/company/technology-talent.jpg",
    imageAlt: "A working session in an office",
    date: "2026-03-12",
    author: { name: "Nadia Brooks", role: "HR Manager" },
    accent: 0,
    intro:
      "The expectations that come up repeatedly in exit conversations are not unreasonable and are rarely about money. They are about whether the work is going somewhere and whether anyone is paying attention.",
    sections: [
      {
        heading: "Work that keeps their skills current",
        paras: [
          "A technologist on a stack that is not moving is watching their market value decline while they are employed. Funded certification and genuine exposure to current platforms is retention, not a benefit.",
        ],
      },
      {
        heading: "Clarity about what happens next",
        paras: [
          "Contract professionals in particular want to know what follows this engagement, and most organizations answer too late. A conversation eight weeks out keeps people who otherwise start looking at twelve.",
        ],
      },
      {
        heading: "Being told the truth",
        paras: [
          "Including when the news is bad: a delayed extension, a client decision that changes the role, a project that is not going to land. People make their own plans around honest information and resent having to infer it.",
        ],
      },
    ],
    takeaways: [
      "A stagnant stack is a retention problem, not a training one.",
      "Have the what-happens-next conversation eight weeks out, not two.",
      "People plan around honest information, including bad news.",
    ],
  },
  {
    slug: "what-makes-a-technology-partnership-last",
    tag: "Partnership",
    title: "What Makes a Technology Partnership Last?",
    excerpt:
      "The relationships that survive are not the ones that went smoothly. They are the ones that handled the first bad quarter well.",
    image: "/delivery/run.jpg",
    imageAlt: "Operations and ongoing support",
    date: "2026-03-19",
    author: { name: "Caleb Ortiz", role: "Sr Sales Manager, Projects" },
    accent: 2,
    intro:
      "Every long engagement has a bad quarter. What happens in it decides whether there is a fourth year, far more than anything agreed during the sales process.",
    sections: [
      {
        heading: "Raising problems early, at a cost",
        paras: [
          "The supplier who says a date is at risk eight weeks out is spending credibility to buy you options. The one who reports green until the week before has protected themselves at your expense.",
          "That behaviour is visible early and is worth weighting heavily when choosing who to work with.",
        ],
      },
      {
        heading: "Leaving the client able to continue",
        paras: [
          "Documentation that is current, decisions that are recorded, and a team that can make a change without the people who built it. A partner whose value depends on being indispensable has an interest in you never becoming capable.",
        ],
      },
      {
        heading: "Being judged a year later",
        paras: [
          "Go-live is a poor measure. Whether the platform still fits, whether changes are still cheap and whether the team can work on it alone are the measures that matter, and they can only be taken with hindsight.",
        ],
      },
    ],
    takeaways: [
      "Weight how a supplier handles bad news; it predicts the hard quarter.",
      "A partner who needs to be indispensable will keep you dependent.",
      "Judge the work a year after go-live, not on the day.",
    ],
  },
  {
    slug: "salesforce-is-no-longer-just-a-crm",
    tag: "Salesforce",
    title: "Salesforce Is No Longer Just a CRM",
    excerpt:
      "How organizations are turning Salesforce into a connected platform for customer experience, data, automation, and AI.",
    image: "/insights/platform.jpg",
    imageAlt: "A team working across an open-plan office",
    date: "2026-01-15",
    author: { name: "Devon Hartley", role: "Sr Product Manager" },
    accent: 1,
    intro:
      "Most organizations bought Salesforce to keep track of customers. Many of them now run quoting, service, onboarding, field operations and parts of finance on it. That shift happened gradually, and a lot of teams are still managing the platform with the habits they formed when it was a address book with reporting attached.",
    sections: [
      {
        heading: "From record-keeping to orchestration",
        paras: [
          "A CRM stores what happened. A platform decides what happens next. The difference shows up in where the work sits: when the system only records outcomes, the real process lives in inboxes, spreadsheets and someone's head, and the CRM is updated afterwards as an act of administration. Nobody enjoys that, so it is done late and done badly, and then the reporting is wrong.",
          "When the platform orchestrates instead, the process runs inside it. A request arrives, it is routed, it carries its own history, and the record is a by-product of the work rather than a chore after it. That is a bigger change to how people work than to how the system is configured, which is why it is usually the part that is underestimated.",
        ],
      },
      {
        heading: "Data is the hard part, not the clicks",
        paras: [
          "Configuration is rarely what sinks a programme. Data is. Most organizations arrive with the same customer represented three times, with a different identifier in each system, and no agreement on which one is authoritative. Until that is settled, every automation built on top inherits the ambiguity and every dashboard invites an argument about whose number is right.",
          "The unglamorous work of deciding what a customer is, which system owns that definition, and how a change propagates is what makes the rest possible. It is worth doing before the first automation, not after the third one misfires.",
        ],
      },
      {
        heading: "Automation earns its place when it removes a decision",
        paras: [
          "Automating a task that a person still has to check is not a saving, it is a second place to look. The automations that hold are the ones that remove a decision entirely: a routing rule that nobody overrides, an approval that fires on a threshold the business actually agreed, a status that updates because the underlying fact changed.",
          "A useful test before building one: if this runs wrong at two in the morning, who finds out, and how? If there is no answer, the automation is not ready, however correct the logic looks in a sandbox.",
        ],
      },
      {
        heading: "Where AI actually lands",
        paras: [
          "The cases that work are narrow and grounded. Summarising a long case history for an agent picking it up cold. Drafting a reply that a person edits and sends. Suggesting the next step from what similar accounts did. In each one the model is working from your own records, and a human stays between the output and the customer.",
          "The cases that disappoint are the broad ones, where a model is pointed at an estate nobody has curated and asked to be useful. The quality of the answer is set by the quality of the knowledge behind it, which brings the question back to data again.",
        ],
      },
      {
        heading: "What this changes about how you buy",
        paras: [
          "If the platform is running the process rather than recording it, the skills around it change too. Release management starts to matter. So does having someone who owns the data model rather than the backlog. Treating it as an application to be administered, when it has become the operating layer for several departments, is how organizations end up with a platform that everyone depends on and nobody is accountable for.",
        ],
      },
    ],
    takeaways: [
      "Decide what a customer is, and which system owns that definition, before automating anything on top of it.",
      "Automations that still need checking have not saved anyone time.",
      "Ground AI features in your own records, and keep a person between the output and the customer.",
      "If the platform runs the process, someone has to own the platform, not just the backlog.",
    ],
  },
  {
    slug: "legacy-to-modern-enterprise-application-modernization",
    tag: "Technology",
    title: "From Legacy to Modern: Rethinking Enterprise Application Modernization",
    excerpt:
      "A practical look at how organizations can modernize critical applications without disrupting the business.",
    image: "/insights/modernization.jpg",
    imageAlt: "Racks of servers in a data centre",
    date: "2026-02-12",
    author: { name: "Marcus Ellery", role: "Business Unit Head, Delivery & Operations" },
    accent: 4,
    intro:
      "Legacy is not a technical description. Plenty of old systems run perfectly well and cost almost nothing to keep. A system becomes legacy on the day the business wants to change something and the honest answer is that nobody is confident they can.",
    sections: [
      {
        heading: "Legacy is a business condition, not a technology one",
        paras: [
          "That reframing matters, because it changes what you measure. The question is not how old the stack is or what language it was written in. It is how long a change takes, how often a change breaks something unrelated, and how many people are left who understand it.",
          "Measured that way, a two-year-old service with no tests and one author can be more of a liability than a twenty-year-old system that is documented, stable and rarely touched. Modernization budgets are far better spent on the first than on the second.",
        ],
      },
      {
        heading: "Five options, compared honestly",
        paras: [
          "Almost every modernization decision resolves to one of five, and most estates need several of them at once rather than one applied everywhere.",
        ],
        list: [
          "Retain. The system works, the business is not asking it to change, and the cheapest correct action is to leave it alone and say so out loud.",
          "Re-host. Move it as it is to get out of a data centre or off unsupported hardware. It buys time and changes nothing else, which is both the point and the limitation.",
          "Re-platform. Same business logic, modern runtime and managed services underneath. Usually the best value when the rules still hold but the operating cost or the risk does not.",
          "Refactor. Keep the system, change its internals so it can be worked on again. The right call when the logic is correct and valuable but nobody can safely touch it.",
          "Replace. Rebuild or buy. The most expensive and the slowest, and sometimes unavoidable when the process the system encodes is itself the thing that has to change.",
        ],
      },
      {
        heading: "Sequence around risk, not around architecture",
        paras: [
          "The common failure is to sequence the programme the way the architecture diagram reads: foundations first, then services, then the parts users can see. It is logical, and it means the first eighteen months produce nothing anyone outside the programme can perceive. That is how funding gets withdrawn at month nine.",
          "Sequencing around risk instead means asking which part of the estate would hurt most if it failed next quarter, and which change would let the business do something it currently cannot. Those two questions usually point at the same handful of components, and starting there produces visible results while the deeper work continues underneath.",
        ],
      },
      {
        heading: "Keeping the business running while you move",
        paras: [
          "Nothing about modernization grants permission to stop trading. In practice that means parallel running for longer than anyone wants, reconciliation between old and new while both are live, and a rollback that has actually been rehearsed rather than written down.",
          "It also means being honest about data migration early. Historic data is almost always worse than the business believes, and the discovery usually happens in a dress rehearsal three weeks before cutover. Pulling that discovery forward is the single cheapest piece of risk reduction available on most programmes.",
        ],
      },
      {
        heading: "How you know it worked",
        paras: [
          "Go-live is not the measure. The measure is what the same work costs a year later: how long a routine change takes, how many incidents trace back to the modernized component, and whether the team can make a change without the people who built it.",
          "If those numbers have not moved, the estate was migrated rather than modernized, and the original problem is still waiting.",
        ],
      },
    ],
    takeaways: [
      "A system is legacy when change becomes risky, not when it becomes old.",
      "Most estates need several of retain, re-host, re-platform, refactor and replace at once.",
      "Sequence by business risk so something visible ships inside the first funding period.",
      "Rehearse the rollback and meet the bad data early, not three weeks before cutover.",
    ],
  },
  {
    slug: "modernizing-the-public-sector",
    tag: "Public Sector",
    title: "Modernizing the Public Sector: Building Technology for What's Next",
    excerpt:
      "How state, local, and education organizations can approach modernization, data, cloud, and digital experiences.",
    image: "/insights/public-sector.jpg",
    imageAlt: "A government building seen from the street",
    date: "2026-03-26",
    author: { name: "Caleb Ortiz", role: "Sr Sales Manager, Projects" },
    accent: 3,
    intro:
      "Public-sector delivery is not private-sector delivery with more paperwork. The constraints are different in kind, not degree, and a plan that ignores them tends to fail at precisely the point where it becomes expensive to change course.",
    sections: [
      {
        heading: "Procurement is part of the design",
        paras: [
          "Scope is fixed by a solicitation written before anyone has built anything, and changing it later is a formal act rather than a conversation. That puts unusual weight on the discovery done before the document is issued, and it rewards scoping that leaves room for what will be learned.",
          "It also changes what a vendor relationship looks like. An agency buying through an existing cooperative or state term contract has already competed the terms and the rates, which removes months from the front of a programme. Knowing which instrument covers you is often worth more than another round of market research.",
        ],
      },
      {
        heading: "Funding cycles shape scope",
        paras: [
          "Money arrives on a cycle and frequently cannot be carried across it. A roadmap whose first meaningful delivery lands in year two is a roadmap that will be defended twice before it produces anything, and defended by people who were not in the room when it was drawn.",
          "Phasing so that each budget period ends with something usable is not a project-management nicety here. It is what keeps the programme alive, and it changes the architecture: the work has to be divisible in ways a single-release design never needs to be.",
        ],
      },
      {
        heading: "Accessibility is a requirement, not a phase",
        paras: [
          "Public services have to work for everyone who is entitled to use them, which makes accessibility a build requirement rather than an audit at the end. Treated as remediation, it becomes a late and expensive rework of exactly the interfaces that were hardest to get right.",
          "Built in, it costs very little: semantic markup, keyboard paths, contrast and labelling are habits rather than tasks. The difference between the two approaches is almost entirely a matter of when the decision is made.",
        ],
      },
      {
        heading: "Data across agencies and departments",
        paras: [
          "Agencies are organised by mandate and their systems inherit that shape. One department holds the record of a person, another holds their case, a third holds the payment, and nobody can follow one individual across all three without a manual reconciliation that somebody does on a Friday.",
          "Fixing that is more a governance problem than a technical one. The integration is usually straightforward once it is agreed who owns the authoritative record and what the others are permitted to do with it. Reaching that agreement is the work.",
        ],
      },
      {
        heading: "Decisions have to survive an audit",
        paras: [
          "Every significant decision will be examined later, sometimes years later, by people with no access to the context in which it was made. Capturing decisions, approvals and changes as the work happens costs very little; reconstructing them afterwards from memory and email is slow, incomplete and exactly the situation audit findings are made of.",
          "Programmes that treat the record as part of delivery rather than as an overhead tend to be the ones that get renewed, because they can answer questions about themselves.",
        ],
      },
    ],
    takeaways: [
      "Scope before the solicitation, because changing it afterwards is a formal process.",
      "Phase so every budget period ends with something usable.",
      "Build accessibility in; remediating it later rewrites the hardest interfaces.",
      "Agree who owns the authoritative record before building the integration.",
      "Capture decisions as the work happens, not when the auditor asks.",
    ],
  },
];

/** Counted from the body, so an edit to the copy updates it automatically. */
export function readMinutes(post: BlogPost): number {
  const words = [
    post.intro,
    ...post.sections.flatMap((s) => [s.heading ?? "", ...(s.paras ?? []), ...(s.list ?? [])]),
    ...post.takeaways,
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** "18 September 2026" — written out, so there is no month/day ambiguity. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * The address a share link should carry.
 *
 * Deliberately not `window.location.href`. In development NEXT_PUBLIC_SITE_URL
 * is localhost, and a localhost link is the reason a share composer opens
 * empty: LinkedIn, Facebook and X build their preview by fetching the page, and
 * they cannot reach a machine on your desk. Sharing from a dev machine
 * therefore falls back to the public domain so the link is at least the real
 * one. The preview itself only appears once that URL is actually live.
 */
export function postUrl(slug: string): string {
  const configured = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");
  const isLocal = /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0|\[::1\])(:|$)/i.test(configured);
  const base = !configured || isLocal ? "https://www.testsoft.com" : configured;
  return `${base}/blog/${slug}`;
}

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
