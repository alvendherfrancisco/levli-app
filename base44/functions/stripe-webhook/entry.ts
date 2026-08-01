import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import Stripe from 'npm:stripe';
import { secrets } from 'base44:runtime';
import { planTypeForPrice } from "../../shared/stripeConfig.ts";

async function findProfileByUserId(base44, userId) {
  const list = await base44.asServiceRole.entities.UserProfile.filter({ created_by_id: userId });
  return list[0] || null;
}

async function findProfileByCustomer(base44, customerId) {
  const list = await base44.asServiceRole.entities.UserProfile.filter({ stripe_customer_id: customerId });
  return list[0] || null;
}

async function updateProfile(base44, profile, updates) {
  if (!profile) return null;
  return await base44.asServiceRole.entities.UserProfile.update(profile.id, updates);
}

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const stripe = new Stripe(secrets.get("STRIPE_SECRET_KEY"));

    const sig = req.headers.get("stripe-signature") || "";
    const raw = await req.text();
    let event;
    try {
      event = await stripe.webhooks.constructEventAsync(
        raw,
        sig,
        secrets.get("STRIPE_WEBHOOK_SECRET")
      );
    } catch (err) {
      console.error("Stripe signature verification failed:", err.message);
      return Response.json({ error: "Invalid signature" }, { status: 400 });
    }

    switch (event.type) {
      case "checkout.session.completed": {
        const sess = event.data.object;
        const userId = sess.metadata?.user_id || sess.client_reference_id;
        const customerId = sess.customer;
        let profile = userId ? await findProfileByUserId(base44, userId) : null;
        if (!profile && customerId) profile = await findProfileByCustomer(base44, customerId);

        if (!profile) {
          console.error("No UserProfile found for checkout", userId, customerId);
          break;
        }

        if (sess.mode === "payment") {
          // Lifetime — one-time purchase
          await updateProfile(base44, profile, {
            plan_type: "lifetime",
            subscription_status: "active",
            premium_until: null,
            stripe_customer_id: customerId || profile.stripe_customer_id,
            stripe_subscription_id: null,
          });
        } else {
          // Subscription — fetch the subscription to read status + price
          const subId = sess.subscription;
          let planType = "monthly";
          let status = "active";
          if (subId) {
            try {
              const sub = await stripe.subscriptions.retrieve(subId);
              status = sub.status;
              const priceId = sub.items?.data?.[0]?.price?.id;
              const mapped = planTypeForPrice(priceId);
              if (mapped) planType = mapped;
            } catch (e) {
              console.error("subscription retrieve failed:", e.message);
            }
          }
          await updateProfile(base44, profile, {
            plan_type: planType,
            subscription_status: status,
            stripe_customer_id: customerId || profile.stripe_customer_id,
            stripe_subscription_id: subId || null,
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object;
        const profile = await findProfileByCustomer(base44, sub.customer);
        if (profile) {
          const priceId = sub.items?.data?.[0]?.price?.id;
          const mapped = planTypeForPrice(priceId);
          await updateProfile(base44, profile, {
            subscription_status: sub.status,
            plan_type: mapped || profile.plan_type,
            stripe_subscription_id: sub.id,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object;
        const profile = await findProfileByCustomer(base44, sub.customer);
        if (profile) {
          await updateProfile(base44, profile, {
            subscription_status: "canceled",
            plan_type: "free",
            stripe_subscription_id: null,
          });
        }
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object;
        const profile = await findProfileByCustomer(base44, invoice.customer);
        if (profile) {
          await updateProfile(base44, profile, { subscription_status: "past_due" });
        }
        break;
      }

      default:
        break;
    }

    return Response.json({ received: true });
  } catch (error) {
    console.error("stripe-webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}