"use client";

import { useEffect, useState, useCallback } from "react";

type Employee = { id: string; name: string; email: string; title: string | null; department: string | null; location: string | null; start_date: string | null; status: string };
type Person = { name: string; email: string };
type Announce = { employee: { id: string; name: string }; email: { subject: string; text: string; html: string }; candidates: { employees: Person[]; admins: Person[] } };

const empty = { name: "", email: "", title: "", department: "", location: "", startDate: "" };

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  // Distinguishes "not fetched yet" from "fetched and genuinely empty".
  const [loaded, setLoaded] = useState(false);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [announce, setAnnounce] = useState<Announce | null>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{ createdCount: number; skippedCount: number; skipped: { row: number; reason: string }[] } | null>(null);

  const load = useCallback(() => {
    fetch("/api/admin/employees").then((r) => r.json()).then((d) => setEmployees(d.employees || [])).catch(() => {}).finally(() => setLoaded(true));
  }, []);
  useEffect(() => { load(); }, [load]);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function addEmployee(e: React.FormEvent) {
    e.preventDefault();
    setErr(""); setBusy(true);
    try {
      const res = await fetch("/api/admin/employees", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not add employee.");
      setForm(empty);
      load();
      // Immediately open the onboarding announcement flow for the new hire.
      openAnnounce(data.employee.id);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Could not add employee.");
    } finally { setBusy(false); }
  }

  async function openAnnounce(id: string) {
    const res = await fetch(`/api/admin/announce?employeeId=${id}`);
    if (res.ok) setAnnounce(await res.json());
  }

  async function toggleStatus(emp: Employee) {
    await fetch(`/api/admin/employees/${emp.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: emp.status === "active" ? "inactive" : "active" }) });
    load();
  }
  async function remove(id: string) {
    if (!confirm("Delete this employee record?")) return;
    await fetch(`/api/admin/employees/${id}`, { method: "DELETE" });
    load();
  }

  async function importFile(file: File) {
    setImporting(true); setImportResult(null); setErr("");
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/admin/employees/import", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Import failed.");
      setImportResult(data);
      load();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Import failed.");
    } finally {
      setImporting(false);
    }
  }

  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";

  return (
    <div>
      <p className="mono-label text-accent-deep mb-2">Employees</p>
      <h1 className="display text-4xl text-ink">Team & onboarding</h1>
      <p className="mt-3 text-graphite">Add a new hire, then send a welcome announcement to the people you choose.</p>

      {/* Bulk import */}
      <div className="mt-8 bg-surface border border-line rounded-2xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="display text-lg text-ink">Bulk import</h2>
            <p className="text-sm text-graphite mt-1">Download the template, fill it in, and upload it. Existing emails are skipped.</p>
          </div>
          <div className="flex gap-2">
            <a href="/api/admin/employees/sample" className="text-xs border border-line text-ink px-4 py-2 rounded-full hover:border-graphite">Download template ↓</a>
            <label className="text-xs bg-brand text-white px-4 py-2 rounded-full cursor-pointer hover:bg-brand-deep">
              {importing ? "Importing…" : "Upload sheet ↑"}
              <input type="file" accept=".xlsx,.xls,.csv" className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) importFile(f); e.target.value = ""; }} />
            </label>
          </div>
        </div>
        {importResult && (
          <div className="mt-4 text-sm border-t border-line pt-4">
            <p className="text-ink font-medium">Added {importResult.createdCount} · skipped {importResult.skippedCount}</p>
            {importResult.skipped.length > 0 && (
              <ul className="mt-2 text-xs text-graphite space-y-0.5">
                {importResult.skipped.slice(0, 10).map((s, i) => <li key={i}>Row {s.row}: {s.reason}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Add form */}
      <form onSubmit={addEmployee} className="mt-8 bg-surface border border-line rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        <div><label className="mono-label text-graphite block mb-2">Name</label><input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aisha Khan" /></div>
        <div><label className="mono-label text-graphite block mb-2">Email</label><input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="aisha@noblesoft.com" /></div>
        <div><label className="mono-label text-graphite block mb-2">Title</label><input className={field} value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Workday Analyst" /></div>
        <div><label className="mono-label text-graphite block mb-2">Department</label><input className={field} value={form.department} onChange={(e) => set("department", e.target.value)} placeholder="HCM Practice" /></div>
        <div><label className="mono-label text-graphite block mb-2">Location</label><input className={field} value={form.location} onChange={(e) => set("location", e.target.value)} placeholder="Noida, India" /></div>
        <div><label className="mono-label text-graphite block mb-2">Start date</label><input className={field} type="date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} /></div>
        {err && <p className="sm:col-span-2 text-sm text-accent-deep">{err}</p>}
        <div className="sm:col-span-2">
          <button type="submit" disabled={busy} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
            {busy ? "Adding…" : "Add employee & prepare announcement →"}
          </button>
        </div>
      </form>

      {/* Employee list */}
      <div className="mt-8 bg-surface border border-line rounded-2xl overflow-hidden">
        {!loaded ? <p className="p-8 text-center text-graphite">Loading…</p> : employees.length === 0 ? <p className="p-8 text-center text-graphite">No employees yet.</p> : null}
        {employees.map((emp) => (
          <div key={emp.id} className="border-b border-line last:border-0 px-5 py-4 grid grid-cols-[1fr_auto] gap-3 items-center">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-ink">{emp.name}</span>
                {emp.status === "inactive" && <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-graphite/10 text-graphite">inactive</span>}
              </div>
              <p className="text-sm text-graphite truncate">{[emp.title, emp.department, emp.location].filter(Boolean).join(" · ")}</p>
              <p className="text-xs text-graphite">{emp.email}</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-end">
              <button onClick={() => openAnnounce(emp.id)} className="text-xs bg-brand text-white px-3 py-1.5 rounded-full">Announce</button>
              <button onClick={() => toggleStatus(emp)} className="text-xs bg-surface border border-line px-3 py-1.5 rounded-full hover:border-ink">{emp.status === "active" ? "Deactivate" : "Activate"}</button>
              <button onClick={() => remove(emp.id)} className="text-xs text-accent-deep px-3 py-1.5 rounded-full hover:underline">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {announce && <AnnounceModal data={announce} onClose={() => setAnnounce(null)} />}
    </div>
  );
}

function AnnounceModal({ data, onClose }: { data: Announce; onClose: () => void }) {
  const allPeople = [
    ...data.candidates.employees.map((p) => ({ ...p, kind: "Employee" })),
    ...data.candidates.admins.map((p) => ({ ...p, kind: "Admin" })),
  ].filter((p, i, arr) => arr.findIndex((x) => x.email === p.email) === i);

  const [selected, setSelected] = useState<Set<string>>(new Set(allPeople.map((p) => p.email)));
  const [subject, setSubject] = useState(data.email.subject);
  const [body, setBody] = useState(data.email.text);
  const [result, setResult] = useState<{ ok: boolean; mode: string; sent: number; note?: string; error?: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const toggle = (email: string) => setSelected((s) => { const n = new Set(s); n.has(email) ? n.delete(email) : n.add(email); return n; });
  const all = () => setSelected(new Set(allPeople.map((p) => p.email)));
  const none = () => setSelected(new Set());

  async function send() {
    setBusy(true);
    const res = await fetch("/api/admin/announce", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ employeeId: data.employee.id, recipients: [...selected], subject, text: body, html: data.email.html }),
    });
    setResult(await res.json());
    setBusy(false);
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
      <div className="bg-surface rounded-3xl border border-line w-full max-w-2xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="mono-label text-accent-deep mb-1">Onboarding announcement</p>
              <h2 className="display text-2xl text-ink">Welcome {data.employee.name}</h2>
            </div>
            <button onClick={onClose} className="text-graphite hover:text-ink text-xl">✕</button>
          </div>

          {result ? (
            <div className="mt-6 text-center py-6">
              <div className={`mx-auto h-14 w-14 grid place-items-center rounded-full text-2xl mb-4 ${result.ok ? "bg-brand text-white" : "bg-accent/20 text-accent-deep"}`}>{result.ok ? "✓" : "!"}</div>
              <h3 className="display text-xl text-ink">{result.ok ? `Announcement ${result.mode === "smtp" ? "sent" : "prepared"} for ${result.sent} ${result.sent === 1 ? "person" : "people"}.` : "Could not send."}</h3>
              {result.note && <p className="mt-2 text-sm text-graphite max-w-md mx-auto">{result.note}</p>}
              {result.error && <p className="mt-2 text-sm text-accent-deep">{result.error}</p>}
              <button onClick={onClose} className="mt-6 bg-brand text-white px-6 py-3 rounded-full">Done</button>
            </div>
          ) : (
            <>
              <div className="mt-6 space-y-4">
                <div>
                  <label className="mono-label text-graphite block mb-2">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} className="w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink focus:border-brand focus:outline-none" />
                </div>
                <div>
                  <label className="mono-label text-graphite block mb-2">Message preview</label>
                  <textarea value={body} onChange={(e) => setBody(e.target.value)} className="w-full bg-paper-tint/40 border border-line rounded-xl px-4 py-3 text-ink text-sm min-h-[160px] focus:border-brand focus:outline-none" />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="mono-label text-graphite">Recipients ({selected.size})</label>
                  <div className="flex gap-2 text-xs">
                    <button onClick={all} className="text-brand hover:underline">Select all</button>
                    <button onClick={none} className="text-graphite hover:underline">Clear</button>
                  </div>
                </div>
                <div className="border border-line rounded-xl max-h-52 overflow-y-auto divide-y divide-line">
                  {allPeople.length === 0 && <p className="p-4 text-sm text-graphite">No other people to notify yet. Add colleagues first.</p>}
                  {allPeople.map((p) => (
                    <label key={p.email} className="flex items-center gap-3 px-4 py-2.5 hover:bg-paper-tint cursor-pointer">
                      <input type="checkbox" checked={selected.has(p.email)} onChange={() => toggle(p.email)} className="accent-[#0B3D91]" />
                      <span className="text-sm text-ink flex-1">{p.name}</span>
                      <span className="text-xs text-graphite">{p.email}</span>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-paper-tint text-graphite">{p.kind}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-3">
                <button onClick={onClose} className="text-sm text-graphite hover:text-ink">Cancel</button>
                <button onClick={send} disabled={busy || selected.size === 0} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">
                  {busy ? "Sending…" : `Send to ${selected.size} →`}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
