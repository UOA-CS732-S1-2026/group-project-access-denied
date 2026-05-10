const logger = require('../utils/logger');

/**
 * 404 catch-all — must be placed after all routes
 */
const notFound = (req, res, next) => {
  const err = new Error(`Not Found — ${req.originalUrl}`);
  err.status = 404;
  next(err);
};

/**
 * Global error handler — catches anything passed via next(err)
 */
const errorHandler = (err, req, res, _next) => {
  const statusCode = err.status || (res.statusCode === 200 ? 500 : res.statusCode);
  logger.error(`${statusCode} — ${err.message}`);
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { notFound, errorHandler };
