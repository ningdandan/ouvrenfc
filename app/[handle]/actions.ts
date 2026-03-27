"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { kv } from "@vercel/kv";
import { signToken, verifyToken } from "@/lib/jwt";
import type {
  ActionResult,
  CardRecord,
  UserRecord,
  SocialLink,
  SkinId,
} from "../link/types";
import { failure, mapKvError } from "../link/actions";

const HANDLE_REGEX = /^[a-z0-9_]{1,30}$/;

/** Re-authenticate on a new device using the card key */
export async function loginWithKey(
  handle: string,
  cardKey: string
): Promise<ActionResult> {
  const trimmedHandle = handle.trim().toLowerCase();
  const trimmedKey = cardKey.trim().toUpperCase();

  if (!HANDLE_REGEX.test(trimmedHandle) || !trimmedKey) {
    return failure("Invalid input.", "INVALID_INPUT");
  }

  try {
    const user = await kv.get<UserRecord>(`user:${trimmedHandle}`);
    if (!user) return failure("Profile not found.", "NOT_FOUND");

    const card = await kv.get<CardRecord>(`card:${user.id}`);
    if (!card) return failure("Card not found.", "NOT_FOUND");
    if (card.key.toUpperCase() !== trimmedKey) {
      return failure("Invalid card key.", "UNAUTHORIZED");
    }

    const token = await signToken({ id: user.id, handle: trimmedHandle });
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });

    return { success: true };
  } catch (error) {
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }
}

/** Update the user's profile (space name, social links, theme) */
export async function updateProfile(
  handle: string,
  updates: { spaceName?: string; socialLinks?: SocialLink[]; theme?: SkinId }
): Promise<ActionResult> {
  const trimmedHandle = handle.trim().toLowerCase();

  // Verify the caller is authenticated for this handle
  const cookieStore = await cookies();
  const tokenValue = cookieStore.get("auth_token")?.value;
  if (!tokenValue) return failure("Not authenticated.", "UNAUTHORIZED");

  const payload = await verifyToken(tokenValue);
  if (!payload || payload.handle !== trimmedHandle) {
    return failure("Not authorized to edit this profile.", "UNAUTHORIZED");
  }

  try {
    const existing = await kv.get<UserRecord>(`user:${trimmedHandle}`);
    if (!existing) return failure("Profile not found.", "NOT_FOUND");

    const updated: UserRecord = {
      ...existing,
      ...(updates.spaceName !== undefined && { spaceName: updates.spaceName.trim() }),
      ...(updates.socialLinks !== undefined && {
        socialLinks: updates.socialLinks.map(({ type, value }) => ({
          type: String(type).trim().toLowerCase(),
          value: String(value).trim(),
        })),
      }),
      ...(updates.theme !== undefined && { theme: updates.theme }),
    };

    await kv.set(`user:${trimmedHandle}`, updated);
    revalidatePath(`/${trimmedHandle}`);
    return { success: true };
  } catch (error) {
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }
}
