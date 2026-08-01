import { secrets } from 'base44:runtime';

// PayMongo Hosted Checkout (one-time payments).
// Amounts are in centavos (PHP). Monthly ₱125 · Yearly ₱509 · Lifetime ₱1,010.
const PLANS = {
  monthly: { name: "Levli Premium — Monthly", amount: 12500 },
  yearly: { name: "Levli Premium — Yearly", amount: 50900 },
  lifetime: { name: "Levli Premium — Lifetime", amount: 101000 },
};

export default async function(req) {
  try {
    const body = await req.json();
    const plan = body.plan;
    const userId = body.userId;
    const email = body.email;

    const planConfig = PLANS[plan];
    if (!planConfig) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const secretKey = secrets.get("PAYMONGO_SECRET_KEY");
    if (!secretKey) {
      console.error("PAYMONGO_SECRET_KEY not set");
      return Response.json({ error: "Payment not configured" }, { status: 500 });
    }

    const origin = new URL(req.url).origin;
    // Encode plan + userId in the reference number so the webhook can map the
    // payment back to a user without relying on metadata support.
    const referenceNumber = `levli|${plan}|${userId || "anon"}`;

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