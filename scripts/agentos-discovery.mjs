// Offline inventory only: never reads environment values, database contents, or contacts hosts.
import { existsSync, readFileSync } from 'node:fs'
import { platform, arch, cpus, totalmem } from 'node:os'
import { resolve } from 'node:path'
const root = process.cwd()
const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
console.log(JSON.stringify({ scope: 'local-offline-only', production: 'unverified', timestamp: new Date().toISOString(),
  runtime: { node: process.version, platform: platform(), arch: arch(), logicalCpus: cpus().length, memoryBytes: totalmem() },
  project: { name: pkg.name, sqliteSchemaPresent: existsSync(resolve(root, 'prisma/schema.prisma')), mysqlSchemaPresent: existsSync(resolve(root, 'prisma/schema.mysql.prisma')) },
  limitations: ['No remote access', 'No credentials or environment values read', 'No database opened', 'No backup or restore verification'] }, null, 2))
