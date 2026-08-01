import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// Verifies a PayMongo payment for a user and grants premium if a paid payment
// is found. Used as a fallback to the webhook (e.g. when the webhook URL was
// misconfigured) and to recover already-completed payments. Scans recent
// payments for one whose metadata matches the userId with a valid plan.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const userId = body.userId;
    if (!userId) return Response.json({ error: "userId required" }, { status: 400 });

    const secretKey = secrets.get("PAYMONGO_SECRET_KEY");
    if (!secretKey) return Response.json({ error: "Payment not configured" }, { status: 500 });

    const auth = `Basic ${btoa(`${secretKey}:`)}`;
    const res = await fetch(`https://api.paymongo.com/v1/payments?limit=100`, {
      headers: { Authorization: auth },
    });
    const json = await res.json();
    const payments = json.data || [];

    const validPlans = ["monthly", "yearly", "lifetime"];
    const match = payments.find((p) => {
      const md = p.attributes?.metadata || {};
      return p.attributes?.status === "paid" && md.user_id === userId && validPlans.includes(md.plan);
    });

    if (!match) return Response.json({ paid: false, reason: "no paid payment found" });

    const plan = match.attributes.metadata.plan;
    const profiles = await base44.asServiceRole.entities.UserProfile.filter({ created_by_id: userId });
    const profile = profiles[0];
    if (!profile) return Response.json({ paid: true, granted: false, reason: "no profile" });

    await base44.asServiceRole.entities.UserProfile.update(profile.id, {
      plan_type: plan,
      subscription_status: "active",
      premium_until: null,
    });

    console.log(`Premium granted via verify-payment: userId=${userId} plan=${plan}`);
    return Response.json({ paid: true, granted: true, plan });
  } catch (error) {
    console.error("verify-payment error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}