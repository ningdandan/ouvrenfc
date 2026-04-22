import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

try {
  const lines = readFileSync(resolve(process.cwd(), ".env.local"), "utf-8").split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const k = t.slice(0, eq).trim();
    const v = t.slice(eq + 1).trim().replace(/^"(.*)"$/, "$1");
    if (k && !(k in process.env)) process.env[k] = v;
  }
} catch {}

import { kv } from "@vercel/kv";

type CardRecord = { status: string; key: string; handle?: string };

async function main() {
  const rows: string[] = ["编号       密码         状态       Handle", "─".repeat(50)];
  for (let i = 1; i <= 300; i++) {
    const id = String(i).padStart(5, "0");
    const rec = await kv.get<CardRecord>(`card:${id}`);
    const key = rec?.key ?? "N/A";
    const status = rec?.status ?? "missing";
    const handle = rec?.handle ?? "";
    rows.push(`${id}    ${key}    ${status.padEnd(8)}  ${handle}`);
  }
  const out = rows.join("\n");
  console.log(out);
  const outPath = resolve(process.cwd(), "card-keys-backup.txt");
  writeFileSync(outPath, out + "\n");
  console.error(`\n✓ 已保存到 ${outPath}`);
}

main().catch((err) => { console.error(err); process.exit(1); });
