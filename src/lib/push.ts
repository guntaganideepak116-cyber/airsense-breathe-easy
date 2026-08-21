/**
 * Web Push (VAPID) helpers — standard Push API + service worker, no FCM.
 *
 * Flow: request permission → subscribe via PushManager with the server's VAPID
 * public key → POST the subscription to /api/push/subscribe.
 */
export type PushState = "unsupported" | "default" | "granted" | "denied";

const LANG_KEY = "airsense-lang";
const PREF_KEY = "airsense-push-enabled";

export function pushSupported() {
  return (
    typeof window !== "undefined" &&
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function pushState(): PushState {
  if (!pushSupported()) return "unsupported";
  return Notification.permission as PushState;
}

export function pushPreference() {
  try {
    return localStorage.getItem(PREF_KEY) === "1";
  } catch {
    return false;
  }
}

function setPushPreference(on: boolean) {
  try {
    localStorage.setItem(PREF_KEY, on ? "1" : "0");
  } catch {
    /* ignore */
  }
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function getRegistration() {
  if (!("serviceWorker" in navigator)) return null;
  const existing = await navigator.serviceWorker.getRegistration();
  return existing ?? null;
}

/** Requests permission and registers a push subscription. Returns the resulting state. */
export async function enablePush(): Promise<PushState> {
  if (!pushSupported()) return "unsupported";

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    setPushPreference(false);
    return permission as PushState;
  }

  setPushPreference(true);

  const registration = await getRegistration();
  if (registration && "pushManager" in registration) {
    try {
      const { publicKey } = (await fetch("/api/push/vapid").then((r) => r.json())) as {
        publicKey: string;
      };
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        }));

      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...subscription.toJSON(),
          lang: localStorage.getItem(LANG_KEY) === "en" ? "en" : "te",
        }),
      });
    } catch {
      /* Subscription is best-effort; local alerts still work. */
    }
  }

  return "granted";
}

export async function disablePush() {
  setPushPreference(false);
  const registration = await getRegistration();
  const subscription = await registration?.pushManager?.getSubscription();
  if (subscription) {
    await fetch("/api/push/subscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    }).catch(() => {});
    await subscription.unsubscribe().catch(() => {});
  }
}

/**
 * Shows an alert for a locally detected poor-air event.
 * Uses the service worker when one is active so the click opens the right room.
 */
export async function showAirAlert(opts: {
  title: string;
  body: string;
  deviceId: string;
  lang: string;
}) {
  if (!pushSupported() || Notification.permission !== "granted" || !pushPreference()) return;
  const url = `/dashboard/rooms?room=${encodeURIComponent(opts.deviceId)}`;
  const registration = await getRegistration();
  const options: NotificationOptions = {
    body: opts.body,
    icon: "/icons/icon-192.png",
    lang: opts.lang,
    tag: opts.deviceId,
    data: { url },
  };
  if (registration) await registration.showNotification(opts.title, options);
  else new Notification(opts.title, options);
}
