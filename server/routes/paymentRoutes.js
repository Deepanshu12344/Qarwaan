import crypto from 'crypto';
import express from 'express';
import { Booking } from '../models/Booking.js';
import { Payment } from '../models/Payment.js';
import { Trip } from '../models/Trip.js';
import { Refund } from '../models/Refund.js';
import {
  constructStripeWebhookEvent,
  createRazorpayOrder,
  createStripeCheckoutSession,
  isRazorpayConfigured,
  isStripeConfigured,
  retrieveStripeCheckoutSession,
} from '../services/paymentGateway.js';
import { buildInvoiceDocument, ensureInvoiceNumber } from '../services/invoiceService.js';
import { renderInvoicePdf } from '../services/invoicePdfService.js';

const router = express.Router();

function selectGateway(requestedGateway = 'auto') {
  if (requestedGateway === 'stripe' && isStripeConfigured()) return 'stripe';
  if (requestedGateway === 'razorpay' && isRazorpayConfigured()) return 'razorpay';
  if (requestedGateway === 'auto' && isStripeConfigured()) return 'stripe';
  if (requestedGateway === 'auto' && isRazorpayConfigured()) return 'razorpay';
  return 'mock';
}

async function markPaymentPaid(payment, updates = {}) {
  payment.status = 'paid';
  payment.paidAt = new Date();
  payment.invoiceNumber = ensureInvoiceNumber(payment);

  if (updates.gatewayOrderId) payment.gatewayOrderId = updates.gatewayOrderId;
  if (updates.gatewayPaymentId) payment.gatewayPaymentId = updates.gatewayPaymentId;
  if (updates.gatewaySignature) payment.gatewaySignature = updates.gatewaySignature;

  payment.metadata = {
    ...(payment.metadata || {}),
    reconciliation: {
      ...(payment.metadata?.reconciliation || {}),
      ...updates.reconciliation,
      updatedAt: new Date().toISOString(),
    },
  };

  await payment.save();

  if (payment.booking) {
    await Booking.findByIdAndUpdate(payment.booking, { bookingStatus: 'confirmed' });
  }
}

