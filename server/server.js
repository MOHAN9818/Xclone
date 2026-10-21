const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const connectDb = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');

// Load environment variables from server/.env or root .env
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadsDir));

// Health check endpoint (both /api/health and /health)
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'TwitterClone API', timestamp: new Date().toISOString() });
});

// Routes (Supported with or without /api prefix for complete client compatibility)
app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/users', userRoutes);
app.use('/users', userRoutes);

app.use('/api/tweets', postRoutes);
app.use('/tweets', postRoutes);
app.use('/api/posts', postRoutes);
app.use('/posts', postRoutes);

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
  connectDb()
    .then(() => {
      app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1);
    });
}

module.exports = app;
