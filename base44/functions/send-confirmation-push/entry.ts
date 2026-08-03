import { secrets } from 'base44:runtime';
import { sendWebPush } from '../../shared/webPush.ts';
import { getVapidConfig } from '../../shared/reminderHelpers.ts';

// Sends a one-time confirmation push right after a user enables
// push notifications and a new subscription is created. The "fire once"
// logic is handled by the frontend (only calls this when isNew === true).

export default async function(req) {
  try {
    const body = await req.json();
    const subscription = body.subscription;

    if (!subscription || !subscription.endpoint) {
      return Response.json({ success: false, error: 'No subscription provided' }, { status: 400 });
    }

    const vapidConfig = getVapidConfig(secrets);
    if (!vapidConfig) {
      console.error('VAPID keys not configured');
      return Response.json({ success: false, error: 'VAPID keys not configured' });
    }

    const payload = JSON.stringify({
      title: 'Notifications On',
      body: "You're all set — we'll send you a gentle nudge when it's shot time.",
    });

    const result = await sendWebPush(subscription, payload, vapidConfig.publicKey, vapidConfig.privateKey, vapidConfig.subject);

    if (result.success) {
      console.log('Confirmation push sent, status:', result.statusCode);
      return Response.json({ success: true, statusCode: result.statusCode });
    } else {
      console.error('Confirmation push failed:', result.error);
      return Response.json({ success: false, error: result.error, statusCode: result.statusCode });
    }
  } catch (error) {
    console.error('send-confirmation-push error:', error.message, error.stack);
    return Response.json({ success: false, error: error.message });
  }
}