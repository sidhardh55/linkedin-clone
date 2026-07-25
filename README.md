# 🚀 ProConnect - Professional Networking Platform

## 📖 Project Overview

**ProConnect** is a full-stack professional networking platform inspired by LinkedIn, built using **Next.js**, **Node.js**, **Express.js**, and **MongoDB**. The platform enables users to build professional profiles, connect with other professionals, share posts, and engage with their network through likes, comments, and follow functionality.

The backend follows the **MVC (Model-View-Controller)** architecture to ensure clean code organization, scalability, and maintainability. This project demonstrates industry-standard full-stack development concepts including authentication, RESTful API development, database integration, state management, image uploads, and responsive UI design.

---

# ✨ Project Highlights

* ✅ Full-Stack Next.js Application
* ✅ MVC (Model-View-Controller) Backend Architecture
* ✅ Secure JWT Authentication
* ✅ Cookie-Based Authentication
* ✅ MongoDB Atlas Database Integration
* ✅ RESTful API Architecture
* ✅ Cloudinary Image Storage
* ✅ Redux Toolkit State Management
* ✅ Responsive User Interface
* ✅ Complete CRUD Functionality
* ✅ Modern & Scalable Project Structure

---

# 🚀 Features

## 🔐 User Authentication

* User Registration
* User Login
* Secure JWT Authentication
* Password Encryption using bcrypt
* Protected Routes
* Cookie-Based Authentication
* Secure User Sessions
* User Logout

---

## 👤 Profile Management

* Create Professional Profile
* Edit Profile Information
* Upload Profile Picture
* Upload Cover Photo
* Update Bio
* Add Skills
* Add Education
* Add Work Experience

---

## 🌐 Social Features

* Create Posts
* Delete Posts
* View Home Feed
* Like & Unlike Posts
* Comment on Posts
* Follow Users
* Unfollow Users
* Suggested Connections
* View User Profiles

---

## 🎨 User Experience

* Responsive Design
* Modern UI
* Mobile-Friendly Layout
* Fast Performance
* Loading Indicators
* Error Handling
* Smooth Navigation

---

## 🗄️ Database Integration

* MongoDB Atlas Cloud Database
* Secure User Data Storage
* User Profiles
* Posts Management
* Comments Management
* User Connections

---

# 🛠️ Tech Stack

## 💻 Frontend

* Next.js
* React.js
* Redux Toolkit
* Tailwind CSS
* Axios

### ⚙️ Backend

* Node.js
* Express.js

### 🗃️ Database

* MongoDB Atlas
* Mongoose

### 🔑 Authentication

* JSON Web Tokens (JWT)
* bcryptjs
* Cookie Parser

### ☁️ Cloud Services

* Cloudinary

---

# 🏗️ Project Architecture

```text
ProConnect
│
├── client (Next.js Frontend)
│   ├── app
│   ├── components
│   ├── redux
│   ├── hooks
│   ├── services
│   ├── utils
│   └── assets
│
├── server (MVC Architecture)
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── MongoDB Atlas
│   ├── Users Collection
│   ├── Posts Collection
│   └── Comments Collection
│
└── Cloudinary
    └── Media Storage
```

---

# ⚙️ Installation Guide

## 📋 Prerequisites

* Node.js
* npm
* MongoDB Atlas Account
* Cloudinary Account
* Git

---

## 📥 Clone Repository

```bash
git clone https://github.com/Sidhardh55/proconnect.git

cd proconnect
```

---

## 📦 Install Backend Dependencies

```bash
cd server
npm install
```

---

## 📦 Install Frontend Dependencies

```bash
cd ../client
npm install
```

---

# 🔐 Environment Variables

Create a `.env` file inside the **server** directory.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:3000

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

# ▶️ Run Backend

```bash
cd server
npm run dev
```

Backend runs on:

```text
http://localhost:5000
```

---

# ▶️ Run Frontend

```bash
cd client
npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

# 🔌 API Endpoints

## 🔐 Authentication

| Method | Endpoint             | Description             |
| ------ | -------------------- | ----------------------- |
| POST   | `/api/auth/register` | Register a new user     |
| POST   | `/api/auth/login`    | Login an existing user  |
| POST   | `/api/auth/logout`   | Logout the current user |

### 👤 Users

| Method | Endpoint                  | Description                |
| ------ | ------------------------- | -------------------------- |
| GET    | `/api/users/profile`      | Get logged-in user profile |
| PUT    | `/api/users/profile`      | Update user profile        |
| POST   | `/api/users/follow/:id`   | Follow a user              |
| DELETE | `/api/users/unfollow/:id` | Unfollow a user            |

### 📝 Posts

| Method | Endpoint                 | Description             |
| ------ | ------------------------ | ----------------------- |
| GET    | `/api/posts`             | Fetch all posts         |
| POST   | `/api/posts`             | Create a new post       |
| DELETE | `/api/posts/:id`         | Delete a post           |
| PUT    | `/api/posts/like/:id`    | Like or Unlike a post   |
| POST   | `/api/posts/comment/:id` | Add a comment to a post |

---

# 📚 Learning Outcomes

This project helped in understanding:

* Full-Stack Web Development
* Next.js Application Development
* MVC Architecture
* REST API Development
* MongoDB Database Integration
* Authentication & Authorization
* Redux Toolkit State Management
* Cloudinary Image Uploads
* Git & GitHub Workflow
* Frontend-Backend Communication
* CRUD Operations
* Secure Session Management
* Scalable Project Architecture

---

# 🚀 Future Enhancements

* 💬 Real-Time Chat
* 🔔 Real-Time Notifications
* ♾️ Infinite Scrolling Feed
* 🔍 Search Users & Posts
* 💼 Job Posting & Applications
* 🔖 Bookmark Posts
* 🌙 Dark Mode
* 📧 Email Verification
* 🔒 Password Reset
* ⚡ WebSocket-Based Live Updates

---

# 👨‍💻 Author

**Manchukonda Sidhardha**

GitHub: https://github.com/sidhardh55

---

# 📄 License

This project is developed for educational, learning, and portfolio purposes.

© 2026 Manchukonda Sidhardha
