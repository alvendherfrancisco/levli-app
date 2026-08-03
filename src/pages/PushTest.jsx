import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Bell, BellRing, CheckCircle2, XCircle, Loader2, Send, FileWarning, ChevronLeft } from "lucide-react";

// VAPID public key — safe to expose client-side.
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

export default function PushTest() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState("idle"); // idle | subscribing | subscribed | sending | sent | error
  const [error, setError] = useState("");
  const [logs, setLogs] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [swScope, setSwScope] = useState("");

  const log = (msg) => {
    const ts = new Date().toLocaleTimeString();
    setLogs((l) => [...l, `${ts}  ${msg}`]);
  };

  const handleSubscribe = async () => {
    setPhase("subscribing");
    setError("");
    setLogs([]);
    try {
      if (!("serviceWorker" in navigator)) {
        throw new Error("Service Worker API not supported in this browser.");
      }
      if (!("PushManager" in window)) {
        throw new Error("Push API not supported in this browser.");
      }

      log("Registering service worker at /sw.js ...");
      const reg = await navigator.serviceWorker.register("/sw.js");
      setSwScope(reg.scope);
      log(`✓ Service worker registered (scope: ${reg.scope})`);

      log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
      log(`Permission result: ${permission}`);
      if (permission !== "granted") {
        throw new Error("Notification permission was not granted.");
      }

      log("Checking for existing subscription...");
      const existingSub = await reg.pushManager.getSubscription();
      if (existingSub) {
        log("Found existing subscription (old key) — unsubscribing first...");
        await existingSub.unsubscribe();
        log("✓ Old subscription removed");
      }

      log("Subscribing to push manager with VAPID public key...");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
      });
      log(`✓ Push subscription created`);
      log(`  endpoint: ${sub.endpoint}`);

      // Save subscription to database so the daily reminder workflow can reach this device
      log("Saving subscription to database...");
      try {
        const subObj = sub.toJSON ? sub.toJSON() : JSON.parse(JSON.stringify(sub));
        await base44.entities.PushSubscription.create({
          endpoint: subObj.endpoint,
          keys_p256dh: subObj.keys?.p256dh,
          keys_auth: subObj.keys?.auth,
        });
        log("✓ Subscription saved to database");
      } catch (e) {
        log(`⚠ Could not save subscription to database: ${e.message}`);
      }

      setSubscription(sub);
      setPhase("subscribed");
    } catch (e) {
      log(`✗ ${e.message}`);
      setError(e.message);
      setPhase("error");
    }
  };

  const handleSendTest = async () => {
    if (!subscription) return;
    setPhase("sending");
    setError("");
    try {
      log("Calling backend function send-test-push...");
      const res = await base44.functions.invoke("send-test-push", {
        subscription: JSON.parse(JSON.stringify(subscription)),
        title: "Levli Reminder",
        body: "This is a test push notification! 🎉",
      });
      log(`Backend response: ${JSON.stringify(res.data)}`);
      if (res.data?.success) {
        log("✓ Push notification sent successfully!");
        setPhase("sent");
      } else {
        // Surface the full error from the backend, including stack trace if available
        const fullError = res.data?.error || "Backend returned failure";
        const stack = res.data?.stack ? `\n\nStack: ${res.data.stack}` : "";
        const debug = res.data?.debug ? `\n\nDebug: ${JSON.stringify(res.data.debug)}` : "";
        throw new Error(`${fullError}${debug}${stack}`);
      }
    } catch (e) {
      log(`✗ ${e.message}`);
      setError(e.message);
      setPhase("error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-5">
      <div className="max-w-md mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate("/settings")} className="p-1 -ml-1 text-gray-500 hover:text-indigo-600 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <BellRing size={24} className="text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Push Notification Test</h1>
        </div>

        {/* Step 1: Subscribe */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">1</div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Subscribe to Push</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Registers the service worker, requests notification permission, and creates a push subscription using the VAPID public key.
          </p>
          <button
            onClick={handleSubscribe}
            disabled={phase === "subscribing" || phase === "subscribed"}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {phase === "subscribing" ? <Loader2 size={18} className="animate-spin" /> : <Bell size={18} />}
            {phase === "subscribed" ? "Subscribed ✓" : phase === "subscribing" ? "Subscribing..." : "Subscribe"}
          </button>
          {swScope && (
            <p className="text-xs text-gray-400 mt-2 break-all">SW scope: {swScope}</p>
          )}
        </div>

        {/* Step 2: Send test */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${subscription ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400"}`}>2</div>
            <h2 className="font-semibold text-gray-900 dark:text-white">Send Test Push</h2>
          </div>
          <p className="text-sm text-gray-500 mb-4">
            Sends the subscription to the backend, which signs a VAPID JWT and delivers the push to your browser.
          </p>
          <button
            onClick={handleSendTest}
            disabled={!subscription || phase === "sending"}
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {phase === "sending" ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            {phase === "sending" ? "Sending..." : "Send Test Push"}
          </button>
        </div>

        {/* Status banner */}
        {phase === "sent" && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-4 flex items-start gap-2">
            <CheckCircle2 size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-800">End-to-end test passed!</p>
              <p className="text-sm text-green-700">A push notification was delivered. Check your device notifications.</p>
            </div>
          </div>
        )}
        {phase === "error" && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-4 flex items-start gap-2">
            <FileWarning size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-800">Something failed</p>
              <p className="text-sm text-red-700 break-words">{error}</p>
            </div>
          </div>
        )}

        {/* Log */}
        {logs.length > 0 && (
          <div className="bg-gray-900 rounded-2xl p-4">
            <p className="text-xs text-gray-400 mb-2 font-mono">Console log:</p>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {logs.map((line, i) => (
                <p key={i} className="text-xs text-green-400 font-mono break-words">{line}</p>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-4">
          Note: Push notifications require HTTPS or localhost. In the builder preview (iframe), service workers may be blocked — test from the published app URL.
        </p>
      </div>
    </div>
  );
}