router.post('/create-order', async (request, response) => {
  try {
    const {
      bookingId,
      tripSlug,
      payerName,
      payerEmail,
      payerPhone,
      amount,
      currency = 'INR',
      gateway = 'auto',
    } = request.body;

    if (!payerName || !payerEmail || !payerPhone || !amount) {
      return response.status(400).json({ message: 'payerName, payerEmail, payerPhone and amount are required' });
    }
    const parsedAmount = Number(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      return response.status(400).json({ message: 'amount must be a positive number' });
    }

    let booking = null;
    let trip = null;

    if (bookingId) {
      booking = await Booking.findById(bookingId);
      if (booking) {
        trip = await Trip.findById(booking.trip);
      }
    }

    if (!trip && tripSlug) {
      trip = await Trip.findOne({ slug: tripSlug });
    }

    const selectedGateway = selectGateway(gateway);

    const payment = await Payment.create({
      booking: booking?._id,
      trip: trip?._id,
      payerName,
      payerEmail,
      payerPhone,
      amount: parsedAmount,
      currency,
      gateway: selectedGateway,
      status: 'created',
      metadata: {
        tripSlug,
      },
    });

    if (selectedGateway === 'stripe') {
      const baseClientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
      const redirectSlug = tripSlug || trip?.slug || 'trips';
      const successUrl = `${baseClientUrl}/trips/${redirectSlug}?payment=success&paymentId=${payment._id}`;
      const cancelUrl = `${baseClientUrl}/trips/${redirectSlug}?payment=cancelled&paymentId=${payment._id}`;

      const session = await createStripeCheckoutSession({
        paymentId: payment._id,
        amount: parsedAmount,
        currency,
        payerEmail,
        payerName,
        tripName: trip?.name,
        successUrl,
        cancelUrl,
        metadata: {
          paymentId: String(payment._id),
          tripSlug: tripSlug || '',
        },
      });

      payment.gatewayOrderId = session.id;
      await payment.save();

      return response.status(201).json({
        paymentId: payment._id,
        gateway: 'stripe',
        orderId: session.id,
        amount: Math.round(parsedAmount * 100),
        currency,
        checkoutUrl: session.url,
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
      });
    }

    if (selectedGateway === 'razorpay') {
      const order = await createRazorpayOrder({
        amount: Math.round(parsedAmount * 100),
        currency,
        receipt: `pay_${payment._id}`,
        notes: {
          paymentId: String(payment._id),
          tripSlug: tripSlug || '',
        },
      });

      payment.gatewayOrderId = order.id;
      await payment.save();

      return response.status(201).json({
        paymentId: payment._id,
        gateway: 'razorpay',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    }

    payment.gatewayOrderId = `mock_order_${payment._id}`;
    await payment.save();

    return response.status(201).json({
      paymentId: payment._id,
      gateway: 'mock',
      orderId: payment.gatewayOrderId,
      amount: Math.round(parsedAmount * 100),
      currency,
      keyId: '',
      message: 'No live gateway configured, created mock order for testing',
    });
  } catch (error) {
    return response.status(500).json({
      message: error instanceof Error ? error.message : 'Failed to create payment order',
    });
  }
});

router.post('/verify', async (request, response) => {
  try {
    const {
      paymentId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      stripe_session_id,
      status,
    } = request.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return response.status(404).json({ message: 'Payment not found' });
    }

    if (payment.gateway === 'razorpay') {
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return response.status(400).json({ message: 'Missing Razorpay verification fields' });
      }

      const raw = `${razorpay_order_id}|${razorpay_payment_id}`;
      const expected = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
        .update(raw)
        .digest('hex');

      if (expected !== razorpay_signature) {
        payment.status = 'failed';
        await payment.save();
        return response.status(400).json({ message: 'Invalid payment signature' });
      }

      await markPaymentPaid(payment, {
        gatewayOrderId: razorpay_order_id,
        gatewayPaymentId: razorpay_payment_id,
        gatewaySignature: razorpay_signature,
        reconciliation: {
          source: 'client_verify',
          gateway: 'razorpay',
        },
      });

      return response.status(200).json({ message: 'Payment verified and marked paid' });
    }

    if (payment.gateway === 'stripe') {
      if (!stripe_session_id && payment.gatewayOrderId) {
        const session = await retrieveStripeCheckoutSession(payment.gatewayOrderId);
        if (session.payment_status === 'paid') {
          await markPaymentPaid(payment, {
            gatewayOrderId: session.id,
            gatewayPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
            reconciliation: {
              source: 'client_verify',
              gateway: 'stripe',
              stripeSessionId: session.id,
            },
          });
          return response.status(200).json({ message: 'Stripe payment verified and marked paid' });
        }
      }

      if (stripe_session_id) {
        const session = await retrieveStripeCheckoutSession(stripe_session_id);
        if (session.payment_status === 'paid') {
          await markPaymentPaid(payment, {
            gatewayOrderId: session.id,
            gatewayPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
            reconciliation: {
              source: 'client_verify',
              gateway: 'stripe',
              stripeSessionId: session.id,
            },
          });
          return response.status(200).json({ message: 'Stripe payment verified and marked paid' });
        }
      }

      return response.status(202).json({ message: 'Stripe payment is pending webhook reconciliation' });
    }

    payment.status = status === 'paid' ? 'paid' : 'failed';
    payment.gatewayPaymentId = `mock_pay_${payment._id}`;
    if (payment.status === 'paid') {
      await markPaymentPaid(payment, {
        gatewayPaymentId: `mock_pay_${payment._id}`,
        reconciliation: {
          source: 'client_verify',
          gateway: 'mock',
        },
      });
    } else {
      await payment.save();
    }

    return response.status(200).json({
      message:
        payment.status === 'paid'
          ? 'Mock payment completed and booking confirmed'
          : 'Mock payment marked failed',
    });
  } catch {
    return response.status(500).json({ message: 'Failed to verify payment' });
  }
});

