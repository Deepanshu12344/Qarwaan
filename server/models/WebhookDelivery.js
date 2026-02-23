import mongoose from 'mongoose';

const webhookDeliverySchema = new mongoose.Schema(
  {
    channel: { type: String, enum: ['email', 'whatsapp'], required: true },
    targetUrl: { type: String, required: true, trim: true },
    entityType: { type: String, enum: ['inquiry', 'booking'], required: true },
    entityId: { type: String, required: true, trim: true },
    payload: { type: Object, required: true },
    signature: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'sent', 'failed'], default: 'pending' },
    attempts: { type: Number, default: 0, min: 0 },
    maxAttempts: { type: Number, default: 5, min: 1 },
    nextAttemptAt: { type: Date, default: Date.now },
    sentAt: { type: Date },
    lastError: { type: String, trim: true },
  },
  { timestamps: true }
);

export const WebhookDelivery = mongoose.model('WebhookDelivery', webhookDeliverySchema);
