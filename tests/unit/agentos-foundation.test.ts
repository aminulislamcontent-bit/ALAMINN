import { describe, it, expect } from 'vitest'
import { createClient } from '@libsql/client'
import { readFileSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { authorize, enqueue, claim, complete, statusAgent, type TaskRequest } from '../../src/lib/agentos/foundation'

const secret = 'a'.repeat(32)
const start = new Date('2030-01-01T00:00:00.000Z')
const task = (): TaskRequest => ({ id: 'task-1', project: 'alaminn', agent: 'foundation-status', objective: 'Report foundation status', inputs: {}, permissions: ['foundation.status.read'], deadline: '2030-01-01T01:00:00.000Z', maxAttempts: 2, createdBy: 'admin' })
async function fixture(fn: (db: ReturnType<typeof createClient>) => Promise<void>) {
  const dir = mkdtempSync(join(tmpdir(), 'agentos-'))
  const db = createClient({ url: `file:${join(dir, 'test.db')}` })
  try {
    await db.executeMultiple(readFileSync('prisma/migrations/sqlite/20261102020000_agentos_foundation/migration.sql', 'utf8'))
    await fn(db)
  } finally { db.close(); rmSync(dir, { recursive: true, force: true }) }
}
describe('experimental AgentOS foundation', () => {
  it('denies everything except the fixed read-only operation', () => {
    expect(authorize('foundation.status.read')).toBe(true)
    for (const x of ['shell', 'network', 'deploy', 'database.write', '', 'FOUNDATION.STATUS.READ']) expect(authorize(x)).toBe(false)
    expect(JSON.parse(statusAgent()).localInference).toBe('not configured')
  })
  it('rejects unsupported inputs, permissions, deadlines and weak keys without writing', async () => fixture(async db => {
    for (const patch of [{ inputs: { path: '/etc/passwd' } }, { permissions: ['shell'] }, { agent: 'unknown' }, { deadline: '2029-01-01' }, { maxAttempts: 9 }])
      await expect(enqueue(db, secret, { ...task(), ...patch }, start)).rejects.toThrow()
    await expect(enqueue(db, 'short', task(), start)).rejects.toThrow()
    expect((await db.execute('SELECT * FROM AgentOsTask')).rows).toHaveLength(0)
  }))
  it('reclaims expired leases and fences stale workers', async () => fixture(async db => {
    await enqueue(db, secret, task(), start)
    const a = (await claim(db, secret, start, 1000))!
    expect(await claim(db, secret, start, 1000)).toBeNull()
    const later = new Date(start.getTime()+1001)
    const b = (await claim(db, secret, later, 1000))!
    expect(b.token).not.toBe(a.token)
    await expect(complete(db, secret, a.id, a.token, later)).rejects.toThrow()
    await complete(db, secret, b.id, b.token, later)
    await expect(complete(db, secret, b.id, b.token, later)).rejects.toThrow()
    expect((await db.execute('SELECT status, attempts FROM AgentOsTask')).rows[0]).toMatchObject({ status: 'completed', attempts: 2 })
    expect((await db.execute('SELECT * FROM AgentOsAudit')).rows).toHaveLength(4)
  }))
  it('rolls back task changes if audit is tampered or key is wrong', async () => fixture(async db => {
    await enqueue(db, secret, task(), start)
    await expect(claim(db, 'b'.repeat(32), start)).rejects.toThrow('Audit integrity')
    await db.execute("UPDATE AgentOsAudit SET event='tampered'")
    await expect(claim(db, secret, start)).rejects.toThrow('Audit integrity')
    expect((await db.execute('SELECT status, attempts FROM AgentOsTask')).rows[0]).toMatchObject({ status: 'queued', attempts: 0 })
  }))
  it('allows at most one claim for a task under concurrent contention', async () => fixture(async db => {
    await enqueue(db, secret, task(), start)
    const results = await Promise.allSettled([claim(db, secret, start), claim(db, secret, start)])
    const winners = results.filter(r => r.status === 'fulfilled' && r.value !== null)
    expect(winners).toHaveLength(1)
    expect((await db.execute('SELECT attempts FROM AgentOsTask')).rows[0].attempts).toBe(1)
  }))
  it('does not execute expired or exhausted tasks', async () => fixture(async db => {
    await enqueue(db, secret, { ...task(), maxAttempts: 1 }, start)
    await claim(db, secret, start, 1000)
    expect(await claim(db, secret, new Date(start.getTime()+1001))).toBeNull()
    expect(await claim(db, secret, new Date('2030-01-01T02:00:00Z'))).toBeNull()
  }))
})
