import Course from '../models/Course.js';
import User from '../models/User.js';

// Get all courses
export const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate(
      'educator',
      'name email imageUrl'
    );
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single course
export const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'educator',
      'name email imageUrl'
    );

    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a course
export const createCourse = async (req, res) => {
  try {
    const {
      courseTitle,
      courseDescription,
      coursePrice,
      discount,
      courseThumbnail,
      courseContent,
    } = req.body;

    const course = await Course.create({
      courseTitle,
      courseDescription,
      coursePrice,
      discount,
      courseThumbnail,
      courseContent,
      educator: req.user.userId,
      isPublished: true,
    });

    // Add course to educator's created courses
    await User.findByIdAndUpdate(req.user.userId, {
      $push: { createdCourses: course._id },
    });

    res.status(201).json(course);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a course
export const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      if (course.educator.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      Object.assign(course, req.body);
      const updatedCourse = await course.save();
      res.json(updatedCourse);
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (course) {
      if (course.educator.toString() !== req.user.userId) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      await course.deleteOne();
      res.json({ message: 'Course removed' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add rating to course
export const addCourseRating = async (req, res) => {
  try {
    const { rating, review } = req.body;
    const course = await Course.findById(req.params.id);

    if (course) {
      const alreadyRated = course.courseRatings.find(
        (r) => r.userId === req.user.userId
      );

      if (alreadyRated) {
        return res.status(400).json({ message: 'Already rated this course' });
      }

      const newRating = {
        userId: req.user.userId,
        rating: Number(rating),
        review,
      };

      course.courseRatings.push(newRating);
      await course.save();

      res.status(201).json({ message: 'Rating added' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Search courses
export const searchCourses = async (req, res) => {
  try {
    const keyword = req.params.keyword
      ? {
          courseTitle: {
            $regex: req.params.keyword,
            $options: 'i',
          },
        }
      : {};

    const courses = await Course.find({ ...keyword, isPublished: true });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get educator courses
export const getEducatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ educator: req.user.userId });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
