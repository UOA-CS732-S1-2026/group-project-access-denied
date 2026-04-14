const User = require('../models/user.model');

// GET /api/scoreboard
const getScoreboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'user' })
      .select('username totalScore solvedChallenges')
      .sort({ totalScore: -1 })
      .limit(100);

    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getScoreboard };
