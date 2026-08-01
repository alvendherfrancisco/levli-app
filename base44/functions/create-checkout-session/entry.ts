import Stripe from 'npm:stripe';
import { secrets } from 'base44:runtime';
import { PRICE_MAP } from "../../shared/stripeConfig.ts";

export default async function(req) {
  try {
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));
    const body = await req.json();
    const plan = body.plan;
    const userId = body.userId;
    const email = body.email;

    const priceId = PRICE_MAP[plan];
    if (!priceId) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const origin = new URL(req.url).origin;
    const successUrl = `${origin}/?checkout=success`;
    const cancelUrl = `${origin}/`;

    const baseParams = {
      client_reference_id: userId || undefined,
      customer_email: email || undefined,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId || "",
        base44_app_id: secrets.get("BASE44_APP_ID") || "",
      },
    };

    let session;
    if (plan === "lifetime") {
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
      });
    } else if (plan === "yearly") {
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
          trial_period_days: 7,
          metadata: { user_id: userId || "" },
        },
      });
    } else {
      session = await stripe.checkout.sessions.create({
        ...baseParams,
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: { metadata: { user_id: userId || "" } },
      });
    }

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("create-checkout-session error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}