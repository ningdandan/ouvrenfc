/**
 * Cleanup script: removes all debug data from Vercel KV before deploy.
 *
 * What it does:
 *   - Deletes all  user:*       keys  (debug profiles created during testing)
 *   - Resets  card:*  that are "active" back to "inactive", clearing the
 *     bound handle — but keeps the key (卡密) untouched
 *   - Deletes all  stats:*      keys  (counters / logs from debugging)
 *
 * Usage (from project root):
 *   npx tsx scripts/reset-debug-data.ts
 */

import { readFileSync } from "fs";
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

type CardRecord = { status: "inactive" | "active"; key: string; handle?: string };

async function scanKeys(pattern: string): Promise<string[]> {
  return kv.keys(pattern);
}

async function main() {
  console.log("=== OuvreNFC KV Debug-Data Reset ===\n");

  // 1. Delete all user:* keys
  const userKeys = await scanKeys("user:*");
  if (userKeys.length === 0) {
    console.log("[user:*]  No user keys found.");
  } else {
    for (const k of userKeys) {
      await kv.del(k);
      console.log(`[DEL]  ${k}`);
    }
    console.log(`\n✓ Deleted ${userKeys.length} user key(s).\n`);
  }

  // 2. Reset active cards back to inactive (keep key/卡密)
  let resetCount = 0;
  for (let i = 1; i <= 300; i++) {
    const id = String(i).padStart(5, "0");
    const kvKey = `card:${id}`;
    const rec = await kv.get<CardRecord>(kvKey);
    if (!rec) continue;
    if (rec.status === "active" || rec.handle) {
      const cleaned: CardRecord = { status: "inactive", key: rec.key };
      await kv.set(kvKey, cleaned);
      console.log(`[RESET]  ${kvKey}  (was active, handle: ${rec.handle ?? "none"})`);
      resetCount++;
    }
  }
  if (resetCount === 0) {
    console.log("[card:*]  No active cards to reset.");
  } else {
    console.log(`\n✓ Reset ${resetCount} active card(s) to inactive.\n`);
  }

  // 3. Delete all stats:* keys
  const statsKeys = await scanKeys("stats:*");
  if (statsKeys.length === 0) {
    console.log("[stats:*]  No stats keys found.");
  } else {
    for (const k of statsKeys) {
      await kv.del(k);
      console.log(`[DEL]  ${k}`);
    }
    console.log(`\n✓ Deleted ${statsKeys.length} stats key(s).\n`);
  }

  console.log("\n=== Done. KV is clean and ready for deploy. ===");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
