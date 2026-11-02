import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const cli = require.resolve('prisma/build/index.js');
const command = process.argv[2] || 'generate';
const args = process.argv[2] ? process.argv.slice(3) : process.argv.slice(2);
const wasm = path.join(path.dirname(cli), 'schema_engine_bg.wasm');
// Prisma 6.19's CLI preflight always checks a native query library, even
// with engineType=client + a driver adapter. Supply the bundled WASM file
// to that existence check only; generation uses the WASM schema engine and
// the runtime uses the libSQL adapter, never this preflight path.
// This avoids a blocked binaries.prisma.sh download without changing codegen.
const result = spawnSync(process.execPath, [cli, command, ...args], {
  stdio: 'inherit',
  env: { ...process.env, PRISMA_QUERY_ENGINE_LIBRARY: wasm },
});
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
