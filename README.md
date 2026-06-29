# All-In-One YouTube Creator Management System

A comprehensive MERN stack web application built as a 4th-year engineering major project. This application serves as a central hub for YouTube content creators to manage their videos, track real-time analytics, manage monthly revenues, schedule content via a calendar, manage production tasks, moderate comments, and receive notifications. It also provides an Admin dashboard for application supervision.

## Features

- **Authentication & Security**: Role-based access control (Admin, Creator), JWT-based session security, and bcrypt password hashing.
- **Creator Dashboard**: View aggregate statistics (subscribers count, watch time, views, revenue), recent video metrics, and visual growth analytics.
- **Video Management**: Full CRUD operations for videos, including media metadata, file uploads, thumbnail configuration, and content scheduling.
- **Analytics & Revenue Hub**: Breakdown of ad, sponsorship, and merchandise revenue alongside growth charts for views, likes, and subscribers.
- **Interactive Planner**: Built-in Task Manager (Kanban layout) and Calendar view for scheduling release slots and recording production milestones.
- **Comment Moderation & Sentiment Analysis**: Real-time moderation, approval toggle, and sentiment analysis dashboard.
- **Admin Control Panel**: Interface to audit users, review and delete uploaded videos, and analyze system-wide performance metrics.
- **Dark Mode & Aesthetics**: Premium responsive dark mode styled with modern CSS variables, glassmorphic UI components, and micro-interactions.

---

## Technology Stack

### Frontend
- **Framework**: React 19, Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **State Management**: Context API (Auth, Theme)
- **Charts**: Chart.js (via react-chartjs-2)
- **Animations**: Framer Motion
- **Toasts**: React Hot Toast
- **Icons**: React Icons (Fa, Md, Io, Fi)
- **Styling**: Vanilla CSS (Custom properties & layout utilities)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Media Upload**: Multer, Cloudinary SDK (with auto local storage fallback)
- **Security**: CORS, Helmet, bcryptjs, JSON Web Tokens
- **Validation & Logs**: Express Validator, Morgan logger

---

## Project Structure

```text
All-In-One-Youtube-Creator-Management/
├── client/          # React 19 frontend application
│   ├── public/      # Static public assets
│   └── src/         # React source files
│       ├── assets/  # Images and styling assets
│       ├── components/ # Reusable UI components
│       ├── context/ # State contexts (Auth, Theme)
│       ├── pages/   # Application pages (Landing, Dashboards, etc.)
│       └── utils/   # Axios helper configuration
├── server/          # Node.js Express MVC application
│   ├── config/      # DB and Cloudinary configuration
│   ├── controllers/ # Route business logic handlers
│   ├── middleware/  # Auth, validation, and file upload middlewares
│   ├── models/      # Mongoose Database Schemas
│   └── routes/      # Server routing paths
├── .env.example     # Environment variables blueprint
├── .gitignore       # Version control ignore lists
└── README.md        # Technical Documentation
```

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB installed locally or MongoDB Atlas connection string

### Backend Configuration
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Create a `.env` file from the template:
   ```bash
   cp ../.env.example .env
   ```
3. Configure the `.env` variables (e.g., set your `MONGO_URI` and `JWT_SECRET`).
4. Install dependencies and start the development server:
   ```bash
   npm install
   ```
   ```bash
   npm run dev
   ```

### Frontend Configuration
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```

---

## API Endpoints List

### Authentication
- `POST /api/auth/register` - Create a new creator account
- `POST /api/auth/login` - Authenticate user & get token
- `POST /api/auth/logout` - Invalidate session / clear client cookie
- `POST /api/auth/forgot-password` - Request password reset mail token
- `POST /api/auth/reset-password/:token` - Set new password

### Videos
- `GET /api/videos` - Retrieve all videos for current creator
- `POST /api/videos` - Upload video / metadata (supports file & scheduling)
- `GET /api/videos/:id` - Retrieve detailed metadata for a video
- `PUT /api/videos/:id` - Update video info or thumbnail
- `DELETE /api/videos/:id` - Delete video

### Analytics & Revenue
- `GET /api/analytics` - Fetch time-series subscriber/view charts data
- `GET /api/revenue` - Retrieve monthly sponsorship/ad revenues data

### Tasks & Calendar
- `GET /api/tasks` - Fetch production tasks list
- `POST /api/tasks` - Add new Kanban or scheduling task
- `PUT /api/tasks/:id` - Edit status, priority, or content
- `DELETE /api/tasks/:id` - Delete task

### Comments
- `GET /api/comments` - Fetch current channel comments
- `POST /api/comments/approve/:id` - Toggle comment moderation state
- `DELETE /api/comments/:id` - Remove spam comments

### Notifications
- `GET /api/notifications` - Retrieve alerts
- `PUT /api/notifications/:id/read` - Toggle notification as read
- `DELETE /api/notifications/:id` - Purge notification

### Admin Supervision
- `GET /api/admin/users` - List all system users
- `DELETE /api/admin/users/:id` - Remove user account
- `GET /api/admin/videos` - View all videos in database
- `DELETE /api/admin/videos/:id` - Remove flags/terms violating content
