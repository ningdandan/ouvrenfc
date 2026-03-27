import type { ActionErrorCode, ActionResult } from "./types";

export function mapKvError(error: unknown): { error: string; code: ActionErrorCode } {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timeout") || message.includes("timed out")) {
    return { error: "Request timed out. Please try again.", code: "KV_TIMEOUT" };
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    return { error: "Too many requests. Please retry shortly.", code: "KV_RATE_LIMIT" };
  }
  return { error: "Network or server issue. Please try again.", code: "INTERNAL_ERROR" };
}

export function failure(error: string, code: ActionErrorCode): ActionResult {
  return { success: false, error, code };
}
