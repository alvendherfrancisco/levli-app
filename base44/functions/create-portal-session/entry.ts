import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

// PayMongo does not provide a self-serve customer portal like Stripe.
// For now, Restore simply reports whether an active subscription exists.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const userId = body.userId;
    if (!userId) {
      return Response.json({ error: "userId required" }, { status: 400 });
    }

    const profiles = await base44.asServiceRole.entities.UserProfile.filter({ created_by_id: userId });
    const profile = profiles[0];
    if (!profile || profile.subscription_status !== "active") {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    // No portal URL available for PayMongo one-time payments.
    return Response.json({ error: "No portal available" }, { status: 404 });
  } catch (error) {
    console.error("create-portal-session error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}