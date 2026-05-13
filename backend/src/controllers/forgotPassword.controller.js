const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User    = require('../models/user.model');
const Session = require('../models/session.model');

const generateToken = (user, sessionId) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role, sessionId, flag: 'CTF{m1_b0mba_y0u_f0und_me}' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

// ─── POST /api/auth/forgot-password  (Step 1: get the security question) ─────
const getSecurityQuestion = async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ $or: [{ email }, { username: req.body.email }] });
    if (!user) {
      // CTF: intentionally verbose — reveals whether the account exists
      return res.status(404).json({ message: 'No account found with that email' });
    }

    res.json({
      securityQuestion: user.securityQuestion,
      email: user.email,
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/forgot-password/verify  (Step 2: verify answer → login) ──
const verifySecurityAnswer = async (req, res, next) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { securityAnswer } = req.body;

    if (!email || !securityAnswer) {
      return res.status(400).json({ message: 'Email and security answer are required' });
    }

    const user = await User.findOne({ $or: [{ email }, { username: req.body.email }] }).select('+securityAnswer');
    if (!user) {
      return res.status(404).json({ message: 'No account found with that email' });
    }

    // Case-insensitive comparison (securityAnswer is stored lowercase)
    if (user.securityAnswer !== securityAnswer.toLowerCase().trim()) {
      return res.status(401).json({ message: 'Incorrect security answer' });
    }

    // Answer correct — log them in directly (CTF: intentional weakness)
    let session = await Session.findOne({ userId: user._id });
    if (!session) {
      const sessionId = crypto.randomUUID();
      session = await Session.create({ userId: user._id, sessionId });
    }

    const token = generateToken(user, session.sessionId);

    const response = {
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      sessionId: session.sessionId,
      expiresAt: session.createdAt.getTime() + 2 * 60 * 60 * 1000,
    };

    // CTF: flag only awarded when bypassing the CEO's account (Social Engineering 101)
    if (email === 'ajithpatel@apapparel.com') {
      response.flag = 'CTF{social_profile_3xp0s3d}';
    }

    res.json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = { getSecurityQuestion, verifySecurityAnswer };
