/** Experimental, isolated SQLite foundation. Not a sandbox or a production authorization boundary. */
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import type { Client, Transaction } from '@libsql/client'

const AGENT = 'foundation-status'
const PROJECT = 'alaminn'
const PERMISSIONS = '["foundation.status.read"]'
const GENESIS = '0'.repeat(64)

export type TaskRequest = {
  id: string; project: string; agent: string; objective: string; inputs: unknown;
  permissions: string[]; deadline: string; maxAttempts: number; createdBy: string
}

// Only a fixed, deterministic status description is supported. No user-controlled paths,
// commands, URLs, code, credentials, or arbitrary input reach the agent.
export function validateTask(t: TaskRequest, now = new Date()): void {
  if (!t || !/^[a-zA-Z0-9_-]{1,100}$/.test(t.id || '') ||
      t.project !== PROJECT || t.agent !== AGENT || t.objective !== 'Report foundation status' ||
      JSON.stringify(t.inputs) !== '{}' || JSON.stringify(t.permissions) !== PERMISSIONS ||
      !/^[a-zA-Z0-9_-]{1,100}$/.test(t.createdBy || '') ||
      !Number.isInteger(t.maxAttempts) || t.maxAttempts < 1 || t.maxAttempts > 3 ||
      typeof t.deadline !== 'string' || !Number.isFinite(Date.parse(t.deadline)) ||
      Date.parse(t.deadline) <= now.getTime() || Date.parse(t.deadline) > now.getTime() + 86400000) {
    throw new Error('Unsupported or invalid task contract')
  }
}

export function authorize(action: string): boolean {
  return action === 'foundation.status.read'
}

export function statusAgent(): string {
  return JSON.stringify({ agent: AGENT, status: 'experimental', network: false, shell: false, localInference: 'not configured' })
}

function digest(secret: string, sequence: number, previousHash: string, event: string): string {
  return createHmac('sha256', secret).update(JSON.stringify([sequence, previousHash, event])).digest('hex')
}
function checkSecret(secret: string): void {
  if (typeof secret !== 'string' || Buffer.byteLength(secret, 'utf8') < 32) throw new Error('Audit key must be at least 32 bytes')
}
async function appendAudit(tx: Transaction, secret: string, event: string): Promise<void> {
  checkSecret(secret)
  const rows = (await tx.execute('SELECT sequence, event, previousHash, hash FROM AgentOsAudit ORDER BY sequence')).rows
  let previous = GENESIS
  let sequence = 0
  for (const row of rows) {
    sequence++
    const actual = String(row.hash)
    const expected = digest(secret, sequence, previous, String(row.event))
    if (Number(row.sequence) !== sequence || row.previousHash !== previous || !/^[0-9a-f]{64}$/.test(actual) ||
        !timingSafeEqual(Buffer.from(actual, 'hex'), Buffer.from(expected, 'hex'))) throw new Error('Audit integrity failure')
    previous = actual
  }
  const next = sequence + 1
  await tx.execute({ sql: 'INSERT INTO AgentOsAudit (sequence, event, previousHash, hash) VALUES (?, ?, ?, ?)',
    args: [next, event, previous, digest(secret, next, previous, event)] })
}
async function atomic<T>(db: Client, fn: (tx: Transaction) => Promise<T>): Promise<T> {
  const tx = await db.transaction('write')
  try { const result = await fn(tx); await tx.commit(); return result }
  catch (error) { await tx.rollback(); throw error }
  finally { tx.close() }
}

/** Caller authentication and rate limiting are NOT supplied here. Never expose directly to untrusted clients. */
export async function enqueue(db: Client, secret: string, t: TaskRequest, now = new Date()): Promise<void> {
  validateTask(t, now); checkSecret(secret)
  await atomic(db, async tx => {
    await tx.execute({ sql: `INSERT INTO AgentOsTask (id,project,agent,objective,inputs,permissions,deadline,maxAttempts,createdBy,createdAt,updatedAt)
      VALUES (?,?,?,?,?,?,?,?,?,?,?)`, args: [t.id, t.project, t.agent, t.objective, '{}', PERMISSIONS,
      new Date(t.deadline).toISOString(), t.maxAttempts, t.createdBy, now.toISOString(), now.toISOString()] })
    await appendAudit(tx, secret, JSON.stringify({ type: 'task.queued', taskId: t.id, actor: t.createdBy, at: now.toISOString() }))
  })
}

/** Claim one task using an atomic conditional update; expired leases can be reclaimed. */
export async function claim(db: Client, secret: string, now = new Date(), leaseMs = 30000): Promise<{ id: string; token: string } | null> {
  checkSecret(secret)
  if (!Number.isInteger(leaseMs) || leaseMs < 1000 || leaseMs > 60000) throw new Error('Invalid lease')
  return atomic(db, async tx => {
    const iso = now.toISOString()
    const row = (await tx.execute({ sql: `SELECT id FROM AgentOsTask WHERE deadline > ? AND attempts < maxAttempts
      AND (status = 'queued' OR (status = 'running' AND leaseUntil <= ?)) ORDER BY createdAt, id LIMIT 1`, args: [iso, iso] })).rows[0]
    if (!row) return null
    const id = String(row.id), token = randomUUID()
    const changed = await tx.execute({ sql: `UPDATE AgentOsTask SET status='running', leaseToken=?, leaseUntil=?, attempts=attempts+1, updatedAt=?
      WHERE id=? AND deadline > ? AND attempts < maxAttempts AND (status='queued' OR (status='running' AND leaseUntil <= ?))`,
      args: [token, new Date(now.getTime()+leaseMs).toISOString(), iso, id, iso, iso] })
    if (changed.rowsAffected !== 1) throw new Error('Claim conflict')
    await appendAudit(tx, secret, JSON.stringify({ type: 'task.claimed', taskId: id, at: iso }))
    return { id, token }
  })
}

/** Fencing token and lease deadline prevent a stale worker from committing output. */
export async function complete(db: Client, secret: string, id: string, token: string, now = new Date()): Promise<void> {
  checkSecret(secret)
  await atomic(db, async tx => {
    const iso = now.toISOString()
    const updated = await tx.execute({ sql: `UPDATE AgentOsTask SET status='completed', outputs=?, leaseToken=NULL, leaseUntil=NULL, updatedAt=?
      WHERE id=? AND status='running' AND leaseToken=? AND leaseUntil > ? AND deadline > ?
      AND project=? AND agent=? AND objective=? AND inputs=? AND permissions=?`,
      args: [statusAgent(), iso, id, token, iso, iso, PROJECT, AGENT, 'Report foundation status', '{}', PERMISSIONS] })
    if (updated.rowsAffected !== 1) throw new Error('Lease invalid or task contract changed')
    await appendAudit(tx, secret, JSON.stringify({ type: 'task.completed', taskId: id, at: iso }))
  })
}
