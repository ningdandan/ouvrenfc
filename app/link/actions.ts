"use server";

import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";
import type { SocialLink } from "./types";

const VALID_ID_REGEX = /^00(0(0[1-9]|[1-9][0-9])|100)$/;
const PIN_REGEX = /^\d{3}$/;

type LinkRecord = {
  pin: string;
  links: SocialLink[];
};

export type ActivateResult = { success: true } | { success: false; error: string };
export type VerifyResult = { success: true } | { success: false; error?: string };
export type UpdateLinksResult = { success: true } | { success: false; error: string };

export async function activateChip(id: string, pin: string): Promise<ActivateResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return { success: false, error: "Invalid chip ID." };
  }
  if (!PIN_REGEX.test(pin)) {
    return { success: false, error: "PIN must be exactly 3 digits." };
  }

  const key = `link:${id}`;
  const existing = await kv.get<LinkRecord | null>(key);
  if (existing != null) {
    return { success: false, error: "Chip already activated." };
  }

  await kv.set(key, { pin, links: [] });
  revalidatePath(`/link/${id}`);
  return { success: true };
}

export async function verifyOwner(id: string, pin: string): Promise<VerifyResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return { success: false, error: "Invalid chip ID." };
  }
  if (!PIN_REGEX.test(pin)) {
    return { success: false, error: "PIN must be exactly 3 digits." };
  }

  const key = `link:${id}`;
  const data = await kv.get<LinkRecord | null>(key);
  if (data == null || data.pin !== pin) {
    return { success: false, error: "Invalid PIN." };
  }
  return { success: true };
}

export async function updateSocialLinks(
  id: string,
  pin: string,
  links: SocialLink[]
): Promise<UpdateLinksResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return { success: false, error: "Invalid chip ID." };
  }
  if (!PIN_REGEX.test(pin)) {
    return { success: false, error: "PIN must be exactly 3 digits." };
  }

  const key = `link:${id}`;
  const data = await kv.get<LinkRecord | null>(key);
  if (data == null || data.pin !== pin) {
    return { success: false, error: "Invalid PIN." };
  }

  const sanitized: SocialLink[] = links.map(({ type, value }) => ({
    type: String(type).trim().toLowerCase(),
    value: String(value).trim(),
  }));

  await kv.set(key, { pin: data.pin, links: sanitized });
  revalidatePath(`/link/${id}`);
  return { success: true };
}
