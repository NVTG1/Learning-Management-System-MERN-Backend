import Enrollment from '../models/Enrollment.js';
import Course from '../models/Course.js';
import User from '../models/User.js';

// Enroll in a course
export const enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const existingEnrollment = await Enrollment.findOne({
      student: req.user.userId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await Enrollment.create({
      student: req.user.userId,
      course: courseId,
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: { enrolledStudents: req.user.userId },
    });

    await User.findByIdAndUpdate(req.user.userId, {
      $push: { enrolledCourses: courseId },
    });

    res.status(201).json(enrollment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get user enrollments
export const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.user.userId,
    }).populate('course');

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update lecture progress
export const updateProgress = async (req, res) => {
  try {
    const { chapterId, lectureId, completed } = req.body;
    const enrollment = await Enrollment.findById(req.params.id);

    if (enrollment) {
      const progressItem = enrollment.progress.find(
        (p) => p.chapterId === chapterId && p.lectureId === lectureId
      );

      if (progressItem) {
        progressItem.completed = completed;
        progressItem.completedAt = completed ? new Date() : null;
      } else {
        enrollment.progress.push({
          chapterId,
          lectureId,
          completed,
          completedAt: completed ? new Date() : null,
        });
      }

      await enrollment.save();
      res.json(enrollment);
    } else {
      res.status(404).json({ message: 'Enrollment not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
