const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const propertyRoutes = require('./routes/properties');
const teamRoutes = require('./routes/team');
const contactRoutes = require('./routes/contact');
const settingsRoutes = require('./routes/settings');
const dashboardRoutes = require('./routes/dashboard'); // NEW

const app = express();
const isDev = process.env.NODE_ENV !== 'production';

// ============================================
// CONNECT TO MONGODB (auto-seeds admin)
// ============================================
connectDB();

// ============================================
// CORS
// ============================================
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// ============================================
// SECURITY HEADERS
// ============================================
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// ============================================
// RATE LIMITING
// ============================================
if (isDev) {
  console.log('⚠️  Rate limiting DISABLED (development mode)');
} else {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    message: { message: 'Too many requests, please try again later.' },
  });
  app.use('/api', apiLimiter);

  const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { message: 'Too many login attempts, please try again in 15 minutes.' },
  });
  app.use('/api/auth/login', authLimiter);
  app.use('/api/auth/register', authLimiter);
}

// ============================================
// BODY PARSER
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ============================================
// STATIC FILES (uploads) — cross-origin enabled
// ============================================
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || '*');
  next();
}, express.static(path.join(__dirname, '..', 'uploads')));

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes); // NEW

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Baobab Real Estate API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// ============================================
// ERROR HANDLER
// ============================================
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════');
  console.log('🌳  BAOBAB REAL ESTATE – BACKEND RUNNING');
  console.log('═══════════════════════════════════════════');
  console.log(`🚀  Server:      http://localhost:${PORT}`);
  console.log(`🔗  API:         http://localhost:${PORT}/api`);
  console.log(`❤️   Health:      http://localhost:${PORT}/api/health`);
  console.log(`🌐  Frontend:    ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`⚙️   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('═══════════════════════════════════════════');
  console.log('');
});