import express from 'express';
import {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  addCourseRating,
  searchCourses,
  getEducatorCourses,
} from '../controllers/courseController.js';
import { protect, isEducator } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getAllCourses);
router.get('/search/:keyword', searchCourses);
router.get('/my-courses', protect, isEducator, getEducatorCourses);
router.get('/:id', getCourseById);
router.post('/', protect, isEducator, createCourse);
router.put('/:id', protect, isEducator, updateCourse);
router.delete('/:id', protect, isEducator, deleteCourse);
router.post('/:id/ratings', protect, addCourseRating);

export default router;
