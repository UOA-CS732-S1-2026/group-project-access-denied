require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const forgotPasswordRoutes = require('./routes/forgotPassword.routes');
const challengeRoutes = require('./routes/challenge.routes');
const flagRoutes = require('./routes/flag.routes');
const scoreboardRoutes = require('./routes/scoreboard.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes   = require('./routes/order.routes');
const adminRoutes = require('./routes/admin.routes');
const internalRoutes = require('./routes/internal.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');
const chatRoutes = require('./routes/chat');

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
// Allow common local frontend dev origins by default.
const defaultOrigins = ['http://localhost:3000', 'http://localhost:5173'];
const configuredOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((o) => o.trim())
  : defaultOrigins;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || configuredOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logging (skip in test env)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/auth', forgotPasswordRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/scoreboard', scoreboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/internal', internalRoutes);

// CTF: intentional vulnerability — robots.txt advertises non-public paths
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    'User-agent: *\n' +
    'Disallow: /admin/\n' +
    'Disallow: /internal/server-status\n' +
    'Disallow: /api/admin/\n'
  );
});

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);


module.exports = app;
