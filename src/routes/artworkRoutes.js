// src/routes/artworkRoutes.js
import express from 'express';
import { checkJwt, checkPermission, checkRole } from '../middleware/auth.js';
import { validateArtwork } from '../middleware/validation.js';
import {
  createArtwork,
  getArtworks,
  getArtworkById,
  updateArtwork,
  deleteArtwork
} from '../controllers/artworkController.js';

const router = express.Router();

// GET all artworks (public)
router.get('/', getArtworks);

// GET single artwork (public)
router.get('/:id', getArtworkById);

// POST create new artwork (admin only)
router.post(
  '/',
  checkJwt,
  checkPermission('write:artwork'),
  validateArtwork,
  createArtwork
);

// PUT update artwork (admin only)
router.put(
  '/:id',
  checkJwt,
  checkPermission('write:artwork'),
  validateArtwork,
  updateArtwork
);

// DELETE artwork (admin only)
router.delete(
  '/:id',
  checkJwt,
  checkPermission('delete:artwork'),
  deleteArtwork
);

export default router;