const rawKey =
  import.meta.env.VITE_RAZORPAY_KEY_ID ||
  import.meta.env.VITE_RAZORPAY_KEY ||
  '';

export const RAZORPAY_KEY_ID = typeof rawKey === 'string' ? rawKey.trim() : '';
export const RAZORPAY_TEST_KEY_ID = RAZORPAY_KEY_ID;

export function getRazorpayKeyId(): string {
  return RAZORPAY_KEY_ID;
}

export type RazorpayOptions = {
  amount: number; // in INR rupees (multiplied by 100 for paise)
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

export async function openRazorpayPayment(options: RazorpayOptions): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded || !window.Razorpay) {
    throw new Error('Could not load Razorpay payment gateway. Please check your internet connection.');
  }

  const rzp = new window.Razorpay({
    key: RAZORPAY_TEST_KEY_ID,
    amount: Math.round(options.amount * 100), // paise
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
  });

  rzp.open();
}
