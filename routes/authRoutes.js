import express from 'express';
import { getUserProfile, generateToken, becomeEducator } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-token', generateToken);
router.get('/profile', protect, getUserProfile);
router.put('/become-educator', protect, becomeEducator);

export default router;
