// vulnerableErrorHandler.js
// INTENTIONAL VULNERABILITY: This error handler exposes the stack trace
// and HELPBOT_SECRET (Flag 2) in the response body. Only HELPBOT_SECRET
// is leaked — other env vars (JWT_SECRET, MONGO_URI, GROQ_API_KEY,
// INTERNAL_FLAG, etc.) are not exposed.
// This is triggered by sending malformed input to POST /api/chat.

const vulnerableErrorHandler = (err, req, res, next) => {
  // Intentionally verbose — leaks the HelpBot secret only
  res.status(500).json({
    error: err.message,
    stack: err.stack,
    // VULNERABILITY: HELPBOT_SECRET is exposed in the error response.
    // It contains Flag 2 and will be visible to anyone who triggers
    // an unhandled error on /api/chat.
    env: {
      HELPBOT_SECRET: process.env.HELPBOT_SECRET,
    },
  });
};

module.exports = vulnerableErrorHandler;