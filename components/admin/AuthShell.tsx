import Link from "next/link";

export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid place-items-center bg-paper px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex items-center gap-2 mb-8 justify-center">
          <span className="h-9 w-9 grid place-items-center bg-brand text-white font-display font-bold text-lg rounded-[6px]">N</span>
          <span className="display text-2xl text-ink">Noblesoft</span>
        </Link>
        <div className="bg-surface border border-line rounded-3xl p-8 shadow-xl shadow-brand/5">
          <h1 className="display text-2xl text-ink mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-graphite mb-6">{subtitle}</p>}
          {children}
        </div>
        {footer && <div className="text-center text-sm mt-4">{footer}</div>}
        <p className="text-center text-xs text-graphite mt-6">Noblesoft Technologies · Internal use only</p>
      </div>
    </div>
  );
}
