# 📚 Course Selling App – Backend API

A Node.js + Express REST API for a course selling platform, built with modular architecture, strict validation, and role-based access control.

The backend uses Zod validators, strict Mongoose models, and centralized error handling to ensure clean, maintainable, and secure APIs.

---

## 📑 Table of Contents

* [🚀 Tech Stack](#-tech-stack)
* [🏗 Project Structure (Expanded)](#-project-structure-expanded)
* [✨ Core Features](#-core-features)
* [📦 API Endpoints](#-api-endpoints)

  * [Auth Routes](#auth-routes)
  * [User Routes](#user-routes)
  * [Course Routes](#course-routes)
  * [Purchase Routes](#purchase-routes)
* [⚙ Middleware Pipeline](#-middleware-pipeline)
* [🔒 Security Practices](#-security-practices)
* [⚡ Installation](#-installation)
* [⚙️ Environment Variables](#️-environment-variables)
* [🔮 Planned Improvements](#-planned-improvements)
* [🧑‍💻 Development Focus](#-development-focus)
* [📄 License](#-license)

---

## 🚀 Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT, bcrypt
* **Validation:** Zod

---

## 🏗 Project Structure (Expanded)

```
backend/
│
├── controllers/       # Handles all business logic
│   ├── authControllers.js
│   ├── userControllers.js
│   ├── courseControllers.js
│   └── purchaseControllers.js
│
├── middlewares/       # Middleware functions for auth, roles, validation, error handling
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   ├── validate.js
│   ├── asyncWrapper.js
│   └── globalErrorHandler.js
│
├── models/            # Mongoose models
│   ├── User.js
│   ├── Course.js
│   └── Purchase.js
│
├── routes/            # Route definitions
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── courseRoutes.js
│   ├── purchaseRoutes.js
│   └── publicRoutes.js
│
├── validators/        # Zod validators
│   ├── authValidator.js
│   ├── userValidator.js
│   ├── courseValidator.js
│   └── purchaseValidator.js
│
├── utilities/         # Utility functions and classes
│   └── AppError.js
│
├── server.js          # Entry point to start the server
├── app.js             # Express app setup
├── package.json
├── package-lock.json
└── .env               # Environment variables
```

---

## ✨ Core Features

* **User Management:** Signup, Signin, Profile view & updates, Password changes
* **Course Management:** Create, update, delete, publish/unpublish, view enrollments
* **Purchases & Enrollment:** Purchase courses, view purchased courses, check enrollment status
* **Role-based Access:** student, teacher, admin
* **Validation & Security:** Zod + strict Mongoose models, JWT auth
* **Error Handling:** Async wrapper + centralized global error handler

---

## 📦 API Endpoints

### Auth Routes

| Method | Endpoint     | Description       | Body                                                                    |
| ------ | ------------ | ----------------- | ----------------------------------------------------------------------- |
| POST   | /auth/signup | Register new user | `{ "name": "John", "email": "john@example.com", "password": "123456" }` |
| POST   | /auth/signin | Login user        | `{ "email": "john@example.com", "password": "123456" }`                 |

**Response Example:**

```json
{
  "status": "success",
  "token": "<JWT_TOKEN>"
}
```

---

### User Routes

| Method | Endpoint            | Description                  |
| ------ | ------------------- | ---------------------------- |
| GET    | /users/my-profile   | Get current user profile     |
| PATCH  | /users/me           | Update profile 			  |
| PATCH  | /users/me/password  | Change password              |
| GET    | /users/             | Get all users (admin)        |
| PATCH  | /users/:userId/role | Change role (admin)          |
| DELETE | /users/:userId      | Delete user (admin)          |

**Get Profile Example:**

```http
GET /users/my-profile
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "status": "success",
  "data": {
    "id": "65a8f3c9b6f4e1a23d...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### Course Routes

| Method | Endpoint                   | Description                         |
| ------ | -------------------------- | ----------------------------------- |
| POST   | /courses/                  | Create a new course (teacher/admin) |
| GET    | /courses/                  | Get all courses                     |
| GET    | /courses/:courseId         | Get course details                  |
| PATCH  | /courses/:courseId         | Update course                       |
| PATCH  | /courses/:courseId/publish | Change publish status               |
| DELETE | /courses/:courseId         | Delete course                       |

**Example: Create Course**

```http
POST /courses/
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "title": "Advanced Node.js",
  "description": "In-depth Node.js course",
  "price": 499
}
```

**Response:**

```json
{
  "status": "success",
  "data": {
    "id": "64f1a2b3c4d5e6f789012345",
    "title": "Advanced Node.js",
    "description": "In-depth Node.js course",
    "price": 499,
    "createdBy": "65a8f3c9b6f4e1a23d...",
    "isPublished": false
  }
}
```

---

### Purchase Routes

| Method | Endpoint                            | Description                      |
| ------ | ----------------------------------- | -------------------------------- |
| POST   | /purchases/:courseId                | Purchase a course                |
| GET    | /purchases/                         | Get user’s purchased courses     |
| GET    | /purchases/:courseId                | Get enrollments (teacher/admin)  |
| GET    | /purchases/:courseId/check-purchase | Check if user purchased a course |
| DELETE | /purchases/:purchaseId              | Delete purchase (admin)          |

**Example: Check Purchase**

```http
GET /purchases/64f1a2b3c4d5e6f789012345/check-purchase
Authorization: Bearer <JWT_TOKEN>
```

```json
{
  "status": "success",
  "purchased": true
}
```

---

## ⚙ Middleware Pipeline

```
Request
   ↓
Logger
   ↓
Authentication (protect)
   ↓
Role-based authorization (authorize)
   ↓
Validation (Zod schemas)
   ↓
Controller (async wrapped)
   ↓
Database
   ↓
Global Error Handler
```

---

## 🔒 Security Practices

* Passwords hashed using bcrypt
* Sensitive fields (password) excluded from responses
* Role-based access for sensitive routes
* Strict validation for both request (Zod) and model (Mongoose)

---

## ⚡ Installation

```bash
git clone <repository-url>
cd course-selling-app/backend
npm install
npm run dev
```

---

## ⚙️ Environment Variables

```
PORT=5000
MONGO_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

---

## 🔮 Planned Improvements

* Pagination, filtering, and sorting
* Email notifications for purchases
* Rate limiting and enhanced security
* Unit / integration tests

---

## 🧑‍💻 Development Focus

* Scalable Express architecture
* Middleware pipelines
* Role-based authentication & authorization
* Strict validation & error handling
* Modular, maintainable API design

---

## 📄 License

For learning, portfolio, and backend development practice.

---

