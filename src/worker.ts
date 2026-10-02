export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  RAZORPAY_KEY_ID?: string;
  RAZORPAY_KEY_SECRET?: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function createJsonResponse(data: any, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
}

async function hmacSha256Hex(secret: string, message: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const msgData = encoder.encode(message);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, msgData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS Preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Health / Diagnostics endpoint
    if (url.pathname === '/api/health') {
      return createJsonResponse({
        status: 'ok',
        service: 'biosphere-worker',
        hasRazorpayKeyId: Boolean(env.RAZORPAY_KEY_ID),
        hasRazorpaySecret: Boolean(env.RAZORPAY_KEY_SECRET),
        timestamp: new Date().toISOString(),
      });
    }

    // Razorpay Create Order Endpoint (Server-Side)
    if (url.pathname === '/api/razorpay/create-order' && request.method === 'POST') {
      try {
        const keyId = env.RAZORPAY_KEY_ID;
        const keySecret = env.RAZORPAY_KEY_SECRET;

        if (!keyId || !keySecret) {
          return createJsonResponse(
            { error: 'Razorpay credentials are not configured on the server.' },
            500
          );
        }

        const body: { amount: number; currency?: string; receipt?: string; notes?: Record<string, string> } =
          await request.json();

        if (!body.amount || body.amount <= 0) {
          return createJsonResponse({ error: 'Valid amount is required.' }, 400);
        }

        // Amount must be in paise (INR * 100)
        const amountInPaise = Math.round(body.amount * 100);
        const currency = body.currency || 'INR';
        const receipt = body.receipt || `mg_${Date.now()}`;

        const authHeader = 'Basic ' + btoa(`${keyId}:${keySecret}`);

        const rzpResponse = await fetch('https://api.razorpay.com/v1/orders', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: authHeader,
          },
          body: JSON.stringify({
            amount: amountInPaise,
            currency,
            receipt,
            notes: body.notes || {},
          }),
        });

        if (!rzpResponse.ok) {
          const errorData = await rzpResponse.text();
          return createJsonResponse(
            { error: `Razorpay order creation failed: ${errorData}` },
            rzpResponse.status
          );
        }

        const orderData: any = await rzpResponse.json();
        return createJsonResponse({
          orderId: orderData.id,
          amount: orderData.amount,
          currency: orderData.currency,
          keyId,
        });
      } catch (err: any) {
        return createJsonResponse({ error: err.message || 'Server error creating order.' }, 500);
      }
    }

    // Razorpay Verify Payment Signature Endpoint (Server-Side)
    if (url.pathname === '/api/razorpay/verify-payment' && request.method === 'POST') {
      try {
        const keySecret = env.RAZORPAY_KEY_SECRET;

        if (!keySecret) {
          return createJsonResponse(
            { error: 'Razorpay secret is not configured on the server.' },
            500
          );
        }

        const body: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        } = await request.json();

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
          return createJsonResponse({ error: 'Missing payment signature details.' }, 400);
        }

        const expectedSignature = await hmacSha256Hex(
          keySecret,
          `${razorpay_order_id}|${razorpay_payment_id}`
        );

        if (expectedSignature !== razorpay_signature) {
          return createJsonResponse({ verified: false, error: 'Invalid payment signature.' }, 400);
        }

        return createJsonResponse({ verified: true });
      } catch (err: any) {
        return createJsonResponse({ error: err.message || 'Server error verifying payment.' }, 500);
      }
    }

    // Fallback to static assets
    return env.ASSETS.fetch(request);
  },
};
