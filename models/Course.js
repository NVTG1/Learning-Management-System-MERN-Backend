import mongoose from 'mongoose';

const lectureSchema = new mongoose.Schema({
  lectureId: { type: String, required: true },
  lectureTitle: { type: String, required: true },
  lectureDuration: { type: Number, required: true },
  lectureUrl: { type: String, required: true },
  isPreviewFree: { type: Boolean, default: false },
  lectureOrder: { type: Number, required: true },
});

const chapterSchema = new mongoose.Schema({
  chapterId: { type: String, required: true },
  chapterOrder: { type: Number, required: true },
  chapterTitle: { type: String, required: true },
  chapterContent: [lectureSchema],
});

const ratingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  review: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const courseSchema = new mongoose.Schema(
  {
    courseTitle: { type: String, required: true, trim: true },
    courseDescription: { type: String, required: true },
    coursePrice: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    courseThumbnail: { type: String, required: true },
    isPublished: { type: Boolean, default: true },
    courseContent: [chapterSchema],
    educator: {
      type: String,
      ref: 'User',
      required: true,
    },
    enrolledStudents: [{ type: String }],
    courseRatings: [ratingSchema],
  },
  { timestamps: true }
);

const Course = mongoose.model('Course', courseSchema);

export default Course;
