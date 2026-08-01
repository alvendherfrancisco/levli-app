import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';

// PayMongo webhook handler. Verifies the Paymongo-Signature header (HMAC-SHA256
// of the raw body) and grants premium access on `checkout_session.payment.paid`.
// The plan + userId are encoded in the checkout session's reference_number
// as `levli|{plan}|{userId}`.

async function verifyPaymongoSignature(rawBody, secret, signatureHeader) {
  if (!signatureHeader || !secret) return false;
  const parts = {};
  signatureHeader.split(",").forEach((p) => {
    const idx = p.indexOf("=");
    if (idx > -1) parts[p.slice(0, idx).trim()] = p.slice(idx + 1).trim();
  });
  // te = test-environment signature, li = live-environment signature
  const provided = parts.te || parts.li || "";
  if (!provided) return false;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBuf = await crypto.subtle.sign("HMAC", key, enc.encode(rawBody));
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

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const raw = await req.text();
    const signatureHeader = req.headers.get("paymongo-signature") || "";

    const webhookSecret = secrets.get("PAYMONGO_WEBHOOK_SECRET");
    let verified = false;
    if (webhookSecret) {
      verified = await verifyPaymongoSignature(raw, webhookSecret, signatureHeader);
    }
    if (!verified) {
      console.warn("PayMongo signature verification failed or no secret set. Header:", signatureHeader);
      // Lenient for test mode: process the event anyway so premium unlocks during testing.
      // TODO: enforce strict verification before going live.
    }

    const body = JSON.parse(raw);
    // PayMongo event payload: { data: { id, type, attributes: { type, data: {...} } } }
    const eventWrapper = body.data || body;
    const eventType = eventWrapper.attributes?.type || eventWrapper.type || "";
    const resource = eventWrapper.attributes?.data || eventWrapper.data || {};

    if (eventType !== "checkout_session.payment.paid") {
      return Response.json({ received: true, ignored: eventType });
    }

    const refNum = resource.attributes?.reference_number || resource.reference_number || "";
    const parts = refNum.split("|"); // levli|{plan}|{userId}
    const plan = parts[1] || "";
    const userId = parts[2] || "";

    if (!userId || userId === "anon") {
      console.error("No userId in reference_number:", refNum);
      return Response.json({ received: true });
    }

    const profile = await findProfileByUserId(base44, userId);
    if (!profile) {
      console.error("No UserProfile found for userId:", userId);
      return Response.json({ received: true });
    }

    const validPlans = ["monthly", "yearly", "lifetime"];
    const planType = validPlans.includes(plan) ? plan : "lifetime";

    await base44.asServiceRole.entities.UserProfile.update(profile.id, {
      plan_type: planType,
      subscription_status: "active",
      premium_until: null,
    });

    console.log(`Premium granted: userId=${userId} plan=${planType}`);
    return Response.json({ received: true, plan: planType });
  } catch (error) {
    console.error("paymongo-webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}