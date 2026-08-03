import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Verifies a Stripe subscription/payment for a user and grants premium if an
// active or trialing subscription (or a paid one-time lifetime checkout) is
// found. Used as a fallback to the webhook and for "Restore Purchase".
const PRICE_TO_PLAN = {
  "price_1TzbX7Q5PgCgpmBFgg8njxI7": "monthly",
  "price_1TzbX7Q5PgCgpmBFNjXlnGzD": "yearly",
  "price_1TzbX7Q5PgCgpmBFbxFVgzXy": "lifetime",
};

function planFromSubscription(sub) {
  const item = sub.items?.data?.[0];
  const priceId = item?.price?.id;
  return PRICE_TO_PLAN[priceId] || sub.metadata?.plan || "";
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const userId = body.userId;
    if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

    const secretKey = secrets.get("STRIPE_SECRET_KEY");
    if (!secretKey) return Response.json({ error: "Payment not configured" }, { status: 500 });

    const auth = `Bearer ${secretKey}`;

    // 1. Check for an active/trialing subscription with this userId in metadata.
    const subRes = await fetch("https://api.stripe.com/v1/subscriptions?limit=100&status=all", {
      headers: { Authorization: auth },
    });
    const subJson = await subRes.json();
    const subMatch = (subJson.data || []).find((s) =>
      s.metadata?.user_id === userId && ["active", "trialing"].includes(s.status)
    );

    let plan = "";
    let status = "";

    if (subMatch) {
      plan = planFromSubscription(subMatch);
      status = subMatch.status === "trialing" ? "trialing" : "active";
    } else {
      // 2. Check for a paid one-time (lifetime) checkout session.
      const sessRes = await fetch("https://api.stripe.com/v1/checkout/sessions?limit=100", {
        headers: { Authorization: auth },
      });
      const sessJson = await sessRes.json();
      const sessMatch = (sessJson.data || []).find((s) =>
        s.metadata?.user_id === userId && s.payment_status === "paid" && s.mode === "payment"
      );
      if (sessMatch) {
        plan = sessMatch.metadata?.plan || "lifetime";
        status = "active";
      }
    }

    if (!plan) {
      return Response.json({ paid: false, granted: false, reason: "no active subscription found" });
    }

    const profiles = await base44.asServiceRole.entities.UserProfile.filter({ created_by_id: userId });
    const profile = profiles[0];
    if (!profile) return Response.json({ paid: true, granted: false, reason: "no profile" });

    const validPlans = ["monthly", "yearly", "lifetime"];
    const planType = validPlans.includes(plan) ? plan : "lifetime";

    await base44.asServiceRole.entities.UserProfile.update(profile.id, {
      plan_type: planType,
      subscription_status: status,
      premium_until: null,
    });

    console.log(`Premium granted via verify-payment: userId=${userId} plan=${planType}`);
    return Response.json({ paid: true, granted: true, plan: planType });
  } catch (error) {
    console.error("verify-payment error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}