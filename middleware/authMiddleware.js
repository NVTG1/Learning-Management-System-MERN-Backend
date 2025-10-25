import jwt from 'jsonwebtoken';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Check if user is educator
export const isEducator = (req, res, next) => {
  if (req.user && req.user.isEducator) {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Educators only.' });
  }
};
