# PROFOLIO - Full Stack Application

A full-stack application built with the MERN stack (MongoDB, Express, React, Node.js). This application replicates core LinkedIn functionality including user authentication, profile management, posts, connections, and networking features.

## Features

### Authentication
- User registration with email, username, and password
- Secure login with bcrypt password hashing
- JWT-like token-based session management

### Profile Management
- Create and edit user profiles
- Upload profile pictures (Cloudinary integration)
- Add work experience and education history
- Write bio and current position
- Download profile as PDF resume

### Posts & Social
- Create text posts with optional media (images/videos)
- Like posts
- Comment on posts
- View all posts in the feed
- Delete own posts and comments

### Connections & Networking
- Send connection requests
- Accept/decline connection requests
- View my connections
- Discover other users

### Additional Features
- Responsive design
- Discover page to find new connections
- Dashboard for user analytics

---

## Tech Stack

### Backend
- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB with Mongoose ODM
- File Storage:Cloudinary
- Authentication: bcrypt
- PDF Generation: pdfkit, pdf-creator-node

### Frontend
- Framework: Next.js 16
- UI Library: React 19
- State Management: Redux Toolkit
- HTTP Client: Axios
- Styling: CSS Modules

---

## Project Structure

```
ProFolio/
├── backend/
│   ├── controllers/
│   │   ├── posts.controller.js
│   │   └── user.controller.js
│   ├── models/
│   │   ├── comments.model.js
│   │   ├── connection.model.js
│   │   ├── posts.model.js
│   │   ├── profile.model.js
│   │   └── user.model.js
│   ├── routes/
│   │   ├── post.routes.js
│   │   └── user.routes.js
│   ├── utils/
│   │   └── cloudinary.js
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── public/
    ├── src/
    │   ├── Components/
    │   │   └── Navbar/
    │   ├── config/
    │   │   ├── index.jsx
    │   │   └── redux/
    │   │       ├── action/
    │   │       ├── middleware/
    │   │       ├── reducer/
    │   │       └── store.js
    │   ├── layout/
    │   │   ├── AdminLayout/
    │   │   ├── DashBoardLayout/
    │   │   └── UserLayout/
    │   ├── pages/
    │   │   ├── _app.js
    │   │   ├── _document.js
    │   │   ├── index.js
    │   │   ├── blog/
    │   │   ├── dashboard/
    │   │   ├── discover/
    │   │   ├── login/
    │   │   ├── my_connections/
    │   │   ├── profile/
    │   │   └── view_profile/
    │   └── styles/
    ├── package.json
    └── next.config.mjs
```
