import { secrets } from 'base44:runtime';

// PayMongo Hosted Checkout (one-time payments).
// Amounts are in centavos (PHP). Monthly ₱125 · Yearly ₱509 · Lifetime ₱1,010.
const PLANS = {
  monthly: { name: "Levli Premium — Monthly", amount: 12500 },
  yearly: { name: "Levli Premium — Yearly", amount: 50900 },
  lifetime: { name: "Levli Premium — Lifetime", amount: 101000 },
};

async function paymongoRequest(path, method, body, secretKey) {
  return fetch(`https://api.paymongo.com${path}`, {
    method,
    headers: {
      "Authorization": `Basic ${btoa(`${secretKey}:`)}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}

// Ensure a PayMongo webhook is registered at the public function URL so payment
// events reach the stripe-webhook handler. Idempotent: if a webhook already
// points at the target URL it does nothing; otherwise it updates an existing
// webhook's URL (preserving its signing secret) or creates one if none exists.
async function ensureWebhook(secretKey, webhookUrl) {
  try {
    const listRes = await paymongoRequest("/v1/webhooks", "GET", null, secretKey);
    const listJson = await listRes.json();
    const existing = listJson.data || [];
    const match = existing.find((w) => w.attributes?.url === webhookUrl);
    if (match) return; // already pointing at the correct URL
    if (existing.length > 0) {
      const id = existing[0].id;
      await paymongoRequest(`/v1/webhooks/${id}`, "PUT", {
        data: { attributes: { url: webhookUrl, events: ["checkout_session.payment.paid"] } },
      }, secretKey);
      console.log("PayMongo webhook updated to:", webhookUrl);
    } else {
      const createRes = await paymongoRequest("/v1/webhooks", "POST", {
        data: { attributes: { url: webhookUrl, events: ["checkout_session.payment.paid"] } },
      }, secretKey);
      const createJson = await createRes.json();
      console.log("PayMongo webhook created:", webhookUrl, "secret:", createJson.data?.attributes?.secret_key);
    }
  } catch (e) {
    console.error("ensureWebhook error:", e);
    // non-fatal — checkout can still proceed; webhook may need manual setup
  }
}

export default async function(req) {
  try {
    const body = await req.json();
    const plan = body.plan;
    const userId = body.userId;
    const email = body.email;
    // Public app origin (e.g. https://levli.base44.app) sent from the frontend.
    // The function's own req.url origin is the internal dispatcher, which rejects
    // external browser/webhook requests with "invalid dispatcher secret".
    const appOrigin = body.appOrigin;

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const secretKey = secrets.get("PAYMONGO_SECRET_KEY");
    if (!secretKey) {
      console.error("PAYMONGO_SECRET_KEY not set");
      return Response.json({ error: "Payment not configured" }, { status: 500 });
    }

    const origin = appOrigin || new URL(req.url).origin;
    const referenceNumber = `levli|${plan}|${userId || "anon"}`;

    // Ensure the webhook is registered at the public function URL before payment,
    // so the checkout_session.payment.paid event reaches the handler.
    await ensureWebhook(secretKey, `${origin}/functions/stripe-webhook`);

    const response = await fetch("https://api.paymongo.com/v2/checkout_sessions", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${secretKey}:`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: [{
              name: planConfig.name,
              amount: planConfig.amount,
              currency: "PHP",
              quantity: 1,
            }],
            payment_method_types: ["card", "gcash", "paymaya", "qrph"],
            success_url: `${origin}/?checkout=success`,
            cancel_url: `${origin}/`,
            reference_number: referenceNumber,
            description: "Levli Premium subscription",
            metadata: {
              user_id: userId || "",
              plan,
              base44_app_id: secrets.get("BASE44_APP_ID") || "",
            },
          },
        },
      }),
    });

    const json = await response.json();
    if (!response.ok || json.errors) {
      console.error("PayMongo checkout error:", JSON.stringify(json.errors || json));
      const msg = json.errors?.[0]?.detail || "PayMongo checkout failed";
      return Response.json({ error: msg }, { status: 500 });
    }

    const checkoutUrl = json.data?.attributes?.checkout_url;
    if (!checkoutUrl) {
      console.error("No checkout_url in PayMongo response:", JSON.stringify(json));
      return Response.json({ error: "No checkout URL returned" }, { status: 500 });
    }

    return Response.json({ url: checkoutUrl });
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}