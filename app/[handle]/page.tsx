import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { kv } from "@vercel/kv";
import { verifyToken } from "@/lib/jwt";
import type { UserRecord } from "../link/types";
import { ProfileShell } from "./profile-shell";

export const revalidate = 0;

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

  let user: UserRecord | null = null;
  try {
    user = await kv.get<UserRecord>(`user:${handle}`);
  } catch {
    // KV unavailable — still render shell, ProfileShell handles the error state
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

  return (
    <main className="min-h-[100svh] flex flex-col">
      <ProfileShell
        handle={handle}
        user={user}
        isOwner={isOwner}
        openEdit={openEdit}
      />
    </main>
  );
}
