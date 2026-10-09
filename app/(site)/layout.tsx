import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import FooterReveal from "@/components/FooterReveal";
import ChatWidget from "@/components/ChatWidget";
import { Analytics } from "@vercel/analytics/next";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-root relative">
      {/* Global animated backdrop for the dark site */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-dotgrid anim-grid opacity-[0.5]" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          maskImage: "radial-gradient(120% 80% at 50% 0%, #000, transparent 75%)",
          WebkitMaskImage: "radial-gradient(120% 80% at 50% 0%, #000, transparent 75%)",
        }}
      >
        <div className="absolute -top-40 right-[-10%] h-[60vh] w-[60vh] rounded-full bg-brand/12 blur-[140px] anim-drift" />
        <div className="absolute top-[40%] left-[-15%] h-[55vh] w-[55vh] rounded-full bg-accent/10 blur-[150px] anim-drift" style={{ animationDelay: "-6s" }} />
      </div>

      <div className="relative z-10">
        <Nav />
        <main>{children}</main>
        <FooterReveal>
          <Footer />
        </FooterReveal>
      </div>
      <ChatWidget />
      {/* Visitor counts, on the public site only: the admin is not footfall.
          Vercel's analytics sets no cookie and keeps no identifier on the
          visitor's device, so it needs no consent banner. It reports only from
          a Vercel deployment, once Web Analytics is switched on for the project. */}
      <Analytics />
    </div>
  );
}
