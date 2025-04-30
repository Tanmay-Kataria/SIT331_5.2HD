import express from 'express';
import { checkJwt, checkRole } from '../middleware/auth.js';
import {
  createExhibition,
  getExhibitions,
  getExhibitionById,
  updateExhibition,
  deleteExhibition
} from '../controllers/exhibitionController.js';

const router = express.Router();

// GET all exhibitions
router.get('/', getExhibitions);

// GET single exhibition
router.get('/:id', getExhibitionById);

// POST create new exhibition (admin only)
router.post('/', checkJwt, checkRole('ADMIN'), createExhibition);

// PUT update exhibition (admin only)
router.put('/:id', checkJwt, checkRole('ADMIN'), updateExhibition);

// DELETE exhibition (admin only)
router.delete('/:id', checkJwt, checkRole('ADMIN'), deleteExhibition);

export default router;