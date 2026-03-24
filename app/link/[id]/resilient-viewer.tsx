"use client";

import { useEffect, useMemo, useState } from "react";
import { InitializeChip } from "./initialize-chip";
import { LinkView } from "./link-view";
import type { SocialLink } from "../types";

type Props = {
  id: string;
  links: SocialLink[];
  hasData: boolean;
  loadError: boolean;
  firstInit?: boolean;
};

const cacheKey = (id: string) => `link-cache:${id}`;

export function ResilientViewer({
  id,
  links,
  hasData,
  loadError,
  firstInit = false,
}: Props) {
  const [cachedLinks, setCachedLinks] = useState<SocialLink[] | null>(null);
  const [cacheChecked, setCacheChecked] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(cacheKey(id));
      if (!raw) {
        setCacheChecked(true);
        return;
      }
      const parsed = JSON.parse(raw) as SocialLink[];
      if (Array.isArray(parsed)) {
        setCachedLinks(parsed);
      }
    } catch {
      // Ignore cache parse issues and continue with network state.
    } finally {
      setCacheChecked(true);
    }
  }, [id]);

  useEffect(() => {
    if (!hasData || loadError || typeof window === "undefined") return;
    try {
      window.localStorage.setItem(cacheKey(id), JSON.stringify(links));
    } catch {
      // Ignore write failures in private mode/quota limits.
    }
  }, [hasData, id, links, loadError]);

  const cachedHasData = useMemo(() => (cachedLinks?.length ?? 0) > 0, [cachedLinks]);

  if (loadError) {
    if (!cacheChecked) {
      return (
        <section className="flex-1 flex items-center justify-center">
          <p className="text-xs text-black/80">Checking offline cache...</p>
        </section>
      );
    }

    if (cachedHasData && cachedLinks) {
      return (
        <div className="flex-1 flex flex-col">
          <p className="mx-auto mt-4 rounded-full bg-black/75 px-3 py-1 text-[10px] text-white">
            Showing offline data. Will sync when network improves.
          </p>
          <LinkView id={id} links={cachedLinks} firstInit={firstInit} />
        </div>
      );
    }

    return (
      <section className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-sm text-black drop-shadow-[0_0_4px_rgba(255,255,255,0.8)]">
          Failed to load links. The network might be acting up.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="min-h-[42px] rounded-full bg-black/80 px-5 text-xs uppercase tracking-wider text-white active:scale-95 transition-transform"
        >
          Retry
        </button>
      </section>
    );
  }

  if (!hasData) {
    return <InitializeChip id={id} />;
  }

  return <LinkView id={id} links={links} firstInit={firstInit} />;
}
