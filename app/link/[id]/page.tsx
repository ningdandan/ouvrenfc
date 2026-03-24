import { notFound } from "next/navigation";
import { kv } from "@vercel/kv";
import { ResilientViewer } from "./resilient-viewer";
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
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ firstInit?: string }>;
}) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const firstInit = resolvedSearchParams?.firstInit === "1";

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

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[420px] mx-auto flex flex-col min-h-[540px]">
        <ResilientViewer
          id={id}
          links={raw?.links ?? []}
          hasData={hasData}
          loadError={kvError}
          firstInit={firstInit}
        />
      </div>
    </main>
  );
}
