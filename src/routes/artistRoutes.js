import { Router } from 'express';
import { getAllArtists, addArtist } from '../controllers/artistController.js';
import { checkRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllArtists);
router.post('/', checkRole('ADMIN'), addArtist);

export default router;