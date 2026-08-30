/**
 * Razorpay Standard Web Checkout Integration Helper
 */

export interface RazorpayOrderResponse {
  success: boolean;
  order_id: string;
  id: string;
  amount: number; // in paise
  currency: string;
  receipt?: string;
  key_id?: string;
  error?: string;
}

export interface RazorpayVerificationResponse {
  success: boolean;
  message?: string;
  payment_id?: string;
  order_id?: string;
  record?: any;
  error?: string;
}

export interface RazorpayCheckoutParams {
  amountInRupees: number;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  onSuccess: (verifyResult: RazorpayVerificationResponse) => void;
  onError: (errorMessage: string) => void;
  onDismiss?: () => void;
}

// Ensure Razorpay SDK is loaded
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if ((window as any).Razorpay) return resolve(true);

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

// STEP 1: Call Backend to Create Razorpay Order
export async function createRazorpayOrder(amountInRupees: number, planName: string, customerDetails: { name: string; email: string; phone: string }): Promise<RazorpayOrderResponse> {
  // Convert rupees to paise (1 INR = 100 paise)
  const amountInPaise = Math.round(amountInRupees * 100);

  const res = await fetch('/api/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: 'INR',
      receipt: `ci_${Date.now().toString().slice(-8)}`,
      notes: {
        plan: planName,
        name: customerDetails.name,
        email: customerDetails.email,
        phone: customerDetails.phone
      }
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Failed to create Razorpay payment order');
  }

  return data;
}

// STEP 3: Call Backend to Verify HMAC Signature
export async function verifyRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  amountInRupees: number;
  planName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
}): Promise<RazorpayVerificationResponse> {
  const res = await fetch('/api/verify-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      razorpay_order_id: payload.razorpay_order_id,
      razorpay_payment_id: payload.razorpay_payment_id,
      razorpay_signature: payload.razorpay_signature,
      amount: Math.round(payload.amountInRupees * 100),
      planName: payload.planName,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone
    })
  });

  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.error || 'Payment signature verification failed');
  }

  return data;
}

// STEP 2: Open Standard Razorpay Checkout Modal
export async function openRazorpayCheckout(params: RazorpayCheckoutParams): Promise<void> {
  try {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded || !(window as any).Razorpay) {
      throw new Error('Could not load Razorpay SDK. Please check your internet connection and try again.');
    }

    // Step 1: Create Order on Backend
    const orderData = await createRazorpayOrder(params.amountInRupees, params.planName, {
      name: params.customerName,
      email: params.customerEmail,
      phone: params.customerPhone
    });

    const keyId = orderData.key_id || (import.meta as any).env?.VITE_RAZORPAY_KEY_ID || 'rzp_test_TQnz7wS1bm4u4P';

    const options = {
      key: keyId,
      amount: orderData.amount, // in paise
      currency: orderData.currency || 'INR',
      name: 'CodeInIndia',
      description: `Enrollment: ${params.planName}`,
      image: 'https://codeinindia.in/favicon.ico',
      order_id: orderData.order_id,
      prefill: {
        name: params.customerName || '',
        email: params.customerEmail || '',
        contact: params.customerPhone || ''
      },
      notes: {
        plan: params.planName,
        cohort: 'Next Live Batch'
      },
      theme: {
        color: '#0D5A50', // Peacock theme color
        backdrop_color: '#091A17'
      },
      modal: {
        ondismiss: () => {
          if (params.onDismiss) {
            params.onDismiss();
          }
        },
        escape: true,
        backdropclose: false
      },
      handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
        try {
          // Step 3: Verify Payment on Backend
          const verifyResult = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            amountInRupees: params.amountInRupees,
            planName: params.planName,
            customerName: params.customerName,
            customerEmail: params.customerEmail,
            customerPhone: params.customerPhone
          });

          params.onSuccess(verifyResult);
        } catch (verifyErr: any) {
          console.error('Payment verification failed:', verifyErr);
          params.onError(verifyErr.message || 'Payment verification failed');
        }
      }
    };

    const rzp = new (window as any).Razorpay(options);

    rzp.on('payment.failed', (response: any) => {
      console.error('Razorpay payment failed event:', response.error);
      const errMsg = response.error?.description || response.error?.reason || 'Payment failed or was cancelled by user';
      params.onError(errMsg);
    });

    rzp.open();
  } catch (err: any) {
    console.error('Razorpay Checkout Init Error:', err);
    params.onError(err.message || 'Failed to initialize payment checkout');
  }
}
