import { COPY_FIELDS } from "@/lib/copy";
import PagesEditor from "@/components/admin/PagesEditor";

/**
 * Page text editor.
 *
 * The field list is handed down from the registry rather than written here, so
 * this screen gains a field whenever the site does, and the labels cannot drift
 * from what renders.
 */
export default function AdminPagesPage() {
  return <PagesEditor fields={COPY_FIELDS} />;
}
