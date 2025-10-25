# LMS Backend

Express.js backend API for Learning Management System with MongoDB and Clerk webhooks.

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Clerk** - Authentication webhooks
- **JWT** - Token authentication
- **Svix** - Webhook verification

## Project Structure

```
server/
├── configs/
│   └── mongodb.js       # Database connection
├── controllers/
│   ├── webhooks.js      # Clerk webhook handler
│   ├── authController.js
│   ├── courseController.js
│   └── enrollmentController.js
├── models/
│   ├── User.js          # User schema
│   ├── Course.js        # Course schema
│   └── Enrollment.js    # Enrollment schema
├── routes/
│   ├── authRoutes.js
│   ├── courseRoutes.js
│   └── enrollmentRoutes.js
├── middleware/
│   └── authMiddleware.js # JWT verification
├── .env                  # Environment variables
├── package.json          # Dependencies
└── server.js             # Entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Clerk account

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Create `.env` file**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/LMS
JWT_SECRET=your_jwt_secret_key
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

3. **Run development server**
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | Yes |
| `NODE_ENV` | Environment (development/production) | Yes |
| `FRONTEND_URL` | Frontend URL for CORS | Yes |

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /generate-token` - Generate JWT token
- `GET /profile` - Get user profile (Protected)
- `PUT /become-educator` - Upgrade to educator (Protected)

### Course Routes (`/api/courses`)
- `GET /` - Get all published courses
- `GET /search/:keyword` - Search courses
- `GET /:id` - Get course by ID
- `POST /` - Create course (Educator only)
- `PUT /:id` - Update course (Educator only)
- `DELETE /:id` - Delete course (Educator only)
- `POST /:id/ratings` - Add rating (Protected)
- `GET /my-courses` - Get educator's courses (Educator only)

### Enrollment Routes (`/api/enrollments`)
- `POST /` - Enroll in course (Protected)
- `GET /my-courses` - Get user enrollments (Protected)
- `PUT /:id/progress` - Update lecture progress (Protected)

### Webhook Routes
- `POST /clerk` - Clerk webhook endpoint

## Database Models

### User Model
```javascript
{
  _id: String (Clerk User ID),
  name: String,
  email: String,
  imageUrl: String,
  isEducator: Boolean,
  role: String,
  enrolledCourses: [ObjectId],
  createdCourses: [ObjectId],
  timestamps: true
}
```

### Course Model
```javascript
{
  courseTitle: String,
  courseDescription: String,
  coursePrice: Number,
  discount: Number,
  courseThumbnail: String,
  isPublished: Boolean,
  courseContent: [{
    chapterId: String,
    chapterOrder: Number,
    chapterTitle: String,
    chapterContent: [{
      lectureId: String,
      lectureTitle: String,
      lectureDuration: Number,
      lectureUrl: String,
      isPreviewFree: Boolean,
      lectureOrder: Number
    }]
  }],
  educator: ObjectId,
  enrolledStudents: [String],
  courseRatings: [{
    userId: String,
    rating: Number,
    review: String
  }],
  timestamps: true
}
```

### Enrollment Model
```javascript
{
  student: String,
  course: ObjectId,
  enrolledAt: Date,
  progress: [{
    chapterId: String,
    lectureId: String,
    completed: Boolean,
    completedAt: Date
  }],
  completed: Boolean,
  completedAt: Date,
  timestamps: true
}
```

## Authentication

Uses Clerk webhooks for user management and JWT for API authentication.

**Webhook Events:**
- `user.created` - Creates user in database
- `user.updated` - Updates user in database
- `user.deleted` - Deletes user from database

**Protected Routes:**
- Require `Authorization: Bearer <token>` header
- Token generated via `/api/auth/generate-token`

## Deployment

### Deploy to Render

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Web Service on Render**
- Import repository
- Set build command: `npm install`
- Set start command: `npm start`

3. **Environment Variables on Render**
```
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
CLERK_WEBHOOK_SECRET=your_webhook_secret
NODE_ENV=production
FRONTEND_URL=your_frontend_url
```

4. **Update Clerk Webhook**
- Set endpoint URL to: `https://your-app.onrender.com/clerk`

## MongoDB Setup

1. **Create Cluster** on MongoDB Atlas
2. **Create Database** named `LMS`
3. **Network Access** - Allow 0.0.0.0/0 (or specific IPs)
4. **Copy connection string** to `MONGODB_URI`

## Common Issues

### Issue: MongoDB connection timeout
**Solution:** Check Network Access in MongoDB Atlas, allow all IPs

### Issue: Webhook verification failed
**Solution:** Verify `CLERK_WEBHOOK_SECRET` is correct

### Issue: CORS errors
**Solution:** Set `FRONTEND_URL` environment variable

## Testing the API

### Test with cURL

**Get all courses:**
```bash
curl http://localhost:5000/api/courses
```

**Generate token (after user signup):**
```bash
curl -X POST http://localhost:5000/api/auth/generate-token \
  -H "Content-Type: application/json" \
  -d '{"userId": "your_clerk_user_id"}'
```

**Enroll in course (with token):**
```bash
curl -X POST http://localhost:5000/api/enrollments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your_jwt_token" \
  -d '{"courseId": "course_id_here"}'
```

## Dependencies

```json
{
  "express": "^4.18.2",
  "mongoose": "^8.0.3",
  "dotenv": "^16.3.1",
  "cors": "^2.8.5",
  "svix": "^1.15.0",
  "jsonwebtoken": "^9.0.2",
  "bcryptjs": "^2.4.3",
  "nodemon": "^3.0.2"
}
```

## License

MIT

## Author

Your Name

## Contributing

Pull requests are welcome. For major changes, please open an issue first.
