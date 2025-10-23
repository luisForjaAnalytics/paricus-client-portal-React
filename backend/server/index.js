import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import routes
import authRoutes from './routes/auth-prisma.js';
import adminRoutes from './routes/admin-prisma.js';
import errorRoutes from './routes/errors.js';
import reportsRoutes from './routes/reports.js';
import invoicesRoutes from './routes/invoices.js';
import audioRecordingsRoutes from './routes/audio-recordings.js';

// Import security middleware
import { validateCSRFToken, getCSRFToken } from './middleware/csrf.js';

// Import database
import { initializePrisma, disconnectPrisma } from './database/prisma.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// CORS Configuration - Must be FIRST
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:5174',
      'http://localhost:5173',
      'http://127.0.0.1:5174',
      'http://127.0.0.1:5173'
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('❌ CORS blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600, // Cache preflight for 10 minutes
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.path} from ${req.get('origin') || 'no-origin'}`);
  next();
});

// Enhanced security middleware
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"]
    }
  } : false, // Disable CSP in development to avoid CORS issues
  crossOriginEmbedderPolicy: false, // Allow embedding for development
  crossOriginResourcePolicy: { policy: "cross-origin" },
  hsts: process.env.NODE_ENV === 'production' ? {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  } : false, // Disable HSTS in development
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// Additional security headers (only in production to avoid CORS conflicts)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // Enable XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Permissions policy
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    next();
  });
}

// Enhanced rate limiting with different tiers
const createRateLimiter = (windowMs, max, message, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General API rate limiting - disabled for development
const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 10000, // Very high limit
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: Math.round((parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 1000)
    });
  }
});
app.use('/api', generalLimiter);

// Authentication rate limiting (stricter) - very high limit for development
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 1000, // Very high limit
  message: { error: 'Too many authentication attempts, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: Math.round((15 * 60 * 1000) / 1000)
    });
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.use('/api/auth/reset-password', authLimiter);

// Admin endpoints rate limiting (moderate)
const adminLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  50,
  'Too many admin requests, please slow down.'
);
app.use('/api/admin', adminLimiter);

// Error reporting rate limiting
const errorLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  10,
  'Too many error reports, please slow down.'
);
app.use('/api/errors', errorLimiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// CSRF Protection (apply to state-changing operations)
app.use('/api/admin', validateCSRFToken);
app.use('/api/auth/reset-password', validateCSRFToken);

// CSRF token endpoint
app.get('/api/csrf-token', getCSRFToken);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/errors', errorRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/invoices', invoicesRoutes);
app.use('/api/audio-recordings', audioRecordingsRoutes);

// S3 test endpoint
app.get('/api/s3-test', async (req, res) => {
  try {
    const { generateUploadUrl, getBucketName } = await import('./services/s3.js');
    const testKey = `test/connection-test-${Date.now()}.txt`;
    const uploadUrl = await generateUploadUrl(testKey, 'text/plain');
    
    res.json({
      success: true,
      message: 'S3 connection successful',
      bucket: getBucketName(),
      testUploadUrl: uploadUrl,
      region: process.env.AWS_REGION
    });
  } catch (error) {
    console.error('S3 test failed:', error);
    res.status(500).json({
      success: false,
      message: 'S3 connection failed',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  // Log error details
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Handle specific error types
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      message: isDevelopment ? err.message : 'Invalid input data'
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  if (err.code === 'ECONNREFUSED') {
    return res.status(503).json({
      error: 'Service unavailable',
      message: 'Database connection failed'
    });
  }

  // Generic error response
  res.status(err.status || 500).json({ 
    error: 'Something went wrong!',
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize database and start server
async function startServer() {
  try {
    await initializePrisma();
    console.log('Database initialized successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
      console.log(`\nMockup Credentials:`);
      console.log(`\nBPO Administration:`);
      console.log(`   Admin: admin@paricus.com / admin123!`);
      console.log(`\nFlex Mobile:`);
      console.log(`   Admin: admin@flexmobile.com / flex123!`);
      console.log(`   User:  user@flexmobile.com / flexuser123!`);
      console.log(`\nIM Telecom:`);
      console.log(`   Admin: admin@imtelecom.com / imtelecom123!`);
      console.log(`   User:  user@imtelecom.com / imuser123!`);
      console.log(`\nNorth American Local:`);
      console.log(`   Admin: admin@northamericanlocal.com / northam123!`);
      console.log(`   User:  user@northamericanlocal.com / naluser123!`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Shutting down gracefully...');
  await disconnectPrisma();
  process.exit(0);
});

startServer();