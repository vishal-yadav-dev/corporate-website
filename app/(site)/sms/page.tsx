import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { getLegal } from "@/lib/site";

/* ISR, like the rest of the site. Saving in /admin/legal revalidates at once. */
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const doc = await getLegal("sms");
  return { title: doc?.title, alternates: { canonical: "/sms" } };
}

export default function SmsPage() {
  return <LegalPage slug="sms" />;
}
