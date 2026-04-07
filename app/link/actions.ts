import type { ActionErrorCode, ActionResult } from "./types";

export function mapKvError(error: unknown): { error: string; code: ActionErrorCode } {
  const message = error instanceof Error ? error.message.toLowerCase() : "";
  if (message.includes("timeout") || message.includes("timed out")) {
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "app/link/actions.ts:mapKvError:timeout",
        message: "kv error mapped to timeout",
        data: { hasError: Boolean(error), messageSnippet: message.slice(0, 120) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return { error: "Request timed out. Please try again.", code: "KV_TIMEOUT" };
  }
  if (message.includes("rate limit") || message.includes("too many requests")) {
    // #region agent log
    fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
      body: JSON.stringify({
        sessionId: "60d044",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "app/link/actions.ts:mapKvError:rate_limit",
        message: "kv error mapped to rate limit",
        data: { hasError: Boolean(error), messageSnippet: message.slice(0, 120) },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    return { error: "Too many requests. Please retry shortly.", code: "KV_RATE_LIMIT" };
  }
  // #region agent log
  fetch("http://127.0.0.1:7701/ingest/2e071bb6-0524-4db4-872c-293a76a7eaab", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "60d044" },
    body: JSON.stringify({
      sessionId: "60d044",
      runId: "pre-fix",
      hypothesisId: "H1",
      location: "app/link/actions.ts:mapKvError:internal",
      message: "kv error mapped to internal",
      data: { hasError: Boolean(error), messageSnippet: message.slice(0, 120) },
      timestamp: Date.now(),
    }),
  }).catch(() => {});
  // #endregion
  return { error: "Network or server issue. Please try again.", code: "INTERNAL_ERROR" };
}

export function failure(error: string, code: ActionErrorCode): ActionResult {
  return { success: false, error, code };
}
