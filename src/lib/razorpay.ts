const rawKey =
  import.meta.env.VITE_RAZORPAY_KEY_ID ||
  import.meta.env.VITE_RAZORPAY_KEY ||
  '';

export const RAZORPAY_KEY_ID = typeof rawKey === 'string' ? rawKey.trim() : '';

export function getRazorpayKeyId(): string {
  return RAZORPAY_KEY_ID;
}

export type RazorpayOptions = {
  amount: number; // in INR rupees
  name?: string;
  description?: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => Promise<void> | void;
  onDismiss?: () => void;
};

export async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window !== 'undefined' && window.Razorpay) {
    return true;
  }
  return new Promise((resolve) => {
    const existingScript = document.querySelector('script[src="https://checkout.razorpay.com/v1/checkout.js"]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Server-side Razorpay order creation
 */
export async function createServerRazorpayOrder(amount: number, notes?: Record<string, string>): Promise<{
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
}> {
  try {
    const response = await fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        notes,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.warn('Server order creation warning:', err);
      return {};
    }

    return await response.json();
  } catch (error) {
    console.warn('Could not contact /api/razorpay/create-order:', error);
    return {};
  }
}

/**
 * Server-side Razorpay signature verification
 */
export async function verifyServerRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<boolean> {
  try {
    const response = await fetch('/api/razorpay/verify-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) return false;
    const data = await response.json();
    return Boolean(data.verified);
  } catch {
    return false;
  }
}

export async function openRazorpayPayment(options: RazorpayOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
  }

  // 1. Attempt server-side order creation
  const serverOrder = await createServerRazorpayOrder(options.amount, options.notes);
  const activeKeyId = serverOrder.keyId || RAZORPAY_KEY_ID;

  if (!activeKeyId) {
    throw new Error('Razorpay Key ID is missing. Please configure VITE_RAZORPAY_KEY_ID.');
  }

  const paymentConfig: any = {
    key: activeKeyId,
    amount: Math.round(options.amount * 100), // in paise (e.g. ₹349 -> 34900)
    currency: 'INR',
    name: options.name || 'My Gardener',
    description: options.description || 'Botanical care and garden essentials',
    image: '/logo.jpg',
    prefill: options.prefill,
    notes: options.notes,
    theme: {
      color: '#102c20', // deep botanical green matching My Gardener
    },
    handler: async (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) => {
      // If server-side order and signature exist, verify on backend
      if (response.razorpay_order_id && response.razorpay_signature) {
        await verifyServerRazorpayPayment({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        });
      }
      await options.onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) {
          options.onDismiss();
        }
      },
      escape: true,
      backdropclose: false,
    },
  };

  // If server-generated order ID is present, attach it to the checkout options
  if (serverOrder.orderId) {
    paymentConfig.order_id = serverOrder.orderId;
  }

  const rzp = new window.Razorpay(paymentConfig);
  rzp.open();
}
