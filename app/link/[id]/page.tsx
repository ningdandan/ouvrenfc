import { notFound } from "next/navigation";
import { kv } from "@vercel/kv";
import { InitializeChip } from "./initialize-chip";
import { LinkView } from "./link-view";
import type { SocialLink } from "../types";

// Strict route: id must be 00001–00100 (5-digit string)
const VALID_ID_REGEX = /^00(0(0[1-9]|[1-9][0-9])|100)$/;

export const revalidate = 0;

type LinkRecord = {
  pin?: string;
  links?: SocialLink[];
};

export default async function LinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!VALID_ID_REGEX.test(id)) {
    notFound();
  }

  const raw = await kv.get<LinkRecord | null>(`link:${id}`);
  const hasData = raw != null && (raw.pin != null || (raw.links?.length ?? 0) > 0);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[540px]">
        {/* State A: Unactivated — no KV data */}
        {!hasData && <InitializeChip id={id} />}

        {/* State B / C: 已激活，公有视图 & Owner/管理视图由 LinkView 内部切换 */}
        {hasData && <LinkView id={id} links={raw?.links ?? []} />}
      </div>
    </main>
  );
}
