import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';
import { secrets } from 'base44:runtime';
import { sendWebPush } from '../../shared/webPush.ts';

// Called by a scheduled workflow once daily. Fetches all stored push
// subscriptions and sends a medication reminder to each. Uses the
// service role to read across all users (bypasses RLS).

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const publicKey = secrets.get('VAPID_PUBLIC_KEY');
    const privateKey = secrets.get('VAPID_PRIVATE_KEY');
    const subject = secrets.get('VAPID_SUBJECT') || 'mailto:alvendherfrancisco01@gmail.com';

    if (!publicKey || !privateKey) {
      console.error('VAPID keys not configured');
      return Response.json({ success: false, error: 'VAPID keys not configured' }, { status: 500 });
    }

    const subscriptions = await base44.asServiceRole.entities.PushSubscription.list();
    console.log(`Found ${subscriptions.length} push subscriptions`);

    let sent = 0;
    let failed = 0;

    for (const sub of subscriptions) {
      const subscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
      };

      const payload = JSON.stringify({
        title: 'Levli Reminder',
        body: "Don't forget to log your shot today! Stay consistent. 💪",
      });

      const result = await sendWebPush(subscription, payload, publicKey, privateKey, subject);
      if (result.success) {
        sent++;
      } else {
        console.error(`Failed for subscription ${sub.id}:`, result.error);
        failed++;
      }
    }

    console.log(`Daily reminders complete: ${sent} sent, ${failed} failed`);
    return Response.json({ success: true, sent, failed, total: subscriptions.length });
  } catch (error) {
    console.error('send-daily-reminders error:', error.message, error.stack);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}