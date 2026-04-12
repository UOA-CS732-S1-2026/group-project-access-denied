const userSchema = require('../models/user.model').schema;

// GET /api/scoreboard
const getScoreboard = async (req, res, next) => {
  try {
    const UserModel = req.db.model('User', userSchema);
    const users = await UserModel.find({ role: 'user' })
      .select('username totalScore solvedChallenges')
      .sort({ totalScore: -1 })
      .limit(100);

    res.json(users);
  } catch (err) {
    next(err);
  }
};

module.exports = { getScoreboard };
