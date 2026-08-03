import { secrets } from 'base44:runtime';

// Stripe Hosted Checkout.
// Monthly & Yearly use subscription mode; Lifetime uses payment (one-time).
// Yearly includes a 7-day free trial via subscription_data[trial_period_days].
// Price IDs are configured on the Stripe product prod_Uzaid7qOtCzbTm.
const PRICE_IDS = {
  monthly: { id: "price_1TzbX7Q5PgCgpmBFgg8njxI7", mode: "subscription" },
  yearly: { id: "price_1TzbX7Q5PgCgpmBFNjXlnGzD", mode: "subscription" },
  lifetime: { id: "price_1TzbX7Q5PgCgpmBFbxFVgzXy", mode: "payment" },
};

export default async function(req) {
  try {
    const body = await req.json();
    const plan = body.plan;
    const userId = body.userId;
    const email = body.email;
    // Public app origin sent from the frontend (the function's own req.url
    // origin is the internal dispatcher and rejects external browsers).
    const appOrigin = body.appOrigin;

    const planConfig = PRICE_IDS[plan];
    if (!planConfig) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const secretKey = secrets.get("STRIPE_SECRET_KEY");
    if (!secretKey) {
      console.error("STRIPE_SECRET_KEY not set");
      return Response.json({ error: "Payment not configured" }, { status: 500 });
    }

    const appId = secrets.get("BASE44_APP_ID") || "";
    const origin = appOrigin || new URL(req.url).origin;

    const params = new URLSearchParams();
    params.append("mode", planConfig.mode);
    params.append("line_items[0][price]", planConfig.id);
    params.append("line_items[0][quantity]", "1");
    params.append("payment_method_types[0]", "card");
    params.append("success_url", `${origin}/?checkout=success`);
    params.append("cancel_url", `${origin}/`);
    params.append("metadata[user_id]", userId || "");
    params.append("metadata[plan]", plan);
    params.append("metadata[base44_app_id]", appId);
    if (email) params.append("customer_email", email);

    // For subscriptions, propagate metadata onto the subscription object so
    // later subscription lifecycle events (update/delete) carry the userId.
    if (planConfig.mode === "subscription") {
      params.append("subscription_data[metadata][user_id]", userId || "");
      params.append("subscription_data[metadata][plan]", plan);
      params.append("subscription_data[metadata][base44_app_id]", appId);
      if (plan === "yearly") {
        params.append("subscription_data[trial_period_days]", "7");
      }
    }

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    const json = await response.json();
    if (!response.ok || json.error) {
      console.error("Stripe checkout error:", JSON.stringify(json.error || json));
      const msg = json.error?.message || "Stripe checkout failed";
      return Response.json({ error: msg }, { status: 500 });
    }

    const checkoutUrl = json.url;
    if (!checkoutUrl) {
      console.error("No checkout URL in Stripe response:", JSON.stringify(json));
      return Response.json({ error: "No checkout URL returned" }, { status: 500 });
    }

    return Response.json({ url: checkoutUrl });
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}