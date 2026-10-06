/**
 * Single, guarded service-worker registrar.
 * Never registers in dev, in an iframe, or inside any Lovable preview host —
 * a stale SW there would serve deleted chunks. `?sw=off` force-unregisters.
 */
const SW_URL = "/sw.js";

function isBlockedContext() {
  if (!import.meta.env.PROD) return true;
  if (typeof window === "undefined") return true;
  if (window.top !== window.self) return true;

  const { hostname, search } = window.location;
  if (new URLSearchParams(search).has("sw") && new URLSearchParams(search).get("sw") === "off")
    return true;
  if (hostname.startsWith("id-preview--") || hostname.startsWith("preview--")) return true;
  const blockedHosts = ["lovableproject.com", "lovableproject-dev.com", "beta.lovable.dev"];
  return blockedHosts.some((h) => hostname === h || hostname.endsWith(`.${h}`));
}

async function unregisterAppWorkers() {
  if (!("serviceWorker" in navigator)) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.allSettled(
    registrations
      .filter((r) => (r.active?.scriptURL ?? r.installing?.scriptURL ?? "").endsWith(SW_URL))
      .map((r) => r.unregister()),
  );
}

export function registerServiceWorker() {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  if (isBlockedContext()) {
    void unregisterAppWorkers();
    return;
  }
  window.addEventListener("load", () => {
    void navigator.serviceWorker.register(SW_URL).catch(() => {
      /* offline support is best-effort */
    });
  });
}
