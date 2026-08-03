// Native Web Push implementation using Web Crypto API and fetch.
// Replaces the web-push npm library which has Node.js HTTP compatibility
// issues in the Deno runtime (garbled response status codes).

function base64UrlDecode(str: string): Uint8Array {
  const padding = '='.repeat((4 - str.length % 4) % 4);
  const base64 = (str + padding).replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Web Crypto ECDSA produces DER-encoded signatures; JWT needs raw r||s (64 bytes).
function ecdsaDerToRaw(der: Uint8Array): Uint8Array {
  // Deno's Web Crypto may return raw r||s (64 bytes) or DER-encoded signature.
  // Handle both formats.
  if (der.length === 64 && der[0] !== 0x30) {
    return der; // Already raw r||s
  }
  const raw = new Uint8Array(64);
  let p = 1; // skip 0x30 (SEQUENCE tag)
  if (der[p] & 0x80) {
    p += 1 + (der[p] & 0x7f); // multi-byte length
  } else {
    p += 1; // single-byte length
  }
  if (der[p++] !== 0x02) throw new Error('Invalid DER: expected INTEGER for r');
  const rLen = der[p++];
  let rOff = p;
  while (rOff < p + rLen && der[rOff] === 0) rOff++;
  const rBytes = der.subarray(rOff, p + rLen);
  raw.set(rBytes, 32 - rBytes.length);
  p += rLen;
  if (der[p++] !== 0x02) throw new Error('Expected INTEGER for s');
  const sLen = der[p++];
  let sOff = p;
  while (sOff < p + sLen && der[sOff] === 0) sOff++;
  const sBytes = der.subarray(sOff, p + sLen);
  raw.set(sBytes, 64 - sBytes.length);
  return raw;
}

async function importVapidPrivateKey(pubKeyB64: string, privKeyB64: string): Promise<CryptoKey> {
  const pubBytes = base64UrlDecode(pubKeyB64);
  const x = pubBytes.slice(1, 33);
  const y = pubBytes.slice(33, 65);
  return crypto.subtle.importKey(
    'jwk',
    { kty: 'EC', crv: 'P-256', d: privKeyB64, x: base64UrlEncode(x), y: base64UrlEncode(y) },
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign']
  );
}

async function createVapidJwt(endpoint: string, subject: string, pubKeyB64: string, privKey: CryptoKey): Promise<string> {
  const url = new URL(endpoint);
  const aud = `${url.protocol}//${url.host}`;
  const exp = Math.floor(Date.now() / 1000) + 12 * 3600;
  const enc = new TextEncoder();
  const headerB64 = base64UrlEncode(enc.encode(JSON.stringify({ typ: 'JWT', alg: 'ES256' })));
  const payloadB64 = base64UrlEncode(enc.encode(JSON.stringify({ aud, exp, sub: subject })));
  const signingInput = `${headerB64}.${payloadB64}`;
  const derSig = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privKey, enc.encode(signingInput));
  const rawSig = ecdsaDerToRaw(new Uint8Array(derSig));
  return `${signingInput}.${base64UrlEncode(rawSig)}`;
}

async function hkdfExtract(salt: Uint8Array, ikm: Uint8Array): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', salt, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, ikm));
}

async function hkdfExpand(prk: Uint8Array, info: Uint8Array, length: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', prk, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const n = Math.ceil(length / 32);
  let t = new Uint8Array(0);
  let okm = new Uint8Array(0);
  for (let i = 1; i <= n; i++) {
    const input = new Uint8Array(t.length + info.length + 1);
    input.set(t, 0);
    input.set(info, t.length);
    input[t.length + info.length] = i;
    t = new Uint8Array(await crypto.subtle.sign('HMAC', key, input));
    const newOkm = new Uint8Array(okm.length + t.length);
    newOkm.set(okm, 0);
    newOkm.set(t, okm.length);
    okm = newOkm;
  }
  return okm.slice(0, length);
}

// RFC 8291: key_info = "WebPush: info" || 0x00 || ua_public || as_public
function buildKeyInfo(uaPublic: Uint8Array, asPublic: Uint8Array): Uint8Array {
  const enc = new TextEncoder();
  const label = enc.encode('WebPush: info');
  const info = new Uint8Array(label.length + 1 + uaPublic.length + asPublic.length);
  let o = 0;
  info.set(label, o); o += label.length;
  info[o++] = 0;
  info.set(uaPublic, o); o += uaPublic.length;
  info.set(asPublic, o);
  return info;
}

// RFC 8188: info = label || 0x00
function buildRfc8188Info(label: string): Uint8Array {
  const enc = new TextEncoder();
  const labelBytes = enc.encode(label);
  const info = new Uint8Array(labelBytes.length + 1);
  info.set(labelBytes, 0);
  info[labelBytes.length] = 0;
  return info;
}

