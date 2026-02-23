import crypto from 'crypto';
import { Booking } from '../models/Booking.js';
import { Inquiry } from '../models/Inquiry.js';
import { WebhookDelivery } from '../models/WebhookDelivery.js';

function buildSignature(payload) {
  const secret = process.env.CRM_WEBHOOK_SECRET || process.env.ADMIN_JWT_SECRET || 'crm_secret';
  return crypto.createHmac('sha256', secret).update(JSON.stringify(payload)).digest('hex');
}

function channelsConfig() {
  return [
    { channel: 'email', url: process.env.CRM_EMAIL_WEBHOOK_URL || '' },
    { channel: 'whatsapp', url: process.env.CRM_WHATSAPP_WEBHOOK_URL || '' },
  ].filter((item) => Boolean(item.url));
}

function formatReminder(type, item) {
  return {
    type,
    id: String(item._id),
    fullName: item.fullName,
    email: item.email,
    phone: item.phone,
    followUpAt: item.followUpAt,
    note: item.followUpNote || '',
    assignedAgent: item.assignedAgent || '',
    status: type === 'inquiry' ? item.status : item.bookingStatus,
    createdAt: item.createdAt,
  };
}

async function queueReminderDeliveries(entries, entityType) {
  const channels = channelsConfig();
  if (channels.length === 0) return 0;

  let queued = 0;

  for (const item of entries) {
    const payload = formatReminder(entityType, item);
    const signature = buildSignature(payload);

    const exists = await WebhookDelivery.exists({
      entityType,
      entityId: String(item._id),
      status: { $in: ['pending', 'sent'] },
    });

    if (exists) {
      item.followUpQueuedAt = item.followUpQueuedAt || new Date();
      await item.save();
      continue;
    }

    const deliveries = channels.map((target) => ({
      channel: target.channel,
      targetUrl: target.url,
      entityType,
      entityId: String(item._id),
      payload,
      signature,
      status: 'pending',
      attempts: 0,
      maxAttempts: Number(process.env.CRM_WEBHOOK_MAX_ATTEMPTS || 5),
      nextAttemptAt: new Date(),
    }));

    await WebhookDelivery.insertMany(deliveries);
    item.followUpQueuedAt = new Date();
    await item.save();
    queued += deliveries.length;
  }

  return queued;
}

async function postWebhook(delivery) {
  const response = await fetch(delivery.targetUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Qarwaan-Signature': delivery.signature || buildSignature(delivery.payload),
      'X-Qarwaan-Entity-Type': delivery.entityType,
      'X-Qarwaan-Entity-Id': delivery.entityId,
      'X-Qarwaan-Channel': delivery.channel,
    },
    body: JSON.stringify(delivery.payload),
  });

  if (!response.ok) {
    throw new Error(`Webhook returned ${response.status}`);
  }
}

async function markEntityNotified(entityType, entityId) {
  if (entityType === 'inquiry') {
    await Inquiry.findByIdAndUpdate(entityId, { followUpNotifiedAt: new Date() });
    return;
  }

  await Booking.findByIdAndUpdate(entityId, { followUpNotifiedAt: new Date() });
}

export async function processDueFollowUps() {
  const now = new Date();

  const [inquiries, bookings] = await Promise.all([
    Inquiry.find({
      followUpAt: { $lte: now },
      status: { $ne: 'closed' },
      crmStage: { $nin: ['won', 'lost', 'closed'] },
      $or: [{ followUpNotifiedAt: { $exists: false } }, { followUpNotifiedAt: null }],
    }).limit(100),
    Booking.find({
      followUpAt: { $lte: now },
      bookingStatus: { $ne: 'cancelled' },
      crmStage: { $nin: ['completed', 'cancelled'] },
      $or: [{ followUpNotifiedAt: { $exists: false } }, { followUpNotifiedAt: null }],
    }).limit(100),
  ]);

  // mongoose does not support custom $orQueued; normalize filters manually
  const cleanInquiries = inquiries.filter((item) => !item.followUpQueuedAt);
  const cleanBookings = bookings.filter((item) => !item.followUpQueuedAt);

  const [queuedInquiryCount, queuedBookingCount] = await Promise.all([
    queueReminderDeliveries(cleanInquiries, 'inquiry'),
    queueReminderDeliveries(cleanBookings, 'booking'),
  ]);

  return {
    queued: queuedInquiryCount + queuedBookingCount,
    totalEntities: cleanInquiries.length + cleanBookings.length,
  };
}

export async function processWebhookQueue() {
  const now = new Date();

  const deliveries = await WebhookDelivery.find({
    status: 'pending',
    nextAttemptAt: { $lte: now },
  })
    .sort({ nextAttemptAt: 1 })
    .limit(100);

  let sent = 0;
  let failed = 0;

  for (const delivery of deliveries) {
    try {
      await postWebhook(delivery);
      delivery.status = 'sent';
      delivery.sentAt = new Date();
      delivery.lastError = '';
      await delivery.save();
      await markEntityNotified(delivery.entityType, delivery.entityId);
      sent += 1;
    } catch (error) {
      const attempts = delivery.attempts + 1;
      delivery.attempts = attempts;
      delivery.lastError = error instanceof Error ? error.message : 'Webhook delivery failed';

      if (attempts >= delivery.maxAttempts) {
        delivery.status = 'failed';
        failed += 1;
      } else {
        const backoffMs = Math.min(30 * 60 * 1000, 60 * 1000 * Math.pow(2, attempts - 1));
        delivery.nextAttemptAt = new Date(Date.now() + backoffMs);
      }

      await delivery.save();
    }
  }

  return { sent, failed, total: deliveries.length };
}

export async function retryFailedDeliveries(limit = 100) {
  const deliveries = await WebhookDelivery.find({ status: 'failed' }).sort({ updatedAt: 1 }).limit(limit);
  for (const delivery of deliveries) {
    delivery.status = 'pending';
    delivery.nextAttemptAt = new Date();
    await delivery.save();
  }
  return deliveries.length;
}

export function startCrmNotifier() {
  const enqueueIntervalMs = Number(process.env.CRM_NOTIFY_INTERVAL_MS || 10 * 60 * 1000);
  const queueIntervalMs = Number(process.env.CRM_WEBHOOK_QUEUE_INTERVAL_MS || 60 * 1000);

  if (enqueueIntervalMs >= 10000) {
    setInterval(() => {
      processDueFollowUps().catch(() => {
        // keep scheduler alive
      });
    }, enqueueIntervalMs);
  }

  if (queueIntervalMs >= 5000) {
    setInterval(() => {
      processWebhookQueue().catch(() => {
        // keep scheduler alive
      });
    }, queueIntervalMs);
  }
}
