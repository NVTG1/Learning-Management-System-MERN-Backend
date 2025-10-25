import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId)
      .populate('enrolledCourses')
      .populate('createdCourses');

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate JWT token for authenticated user
export const generateToken = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        isEducator: user.isEducator,
      },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        imageUrl: user.imageUrl,
        isEducator: user.isEducator,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Become educator
export const becomeEducator = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);

    if (user) {
      user.isEducator = true;
      user.role = 'educator';
      await user.save();

      res.json({
        message: 'Successfully became an educator',
        user,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
