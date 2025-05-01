import { Router } from 'express';
import { getAllArtists, addArtist } from '../controllers/artistController.js';
import { checkPermission, checkRole } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllArtists);
router.post('/', checkPermission('write:artist'), addArtist);

export default router;