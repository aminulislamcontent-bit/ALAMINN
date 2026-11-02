"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PublicPage } from "@/components/site/public-chrome";
import { Button } from "@/components/ui/button";
function UnsubscribeForm() {
  const token = useSearchParams().get("token") || ""; const [state, setState] = useState(""); const [busy, setBusy] = useState(false);
  async function submit() { setBusy(true); try { const r = await fetch("/api/v1/newsletter/unsubscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) }); const j = await r.json(); setState(j.message || "Request completed."); } catch { setState("Could not connect. Please try again."); } finally { setBusy(false); } }
  return <div className="max-w-lg mx-auto px-5 py-24"><h1 className="text-3xl font-bold">Email preferences</h1><p className="text-muted-foreground text-sm mt-4 leading-relaxed">Confirm below to stop receiving marketing emails from Al Aminn. Essential account and transactional messages are not affected.</p>{state ? <p role="status" className="mt-6 rounded-lg border p-4 text-sm">{state}</p> : <Button className="mt-6" onClick={submit} disabled={busy || !token}>{busy ? "Updating…" : "Unsubscribe from marketing emails"}</Button>}<Link href="/" className="block text-sm text-blue-700 mt-6">Return to the website</Link></div>;
}
export default function Page() { return <PublicPage><Suspense fallback={<p className="p-10">Loading preferences…</p>}><UnsubscribeForm /></Suspense></PublicPage>; }
