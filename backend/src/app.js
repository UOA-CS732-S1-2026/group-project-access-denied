require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const challengeRoutes = require('./routes/challenge.routes');
const flagRoutes = require('./routes/flag.routes');
const scoreboardRoutes = require('./routes/scoreboard.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes   = require('./routes/order.routes');
const { notFound, errorHandler } = require('./middleware/error.middleware');
const logger = require('./utils/logger');
const chatRoutes = require('./routes/chat');

const seedChatbot = require('./config/seedChatbot');


const vulnerableErrorHandler = require('./middleware/vulnerableErrorhandler.middleware')

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// HTTP request logging (skip in test env)
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev', { stream: { write: (msg) => logger.http(msg.trim()) } }));
}

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/flags', flagRoutes);
app.use('/api/scoreboard', scoreboardRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders',   orderRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(vulnerableErrorHandler);


module.exports = app;
