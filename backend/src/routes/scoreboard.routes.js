const express = require('express');
const router = express.Router();
const { getScoreboard } = require('../controllers/scoreboard.controller');

// GET /api/scoreboard  — public leaderboard
router.get('/', getScoreboard);

module.exports = router;
