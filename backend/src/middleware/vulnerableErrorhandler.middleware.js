// vulnerableErrorHandler.js
// INTENTIONAL VULNERABILITY: This error handler exposes the full stack trace
// and process.env (including HELPBOT_SECRET / Flag 2) in the response body.
// This is triggered by sending malformed input to POST /api/chat.

const vulnerableErrorHandler = (err, req, res, next) => {
  // Intentionally verbose — leaks internal server state
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    // VULNERABILITY: process.env is exposed in the error response.
    // HELPBOT_SECRET contains Flag 2 and will be visible to anyone
    // who triggers an unhandled error on /api/chat.
    env: process.env,
  });
};

module.exports = vulnerableErrorHandler;