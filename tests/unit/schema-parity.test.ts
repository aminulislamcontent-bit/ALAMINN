import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
function models(path: string) {
  const result = new Map<string, string[]>();
  for (const match of readFileSync(path, "utf8").matchAll(/model (\w+) \{([\s\S]*?)\n\}/g)) {
    const fields = [...match[2].matchAll(/^\s+(\w+)\s+(String|Int|Float|Boolean|DateTime|Json|BigInt)(\?)?/gm)].map(f => f.slice(1).join(" "));
    result.set(match[1], fields);
  }
  return result;
}
describe("provider schema parity", () => {
  const sqlite = models("prisma/schema.prisma"), mysql = models("prisma/schema.mysql.prisma");
  it("keeps every model and scalar field in both providers", () => { expect([...mysql.keys()].sort()).toEqual([...sqlite.keys()].sort()); for (const [name, fields] of sqlite) expect(mysql.get(name), name).toEqual(fields); });
  it("has a separate MySQL lock and additive migration", () => {
    expect(readFileSync("prisma/migrations/mysql/migration_lock.toml", "utf8")).toContain('provider = "mysql"');
    const sql = readFileSync("prisma/migrations/mysql/20261102000000_integrated_feature_kits/migration.sql", "utf8");
    for (const name of ["KitDocument", "SeoAudit", "EmailCampaign", "EmailDelivery", "SupportConversation", "SupportMessage"]) expect(sql).toContain("CREATE TABLE `" + name + "`");
    expect(sql).not.toMatch(/DROP TABLE|TRUNCATE|DEFAULT cuid\(|DEFAULT now\(/);
  });
});
