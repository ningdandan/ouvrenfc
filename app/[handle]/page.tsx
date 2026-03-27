import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { after } from "next/server";
import { kv } from "@vercel/kv";
import { verifyToken } from "@/lib/jwt";
import type { UserRecord } from "../link/types";
import { ProfileShell } from "./profile-shell";

export const revalidate = 0;

/** 模糊化 IP：IPv4 末段归零，IPv6 只保留前四组 */
function fuzzyIp(raw: string): string {
  const ip = raw.split(",")[0].trim();
  const v4 = ip.match(/^(\d{1,3}\.\d{1,3}\.\d{1,3})\.\d{1,3}$/);
  if (v4) return `${v4[1]}.0`;
  const v6parts = ip.split(":");
  if (v6parts.length >= 4) return v6parts.slice(0, 4).join(":") + "::";
  return ip;
}

export default async function HandlePage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ edit?: string }>;
}) {
  const { handle } = await params;
  const resolvedSearch = searchParams ? await searchParams : undefined;
  const openEdit = resolvedSearch?.edit === "true";
  const fromBoot = resolvedSearch?.from === "boot";

  let user: UserRecord | null = null;
  let kvError = false;
  try {
    user = await kv.get<UserRecord>(`user:${handle}`);
  } catch {
    kvError = true;
  }

  if (kvError) {
    return (
      <main className="min-h-[100svh] flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-white/60">service temporarily unavailable</p>
        <p className="text-xs text-white/30">please try again in a moment</p>
      </main>
    );
  }

  if (!user) {
    notFound();
  }

  // Check ownership via JWT cookie
  const cookieStore = await cookies();
  const tokenValue = cookieStore.get("auth_token")?.value;
  let isOwner = false;
  if (tokenValue) {
    const payload = await verifyToken(tokenValue);
    isOwner = payload?.handle === handle;
  }

  // 埋点：响应发送后异步执行，不增加任何延迟；跳过 owner 自访问
  if (!isOwner) {
    const headersList = await headers();
    const rawIp =
      headersList.get("x-forwarded-for") ??
      headersList.get("x-real-ip") ??
      "unknown";
    const ip = fuzzyIp(rawIp);
    const ts = Date.now();

    after(async () => {
      await Promise.all([
        kv.incr(`stats:views:${handle}`),
        kv.lpush(`stats:log:${handle}`, JSON.stringify({ ts, ip })),
        kv.ltrim(`stats:log:${handle}`, 0, 999), // 只保留最近 1000 条
      ]);
    });
  }

  return (
    <main className="min-h-[100svh] flex flex-col">
      <ProfileShell
        handle={handle}
        user={user}
        isOwner={isOwner}
        openEdit={openEdit}
        fromBoot={fromBoot}
      />
    </main>
  );
}
