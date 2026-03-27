/** 发送链接点击 beacon，keepalive 保证页面跳转后请求仍能完成 */
export function trackClick(handle: string, type: string) {
  try {
    fetch("/api/track/click", {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handle, type, ts: Date.now() }),
    });
  } catch {
    // silent — tracking never blocks navigation
  }
}
