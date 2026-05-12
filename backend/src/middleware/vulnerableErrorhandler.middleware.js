// vulnerableErrorHandler.js
// INTENTIONAL VULNERABILITY: This error handler exposes HELPBOT_SECRET
// (Flag 2) in the response body. No stack trace, error message, or other
// env vars (JWT_SECRET, MONGO_URI, GROQ_API_KEY, INTERNAL_FLAG, etc.)
// are exposed. Triggered by sending malformed input to POST /api/chat.

const vulnerableErrorHandler = (err, req, res, next) => {
  // Intentionally leaks the HelpBot secret only
  res.status(500).json({
    error: 'Internal Server Error',
    // VULNERABILITY: HELPBOT_SECRET is exposed in the error response.
    // It contains Flag 2 and will be visible to anyone who triggers
    // an unhandled error on /api/chat.
    env: {
      HELPBOT_SECRET: process.env.HELPBOT_SECRET,
    },
  });
};

module.exports = vulnerableErrorHandler;