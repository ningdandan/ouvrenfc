import { notFound, redirect } from "next/navigation";
import { kv } from "@vercel/kv";
import type { CardRecord } from "../../link/types";
import { ActivateForm } from "./activate-form";

const VALID_ID_REGEX = /^00(0(0[1-9]|[1-9][0-9])|100)$/;

export const revalidate = 0;

export default async function ActivatePage({
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
    // KV issue — still render the form, action will surface the error
  }

  if (card?.status === "active" && card.handle) {
    redirect(`/${card.handle}`);
  }

  return <ActivateForm id={id} />;
}
