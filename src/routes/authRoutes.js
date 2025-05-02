// src/routes/authRoutes.js
import { Router } from 'express';
import { handleAuth } from '../controllers/authController.js';

const router = Router();

// OAuth2-style token endpoint
router.post('/oauth/token', handleAuth);

export default router;