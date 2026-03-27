import { notFound, redirect } from "next/navigation";
import { headers } from "next/headers";
import { after } from "next/server";
import { kv } from "@vercel/kv";
import type { CardRecord } from "../types";

const VALID_ID_REGEX = /^00(0(0[1-9]|[1-9][0-9])|100)$/;

/** 模糊化 IP：IPv4 末段归零，IPv6 只保留前四组 */
function fuzzyIp(raw: string): string {
  const ip = raw.split(",")[0].trim();
  const v4 = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.0`;
  const v6parts = ip.split(":");
  if (v6parts.length >= 4) return v6parts.slice(0, 4).join(":") + "::";
  return ip;
}

export const revalidate = 0;

export default async function LinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!VALID_ID_REGEX.test(id)) {
    notFound();
  }

  let card: CardRecord | null = null;
  try {
    card = await kv.get<CardRecord>(`card:${id}`);
  } catch {
    // KV unreachable — fall through to notFound
  }

  if (!card) {
    notFound();
  }

  // 记录 NFC tap：在 redirect 之后异步执行，零延迟
  const headersList = await headers();
  const rawIp =
    headersList.get("x-forwarded-for") ??
    headersList.get("x-real-ip") ??
    "unknown";
  const ip = fuzzyIp(rawIp);
  const ts = Date.now();
  const handle = card.handle ?? null;

  after(async () => {
    await Promise.all([
      kv.incr(`stats:taps:${id}`),
      kv.lpush(`stats:taplog:${id}`, JSON.stringify({ ts, ip, handle })),
      kv.ltrim(`stats:taplog:${id}`, 0, 999),
    ]);
  });

  if (card.status === "inactive" || !card.handle) {
    redirect(`/activate/${id}`);
  }

  redirect(`/${card.handle}`);
}
