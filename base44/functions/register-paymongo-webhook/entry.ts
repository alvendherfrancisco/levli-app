import { secrets } from 'base44:runtime';

// One-off helper: registers the PayMongo webhook endpoint and returns the
// signing secret. Delete this function after the secret is saved.
export default async function(req) {
  try {
    const secretKey = secrets.get("PAYMONGO_SECRET_KEY");
    if (!secretKey) return Response.json({ error: "PAYMONGO_SECRET_KEY not set" }, { status: 500 });

    const body = await req.json().catch(() => ({}));
    const origin = new URL(req.url).origin;
    const webhookUrl = body.webhookUrl || `${origin}/api/functions/stripe-webhook`;

    const response = await fetch("https://api.paymongo.com/v1/webhooks", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${btoa(`${secretKey}:`)}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: {
          attributes: {
            url: webhookUrl,
            events: ["checkout_session.payment.paid"],
          },
        },
      }),
    });

    const json = await response.json();
    console.log("Origin used:", origin);
    console.log("Webhook URL registered:", webhookUrl);
    console.log("Register response:", JSON.stringify(json));

    if (!response.ok || json.errors) {
      return Response.json({ error: json.errors?.[0]?.detail || "Registration failed", webhookUrl, origin }, { status: 500 });
    }

    const attrs = json.data?.attributes || {};
    const secret = attrs.secret_key || attrs.secret || "";
    return Response.json({
      webhookUrl,
      origin,
      webhookId: json.data?.id,
      secret,
    });
  } catch (error) {
    console.error("register-paymongo-webhook error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}