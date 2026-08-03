import { base44 } from "@/api/base44Client";

const VAPID_PUBLIC_KEY = "BIvggstIUyKg2SGxfM0LkRw5Onl5HysVhqG4ACz-VGW8wvOpZbGGDYxGi9BwKOKFKYYwno74LYQ1ELgCphcMteA";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Subscribe to push notifications.
// Returns { subscription, subObj, isNew }:
//   - isNew = true: a new subscription was created and saved to DB (caller should send confirmation)
//   - isNew = false: an existing subscription was found (no confirmation needed)
export async function subscribeToPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    throw new Error("Push notifications are not supported in this browser.");
  }

  const reg = await navigator.serviceWorker.register("/sw.js");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    throw new Error("Notification permission was not granted.");
  }

  // Check for existing subscription — if found, no confirmation needed
  const existingSub = await reg.pushManager.getSubscription();
  if (existingSub) {
    const subObj = existingSub.toJSON ? existingSub.toJSON() : JSON.parse(JSON.stringify(existingSub));
    return { subscription: existingSub, subObj, isNew: false };
  }

  // Create new subscription
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
  });

  const subObj = sub.toJSON ? sub.toJSON() : JSON.parse(JSON.stringify(sub));

  // Save to database so the reminder workflow can reach this device
  await base44.entities.PushSubscription.create({
    endpoint: subObj.endpoint,
    keys_p256dh: subObj.keys?.p256dh,
    keys_auth: subObj.keys?.auth,
  });

  return { subscription: sub, subObj, isNew: true };
}

// Unsubscribe from push notifications (silently — no notification fires).
export async function unsubscribeFromPush() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return;

  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return;

  const existingSub = await reg.pushManager.getSubscription();
  if (existingSub) {
    await existingSub.unsubscribe();
  }
}