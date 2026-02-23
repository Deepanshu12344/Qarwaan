import express from 'express';
import { AnalyticsEvent } from '../models/AnalyticsEvent.js';

const router = express.Router();

router.post('/events', async (request, response) => {
  try {
    const {
      eventName,
      sessionId,
      userId,
      anonymousId,
      pagePath,
      source = 'web',
      properties = {},
      occurredAt,
    } = request.body;

    if (!eventName || typeof eventName !== 'string') {
      return response.status(400).json({ message: 'eventName is required' });
    }

    await AnalyticsEvent.create({
      eventName: eventName.trim(),
      sessionId: sessionId || undefined,
      userId: userId || undefined,
      anonymousId: anonymousId || undefined,
      pagePath: pagePath || undefined,
      source,
      properties: typeof properties === 'object' && properties !== null ? properties : {},
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
    });

    return response.status(202).json({ accepted: true });
  } catch {
    return response.status(400).json({ message: 'Failed to ingest analytics event' });
  }
});

export default router;
