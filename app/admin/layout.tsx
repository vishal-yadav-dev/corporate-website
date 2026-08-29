import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // No session → this is the login page (proxy.ts guards everything else).
  // Render children bare so the login screen shows without a sidebar.
  if (!session) {
    return <div className="bg-paper min-h-screen">{children}</div>;
  }

  return (
    <div className="relative min-h-screen lg:pl-[260px] overflow-hidden bg-paper">
      {/* Calm brand backdrop (adapts to theme via body background) */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-paper" />
      <div aria-hidden className="pointer-events-none fixed -top-48 right-[-8rem] z-0 h-[560px] w-[560px] rounded-full bg-brand/[0.12] blur-[160px]" />
      <div aria-hidden className="pointer-events-none fixed bottom-[-12rem] left-[200px] z-0 h-[480px] w-[480px] rounded-full bg-accent/[0.10] blur-[160px]" />
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 bg-dotgrid opacity-[0.5] [mask-image:linear-gradient(180deg,#000,transparent_70%)]" />

      {/* Single soft monogram watermark */}
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-[-5rem] right-[-2rem] z-0 select-none display font-bold leading-none text-brand/[0.045]"
        style={{ fontSize: "26rem" }}
      >
        N
      </div>

      <AdminSidebar name={session.name} />
      <div className="relative z-10 mx-auto w-full max-w-[1100px] p-5 sm:p-8 lg:p-12">{children}</div>
    </div>
  );
}
