const express = require('express');
const router = express.Router();
const { getSecurityQuestion, verifySecurityAnswer } = require('../controllers/forgotPassword.controller');

// POST /api/auth/forgot-password  — returns the user's security question
router.post('/forgot-password', getSecurityQuestion);

// POST /api/auth/forgot-password/verify  — verifies answer, returns JWT
router.post('/forgot-password/verify', verifySecurityAnswer);

module.exports = router;
