const express = require('express');
const router = express.Router();
const { submitFlag } = require('../controllers/flag.controller');
const { protect } = require('../middleware/auth.middleware');

// POST /api/flags/submit
router.post('/submit', protect, submitFlag);

module.exports = router;
