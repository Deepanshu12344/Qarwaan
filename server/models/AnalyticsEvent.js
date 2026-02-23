import mongoose from 'mongoose';

const analyticsEventSchema = new mongoose.Schema(
  {
    eventName: { type: String, required: true, trim: true, index: true },
    sessionId: { type: String, trim: true, index: true },
    userId: { type: String, trim: true, index: true },
    anonymousId: { type: String, trim: true, index: true },
    pagePath: { type: String, trim: true, index: true },
    source: { type: String, trim: true, default: 'web' },
    properties: { type: Object, default: {} },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const AnalyticsEvent = mongoose.model('AnalyticsEvent', analyticsEventSchema);
