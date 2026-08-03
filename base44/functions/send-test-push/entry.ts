import { secrets } from 'base44:runtime';
import { sendWebPush } from '../../shared/webPush.ts';

// Sends a test web push notification to a single PushSubscription object
// passed from the frontend. Uses VAPID keys from app secrets.
// Uses a native Deno implementation (Web Crypto + fetch) instead of the
// web-push npm library, which has Node.js HTTP compatibility issues in Deno.

export default async function(req) {
  try {
    const body = await req.json();
    const subscription = body.subscription;
    const title = body.title || 'Levli';
    const messageBody = body.body || 'Test push notification';

    if (!subscription || !subscription.endpoint) {
      return Response.json({ success: false, error: 'No subscription provided' }, { status: 400 });
    }

    const publicKey = secrets.get('VAPID_PUBLIC_KEY');
    const privateKey = secrets.get('VAPID_PRIVATE_KEY');
    const subject = secrets.get('VAPID_SUBJECT') || 'mailto:alvendherfrancisco01@gmail.com';

    if (!publicKey || !privateKey) {
      console.error('VAPID keys not configured');
      return Response.json({ success: false, error: 'VAPID keys not configured' }, { status: 500 });
    }

    const payload = JSON.stringify({ title, body: messageBody });
    const result = await sendWebPush(subscription, payload, publicKey, privateKey, subject);

    if (result.success) {
      console.log('Push sent, status:', result.statusCode);
      return Response.json({ success: true, statusCode: result.statusCode });
    } else {
      console.error('Push failed:', result.error);
      return Response.json({ success: false, error: result.error, statusCode: result.statusCode }, { status: 500 });
    }
  } catch (error) {
    console.error('send-test-push error:', error.message, error.stack);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}