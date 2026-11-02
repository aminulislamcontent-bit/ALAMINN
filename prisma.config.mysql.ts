import "dotenv/config";
import { defineConfig } from "prisma/config";
// MySQL uses Prisma's native schema engine on the deployment host. No SQLite adapter.
export default defineConfig({
  schema: "prisma/schema.mysql.prisma",
  migrations: { path: "prisma/migrations/mysql", seed: "npx tsx prisma/seed.ts" },
});
