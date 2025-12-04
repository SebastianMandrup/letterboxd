import express from 'express';
import request from 'supertest';
import { createAccountLimiter } from './createAccountLimiter';

describe('createAccountLimiter', () => {
  let app: express.Express;

  beforeEach(() => {
    app = express();

    app.post('/create-account', createAccountLimiter, (req, res) => {
      res.status(200).json({ success: true });
    });
  });

  it('allows up to 5 requests and blocks the 6th', async () => {
    // First 5 requests should pass
    for (let i = 1; i <= 5; i++) {
      const res = await request(app).post('/create-account');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ success: true });
    }

    const limited = await request(app).post('/create-account');

    expect(limited.status).toBe(429);
    expect(limited.body).toEqual({
      errors: [
        'Too many accounts created from this IP, please try again after 15 minutes',
      ],
    });
  });
});
