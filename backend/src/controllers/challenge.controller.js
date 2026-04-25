const Challenge = require('../models/challenge.model');
const User      = require('../models/user.model');

// GET /api/challenges
const getChallenges = async (req, res, next) => {
  try {
    const challenges = await Challenge.find({ isActive: true }).select('-flag');
    res.json(challenges);
  } catch (err) {
    next(err);
  }
};

// GET /api/challenges/:id
const getChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findById(req.params.id).select('-flag');
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    next(err);
  }
};

// POST /api/challenges  (admin only)
const createChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.create(req.body);
    res.status(201).json(challenge);
  } catch (err) {
    next(err);
  }
};

// PUT /api/challenges/:id  (admin only)
const updateChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json(challenge);
  } catch (err) {
    next(err);
  }
};

// DELETE /api/challenges/:id  (admin only)
const deleteChallenge = async (req, res, next) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    res.json({ message: 'Challenge deleted' });
  } catch (err) {
    next(err);
  }
};

// POST /api/challenges/:id/hint/:hintIdx
const useHint = async (req, res, next) => {
  try {
    const { id, hintIdx } = req.params;
    const idx = parseInt(hintIdx, 10);

    const challenge = await Challenge.findById(id);
    if (!challenge || !challenge.isActive) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    if (idx < 0 || idx >= challenge.hints.length) {
      return res.status(404).json({ message: 'Hint not found' });
    }

    const hint = challenge.hints[idx];
    const user = await User.findById(req.user.id);

    if (hint.cost > 0) {
      const alreadyUsed = user.usedHints.some(
        (h) => h.challenge.toString() === id && h.hintIdx === idx
      );
      if (!alreadyUsed) {
        user.totalScore  = Math.max(0, user.totalScore - hint.cost);
        user.usedHints.push({ challenge: challenge._id, hintIdx: idx });
        await user.save();
      }
    }

    res.json({ text: hint.text, cost: hint.cost, totalScore: user.totalScore });
  } catch (err) {
    next(err);
  }
};

module.exports = { getChallenges, getChallenge, createChallenge, updateChallenge, deleteChallenge, useHint };
