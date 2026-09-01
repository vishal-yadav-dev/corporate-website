"use client";
import { useEffect, useState, useCallback } from "react";
import { SECTIONS } from "@/lib/permissions";

type Admin = { id: string; email: string; name: string; role: string; permissions: string; created_at: string };
const empty = { name: "", email: "", password: "", role: "admin", permissions: [] as string[], sendInvite: true };

function parsePerms(raw: string) {
  try { const v = JSON.parse(raw || "[]"); return Array.isArray(v) ? v.map(String) : []; } catch { return []; }
}

export default function TeamPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [form, setForm] = useState(empty);
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const [editing, setEditing] = useState<Admin | null>(null);
  const [editRole, setEditRole] = useState("admin");
  const [editPerms, setEditPerms] = useState<string[]>([]);

  const load = useCallback(() => { fetch("/api/admin/admins").then((r) => r.json()).then((d) => setAdmins(d.admins || [])); }, []);
  useEffect(() => { load(); }, [load]);
  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }));

  function togglePerm(list: string[], k: string) {
    return list.includes(k) ? list.filter((x) => x !== k) : [...list, k];
  }

  const [note, setNote] = useState("");

  async function add(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setNote(""); setBusy(true);
    try {
      const res = await fetch("/api/admin/admins", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const d = await res.json(); if (!res.ok) throw new Error(d.error || "Could not add admin.");
      setForm(empty); load();
      if (d.invite) {
        setNote(d.invite.mode === "smtp"
          ? `Invite email sent to ${d.invite.email}.`
          : `User created. SMTP isn't configured — share this set-password link manually: ${d.invite.actionUrl}`);
      } else {
        setNote("User created.");
      }
    } catch (e) { setErr(e instanceof Error ? e.message : "Error"); } finally { setBusy(false); }
  }
  async function remove(id: string) { if (!confirm("Remove this admin?")) return; const res = await fetch(`/api/admin/admins/${id}`, { method: "DELETE" }); const d = await res.json(); if (!res.ok) alert(d.error); load(); }
  async function resend(id: string) {
    setNote("");
    const res = await fetch(`/api/admin/admins/${id}/invite`, { method: "POST" });
    const d = await res.json();
    if (!res.ok) { alert(d.error); return; }
    setNote(d.mode === "smtp" ? `Sign-in link emailed to ${d.email}.` : `Share this link: ${d.actionUrl}`);
  }

  function openEdit(a: Admin) {
    setEditing(a); setEditRole(a.role); setEditPerms(parsePerms(a.permissions));
  }
  async function saveEdit() {
    if (!editing) return;
    const res = await fetch(`/api/admin/admins/${editing.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: editRole, permissions: editPerms }),
    });
    const d = await res.json();
    if (!res.ok) { alert(d.error); return; }
    setEditing(null); load();
  }

  const field = "w-full bg-surface border border-line rounded-xl px-4 py-3 text-ink placeholder:text-graphite/50 focus:border-brand focus:outline-none transition-colors";
  const grantable = SECTIONS.filter((s) => s.key !== "dashboard");

  return (
    <div className="mx-auto max-w-3xl">
      <div className="text-center">
        <p className="mono-label text-accent-deep mb-2">Admin users</p>
        <h1 className="display text-4xl text-ink">Who can sign in</h1>
        <p className="mt-2 text-graphite text-sm">
          <strong>Owner</strong> & <strong>Admin</strong> see everything. <strong>Editor</strong> only sees the sections you tick.
        </p>
      </div>

      <form onSubmit={add} className="mt-8 bg-surface border border-line rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
        <div><label className="mono-label text-graphite block mb-2">Name</label><input className={field} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jordan Lee" /></div>
        <div><label className="mono-label text-graphite block mb-2">Email</label><input className={field} type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="jordan@testsoft.com" /></div>
        <div>
          <label className="mono-label text-graphite block mb-2">Sign-in setup</label>
          <label className="flex items-center gap-2 py-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={form.sendInvite} onChange={(e) => set("sendInvite", e.target.checked)} className="w-4 h-4 accent-brand" />
            <span className="text-sm text-ink">Email them a link to set their own password</span>
          </label>
        </div>
        {!form.sendInvite && (
          <div><label className="mono-label text-graphite block mb-2">Password (8+ chars)</label><input className={field} type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" /></div>
        )}
        <div><label className="mono-label text-graphite block mb-2">Role</label>
          <select className={field} value={form.role} onChange={(e) => set("role", e.target.value)}>
            <option value="admin">Admin — full access</option>
            <option value="owner">Owner — full access</option>
            <option value="editor">Editor — limited</option>
          </select>
        </div>
        {form.role === "editor" && (
          <div className="sm:col-span-2">
            <label className="mono-label text-graphite block mb-2">Sections this editor can open</label>
            <div className="flex flex-wrap gap-2">
              {grantable.map((s) => (
                <button type="button" key={s.key}
                  onClick={() => set("permissions", togglePerm(form.permissions, s.key))}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${form.permissions.includes(s.key) ? "bg-brand text-white border-brand" : "border-line text-graphite hover:border-brand"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}
        {err && <p className="sm:col-span-2 text-sm text-accent-deep">{err}</p>}
        {note && <p className="sm:col-span-2 text-sm text-brand break-all">{note}</p>}
        <div className="sm:col-span-2"><button disabled={busy} className="bg-brand text-white px-6 py-3 rounded-full font-medium hover:bg-brand-deep transition-colors disabled:opacity-50">{busy ? "Adding…" : "Add user"}</button></div>
      </form>

      <div className="mt-8 bg-surface border border-line rounded-2xl overflow-hidden">
        {admins.map((a) => {
          const perms = parsePerms(a.permissions);
          return (
            <div key={a.id} className="border-b border-line last:border-0 px-5 py-4 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-ink font-medium">{a.name}
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-paper-tint text-graphite ml-2">{a.role}</span>
                </p>
                <p className="text-sm text-graphite">{a.email}</p>
                {a.role === "editor" && <p className="text-[11px] text-graphite/70 mt-0.5">{perms.length ? perms.join(", ") : "no sections granted"}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => resend(a.id)} className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">Send link</button>
                <button onClick={() => openEdit(a)} className="text-xs bg-surface border border-line text-ink px-3 py-1.5 rounded-full hover:border-graphite">Role</button>
                <button onClick={() => remove(a.id)} className="text-xs text-accent-deep hover:underline px-2">Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm grid place-items-center p-4 overflow-y-auto">
          <div className="bg-surface rounded-3xl border border-line w-full max-w-lg p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between">
              <h2 className="display text-2xl text-ink">{editing.name}</h2>
              <button onClick={() => setEditing(null)} className="text-graphite hover:text-ink text-xl">✕</button>
            </div>
            <label className="mono-label text-graphite block mt-6 mb-2">Role</label>
            <select className={field} value={editRole} onChange={(e) => setEditRole(e.target.value)}>
              <option value="admin">Admin — full access</option>
              <option value="owner">Owner — full access</option>
              <option value="editor">Editor — limited</option>
            </select>
            {editRole === "editor" && (
              <div className="mt-4">
                <label className="mono-label text-graphite block mb-2">Allowed sections</label>
                <div className="flex flex-wrap gap-2">
                  {grantable.map((s) => (
                    <button type="button" key={s.key}
                      onClick={() => setEditPerms((p) => togglePerm(p, s.key))}
                      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${editPerms.includes(s.key) ? "bg-brand text-white border-brand" : "border-line text-graphite hover:border-brand"}`}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="text-sm text-graphite hover:text-ink">Cancel</button>
              <button onClick={saveEdit} className="bg-brand text-white px-6 py-2.5 rounded-full font-medium hover:bg-brand-deep transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
