const Challenge = require('../models/challenge.model');
const User = require('../models/user.model');
const Submission = require('../models/submission.model');

// POST /api/flags/submit
const submitFlag = async (req, res, next) => {
  try {
    const { challengeId, flag } = req.body;

    if (!challengeId || !flag) {
      return res.status(400).json({ message: 'challengeId and flag are required' });
    }

    const challenge = await Challenge.findById(challengeId).select('+flag');
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const user = await User.findById(req.user.id);

    // Check if already solved
    if (user.solvedChallenges.includes(challengeId)) {
      return res.status(400).json({ message: 'You have already solved this challenge' });
    }

    const isCorrect = flag.trim() === challenge.flag.trim();

    // Record the submission
    await Submission.create({
      user: user._id,
      challenge: challenge._id,
      submittedFlag: flag,
      isCorrect,
      pointsAwarded: isCorrect ? challenge.points : 0,
    });

    if (!isCorrect) {
      return res.status(200).json({ correct: false, message: 'Incorrect flag, try again!' });
    }

    // Update user score and solved list
    user.solvedChallenges.push(challenge._id);
    user.totalScore += challenge.points;
    await user.save();

    // Increment challenge solve count
    challenge.solveCount += 1;
    await challenge.save();

    return res.json({
      correct: true,
      message: `Correct! You earned ${challenge.points} points.`,
      pointsAwarded: challenge.points,
      totalScore: user.totalScore,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { submitFlag };
