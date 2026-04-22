/**
 * Seed script: pre-generates card records for IDs 00101–00300 in Vercel KV.
 * Each card gets a random key in the format OVR-XXXX using an unambiguous
 * character set (no I, L, O, 0, 1 to avoid visual confusion).
 * Existing records are never overwritten, so 00001–00100 stay untouched.
 *
 * Usage (from project root):
 *   npx tsx scripts/seed-cards.ts
 */

// Load .env.local so KV credentials are available when running outside Next.js
import { readFileSync } from "fs";
import { resolve } from "path";

try {
  const envPath = resolve(process.cwd(), ".env.local");
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const rawVal = trimmed.slice(eqIdx + 1).trim();
    const value = rawVal.replace(/^"(.*)"$/, "$1");
    if (key && !(key in process.env)) {
      process.env[key] = value;
    }
  }
} catch {
  // .env.local not found — rely on environment variables already being set
}

import { kv } from "@vercel/kv";

type CardRecord = {
  status: "inactive" | "active";
  key: string;
  handle?: string;
};

// Excludes I, L, O (look like 1, 1, 0) and 0, 1 (look like O, I/l)
const CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function randomKey(): string {
  let suffix = "";
  for (let i = 0; i < 4; i++) {
    suffix += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return `OVR-${suffix}`;
}

function padId(n: number): string {
  return String(n).padStart(5, "0");
}

async function main() {
  let seeded = 0;
  let skipped = 0;

  for (let i = 101; i <= 300; i++) {
    const id = padId(i);
    const kvKey = `card:${id}`;

    const existing = await kv.get<CardRecord>(kvKey);
    if (existing) {
      console.log(`[SKIP]  ${kvKey} already exists`);
      skipped++;
      continue;
    }

    // Create only missing cards to avoid modifying existing keys/data
    const cardKey = randomKey();
    const record: CardRecord = {
      status: "inactive",
      key: cardKey,
    };
    await kv.set(kvKey, record);
    console.log(`[SEED]  ${kvKey} → key: ${cardKey}`);
    seeded++;
  }

  console.log(`\nDone. Created: ${seeded}, Skipped(existing): ${skipped}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
