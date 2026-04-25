const express = require('express');
const router = express.Router();
const {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  useHint,
} = require('../controllers/challenge.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// GET  /api/challenges          — list all active challenges
router.get('/', protect, getChallenges);

// GET  /api/challenges/:id      — get a single challenge
router.get('/:id', protect, getChallenge);

// Hint unlock — deducts cost from score on first use
router.post('/:id/hint/:hintIdx', protect, useHint);

// Admin-only routes
router.post('/', protect, adminOnly, createChallenge);
router.put('/:id', protect, adminOnly, updateChallenge);
router.delete('/:id', protect, adminOnly, deleteChallenge);

module.exports = router;
