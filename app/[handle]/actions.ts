"use server";

import { cookies } from "next/headers";
import { headers } from "next/headers";
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
  const headersList = await headers();
  // #region agent log
  console.info("[DBG60d044][H6] loginWithKey entry", {
    handleLength: trimmedHandle.length,
    keyLength: trimmedKey.length,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV ?? "unknown",
    host: headersList.get("host"),
    origin: headersList.get("origin"),
    proto: headersList.get("x-forwarded-proto"),
  });
  // #endregion
  // #region agent log
  fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
    body: JSON.stringify({
      sessionId: "60d044",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "app/[handle]/actions.ts:loginWithKey:entry",
      message: "loginWithKey called",
      data: { handleLength: trimmedHandle.length, hasKey: Boolean(trimmedKey) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion

  if (!HANDLE_REGEX.test(trimmedHandle) || !trimmedKey) {
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H4",
        location: "app/[handle]/actions.ts:loginWithKey:input_guard",
        message: "login input rejected by guard",
        data: { handleValid: HANDLE_REGEX.test(trimmedHandle), hasKey: Boolean(trimmedKey) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
    // #region agent log
    console.info("[DBG60d044][H7] loginWithKey cookie written", {
      secureCookie: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      handleLength: trimmedHandle.length,
    });
    // #endregion
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "app/[handle]/actions.ts:loginWithKey:cookie_set",
        message: "auth cookie set before success return",
        data: { secureCookie: process.env.NODE_ENV === "production" },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion

    return { success: true };
  } catch (error) {
    // #region agent log
    console.error("[DBG60d044][H8] loginWithKey catch", {
      errorName: error instanceof Error ? error.name : "unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV ?? "unknown",
      handleLength: trimmedHandle.length,
    });
    // #endregion
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "app/[handle]/actions.ts:loginWithKey:catch",
        message: "login catch branch hit",
        data: {
          errorName: error instanceof Error ? error.name : "unknown",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
  const headersList = await headers();
  // #region agent log
  console.info("[DBG60d044][H6] updateProfile entry", {
    handleLength: trimmedHandle.length,
    hasSpaceName: updates.spaceName !== undefined,
    linksCount: updates.socialLinks?.length ?? 0,
    hasTheme: updates.theme !== undefined,
    host: headersList.get("host"),
    origin: headersList.get("origin"),
    proto: headersList.get("x-forwarded-proto"),
  });
  // #endregion

  // Verify the caller is authenticated for this handle
  const cookieStore = await cookies();
  const tokenValue = cookieStore.get("auth_token")?.value;
  if (!tokenValue) {
    // #region agent log
    console.warn("[DBG60d044][H7] updateProfile missing auth cookie", {
      handleLength: trimmedHandle.length,
      nodeEnv: process.env.NODE_ENV,
      vercelEnv: process.env.VERCEL_ENV ?? "unknown",
    });
    // #endregion
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H2",
        location: "app/[handle]/actions.ts:updateProfile:no_cookie",
        message: "update rejected due to missing auth cookie",
        data: { handleLength: trimmedHandle.length },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return failure("Not authenticated.", "UNAUTHORIZED");
  }

  const payload = await verifyToken(tokenValue);
  if (!payload || payload.handle !== trimmedHandle) {
    // #region agent log
    console.warn("[DBG60d044][H7] updateProfile token mismatch", {
      hasPayload: Boolean(payload),
      payloadHandleMatches: payload?.handle === trimmedHandle,
      handleLength: trimmedHandle.length,
    });
    // #endregion
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H3",
        location: "app/[handle]/actions.ts:updateProfile:token_mismatch",
        message: "update rejected due to invalid token payload",
        data: { hasPayload: Boolean(payload), payloadHandleMatches: payload?.handle === trimmedHandle },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
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
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H5",
        location: "app/[handle]/actions.ts:updateProfile:success",
        message: "profile update persisted",
        data: { linksCount: updated.socialLinks.length, hasTheme: Boolean(updated.theme) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return { success: true };
  } catch (error) {
    // #region agent log
    console.error("[DBG60d044][H8] updateProfile catch", {
      errorName: error instanceof Error ? error.name : "unknown",
      errorMessage: error instanceof Error ? error.message : String(error),
      handleLength: trimmedHandle.length,
    });
    // #endregion
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "app/[handle]/actions.ts:updateProfile:catch",
        message: "update catch branch hit",
        data: {
          errorName: error instanceof Error ? error.name : "unknown",
          errorMessage: error instanceof Error ? error.message : String(error),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    const mapped = mapKvError(error);
    return failure(mapped.error, mapped.code);
  }
}
