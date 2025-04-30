import { Router } from 'express';
import { auth } from '../config/auth.js';
import jwt from 'express-jwt';

const router = Router();

// Auth0 token endpoint (mock)
router.get('/token', (req, res) => {
  res.json({ 
    access_token: 'mock-token',
    expires_in: 3600
  });
});

export default router;