import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Stripe Billing Portal — lets subscribers manage their plan (update payment
// method, cancel, etc.). Finds the Stripe customer ID via the user's
// subscription metadata, then creates a portal session.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const userId = body.userId;
    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    const secretKey = secrets.get("STRIPE_SECRET_KEY");
    if (!secretKey) return Response.json({ error: "Payment not configured" }, { status: 500 });

    const auth = `Bearer ${secretKey}`;
    const origin = body.returnUrl || new URL(req.url).origin;

    // Find the customer's subscription via metadata.
    const subRes = await fetch("https://api.stripe.com/v1/subscriptions?limit=100&status=all", {
      headers: { Authorization: auth },
    });
    const subJson = await subRes.json();
    const sub = (subJson.data || []).find((s) => s.metadata?.user_id === userId);
    if (!sub) {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    const params = new URLSearchParams();
    params.append("customer", sub.customer);
    params.append("return_url", origin);

    const portalRes = await fetch("https://api.stripe.com/v1/billing_portal/sessions", {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });
    const portalJson = await portalRes.json();
    if (!portalRes.ok || portalJson.error) {
      console.error("Stripe portal error:", JSON.stringify(portalJson.error || portalJson));
      const msg = portalJson.error?.message || "Could not create portal session";
      return Response.json({ error: msg }, { status: 500 });
    }

    return Response.json({ url: portalJson.url });
  } catch (error) {
    console.error("create-portal-session error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}