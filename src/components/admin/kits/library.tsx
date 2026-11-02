"use client";
import { Clock3, FolderOpen, Trash2 } from "lucide-react";
import { adminFetch, fmtDate } from "@/components/admin/lib";
import { Button } from "@/components/ui/button";
import { EmptyKit, Panel, type KitDoc, errorMessage } from "./shared";
import { toast } from "sonner";
export function DocumentLibrary({ documents, onLoad, onRefresh, currentId }: { documents: KitDoc[]; onLoad: (doc: KitDoc) => void; onRefresh: () => void; currentId?: string }) {
  async function remove(id: string) { if (!confirm("Delete this saved document? This cannot be undone.")) return; try { await adminFetch(`/api/v1/admin/kits/documents/${id}`, { method: "DELETE", body: "{}" }); toast.success("Document deleted."); onRefresh(); } catch (e) { toast.error(errorMessage(e)); } }
  return <Panel title="Saved documents" description="Your latest 100 documents · stored in the platform"><div className="max-h-[460px] overflow-y-auto divide-y">{documents.length ? documents.map(d => <div key={d.id} className={`px-4 py-3 flex items-center gap-2 ${currentId === d.id ? "bg-blue-50/60 dark:bg-blue-950/20" : ""}`}><button className="text-left flex-1 min-w-0 py-1" onClick={() => onLoad(d)}><span className="text-sm font-medium block truncate">{d.title}</span><span className="text-[11px] text-muted-foreground flex items-center gap-1 mt-1"><Clock3 className="size-3" />{fmtDate(d.updatedAt)}</span></button><Button variant="ghost" size="icon" aria-label={`Delete ${d.title}`} onClick={() => remove(d.id)}><Trash2 className="size-3.5 text-muted-foreground" /></Button></div>) : <EmptyKit icon={FolderOpen} title="A fresh workspace" description="Save your first document and it will appear here." />}</div></Panel>;
}
