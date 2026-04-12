const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { getScoreboard } = require('../controllers/scoreboard.controller');

// GET /api/scoreboard
router.get('/', protect, getScoreboard);

module.exports = router;
