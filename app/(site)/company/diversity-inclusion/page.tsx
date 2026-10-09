import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import SectionBackdrop from "@/components/SectionBackdrop";
import ConstellationField from "@/components/ConstellationField";
import { PRISM_TEXT, PRISM_VAR } from "@/lib/data";

const PRISM_BG = ["bg-prism-red", "bg-brand", "bg-prism-amber", "bg-prism-green", "bg-prism-blue", "bg-prism-violet"];

export const metadata: Metadata = {
  title: "Diversity & Inclusion",
  description:
    "Different perspectives, equal opportunity. How Testsoft evaluates candidates, builds teams, and treats the certification as a responsibility rather than a category.",
};

export const revalidate = 60;

/* The certifications this page actually claims. Kept local rather than shared
   with the contract-vehicles list, which names a VAR status that belongs to
   procurement and not here. */
const CERTS = [
  { label: "MBE", body: "Minority Business Enterprise." },
  { label: "SBE", body: "Small Business Enterprise." },
  { label: "HUB", body: "Texas Historically Underutilized Business." },
];

/** The first conversation. Front is the promise, back is what it means. */
const FAIRNESS = [
  { title: "We listen", image: "/diversity/listen.jpg", body: "Every candidate deserves to be heard and understood before decisions are made." },
  { title: "We evaluate fairly", image: "/diversity/evaluate.jpg", body: "Skills, experience, qualifications and role requirements guide the evaluation, nothing else." },
  { title: "We communicate transparently", image: "/diversity/communicate.jpg", body: "Candidates should know where they stand and what happens next, without having to chase it." },
  { title: "We respect every individual", image: "/diversity/respect.jpg", body: "Selected or not, every interaction should be professional and respectful." },
];

const WHY = [
  { title: "Stronger teams", body: "Different experiences bring complementary skills, perspectives and approaches to a team." },
  { title: "Better ideas", body: "When people are comfortable saying what they think, assumptions get challenged rather than inherited." },
  { title: "Greater innovation", body: "Innovation grows where people are encouraged to think differently without fear of being overlooked." },
  { title: "Stronger connections", body: "An inclusive environment builds trust between employees, candidates, clients and partners." },
  { title: "More opportunity", body: "Fair access lets people build skills, careers and long-term professional relationships." },
];

const ATTRIBUTES = [
  "Background", "Gender", "Age", "Ethnicity", "National origin",
  "Disability", "Personal circumstances", "Career path", "Previous employer", "Educational journey",
];

const ENCOURAGE = [
  { title: "Speak up", body: "Bring ideas, questions and different perspectives to the conversation." },
  { title: "Learn continuously", body: "Build new skills and stay curious as technology and business keep moving." },
  { title: "Collaborate openly", body: "Work across teams and disciplines to solve problems together." },
  { title: "Support one another", body: "Create a place where people can ask for help, share what they know, and grow." },
  { title: "Lead with respect", body: "Treat colleagues, candidates, clients and partners with professionalism and dignity." },
];

const IN_ACTION = [
  { title: "Inclusive talent sourcing", body: "We look across broad professional networks and markets rather than one referral circle." },
  { title: "Consistent evaluation", body: "Role requirements, technical capability, experience and qualifications, applied the same way each time." },
  { title: "Opportunity to grow", body: "Continuous learning and development, so capability keeps pace with the technology." },
  { title: "Respectful communication", body: "Clear and professional through the whole recruitment and employment journey." },
  { title: "Diverse perspectives", body: "People are encouraged to bring different viewpoints into projects and problem-solving." },
  { title: "Inclusive teams", body: "Teams where people can contribute and develop without having to fit a particular mould." },
];

/** The chain from talent to what gets delivered. */
const CHAIN = [
  { title: "Diverse talent", body: "Professionals with different experiences and perspectives." },
  { title: "Collaborative teams", body: "Environments where people can actually contribute their expertise." },
  { title: "Better thinking", body: "Assumptions challenged, problems seen from more than one angle." },
  { title: "Stronger solutions", body: "Technology that serves a broader range of users." },
];

