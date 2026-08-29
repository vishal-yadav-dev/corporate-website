/* Seeds dummy hero media + carousel banners so the homepage has imagery out of the box.
   Everything here is editable later from the admin (/admin/banners and /admin/images).
   Run: npm run seed:banners */
import "dotenv/config";
import { q } from "../lib/db";
import { cuid } from "../lib/id";

/* A light, professional hero backdrop: white → pale sky-blue mesh gradient, faint
   engineering grid, soft blue + peach glows, and an orange node network weighted to
   the right so the left-side headline stays readable under the reading gradient. */
function heroSvg(opts: {
  from: string; via: string; to: string;
  glowA: string; glowB: string; node: string;
}): string {
  const { from, via, to, glowA, glowB, node } = opts;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="55%" stop-color="${via}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glowA}" stop-opacity="0.28"/>
      <stop offset="100%" stop-color="${glowA}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glowB}" stop-opacity="0.20"/>
      <stop offset="100%" stop-color="${glowB}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1920" height="1080" fill="url(#bg)"/>
  <ellipse cx="1620" cy="220" rx="760" ry="680" fill="url(#glowA)"/>
  <ellipse cx="240" cy="980" rx="640" ry="540" fill="url(#glowB)"/>

  <g stroke="${node}" stroke-opacity="0.16" stroke-width="1.4">
    <line x1="1320" y1="300" x2="1560" y2="220"/>
    <line x1="1560" y1="220" x2="1760" y2="380"/>
    <line x1="1320" y1="300" x2="1440" y2="560"/>
    <line x1="1440" y1="560" x2="1660" y2="640"/>
    <line x1="1660" y1="640" x2="1760" y2="380"/>
  </g>
  <g fill="${node}" fill-opacity="0.22">
    <circle cx="1320" cy="300" r="6"/><circle cx="1560" cy="220" r="8"/>
    <circle cx="1760" cy="380" r="6"/><circle cx="1440" cy="560" r="7"/>
    <circle cx="1660" cy="640" r="6"/>
  </g>
</svg>`;
}

const SLIDES = [
  {
    title: "Enterprise software, delivered.",
    subtitle:
      "We architect, implement, and run the platforms that keep global enterprises moving — Salesforce, SAP, Oracle, and custom cloud apps.",
    cta_text: "Explore our practices",
    cta_url: "/practices",
    alt: "Light sky-blue network mesh representing connected enterprise platforms",
    sort_order: 10,
    background_fx: "rings",
    svg: heroSvg({
      from: "#FFFFFF", via: "#FBFDFE", to: "#F1F7FB",
      glowA: "#2FA6DE", glowB: "#F5822E", node: "#E4641E",
    }),
  },
  {
    title: "Salesforce & SAP transformations",
    subtitle:
      "Consulting engineered for real adoption. From strategy through integration, we unlock legacy data and automate customer and finance operations.",
    cta_text: "Our core services",
    cta_url: "/practices",
    alt: "Soft white-to-blue gradient with a glowing data-flow node graph",
    sort_order: 20,
    background_fx: "birds",
    svg: heroSvg({
      from: "#FFFFFF", via: "#FDFCFB", to: "#F4F9FC",
      glowA: "#F5822E", glowB: "#2FA6DE", node: "#2FA6DE",
    }),
  },
  {
    title: "Nearshore & offshore delivery",
    subtitle:
      "Accelerate every release. Certified engineering pods and scalable scrum teams delivered from the US, nearshore Mexico, and offshore India.",
    cta_text: "About Noblesoft",
    cta_url: "/company",
    alt: "Layered pale-blue gradient with a warm connection network",
    sort_order: 30,
    background_fx: "halo",
    svg: heroSvg({
      from: "#FFFFFF", via: "#FBFDFE", to: "#FCF6F1",
      glowA: "#2FA6DE", glowB: "#F5822E", node: "#E4641E",
    }),
  },
];

async function main() {
  console.log("Seeding dummy hero media + banners…");
  await q("DELETE FROM banners");
  console.log("✓ Cleared existing banners.");

  for (const s of SLIDES) {
    const mediaId = cuid();
    const bytes = Buffer.from(s.svg);
    await q(
      "INSERT INTO site_images (id, slot, alt, mime_type, data, size) VALUES ($1,$2,$3,$4,$5,$6)",
      [mediaId, "hero", s.alt, "image/svg+xml", bytes, bytes.length]
    );
    await q(
      `INSERT INTO banners (id, title, subtitle, cta_text, cta_url, media_id, sort_order, is_active, background_fx)
       VALUES ($1,$2,$3,$4,$5,$6,$7,true,$8)`,
      [cuid(), s.title, s.subtitle, s.cta_text, s.cta_url, mediaId, s.sort_order, s.background_fx ?? ""]
    );
    console.log(`✓ Banner: "${s.title}"`);
  }

  console.log("✓ Done. Edit these anytime from /admin/banners.");
  process.exit(0);
}

main().catch((e) => {
  console.error("Failed to seed banners:", e);
  process.exit(1);
});
