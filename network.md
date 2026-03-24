# 🚀 Project Plan: Refactoring Network & Error Handling for Low-Network Environments

## 1. Context & Tech Stack
- **Project:** A Linktree clone (Users can set a password, add links, and generate a public sub-page for visitors).
- **Tech Stack:** TypeScript + React/Next.js (Frontend) + Vercel KV (Database).
- **Current Issue:** The application is unstable in low-network (Low 3G/Weak WiFi) or offline environments. Error handling is insufficient, leading to silent failures, infinite hangs, or bad UX.
- **Goal:** Implement robust, resilient network handling and graceful error states across the entire full-stack application.

## 2. Implementation Phases

### Phase 1: Global Network Status Listener
**Target:** Create a reliable way to detect network drops and slow connections.
- [ ] Create a custom hook `hooks/useNetworkStatus.ts`.
- [ ] Listen to `window` `online` and `offline` events.
- [ ] Use `navigator.connection.effectiveType` (safely typed for TS) to detect '2g' or '3g' (slow networks).
- [ ] Return `{ isOnline, isSlowNetwork }`.
- [ ] Implement a global `NetworkToast` component (or integrate with the existing Toast library) to show "You are offline" when connection drops, and "Back online" when restored.

### Phase 2: Resilient Fetch Wrapper (Timeout & Retry)
**Target:** Prevent API calls from hanging infinitely in weak networks.
- [ ] Create a utility `utils/fetchWithTimeout.ts` using `AbortController`.
- [ ] Set a default timeout of 8 seconds. If it exceeds, throw a custom `TimeoutError`.
- [ ] Implement Exponential Backoff Retry logic (e.g., max 3 retries, waiting 1s, 2s, 4s).
- [ ] Add HTTP Status Code filtering: 
  - Do NOT retry on client errors (400, 401, 403, 404).
  - DO retry on 5xx errors or Network/Timeout errors.
- [ ] Ensure full TypeScript generic support for the expected JSON response.

### Phase 3: Optimistic UI for Creator Dashboard
**Target:** Make link management feel instant, even on slow networks.
- [ ] Refactor the Link creation/update/deletion logic in the Creator Dashboard.
- [ ] Implement Optimistic UI: Update the frontend state immediately before waiting for the Vercel KV response.
- [ ] Use `fetchWithTimeout` for the background mutation.
- [ ] If the mutation fails (after retries), automatically rollback the UI state to the previous version and show a Toast: "Network unstable. Reverted changes."
- [ ] Add inline, non-blocking loading states (e.g., lowered opacity or a tiny spinner on the specific link item being mutated) instead of blocking the whole screen.

### Phase 4: Graceful Degradation for Viewer Page (Public Linktree)
**Target:** Ensure visitors have a smooth experience, even if the data fails to load.
- [ ] Replace global loading spinners with Skeleton Screens (circular skeletons for avatars, rectangular bars for links).
- [ ] Implement an Error/Empty State fallback component. If fetching the user's links from Vercel KV fails entirely, display a friendly UI: "Failed to load links. The network might be acting up." with a "Retry" button.
- [ ] Enable offline caching (via `localStorage` or SWR/React Query cache). If a fetch fails but cached data exists, display the cached links and add a subtle banner: "Showing offline data. Will sync when network improves."

### Phase 5: Vercel KV API Route Resilience
**Target:** Standardize backend error responses so the frontend can handle them predictably.
- [ ] Wrap all Vercel KV read/write operations in Next.js API routes (or Server Actions) in `try/catch` blocks.
- [ ] Map Vercel KV rate limit errors to `429 Too Many Requests`.
- [ ] Map KV connection timeouts to `504 Gateway Timeout`.
- [ ] Ensure NO unhandled exceptions leak HTML error pages. All API responses MUST return a standard JSON format: `{ success: boolean, data?: any, error?: string, code?: number }`.