const RESPONSIBILITY = [
  "Create access to technology careers",
  "Connect diverse professionals with meaningful opportunities",
  "Support inclusive teams",
  "Develop long-term professional relationships",
  "Work with organizations committed to diverse supplier ecosystems",
  "Encourage growth through skills and technology",
];

const SKILLS = [
  "AI & Data", "Cloud", "Salesforce", "Software Engineering",
  "Cybersecurity", "DevOps", "Enterprise Applications", "Digital Transformation",
];

const AHEAD = [
  { title: "Opportunity is accessible", body: "People have real chances to show what they can do and build a career." },
  { title: "Perspectives are valued", body: "Different experience is treated as a source of knowledge, not an exception." },
  { title: "Technology is inclusive", body: "Solutions designed with the needs of diverse users and communities in mind." },
  { title: "People can grow", body: "Everyone is encouraged to keep learning as the work changes." },
  { title: "Success is shared", body: "Growth creates opportunity for the people and communities connected to it." },
];

/** What we can and cannot promise, stated as a pair so neither is overstated. */
const PROMISE = [
  { cant: "We cannot promise that every candidate will be selected.", can: "We can promise to approach every candidate with respect, professionalism and fairness." },
  { cant: "We cannot guarantee that every person will have the same career journey.", can: "We can work toward equal access to opportunity and development." },
  { cant: "We cannot remove every difference between people.", can: "We can build an environment where those differences are respected rather than used as barriers." },
];

