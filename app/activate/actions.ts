"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { kv } from "@vercel/kv";
import { signToken } from "@/lib/jwt";
import type { CardRecord, UserRecord, ActionResult, SkinId } from "../link/types";
import { failure, mapKvError } from "../link/actions";

const VALID_ID_REGEX = /^00(0(0[1-9]|[1-9][0-9])|100)$/;
const HANDLE_REGEX = /^[a-z0-9_]{1,30}$/;

export type ActivateCardResult = ActionResult;

export async function activateCard(
  id: string,
  cardKey: string,
  handle: string
): Promise<ActivateCardResult> {
  if (!VALID_ID_REGEX.test(id)) {
    return failure("Invalid card ID.", "INVALID_INPUT");
  }
  const trimmedKey = cardKey.trim().toUpperCase();
  const trimmedHandle = handle.trim().toLowerCase();

  if (!trimmedKey) {
    return failure("Card key is required.", "INVALID_INPUT");
  }
  if (!HANDLE_REGEX.test(trimmedHandle)) {
    return failure(
      "Handle must be 1–30 lowercase letters, numbers, or underscores.",
      "INVALID_INPUT"
    );
  }

  try {
    const card = await kv.get<CardRecord>(`card:${id}`);

    if (!card) {
      return failure("Card not found.", "NOT_FOUND");
    }
    if (card.status === "active") {
      return failure("This card is already activated.", "ALREADY_EXISTS");
    }
    if (card.key.toUpperCase() !== trimmedKey) {
      return failure("Invalid card key.", "UNAUTHORIZED");
    }

    // Check handle uniqueness
    const existingUser = await kv.get<UserRecord>(`user:${trimmedHandle}`);
    if (existingUser) {
      return failure("This handle is already taken.", "ALREADY_EXISTS");
    }

    // Atomic dual-write
    const defaultTheme: SkinId = "windowsxp";
    const userRecord: UserRecord = {
      id,
      spaceName: trimmedHandle,
      socialLinks: [{ type: "instagram", value: "" }],
      theme: defaultTheme,
    };
    const updatedCard: CardRecord = {
      ...card,
      status: "active",
      handle: trimmedHandle,
    };

    await Promise.all([
      kv.set(`card:${id}`, updatedCard),
      kv.set(`user:${trimmedHandle}`, userRecord),
    ]);

    // Sign JWT and set cookie
    const token = await signToken({ id, handle: trimmedHandle });
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      path: "/",
    });
  } catch (error) {
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }

  redirect(`/booting/${handle.trim().toLowerCase()}?id=${id}`);
}
