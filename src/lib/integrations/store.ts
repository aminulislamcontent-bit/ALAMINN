/**
 * Encrypted per-integration configuration stored in the existing Setting table.
 * Keys are namespaced `integration:<id>:<field>` so no schema migration is needed.
 * Secrets are encrypted with the same AES helper used by the AI provider keys.
 */
import { db } from "@/lib/db";
import { encryptStoredAiSecret, decryptStoredAiSecret, maskSecret } from "@/lib/ai/free-providers";
import { INTEGRATION_BY_ID, isConnectable, type IntegrationDefinition } from "./registry";

const PREFIX = "integration:";
export function settingKey(id: string, field: string): string { return `${PREFIX}${id}:${field}`; }

export interface StoredConnection {
  id: string;
  enabled: boolean;
  /** Masked secret values + plain non-secret values, safe to send to the client. */
  values: Record<string, string>;
  configured: boolean;
  lastTestAt: string | null;
  lastTestOk: boolean | null;
  lastTestMessage: string | null;
}

/** Read decrypted config for server-side connector use. Never expose directly. */
export async function readConnectionSecrets(id: string): Promise<Record<string, string>> {
  const def = INTEGRATION_BY_ID[id];
  if (!def || !def.fields) return {};
  const keys = def.fields.map(f => settingKey(id, f.key));
  keys.push(settingKey(id, "enabled"), settingKey(id, "lastTestAt"), settingKey(id, "lastTestOk"), settingKey(id, "lastTestMessage"));
  const rows = await db.setting.findMany({ where: { key: { in: keys } } });
  const map = new Map(rows.map(r => [r.key, r.value]));
  const out: Record<string, string> = {};
  for (const f of def.fields) {
    const raw = map.get(settingKey(id, f.key)) || "";
    out[f.key] = f.secret ? decryptStoredAiSecret(raw) : raw;
  }
  out.__enabled = map.get(settingKey(id, "enabled")) === "true" ? "true" : "false";
  return out;
}

export async function readConnectionPublic(def: IntegrationDefinition): Promise<StoredConnection> {
  const empty: StoredConnection = { id: def.id, enabled: false, values: {}, configured: false, lastTestAt: null, lastTestOk: null, lastTestMessage: null };
  if (!isConnectable(def.mode) || !def.fields) return empty;
  const keys = def.fields.map(f => settingKey(def.id, f.key));
  keys.push(settingKey(def.id, "enabled"), settingKey(def.id, "lastTestAt"), settingKey(def.id, "lastTestOk"), settingKey(def.id, "lastTestMessage"));
  const rows = await db.setting.findMany({ where: { key: { in: keys } } });
  const map = new Map(rows.map(r => [r.key, r.value]));
  const values: Record<string, string> = {};
  let configured = true;
  for (const f of def.fields) {
    const raw = map.get(settingKey(def.id, f.key)) || "";
    if (f.secret) { const plain = decryptStoredAiSecret(raw); values[f.key] = plain ? maskSecret(plain) : ""; if (f.required && !plain) configured = false; }
    else { values[f.key] = raw; if (f.required && !raw.trim()) configured = false; }
  }
  const okRaw = map.get(settingKey(def.id, "lastTestOk"));
  return {
    id: def.id,
    enabled: map.get(settingKey(def.id, "enabled")) === "true",
    values, configured,
    lastTestAt: map.get(settingKey(def.id, "lastTestAt")) || null,
    lastTestOk: okRaw === "true" ? true : okRaw === "false" ? false : null,
    lastTestMessage: map.get(settingKey(def.id, "lastTestMessage")) || null,
  };
}

/** Persist config. Masked/empty secret submissions keep the existing secret. */
export async function saveConnection(id: string, input: { enabled?: boolean; values?: Record<string, string> }): Promise<void> {
  const def = INTEGRATION_BY_ID[id];
  if (!def || !isConnectable(def.mode) || !def.fields) throw new Error("This integration is not connectable.");
  const upserts: { key: string; value: string }[] = [];
  for (const f of def.fields) {
    const submitted = input.values?.[f.key];
    if (submitted === undefined) continue;
    const trimmed = String(submitted).trim();
    if (f.secret) {
      // Keep existing secret when the client sends back a mask or blank.
      if (!trimmed || trimmed.includes("••••") || trimmed === "__KEEP__") continue;
      upserts.push({ key: settingKey(id, f.key), value: encryptStoredAiSecret(trimmed) });
    } else {
      if (trimmed.length > 2000) throw new Error(`Value for ${f.label} is too long.`);
      if (trimmed && (f.key.toLowerCase().includes("url")) && !/^https?:\/\//i.test(trimmed)) throw new Error(`${f.label} must start with http:// or https://`);
      upserts.push({ key: settingKey(id, f.key), value: trimmed });
    }
  }
  if (typeof input.enabled === "boolean") upserts.push({ key: settingKey(id, "enabled"), value: input.enabled ? "true" : "false" });
  if (!upserts.length) return;
  await db.$transaction(upserts.map(u => db.setting.upsert({ where: { key: u.key }, update: { value: u.value }, create: { key: u.key, value: u.value } })));
}

export async function recordTest(id: string, ok: boolean, message: string): Promise<void> {
  const rows = [
    { key: settingKey(id, "lastTestAt"), value: new Date().toISOString() },
    { key: settingKey(id, "lastTestOk"), value: ok ? "true" : "false" },
    { key: settingKey(id, "lastTestMessage"), value: message.slice(0, 300) },
  ];
  await db.$transaction(rows.map(u => db.setting.upsert({ where: { key: u.key }, update: { value: u.value }, create: { key: u.key, value: u.value } })));
}
