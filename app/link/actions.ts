"use server";

import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";
import type { ActionErrorCode, ActionResult, SocialLink } from "./types";

const VALID_ID_REGEX = /^00(0(0[1-9]|[1-9][0-9])|100)$/;
const PIN_REGEX = /^\d{3}$/;

type LinkRecord = {
  pin: string;
  links: SocialLink[];
};

export type ActivateResult = ActionResult;
export type VerifyResult = ActionResult;
export type UpdateLinksResult = ActionResult;

function failure(error: string, code: ActionErrorCode): ActionResult {
  return { success: false, error, code };
}

function mapKvError(error: unknown): { error: string; code: ActionErrorCode } {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timeout") || message.includes("timed out")) {
    return { error: "Request timed out. Please try again.", code: "KV_TIMEOUT" };
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return { error: "Too many requests. Please retry shortly.", code: "KV_RATE_LIMIT" };
  }
  return { error: "Network or server issue. Please try again.", code: "INTERNAL_ERROR" };
}

export async function activateChip(id: string, pin: string): Promise<ActivateResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return failure("Invalid chip ID.", "INVALID_INPUT");
  }
  if (!PIN_REGEX.test(pin)) {
    return failure("PIN must be exactly 3 digits.", "INVALID_INPUT");
  }

  try {
    const key = `link:${id}`;
    const existing = await kv.get<LinkRecord | null>(key);
    if (existing != null) {
      return failure("Chip already activated.", "ALREADY_EXISTS");
    }

    await kv.set(key, { pin, links: [] });
    revalidatePath(`/link/${id}`);
    return { success: true };
  } catch (error) {
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }
}

export async function verifyOwner(id: string, pin: string): Promise<VerifyResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return failure("Invalid chip ID.", "INVALID_INPUT");
  }
  if (!PIN_REGEX.test(pin)) {
    return failure("PIN must be exactly 3 digits.", "INVALID_INPUT");
  }

  try {
    const key = `link:${id}`;
    const data = await kv.get<LinkRecord | null>(key);
    if (data == null) {
      return failure("Chip not found.", "NOT_FOUND");
    }
    if (data.pin !== pin) {
      return failure("Invalid PIN.", "UNAUTHORIZED");
    }
    return { success: true };
  } catch (error) {
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }
}

export async function updateSocialLinks(
  id: string,
  pin: string,
  links: SocialLink[]
): Promise<UpdateLinksResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return failure("Invalid chip ID.", "INVALID_INPUT");
  }
  if (!PIN_REGEX.test(pin)) {
    return failure("PIN must be exactly 3 digits.", "INVALID_INPUT");
  }

  try {
    const key = `link:${id}`;
    const data = await kv.get<LinkRecord | null>(key);
    if (data == null) {
      return failure("Chip not found.", "NOT_FOUND");
    }
    if (data.pin !== pin) {
      return failure("Invalid PIN.", "UNAUTHORIZED");
    }

    const sanitized: SocialLink[] = links.map(({ type, value }) => ({
      type: String(type).trim().toLowerCase(),
      value: String(value).trim(),
    }));

    await kv.set(key, { pin: data.pin, links: sanitized });
    revalidatePath(`/link/${id}`);
    return { success: true };
  } catch (error) {
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }
}
