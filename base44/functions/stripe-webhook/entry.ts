import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Stripe webhook handler. Verifies the Stripe-Signature header (HMAC-SHA256
// of "{timestamp}.{rawBody}" with the webhook signing secret) and updates the
// user's subscription_status / plan_type on checkout.session.completed,
// customer.subscription.updated, customer.subscription.deleted, and
// invoice.payment_failed. The userId + plan are carried in the event metadata.

const PRICE_TO_PLAN = {
  "price_1TzbX7Q5PgCgpmBFgg8njxI7": "monthly",
  "price_1TzbX7Q5PgCgpmBFNjXlnGzD": "yearly",
  "price_1TzbX7Q5PgCgpmBFbxFVgzXy": "lifetime",
};

const STATUS_MAP = {
  active: "active",
  trialing: "trialing",
  past_due: "past_due",
  canceled: "canceled",
  incomplete: "inactive",
  incomplete_expired: "inactive",
  unpaid: "past_due",
  paused: "inactive",
};

async function verifyStripeSignature(rawBody, signatureHeader, secret) {
  if (!signatureHeader || !secret) return false;
  const parts = {};
  signatureHeader.split(",").forEach((p) => {
    const idx = p.indexOf("=");
    if (idx > -1) parts[p.slice(0, idx).trim()] = p.slice(idx + 1).trim();
  });
  const timestamp = parts.t;
  const provided = parts.v1;
  if (!timestamp || !provided) return false;
  // Reject signatures older than 5 minutes to prevent replay attacks.
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp);
  if (isNaN(age) || age > 300) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(`${timestamp}.${rawBody}`));
  const expected = [...new Uint8Array(sigBuf)]
    .map((b) => b.toString(16).padStart(2, "0")).join("");
  if (expected.length !== provided.length) return false;
  return expected === provided;
}

async function findProfileByUserId(base44, userId) {
  if (!userId) return null;
  const list = await base44.asServiceRole.entities.UserProfile.filter({ created_by_id: userId });
  return list[0] || null;
}

async function getSubscription(subId, secretKey) {
  const res = await fetch(`https://api.stripe.com/v1/subscriptions/${subId}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  return res.json();
}

function planFromSubscription(sub) {
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.id;
  return PRICE_TO_PLAN[priceId] || sub.metadata?.plan || "";
}

function statusFromSubscription(sub) {
  return STATUS_MAP[sub.status] || "inactive";
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const raw = await req.text();
    const signatureHeader = req.headers.get("Stripe-Signature") || "";

    const webhookSecret = secrets.get("STRIPE_WEBHOOK_SECRET");
    const secretKey = secrets.get("STRIPE_SECRET_KEY");
    if (!webhookSecret || !secretKey) {
      console.error("STRIPE_WEBHOOK_SECRET or STRIPE_SECRET_KEY not set");
      return Response.json({ error: "Not configured" }, { status: 500 });
    }

    const verified = await verifyStripeSignature(raw, signatureHeader, webhookSecret);
    if (!verified) {
      console.error("Stripe signature verification failed.");
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(raw);
    const eventType = event.type;
    const data = event.data?.object || {};

    let userId = "";
    let plan = "";
    let status = "";

    if (eventType === "checkout.session.completed") {
      userId = data.metadata?.user_id || "";
      plan = data.metadata?.plan || "";
      if (data.mode === "subscription" && data.subscription) {
        const sub = await getSubscription(data.subscription, secretKey);
        status = statusFromSubscription(sub);
        if (!plan) plan = planFromSubscription(sub);
        if (!userId) userId = sub.metadata?.user_id || "";
      } else {
        // One-time payment (lifetime) — payment is complete.
        status = "active";
      }
    } else if (eventType === "customer.subscription.updated") {
      userId = data.metadata?.user_id || "";
      plan = planFromSubscription(data);
      status = statusFromSubscription(data);
    } else if (eventType === "customer.subscription.deleted") {
      userId = data.metadata?.user_id || "";
      plan = planFromSubscription(data);
      status = "canceled";
    } else if (eventType === "invoice.payment_failed") {
      if (data.subscription) {
        const sub = await getSubscription(data.subscription, secretKey);
        userId = sub.metadata?.user_id || "";
        plan = planFromSubscription(sub);
      }
      status = "past_due";
    } else {
      return Response.json({ received: true, ignored: eventType });
    }

    if (!userId) {
      console.error("No userId in event metadata:", eventType);
      return Response.json({ received: true, error: "no userId" });
    }

    const profile = await findProfileByUserId(base44, userId);
    if (!profile) {
      console.error("No UserProfile found for userId:", userId);
      return Response.json({ received: true, error: "no profile" });
    }

    const validPlans = ["monthly", "yearly", "lifetime"];
    const update = { subscription_status: status };
    if (validPlans.includes(plan)) {
      update.plan_type = plan;
    }
    if (status === "active" || status === "trialing") {
      update.premium_until = null;
    }

    await base44.asServiceRole.entities.UserProfile.update(profile.id, update);

    console.log(`Subscription updated: userId=${userId} plan=${update.plan_type || plan} status=${status}`);
    return Response.json({ received: true, status, plan: update.plan_type || plan });
  } catch (error) {
    console.error("stripe-webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}