router.post('/webhook/stripe', async (request, response) => {
  const signature = request.headers['stripe-signature'];
  if (!signature || typeof signature !== 'string') {
    return response.status(400).json({ message: 'Missing stripe-signature header' });
  }

  try {
    const event = await constructStripeWebhookEvent({
      payload: request.rawBody || JSON.stringify(request.body),
      signature,
    });

    if (event.type === 'checkout.session.completed' || event.type === 'checkout.session.async_payment_succeeded') {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId || session.client_reference_id;
      if (paymentId) {
        const payment = await Payment.findById(paymentId);
        if (payment && payment.status !== 'paid') {
          await markPaymentPaid(payment, {
            gatewayOrderId: session.id,
            gatewayPaymentId: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
            reconciliation: {
              source: 'webhook',
              webhookEventId: event.id,
              webhookEventType: event.type,
              gateway: 'stripe',
            },
          });
        }
      }
    }

    if (event.type === 'checkout.session.expired' || event.type === 'checkout.session.async_payment_failed') {
      const session = event.data.object;
      const paymentId = session.metadata?.paymentId || session.client_reference_id;
      if (paymentId) {
        await Payment.findByIdAndUpdate(paymentId, {
          $set: {
            status: 'failed',
            'metadata.reconciliation': {
              source: 'webhook',
              webhookEventId: event.id,
              webhookEventType: event.type,
              gateway: 'stripe',
              updatedAt: new Date().toISOString(),
            },
          },
        });
      }
    }

    return response.status(200).json({ received: true });
  } catch (error) {
    return response.status(400).json({ message: error instanceof Error ? error.message : 'Invalid Stripe webhook' });
  }
});

router.post('/webhook/razorpay', async (request, response) => {
  try {
    const signature = request.headers['x-razorpay-signature'];
    if (!signature || typeof signature !== 'string') {
      return response.status(400).json({ message: 'Missing x-razorpay-signature header' });
    }

    const expected = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET || '')
      .update(request.rawBody || JSON.stringify(request.body))
      .digest('hex');

    if (expected !== signature) {
      return response.status(400).json({ message: 'Invalid Razorpay webhook signature' });
    }

    const event = request.body?.event;
    const paymentEntity = request.body?.payload?.payment?.entity;
    const orderEntity = request.body?.payload?.order?.entity;
    const paymentId = orderEntity?.notes?.paymentId || paymentEntity?.notes?.paymentId;

    if (paymentId && event === 'payment.captured') {
      const payment = await Payment.findById(paymentId);
      if (payment && payment.status !== 'paid') {
        await markPaymentPaid(payment, {
          gatewayOrderId: paymentEntity?.order_id || orderEntity?.id,
          gatewayPaymentId: paymentEntity?.id,
          reconciliation: {
            source: 'webhook',
            webhookEventType: event,
            gateway: 'razorpay',
          },
        });
      }
    }

    if (paymentId && event === 'payment.failed') {
      await Payment.findByIdAndUpdate(paymentId, {
        $set: {
          status: 'failed',
          'metadata.reconciliation': {
            source: 'webhook',
            webhookEventType: event,
            gateway: 'razorpay',
            updatedAt: new Date().toISOString(),
          },
        },
      });
    }

    return response.status(200).json({ received: true });
  } catch {
    return response.status(400).json({ message: 'Invalid Razorpay webhook payload' });
  }
});

router.get('/:paymentId/invoice', async (request, response) => {
  try {
    const payment = await Payment.findById(request.params.paymentId);
    if (!payment) {
      return response.status(404).json({ message: 'Payment not found' });
    }

    const [booking, trip, refunds] = await Promise.all([
      payment.booking ? Booking.findById(payment.booking) : Promise.resolve(null),
      payment.trip ? Trip.findById(payment.trip) : Promise.resolve(null),
      Refund.find({ payment: payment._id }).sort({ createdAt: -1 }),
    ]);

    return response.status(200).json({
      invoice: buildInvoiceDocument({ payment, booking, trip, refunds }),
    });
  } catch {
    return response.status(500).json({ message: 'Failed to generate invoice' });
  }
});

router.get('/:paymentId/invoice.pdf', async (request, response) => {
  try {
    const payment = await Payment.findById(request.params.paymentId);
    if (!payment) {
      return response.status(404).json({ message: 'Payment not found' });
    }

    const [booking, trip, refunds] = await Promise.all([
      payment.booking ? Booking.findById(payment.booking) : Promise.resolve(null),
      payment.trip ? Trip.findById(payment.trip) : Promise.resolve(null),
      Refund.find({ payment: payment._id }).sort({ createdAt: -1 }),
    ]);

    const invoice = buildInvoiceDocument({ payment, booking, trip, refunds });
    const pdfBuffer = await renderInvoicePdf(invoice);

    response.setHeader('Content-Type', 'application/pdf');
    response.setHeader('Content-Disposition', `attachment; filename="${invoice.invoiceNumber}.pdf"`);
    return response.status(200).send(pdfBuffer);
  } catch {
    return response.status(500).json({ message: 'Failed to generate invoice PDF' });
  }
});

export default router;
