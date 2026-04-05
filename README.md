# EduLink - Course Selling Platform

A modern, full-stack course selling platform built with React, Node.js, and MongoDB. Designed for educators to create and sell courses while students can discover, purchase, and learn from expert-led content.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node.js](https://img.shields.io/badge/node.js-v16+-green.svg)
![React](https://img.shields.io/badge/react-v18+-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-v5.0+-green.svg)
![Vite](https://img.shields.io/badge/vite-v5+-purple.svg)

---

## 🎯 Key Features

### For Students
- 🎓 **Browse & Discover** - Explore courses from expert teachers
- 💳 **Secure Purchases** - Integrated payment processing with validation
- 📚 **Learning Dashboard** - Track enrolled courses and learning progress
- 👤 **Profile Management** - Manage account, change password, view purchase history

### For Teachers
- 📝 **Course Creation** - Create, edit, and publish courses with rich content
- 💰 **Revenue Analytics** - Real-time dashboard showing earnings, enrollments, and course performance
- 📊 **Business Insights** - Track total revenue, average course price, and student engagement
- 🎯 **Course Management** - Archive courses, manage pricing, and course details

### For Admins
- 👥 **User Management** - Manage students, teachers, and admin roles
- 📈 **Platform Analytics** - Comprehensive dashboard with platform-wide metrics
- 🎓 **Course Moderation** - Monitor active and archived courses
- 💸 **Revenue Oversight** - Track total platform revenue and recent transactions
- 🔐 **Role-Based Access Control** - Fine-grained permission system

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- **Vite** - Next-generation build tool (blazing fast development)
- React 18 with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- React Router for navigation
- Axios for API communication
- React Hot Toast for notifications
- Lucide React for icons

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT authentication
- Bcrypt for password hashing
- Async error handling with custom middleware

**Database:**
- MongoDB Atlas (cloud)
- Optimized schemas with indexes
- Relationship mapping (Users → Courses → Purchases)

---

## ✨ Standout Features

### 1. **Role-Based Authentication System**
- Multi-role support (Student, Teacher, Admin)
- JWT-based authentication with secure token management
- Protected routes with authorization middleware
- Password hashing with bcrypt

### 2. **Race Condition Handling**
```typescript
// Prevents duplicate purchases with real-time validation
- Pre-purchase course existence checks
- Idempotent purchase operations
- Automatic UI updates on course deletion
- Concurrent request prevention
```

Example from CourseCard:
```typescript
// Check if course still exists before purchase
const courseCheck = await api.get(`/courses/${course._id}`);

if (!courseCheck.data?.data) {
  throw new Error("Course no longer available");
}

// Only proceed if course exists and is valid
await buyCourse(course._id);
await fetchPurchasedCourses();
```

### 3. **Comprehensive Error Handling**
- Custom AppError class with HTTP status codes
- Async wrapper for automatic error catching
- User-friendly error messages
- Graceful fallbacks and null safety

### 4. **Real-Time Dashboard Analytics**
- Teacher earnings dashboard with revenue tracking
- Admin platform-wide analytics
- Course performance metrics
- Student engagement insights


### 5. **Frontend State Management**
```typescript
// Zustand stores for clean, efficient state
- Authentication store with persistence
- Purchase history management
- Real-time UI synchronization
- No prop drilling issues
```

### 6. **API Response Standardization**
```javascript
// Consistent response format across all endpoints
{
  success: boolean,
  message: string,
  data: object,
  statusCode: number
}
```

### 7. **Cascade Delete Operations**
```javascript
// When a user is deleted, all their purchases are also deleted
- Maintains referential integrity
- Prevents orphaned data
- Automatic cleanup of related records
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- npm or yarn

### Installation

**Backend Setup:**
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MongoDB URI and JWT secret in .env
npm run dev
```

**Frontend Setup:**
```bash
cd frontend
npm install
cp .env.example .env
# Fill in your backend API URL in .env
npm run dev
```

### Environment Variables

**Frontend (.env):**
```properties
# API Configuration - point to your backend
VITE_API_URL=http://localhost:3000/api

# Application Name
VITE_APP_NAME=EduLink

# Environment Mode
VITE_ENV=development
```



### Using Environment Variables

All frontend environment variables are accessed using Vite's `import.meta.env`:

```typescript
// In your code
const apiUrl = import.meta.env.VITE_API_URL;
const appName = import.meta.env.VITE_APP_NAME;
```

Example from axios setup:
```typescript
// filepath: src/api/axios.ts
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
```

---

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: "student" | "teacher" | "admin",
  createdAt: Date,
  updatedAt: Date
}
```

### Course Model
```javascript
{
  title: String,
  description: String,
  price: Number,
  teacherId: ObjectId (reference),
  status: "active" | "archived" | "deleted",
  isDeleted: Boolean,
  deletedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Purchase Model
```javascript
{
  userId: ObjectId (reference),
  courseId: ObjectId (reference),
  price: Number,
  status: "completed",
  createdAt: Date
}
```

---

## 🔒 Security Features

- ✅ **Password Security** - Bcrypt hashing with salt rounds
- ✅ **JWT Authentication** - Stateless, secure token-based auth
- ✅ **Authorization Middleware** - Role-based access control
- ✅ **Input Validation** - Server-side validation on all endpoints
- ✅ **Error Message Safety** - No sensitive data exposed in responses
- ✅ **Cascade Deletes** - Maintains referential integrity
- ✅ **Idempotent Operations** - Prevents duplicate purchases
- ✅ **Environment Variables** - Secrets stored in `.env` files (not committed)

---

## 📱 API Endpoints

### Authentication
```
POST   /auth/register       - Register new user
POST   /auth/login          - Login user
POST   /auth/logout         - Logout user
GET    /auth/me             - Get current user
```

### Courses
```
GET    /courses             - List all courses
GET    /courses/:id         - Get course details
POST   /courses             - Create course (Teacher)
PATCH  /courses/:id         - Update course (Teacher/Admin)
DELETE /courses/:id         - Delete course (Teacher/Admin)
GET    /courses/teacher     - Get teacher's courses
```

### Purchases
```
POST   /purchases           - Purchase course
GET    /purchases/enrollments - Get user's purchased courses
```

### Admin
```
GET    /admin/users         - List all users
POST   /admin/users/:id/role - Change user role
DELETE /admin/users/:id     - Delete user (cascade)
GET    /admin/dashboard-stats - Platform analytics
```

### Users
```
GET    /users/my-profile    - Get current user profile
PATCH  /users/my-profile    - Update user profile
POST   /users/change-password - Change password
```

---

## 🧪 Key Implementations

### Race Condition Prevention in Purchase
```typescript
// Ensures course hasn't been deleted between viewing and purchasing
async function handleBuy() {
  try {
    setLoading(true);

    // Verify course still exists before purchase
    const courseCheck = await api.get(`/courses/${course._id}`);
    
    if (!courseCheck.data?.data) {
      toast.error("This course is no longer available");
      return;
    }

    // Proceed with purchase only if course is valid
    await buyCourse(course._id);
    await fetchPurchasedCourses();
    
    toast.success("Course purchased successfully!");
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || "Something went wrong";
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
}
```

### Cascade Delete Example
```javascript
// When a user is deleted, all their purchases are also deleted
exports.deleteUser = asyncWrapper(async (req, res) => {
  const { userId } = req.params;
  
  // Delete all purchases
  await PurchaseModel.deleteMany({ userId });
  
  // Delete user
  await UserModel.findByIdAndDelete(userId);
  
  res.json({ success: true });
});
```

### Error Handling Pattern
```javascript
// Custom async wrapper catches all errors
exports.buyCourse = asyncWrapper(async (req, res) => {
  // If any error occurs, it's caught and passed to error middleware
  const purchase = await PurchaseModel.create(data);
  res.json({ success: true, data: purchase });
});
```

---

## 🔄 Development Workflow

### Local Development
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend (with Vite)
cd frontend
npm run dev

# Frontend will be available at http://localhost:5173
# Backend API at http://localhost:3000/api
```

### Development Tips
- Vite provides instant HMR (Hot Module Replacement)
- Changes reflect in browser immediately
- Console shows helpful error messages
- Check `.env` is properly configured before running

---

## 📈 Performance Features

- ⚡ **Vite** - Sub-100ms HMR (Hot Module Replacement)
- 🔥 **Fast Development** - Instant server start and updates
- 🎯 **Optimized Components** - React with Zustand state management
- 💾 **Efficient Caching** - Strategic use of memoization
- 🚀 **Light Bundle** - Only necessary dependencies included

---

## 🔄 Future Enhancements

- [ ] Video streaming integration
- [ ] Course ratings and reviews
- [ ] Search and filtering optimization
- [ ] Email notifications
- [ ] Refund management system
- [ ] Course categories and tags
- [ ] Student progress tracking
- [ ] Certificate generation
- [ ] Mobile app (React Native)
- [ ] Payment gateway integration (Stripe/Razorpay)
- [ ] Real-time notifications with WebSocket
- [ ] Course bundles and discounts

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💻 Author

**Sidpreet Singh**

- GitHub: [@sidpreetsingh](https://github.com/sidpreetsingh)
- LinkedIn: [Connect with me](https://linkedin.com/in/sidpreetsingh)
- Email: sidpreetsandhu29@gmail.com

---

## 🙏 Acknowledgments

- Built with modern best practices in mind
- Follows REST API conventions
- Implements SOLID principles
- TypeScript for type safety
- React hooks for functional components
- Zustand for lightweight state management
- Vite for blazing-fast development experience

---

## 📞 Support

For support, email sidpreetsandhu29@gmail.com or open an issue on GitHub.

---

## 🔗 Quick Links

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)
- [Express.js](https://expressjs.com/)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Made with ❤️ by Sidpreet**