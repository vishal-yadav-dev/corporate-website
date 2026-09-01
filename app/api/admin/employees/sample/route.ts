import * as XLSX from "xlsx";
import { requireAdmin } from "@/lib/guard";

/** Downloadable template for bulk employee import. */
export async function GET() {
  const guard = await requireAdmin("employees");
  if (guard instanceof Response) return guard;

  const rows = [
    { name: "Aisha Khan", email: "aisha.khan@testsoft.com", title: "Workday Analyst", department: "HCM Practice", location: "Noida, India", start_date: "2026-09-01" },
    { name: "John Carter", email: "john.carter@testsoft.com", title: "SAP Consultant", department: "SAP Practice", location: "Frisco, TX", start_date: "2026-09-15" },
  ];

  const ws = XLSX.utils.json_to_sheet(rows, {
    header: ["name", "email", "title", "department", "location", "start_date"],
  });
  ws["!cols"] = [{ wch: 20 }, { wch: 30 }, { wch: 22 }, { wch: 20 }, { wch: 18 }, { wch: 14 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Employees");
  const buf: Buffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  return new Response(new Uint8Array(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="testsoft-employee-import-template.xlsx"',
    },
  });
}
