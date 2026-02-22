import express from 'express';
import { Subscriber } from '../models/Subscriber.js';

const router = express.Router();

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

router.post('/', async (request, response) => {
  try {
    const { email } = request.body;

    if (!email || !isValidEmail(email)) {
      return response.status(400).json({ message: 'Valid email is required' });
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      return response.status(200).json({ message: 'You are already subscribed' });
    }

    await Subscriber.create({ email });
    return response.status(201).json({ message: 'Subscribed successfully' });
  } catch (error) {
    return response.status(500).json({ message: 'Failed to subscribe' });
  }
});

export default router;
