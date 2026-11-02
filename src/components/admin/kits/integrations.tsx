"use client";
import { useMemo, useState } from "react";
import { Plug, ExternalLink, ShieldCheck, FlaskConical, Loader2, Search, CheckCircle2, XCircle, MonitorSmartphone, BookOpen, Ban, HelpCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KitHeading, Panel, Notice, KitLoading, KitError, Field, Modal, StatusBadge, errorMessage, useKitResource } from "./shared";
import { toast } from "sonner";

interface FieldDef { key: string; label: string; secret: boolean; required: boolean; placeholder: string | null }
interface Connection { id: string; enabled: boolean; values: Record<string, string>; configured: boolean; lastTestAt: string | null; lastTestOk: boolean | null; lastTestMessage: string | null }
interface Integration { id: string; name: string; url: string; category: string; mode: string; license: string; language: string; summary: string; integrationNote: string; docsUrl: string | null; fields: FieldDef[]; connection: Connection | null }
interface Payload { categories: string[]; integrations: Integration[] }

const MODE_META: Record<string, { label: string; tone: string; icon: typeof Plug }> = {
  adapter: { label: "Native adapter", tone: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300", icon: Plug },
  service: { label: "Self-host + connect", tone: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300", icon: Plug },
  reference: { label: "Reference", tone: "bg-muted text-muted-foreground border", icon: BookOpen },
  desktop: { label: "Desktop / GPU", tone: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300", icon: MonitorSmartphone },
  unavailable: { label: "Link unavailable", tone: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300", icon: HelpCircle },
  excluded: { label: "Not integrated", tone: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300", icon: Ban },
};

export default function IntegrationsKit() {
  const { data, error, loading, refresh } = useKitResource<Payload>("/api/v1/admin/integrations");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [editing, setEditing] = useState<Integration | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [enabled, setEnabled] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  const shown = useMemo(() => (data?.integrations ?? []).filter(i =>
    (category === "all" || i.category === category) &&
    (!query || `${i.name} ${i.summary} ${i.category}`.toLowerCase().includes(query.toLowerCase()))
  ), [data, query, category]);

  const counts = useMemo(() => {
    const all = data?.integrations ?? [];
    return { total: all.length, connectable: all.filter(i => i.mode === "adapter" || i.mode === "service").length, connected: all.filter(i => i.connection?.enabled && i.connection?.configured).length };
  }, [data]);

  function open(i: Integration) { setEditing(i); setForm({ ...(i.connection?.values ?? {}) }); setEnabled(i.connection?.enabled ?? false); }

  async function save() {
    if (!editing) return; setBusy("save");
    try {
      const r = await fetch("/api/v1/admin/integrations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: editing.id, enabled, values: form }) });
      const j = await r.json(); if (!r.ok || !j.success) throw new Error(j.message || "Save failed");
      toast.success("Integration saved."); setEditing(null); refresh(true);
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusy(null); }
  }

  async function test(i: Integration) {
    setBusy(`test:${i.id}`);
    try {
      const r = await fetch(`/api/v1/admin/integrations/${i.id}/test`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
      const j = await r.json(); const res = j.data;
      if (res?.ok) toast.success(res.message); else toast.error(res?.message || j.message || "Connection failed");
      refresh(true);
    } catch (e) { toast.error(errorMessage(e)); } finally { setBusy(null); }
  }

  if (loading) return <KitLoading />;
  return <div>
    <KitHeading title="Integration Hub" description="Every external project you shared — verified, licensed, and connected on your terms. Native adapters run here; everything else stays separate and is linked, never copied." badge={`${counts.total} verified`}>
      <Button variant="outline" onClick={() => refresh(true)}><FlaskConical className="size-4" />Refresh</Button>
    </KitHeading>
    {error && <KitError message={error} retry={() => refresh(true)} />}
    <div className="grid sm:grid-cols-3 gap-4 mb-6">
      <div className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Projects verified</p><p className="text-2xl font-bold mt-2">{counts.total}</p></div>
      <div className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Connectable (adapter / service)</p><p className="text-2xl font-bold mt-2">{counts.connectable}</p></div>
      <div className="rounded-xl border bg-card p-5"><p className="text-xs text-muted-foreground">Enabled & configured</p><p className="text-2xl font-bold mt-2">{counts.connected}</p></div>
    </div>
    <Notice><strong>Licensing & safety:</strong> GPL/AGPL and desktop/GPU projects are <em>not</em> merged into this codebase — they run separately and connect by URL/key, or are listed as reference. Secrets are encrypted at rest. Wi-Fi cracking tooling is intentionally excluded.</Notice>
    <Panel className="mt-5 mb-5"><div className="p-4 flex flex-wrap gap-3 items-center">
      <div className="relative flex-1 min-w-52"><Search className="size-4 absolute left-3 top-3 text-muted-foreground" /><Input className="pl-9" placeholder="Search integrations…" value={query} onChange={e => setQuery(e.target.value)} /></div>
      <select aria-label="Filter by category" className="h-9 rounded-md border border-input bg-background px-3 text-sm" value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">All categories</option>{(data?.categories ?? []).map(c => <option key={c} value={c}>{c}</option>)}
      </select>
    </div></Panel>

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {shown.map(i => { const m = MODE_META[i.mode] ?? MODE_META.reference; const Icon = m.icon; const connectable = i.mode === "adapter" || i.mode === "service"; const c = i.connection;
        return <article key={i.id} className="rounded-xl border bg-card p-5 flex flex-col shadow-sm">
          <div className="flex items-start justify-between gap-2">
            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${m.tone}`}><Icon className="size-3" />{m.label}</span>
            {c?.lastTestOk != null && (c.lastTestOk ? <CheckCircle2 className="size-4 text-emerald-600" /> : <XCircle className="size-4 text-red-500" />)}
          </div>
          <h3 className="font-semibold text-sm mt-3">{i.name}</h3>
          <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed flex-1">{i.summary}</p>
          <div className="flex flex-wrap gap-1.5 mt-3 text-[10px]">
            <span className="rounded bg-muted px-1.5 py-0.5">{i.category}</span>
            <span className="rounded bg-muted px-1.5 py-0.5">{i.license}</span>
            <span className="rounded bg-muted px-1.5 py-0.5">{i.language}</span>
            {c?.enabled && c?.configured && <StatusBadge status="active" />}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 leading-relaxed border-t pt-3">{i.integrationNote}</p>
          {c?.lastTestMessage && <p className={`text-[10px] mt-2 ${c.lastTestOk ? "text-emerald-700 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>{c.lastTestMessage}</p>}
          <div className="flex flex-wrap gap-2 mt-4">
            <a href={i.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"><ExternalLink className="size-3" />Repo</a>
            {i.docsUrl && <a href={i.docsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline"><BookOpen className="size-3" />Docs</a>}
            {connectable && <div className="ml-auto flex gap-2">
              <Button size="sm" variant="outline" disabled={busy === `test:${i.id}`} onClick={() => test(i)}>{busy === `test:${i.id}` ? <Loader2 className="size-3.5 animate-spin" /> : <FlaskConical className="size-3.5" />}Test</Button>
              <Button size="sm" onClick={() => open(i)}><ShieldCheck className="size-3.5" />Configure</Button>
            </div>}
          </div>
        </article>; })}
    </div>
    {!shown.length && <p className="text-sm text-muted-foreground text-center py-12">No integrations match your filter.</p>}

    <Modal open={!!editing} onClose={() => setEditing(null)} title={editing ? `Configure ${editing.name}` : ""}>
      {editing && <div className="space-y-4">
        <Notice tone="info">{editing.integrationNote}</Notice>
        {editing.fields.map(f => <Field key={f.key} label={`${f.label}${f.required ? " *" : ""}`} hint={f.secret ? "Encrypted at rest. Leave blank to keep the existing value." : undefined}>
          <Input type={f.secret ? "password" : "text"} value={form[f.key] ?? ""} placeholder={f.placeholder ?? ""} onChange={e => setForm({ ...form, [f.key]: e.target.value })} autoComplete={f.secret ? "new-password" : "off"} />
        </Field>)}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={enabled} onChange={e => setEnabled(e.target.checked)} />Enable this integration</label>
        <div className="flex gap-2"><Button className="flex-1" disabled={busy === "save"} onClick={save}>{busy === "save" ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}Save</Button>
          <Button variant="outline" disabled={busy === `test:${editing.id}`} onClick={() => test(editing)}><FlaskConical className="size-4" />Test connection</Button></div>
      </div>}
    </Modal>
  </div>;
}
