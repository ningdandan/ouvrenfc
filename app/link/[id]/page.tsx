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
  params: { id: string };
}) {
  const { id } = params;

  if (!VALID_ID_REGEX.test(id)) {
    notFound();
  }

  let raw: LinkRecord | null = null;
  let kvError = false;

  try {
    raw = await kv.get<LinkRecord | null>(`link:${id}`);
  } catch {
    kvError = true;
  }

  const hasData =
    !kvError && raw != null && (raw.pin != null || (raw.links?.length ?? 0) > 0);

  if (kvError) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[540px] items-center justify-center">
          <p className="text-sm text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
            Error loading this chip. Please try again later.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[540px]">
        {/* State A: Unactivated — no KV data */}
        {!hasData && <InitializeChip id={id} />}

        {/* State B / C: 已激活，公有视图 & Owner/管理视图由 LinkView 内部切换 */}
        {hasData && raw && <LinkView id={id} links={raw.links ?? []} />}
      </div>
    </main>
  );
}
