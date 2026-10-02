interface Window {
  Razorpay: new (options: {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description?: string;
    image?: string;
    prefill?: {
      name?: string;
      email?: string;
      contact?: string;
    };
    notes?: Record<string, string>;
    theme?: {
      color?: string;
    };
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) => void;
    modal?: {
      ondismiss?: () => void;
      escape?: boolean;
      backdropclose?: boolean;
    };
  }) => { open: () => void };
}
