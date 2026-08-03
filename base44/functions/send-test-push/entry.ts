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

    // Log what we received for debugging
    console.log('send-test-push called');
    console.log('  endpoint:', subscription.endpoint);
    console.log('  keys.p256dh present:', !!subscription.keys?.p256dh, 'length:', subscription.keys?.p256dh?.length);
    console.log('  keys.auth present:', !!subscription.keys?.auth, 'length:', subscription.keys?.auth?.length);
    console.log('  VAPID_PUBLIC_KEY present:', !!publicKey, 'length:', publicKey?.length);
    console.log('  VAPID_PRIVATE_KEY present:', !!privateKey, 'length:', privateKey?.length);
    console.log('  VAPID_SUBJECT:', subject);

    const payload = JSON.stringify({ title, body: messageBody });
    const result = await sendWebPush(subscription, payload, publicKey, privateKey, subject);

    if (result.success) {
      console.log('Push sent, status:', result.statusCode);
      return Response.json({ success: true, statusCode: result.statusCode });
    } else {
      console.error('Push failed:', result.error);
      // Return the full error text + status code so the client can see exactly which step failed
      return Response.json({
        success: false,
        error: result.error,
        statusCode: result.statusCode,
        debug: {
          endpoint: subscription.endpoint,
          hasP256dh: !!subscription.keys?.p256dh,
          hasAuth: !!subscription.keys?.auth,
          vapidPublicKeyLength: publicKey?.length,
          vapidPrivateKeyLength: privateKey?.length,
        }
      }, { status: 500 });
    }
  } catch (error) {
    console.error('send-test-push UNCAUGHT error:', error.message, error.stack);
    // Return full error + stack trace in the response body for debugging
    return Response.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 });
  }
}