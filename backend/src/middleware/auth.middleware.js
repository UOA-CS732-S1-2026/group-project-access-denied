const jwt = require('jsonwebtoken');

/**
 * Middleware to protect routes — verifies the JWT from the Authorization header.
 */
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorised, no token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorised, token invalid or expired' });
  }
};

/**
 * Middleware to restrict access to admin users only.
 * Must be used after `protect`.
 */
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Forbidden — admin access required' });
};

module.exports = { protect, adminOnly };
