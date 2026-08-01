import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe';
import { secrets } from 'base44:runtime';

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
    if (!profile || !profile.stripe_customer_id) {
      return Response.json({ error: "No subscription found" }, { status: 404 });
    }

    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));
    const origin = new URL(req.url).origin;
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${origin}/`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("create-portal-session error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}