// RFC 8291 + RFC 8188 aes128g2 content encryption
async function encryptPayload(payload: string, sub: { keys: { p256dh: string; auth: string } }): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const plaintext = enc.encode(payload);

  // Ephemeral ECDH key pair
  const ecdhKeys = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, ['deriveBits']);
  const epub = new Uint8Array(await crypto.subtle.exportKey('raw', ecdhKeys.publicKey));

  // Import receiver's p256dh public key
  const p256dhBytes = base64UrlDecode(sub.keys.p256dh);
  const p256dhKey = await crypto.subtle.importKey('raw', p256dhBytes, { name: 'ECDH', namedCurve: 'P-256' }, false, []);

  // Shared secret
  const sharedSecret = new Uint8Array(await crypto.subtle.deriveBits({ name: 'ECDH', public: p256dhKey }, ecdhKeys.privateKey, 256));

  // RFC 8291: IKM' = HKDF(salt=auth_secret, IKM=shared_secret, info=key_info, L=32)
  const authSecret = base64UrlDecode(sub.keys.auth);
  const prk1 = await hkdfExtract(authSecret, sharedSecret);
  const ikm = await hkdfExpand(prk1, buildKeyInfo(p256dhBytes, epub), 32);

  // RFC 8188: PRK' = HKDF-Extract(salt=random_salt, IKM=IKM')
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const prk = await hkdfExtract(salt, ikm);

  // RFC 8188: CEK = HKDF-Expand(PRK', info="Content-Encoding: aes128gcm"||0x00, L=16)
  const cek = await hkdfExpand(prk, buildRfc8188Info('Content-Encoding: aes128gcm'), 16);

  // RFC 8188: nonce = HKDF-Expand(PRK', info="Content-Encoding: nonce"||0x00, L=12)
  const nonce = await hkdfExpand(prk, buildRfc8188Info('Content-Encoding: nonce'), 12);

  // Pad: plaintext || 0x02 (last-record delimiter)
  const padded = new Uint8Array(plaintext.length + 1);
  padded.set(plaintext, 0);
  padded[plaintext.length] = 0x02;

  // AES-128-GCM encrypt
  const cekKey = await crypto.subtle.importKey('raw', cek, { name: 'AES-GCM' }, false, ['encrypt']);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv: nonce, tagLength: 128 }, cekKey, padded));

  // Header: salt(16) || rs(4, big-endian) || idlen(1) || epub(65)
  const header = new Uint8Array(16 + 4 + 1 + 65);
  header.set(salt, 0);
  new DataView(header.buffer, 16, 4).setUint32(0, 4096, false);
  header[20] = 65;
  header.set(epub, 21);

  const result = new Uint8Array(header.length + ciphertext.length);
  result.set(header, 0);
  result.set(ciphertext, header.length);
  return result;
}

export async function sendWebPush(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: string,
  vapidPublicKey: string,
  vapidPrivateKey: string,
  vapidSubject: string
): Promise<{ success: boolean; statusCode?: number; error?: string }> {
  // Step 1: Import VAPID private key
  let vapidKey: CryptoKey;
  try {
    vapidKey = await importVapidPrivateKey(vapidPublicKey, vapidPrivateKey);
  } catch (e) {
    return { success: false, error: `[Step 1: import VAPID key] ${e.message}` };
  }

  // Step 2: Create VAPID JWT
  let vapidJwt: string;
  try {
    vapidJwt = await createVapidJwt(subscription.endpoint, vapidSubject, vapidPublicKey, vapidKey);
  } catch (e) {
    return { success: false, error: `[Step 2: create VAPID JWT] ${e.message}` };
  }

  // Step 3: Encrypt payload (RFC 8291 aes128g2)
  let encrypted: Uint8Array;
  try {
    if (!subscription.keys?.p256dh || !subscription.keys?.auth) {
      throw new Error(`Subscription missing keys — p256dh present: ${!!subscription.keys?.p256dh}, auth present: ${!!subscription.keys?.auth}`);
    }
    encrypted = await encryptPayload(payload, subscription);
  } catch (e) {
    return { success: false, error: `[Step 3: encrypt payload] ${e.message}` };
  }

  // Step 4: Send to push service endpoint
  let response: Response;
  try {
    response = await fetch(subscription.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `vapid t=${vapidJwt},k=${vapidPublicKey}`,
        'Content-Encoding': 'aes128gcm',
        'Content-Type': 'application/octet-stream',
        'TTL': '86400',
      },
      body: encrypted,
    });
  } catch (e) {
    return { success: false, error: `[Step 4: fetch to push endpoint] ${e.message}` };
  }

  if (response.status === 201 || response.status === 202) {
    return { success: true, statusCode: response.status };
  }
  const errorText = await response.text();
  return { success: false, statusCode: response.status, error: `[Step 4: push service response] Push service returned ${response.status}: ${errorText}` };
}