/** Experimental one-shot worker, not a service supervisor or production deployment. */
import { createClient } from '@libsql/client'
import { existsSync } from 'node:fs'
import { claim, complete } from '../src/lib/agentos/foundation'

async function main() {
  const url = process.env.AGENTOS_DATABASE_URL
  const secret = process.env.AGENTOS_AUDIT_SECRET
  if (!url || !url.startsWith('file:/') || !secret || Buffer.byteLength(secret) < 32) {
    throw new Error('Explicit absolute file: AGENTOS_DATABASE_URL and a 32-byte AGENTOS_AUDIT_SECRET are required')
  }
  if (!existsSync(url.slice(5))) throw new Error('Explicit database file must already exist')
  // This experimental worker supports local SQLite only; it never falls back to DATABASE_URL.
  const db = createClient({ url })
  try {
    const job = await claim(db, secret)
    if (job) { await complete(db, secret, job.id, job.token); console.log('Completed one foundation task') }
    else console.log('No eligible foundation task')
  } finally { db.close() }
}
main().catch(() => { console.error('AgentOS worker failed closed; inspect configuration and audit integrity') ; process.exitCode = 1 })
