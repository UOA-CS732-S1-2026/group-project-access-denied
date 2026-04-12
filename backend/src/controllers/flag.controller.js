const challengeSchema  = require('../models/challenge.model').schema;
const userSchema       = require('../models/user.model').schema;
const submissionSchema = require('../models/submission.model').schema;

// POST /api/flags/submit
const submitFlag = async (req, res, next) => {
  try {
    const ChallengeModel  = req.db.model('Challenge', challengeSchema);
    const UserModel       = req.db.model('User', userSchema);
    const SubmissionModel = req.db.model('Submission', submissionSchema);

    const { challengeId, flag } = req.body;

    if (!challengeId || !flag) {
      return res.status(400).json({ message: 'challengeId and flag are required' });
    }

    const challenge = await ChallengeModel.findById(challengeId).select('+flag');
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const user = await UserModel.findById(req.user.id);

    if (user.solvedChallenges.includes(challengeId)) {
      return res.status(400).json({ message: 'You have already solved this challenge' });
    }

    const isCorrect = flag.trim() === challenge.flag.trim();

    await SubmissionModel.create({
      user: user._id,
      challenge: challenge._id,
      submittedFlag: flag,
      isCorrect,
      pointsAwarded: isCorrect ? challenge.points : 0,
    });

    if (!isCorrect) {
      return res.status(200).json({ correct: false, message: 'Incorrect flag, try again!' });
    }

    user.solvedChallenges.push(challenge._id);
    user.totalScore += challenge.points;
    await user.save();

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
