require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const fs = require('fs');

const connectDB = require('./config/db');

// Initialize Express App
const app = express();

// Connect Database
connectDB();

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware setup
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local file uploads from frontend
}));
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static folders for local file fallback
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Import Routes (To be created in subsequent phases)
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const videoRoutes = require('./routes/videoRoutes');
const commentRoutes = require('./routes/commentRoutes');
const playlistRoutes = require('./routes/playlistRoutes');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const revenueRoutes = require('./routes/revenueRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/playlists', playlistRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/revenue', revenueRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/admin', adminRoutes);

// Base route for API health check
app.get('/', (req, res) => {
  res.json({ message: 'All-In-One YouTube Creator Management API is running...' });
});

// 404 Route handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Resource not found' });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.stack : {}
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
