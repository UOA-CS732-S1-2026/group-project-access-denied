const express = require('express');
const router = express.Router();
const { register, login, getMe, getDefaultAdminFlag } = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET  /api/auth/me  — requires valid JWT
router.get('/me', protect, getMe);

// GET /api/auth/default-admin-flag
router.get('/default-admin-flag', protect, adminOnly, getDefaultAdminFlag);

module.exports = router;
