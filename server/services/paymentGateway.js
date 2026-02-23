function getRazorpayAuthHeader() {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64');
  return `Basic ${auth}`;
}

let stripeClientPromise = null;

async function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Stripe secret key is missing');
  }

  if (!stripeClientPromise) {
    stripeClientPromise = import('stripe').then((module) => new module.default(process.env.STRIPE_SECRET_KEY));
  }

  return stripeClientPromise;
}

export function isRazorpayConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export async function createRazorpayOrder({ amount, currency, receipt, notes }) {
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getRazorpayAuthHeader(),
    },
    body: JSON.stringify({ amount, currency, receipt, notes }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.description || 'Razorpay order creation failed');
  }

  return response.json();
}

export async function createRazorpayRefund({ paymentId, amount }) {
  const response = await fetch(`https://api.razorpay.com/v1/payments/${paymentId}/refund`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getRazorpayAuthHeader(),
    },
    body: JSON.stringify({ amount }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error?.description || 'Razorpay refund failed');
  }

  return response.json();
}

export async function createStripeCheckoutSession({
  paymentId,
  amount,
  currency,
  payerEmail,
  payerName,
  tripName,
  successUrl,
  cancelUrl,
  metadata,
}) {
  const stripe = await getStripeClient();
  return stripe.checkout.sessions.create({
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
    customer_email: payerEmail,
    client_reference_id: String(paymentId),
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: currency.toLowerCase(),
          unit_amount: Math.round(amount * 100),
          product_data: {
            name: tripName || 'Qarwaan Travel Booking',
          },
        },
      },
    ],
    payment_intent_data: {
      receipt_email: payerEmail,
      metadata: {
        payerName,
        ...metadata,
      },
    },
    metadata: {
      paymentId: String(paymentId),
      ...metadata,
    },
  });
}

export async function retrieveStripeCheckoutSession(sessionId) {
  const stripe = await getStripeClient();
  return stripe.checkout.sessions.retrieve(sessionId, { expand: ['payment_intent'] });
}

export async function createStripeRefund({ paymentIntentId, amount }) {
  const stripe = await getStripeClient();
  return stripe.refunds.create({
    payment_intent: paymentIntentId,
    amount: Math.round(amount * 100),
  });
}

export async function constructStripeWebhookEvent({ payload, signature }) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('Stripe webhook secret is missing');
  }

  const stripe = await getStripeClient();
  return stripe.webhooks.constructEvent(payload, signature, process.env.STRIPE_WEBHOOK_SECRET);
}
