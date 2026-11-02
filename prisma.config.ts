import "dotenv/config";
import path from "node:path";
import { defineConfig } from "prisma/config";
import { PrismaLibSQL } from "@prisma/adapter-libsql";

// The bundled WASM schema engine works without downloading native binaries.
// Keep the CLI and the application on the same libSQL driver.
const raw = process.env.DATABASE_URL || `file:${path.resolve("db/custom.db")}`;
const url = raw.startsWith("file:") && !path.isAbsolute(raw.slice(5))
  ? `file:${path.resolve(raw.slice(5))}`
  : raw;

export default defineConfig({
  schema: "prisma/schema.prisma",
  experimental: { adapter: true },
  migrations: { path: "prisma/migrations/sqlite", seed: "npx tsx prisma/seed.ts" },
  engine: "js",
  adapter: async () => new PrismaLibSQL({ url }),
});
