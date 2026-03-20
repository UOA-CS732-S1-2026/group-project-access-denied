const Challenge = require('../models/challenge.model');

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

module.exports = { getChallenges, getChallenge, createChallenge, updateChallenge, deleteChallenge };
