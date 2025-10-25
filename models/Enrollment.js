import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  chapterId: String,
  lectureId: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
});

const enrollmentSchema = new mongoose.Schema(
  {
    student: { type: String, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    enrolledAt: { type: Date, default: Date.now },
    progress: [progressSchema],
    completed: { type: Boolean, default: false },
    completedAt: Date,
  },
  { timestamps: true }
);

const Enrollment = mongoose.model('Enrollment', enrollmentSchema);

export default Enrollment;
