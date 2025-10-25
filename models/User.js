import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        imageUrl: { type: String, required: true },
        isEducator: { type: Boolean, default: false },
        role: {
            type: String,
            enum: ['student', 'educator', 'admin'],
            default: 'student'
        },
        enrolledCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
        createdCourses: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course'
            }
        ],
    }, 
    { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
