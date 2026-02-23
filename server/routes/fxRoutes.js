import express from 'express';
import { getFxRates } from '../services/fxService.js';

const router = express.Router();

router.get('/rates', async (request, response) => {
  try {
    const base = String(request.query.base || 'INR').toUpperCase();
    const data = await getFxRates(base);
    return response.status(200).json(data);
  } catch (error) {
    return response.status(502).json({
      message: error instanceof Error ? error.message : 'Failed to fetch FX rates',
    });
  }
});

export default router;