export default function DiversityInclusionPage() {
  return (
    <div style={{ "--page-accent": PRISM_VAR[3] } as React.CSSProperties}>
      <PageHeader
        eyebrow="Diversity & Inclusion"
        flow
        title="Different perspectives. Equal opportunity."
        intro="Great technology is built by people with different experiences, perspectives, backgrounds and ideas. Diversity is who is represented. Inclusion is how people are treated once they are there."
      />

      {/* ---- the belief, and the certifications behind it ---- */}
      <section className="relative z-10 overflow-hidden bg-surface pt-10 sm:pt-12 pb-10 sm:pb-12">
        <SectionBackdrop from="bg-prism-green" to="bg-prism-blue" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <div className="grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-20">
            <Reveal>
              <p className="mono-label label-accent mb-4">Our belief</p>
              <h2 className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
                Every person should be evaluated for what they can contribute, not defined by where they
                <span className="text-brand italic"> come from.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1} className="space-y-5 text-graphite leading-relaxed self-center">
              <p>Whether someone is a candidate, employee, consultant, client or partner, every individual deserves fairness, respect, transparency and dignity.</p>
              <p>As a Minority Business Enterprise, a Small Business Enterprise and a Texas HUB-certified company, we recognise the responsibility that comes with building a business rooted in opportunity.</p>
            </Reveal>
          </div>

          <ul className="mt-12 grid gap-5 sm:grid-cols-3">
            {CERTS.map((c, i) => (
              <Reveal key={c.label} delay={i * 0.06} variant="rise">
                <li className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${PRISM_BG[(i + 3) % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`} />
                  <p className={`display relative text-3xl ${PRISM_TEXT[(i + 3) % 6]}`}>{c.label}</p>
                  <p className="relative mt-3 text-sm text-graphite leading-relaxed">{c.body}</p>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---- the first conversation, as cards that turn ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Our commitment</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Fairness from the first <span className="text-brand italic">conversation.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              Inclusion begins before anyone joins us. It starts at the first interaction, and a candidate
              who is not right for one role today is not defined by it tomorrow.
            </p>
          </Reveal>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FAIRNESS.map((f, i) => (
              <Reveal key={f.title} delay={(i % 4) * 0.06} variant="rise">
                {/* Turns on hover; on a touch screen there is no hover to reveal
                    it with, so those devices get both faces stacked instead. */}
                <div className="flip h-full">
                  <div className="flip-inner h-full min-h-[13.125rem]">
                    {/* The picture is the card, with the title set over it —
                        the fronts were four empty boxes with a rule on them. */}
                    <div className="flip-face overflow-hidden rounded-2xl border border-line bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={f.image}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="media-footage absolute inset-0 h-full w-full object-cover"
                      />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-surface/25" />
                      <span aria-hidden className={`prism-wash-lg pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full ${PRISM_BG[(i + 3) % 6]} blur-[60px]`} />
                      <div className="absolute inset-x-0 bottom-0 p-7">
                        <span aria-hidden className={`prism-rule block ${PRISM_BG[(i + 3) % 6]}`} />
                        <h3 className="display text-2xl text-ink mt-4">{f.title}</h3>
                      </div>
                    </div>
                    <div className="flip-face flip-back overflow-hidden rounded-2xl border border-brand/50 bg-surface p-7">
                      <span aria-hidden className={`prism-wash-lg pointer-events-none absolute -left-12 -bottom-12 h-36 w-36 rounded-full ${PRISM_BG[(i + 3) % 6]} blur-[60px]`} />
                      <p className="relative text-sm text-ink/80 leading-relaxed">{f.body}</p>
                    </div>
                  </div>
                </div>
                {/* touch fallback */}
                <p className="mt-3 text-sm text-graphite leading-relaxed [@media(hover:hover)]:hidden">{f.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- why it matters ---- */}
      <section className="relative z-10 overflow-hidden bg-paper-tint/55 py-10 sm:py-12">
        <ConstellationField link={110} />
        <span aria-hidden className="pointer-events-none absolute inset-0 bg-paper-tint/60" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-paper to-transparent" />
        <span aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-paper to-transparent" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Why inclusion matters</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Better people. Better ideas. Better <span className="text-brand italic">outcomes.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              Inclusion is not about giving anyone an advantage. It is about making sure unnecessary
              barriers do not decide who gets an opportunity.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {WHY.map((w, i) => (
              <Reveal key={w.title} delay={(i % 3) * 0.05} variant="tilt" duration={0.7}>
                <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute -left-14 -bottom-14 h-40 w-40 rounded-full ${PRISM_BG[(i + 2) % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`} />
                  <h3 className={`display relative text-xl sm:text-2xl ${PRISM_TEXT[(i + 2) % 6]}`}>{w.title}</h3>
                  <p className="relative mt-3 text-sm text-graphite leading-relaxed">{w.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the band ---- */}
      <section className="relative z-10 bg-paper py-6 sm:py-8">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal variant="rise" duration={0.8}>
            <figure className="relative overflow-hidden rounded-[1.75rem] border border-line">
              <video
                className="media-footage block w-full h-[clamp(13.75rem,32vw,26.25rem)] object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="none"
                aria-label="A project team working together"
              >
                <source src="/videos/inclusion-band.mp4" type="video/mp4" />
              </video>
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/35 to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-7 sm:p-12">
                <p className="display text-2xl sm:text-4xl text-ink max-w-2xl leading-[1.1]">
                  Equal consideration. Individual evaluation. Respect at every step.
                </p>
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* ---- every candidate matters ---- */}
      <section className="relative z-10 bg-paper pb-10 sm:pb-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">Every candidate matters</p>
            <h2 className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
              Talent should be recognised for what it can <span className="text-brand italic">do.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              We speak with thousands of professionals across different skills, industries and career
              stages. None of the following should stand in for evaluating someone&apos;s actual
              qualifications for a role.
            </p>
          </Reveal>
          <Reveal delay={0.1} variant="rise" className="self-center">
            <div className="flex flex-wrap gap-2">
              {ATTRIBUTES.map((a, i) => (
                <span
                  key={a}
                  className={`mono-label rounded-full border px-3 py-1.5 text-graphite transition-colors ${i % 3 === 0 ? "border-brand/35" : "border-line-blue"
                    }`}
                >
                  {a}
                </span>
              ))}
            </div>
            <p className="mt-7 text-ink/80 leading-relaxed">
              Our job is to understand the person behind the resume: the skills the role needs, the
              experience behind them, and how that capability lines up with the work.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- our people ---- */}
      <section className="relative z-10 bg-surface/70 py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Our people are our strength</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Different experiences. Shared <span className="text-brand italic">purpose.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {ENCOURAGE.map((e, i) => (
              <Reveal key={e.title} delay={(i % 3) * 0.05} variant="rise">
                <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-paper p-7 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-rule block ${PRISM_BG[(i + 1) % 6]} origin-left transition-transform duration-500 group-hover:scale-x-[1.8]`} />
                  <h3 className="display text-xl sm:text-2xl text-ink mt-5 group-hover:text-brand transition-colors">{e.title}</h3>
                  <p className="mt-3 text-sm text-graphite leading-relaxed">{e.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- inclusion in action ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Inclusion in action</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              It is more than a <span className="text-brand italic">statement.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              A commitment means something only when it changes everyday decisions. These are the ones it changes.
            </p>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {IN_ACTION.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.05} variant="tilt" duration={0.7}>
                <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute -right-14 -top-14 h-40 w-40 rounded-full ${PRISM_BG[i % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`} />
                  <h3 className="display relative text-xl sm:text-2xl text-ink group-hover:text-brand transition-colors">{a.title}</h3>
                  <p className="relative mt-3 text-sm text-graphite leading-relaxed">{a.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the chain from talent to what gets built ---- */}
      <section className="relative z-10 overflow-hidden bg-paper-tint/55 py-10 sm:py-12">
        <SectionBackdrop from="bg-prism-violet" to="bg-prism-blue" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">From talent to technology</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Inclusion strengthens what we <span className="text-brand italic">deliver.</span>
            </h2>
          </Reveal>
          <ol className="grid gap-4 lg:grid-cols-4">
            {CHAIN.map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08} variant="rise">
                <li className="relative h-full rounded-2xl border border-line bg-surface p-7">
                  {/* the link to the next step, drawn only between items */}
                  {i < CHAIN.length - 1 && (
                    <span aria-hidden className="arrow-flow pointer-events-none absolute -right-4 top-1/2 hidden text-2xl text-brand lg:block">→</span>
                  )}
                  <span className={`mono-label ${PRISM_TEXT[(i + 4) % 6]}`}>{`Step ${i + 1}`}</span>
                  <h3 className="display text-xl sm:text-2xl text-ink mt-3">{c.title}</h3>
                  <p className="mt-3 text-sm text-graphite leading-relaxed">{c.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-10">
            <p className="max-w-2xl text-graphite leading-relaxed">
              Inclusion is not separate from innovation. It is one of the conditions that lets it happen.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---- the certification as responsibility ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8 grid lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20">
          <Reveal>
            <p className="mono-label label-accent mb-4">Our responsibility as an MBE</p>
            <h2 className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
              Certification is the recognition. Inclusion is the <span className="text-brand italic">responsibility.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              We would rather the certification represented the way we do business than a procurement category.
            </p>
          </Reveal>
          <Reveal delay={0.1} variant="rise" className="self-center">
            <ul className="space-y-3">
              {RESPONSIBILITY.map((r, i) => (
                <li key={r} className="flex gap-4 text-ink/80 leading-relaxed">
                  <span aria-hidden className={`mt-[0.7em] h-px w-5 shrink-0 ${PRISM_BG[i % 6]}`} />
                  {r}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---- opportunity through technology ---- */}
      <section className="relative z-10 bg-surface/70 py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="max-w-3xl">
            <p className="mono-label label-accent mb-4">Building opportunity through technology</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Skills change careers. Technology changes what is <span className="text-brand italic">possible.</span>
            </h2>
            <p className="mt-6 text-graphite leading-relaxed">
              New roles keep appearing, and access to them should not be limited by a traditional career
              path. Someone&apos;s first opportunity does not have to define the rest of it.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-10">
            <div className="flex flex-wrap gap-2.5">
              {SKILLS.map((sk, i) => (
                <span key={sk} className={`mono-label rounded-full border border-line-blue px-4 py-2 ${PRISM_TEXT[i % 6]}`}>
                  {sk}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- looking ahead ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Looking ahead</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              Building a more inclusive <span className="text-brand italic">future.</span>
            </h2>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {AHEAD.map((a, i) => (
              <Reveal key={a.title} delay={(i % 3) * 0.05} variant="rise">
                <article className="card-lift group relative h-full overflow-hidden rounded-2xl border border-line bg-surface p-7 transition-colors hover:border-brand/50">
                  <span aria-hidden className={`prism-wash pointer-events-none absolute -left-14 -top-14 h-40 w-40 rounded-full ${PRISM_BG[(i + 5) % 6]} blur-[70px] transition-opacity duration-500 group-hover:opacity-45`} />
                  <h3 className="display relative text-xl sm:text-2xl text-ink group-hover:text-brand transition-colors">{a.title}</h3>
                  <p className="relative mt-3 text-sm text-graphite leading-relaxed">{a.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- the promise, stated as pairs ---- */}
      <section className="relative z-10 overflow-hidden bg-paper-tint/55 py-10 sm:py-12">
        <SectionBackdrop from="bg-prism-green" to="bg-prism-violet" />
        <div className="relative z-10 mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal className="mb-9 max-w-3xl">
            <p className="mono-label label-accent mb-4">Our promise</p>
            <h2 className="display text-4xl sm:text-6xl text-ink">
              See the person. Recognise the <span className="text-brand italic">potential.</span>
            </h2>
          </Reveal>
          <div className="space-y-4">
            {PROMISE.map((p, i) => (
              <Reveal key={p.can} delay={i * 0.06} variant="rise">
                {/* Both halves together on purpose: a promise is only credible
                    next to the thing it does not claim. */}
                <div className="grid gap-4 rounded-2xl border border-line bg-surface p-7 sm:p-9 md:grid-cols-2 md:gap-10">
                  <p className="text-graphite leading-relaxed">{p.cant}</p>
                  <p className="text-ink leading-relaxed border-l-2 border-brand/50 pl-5">{p.can}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---- close ---- */}
      <section className="relative z-10 bg-paper py-10 sm:py-12">
        <div className="mx-auto max-w-[87.5rem] px-5 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[1.75rem] border border-line-blue/60 bg-surface px-7 py-12 sm:px-14 sm:py-16">
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -right-28 -top-28 h-80 w-80 rounded-full bg-prism-green blur-[120px]" />
              <span aria-hidden className="prism-wash-lg pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-prism-violet blur-[120px]" />
              <div className="relative max-w-3xl">
                <p className="mono-label label-accent mb-4">Diversity is our strength. Inclusion is our practice.</p>
                <h2 className="display text-3xl sm:text-5xl text-ink leading-[1.1]">
                  Different backgrounds. Different journeys. One shared <span className="text-brand italic">belief.</span>
                </h2>
                <p className="mt-6 text-graphite leading-relaxed">
                  Everyone deserves the opportunity to be recognised for what they can contribute, and we
                  are still building a place, and a technology ecosystem, with room for more people to do it.
                </p>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link
                    href="/careers"
                    className="group btn-cta inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3.5 font-medium text-white transition-colors hover:bg-brand-deep"
                  >
                    Explore careers
                    <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                  </Link>
                  <Link
                    href="/contact#form"
                    className="inline-flex items-center gap-2 rounded-full border border-line-blue px-6 py-3.5 font-medium text-ink transition-colors hover:border-brand/50 hover:text-brand"
                  >
                    Talk to our team
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
