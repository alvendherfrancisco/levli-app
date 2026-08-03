import { secrets } from 'base44:runtime';
import webpush from 'npm:web-push@3.6.7';

// Sends a test web push notification to a single PushSubscription object
// passed from the frontend. Uses VAPID keys from app secrets.
// This is a test/verification endpoint — not wired to any reminder logic yet.

export default async function(req) {
  try {
    const body = await req.json();
    const subscription = body.subscription;
    const title = body.title || "Levli";
    const messageBody = body.body || "Test push notification";

    if (!subscription || !subscription.endpoint) {
      return Response.json({ success: false, error: "No subscription provided" }, { status: 400 });
    }

    const publicKey = secrets.get("VAPID_PUBLIC_KEY");
    const privateKey = secrets.get("VAPID_PRIVATE_KEY");
    const subject = secrets.get("VAPID_SUBJECT") || "mailto:alvendherfrancisco01@gmail.com";

    if (!publicKey || !privateKey) {
      console.error("VAPID keys not configured");
      return Response.json({ success: false, error: "VAPID keys not configured" }, { status: 500 });
    }

    webpush.setVapidDetails(subject, publicKey, privateKey);

    const payload = JSON.stringify({ title, body: messageBody });

    const result = await webpush.sendNotification(subscription, payload, {
      TTL: 60,
    });

    console.log("Push sent, status:", result.statusCode);
    return Response.json({ success: true, statusCode: result.statusCode });
  } catch (error) {
    console.error("send-test-push error:", error.message, error.stack);
    return Response.json({
      success: false,
      error: error.message,
      statusCode: error.statusCode,
    }, { status: 500 });
  }
}