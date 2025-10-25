import express from 'express';
import {
  enrollCourse,
  getMyEnrollments,
  updateProgress,
} from '../controllers/enrollmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, enrollCourse);
router.get('/my-courses', protect, getMyEnrollments);
router.put('/:id/progress', protect, updateProgress);

export default router;
