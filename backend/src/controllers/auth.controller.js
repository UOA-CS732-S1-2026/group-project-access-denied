const jwt    = require('jsonwebtoken');
const crypto = require('crypto');
const User    = require('../models/user.model');
const Session = require('../models/session.model');
const { seedSession } = require('../config/seed.session');

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000;
const SESSION_LOOKUP_WINDOW_MS = 2 * 60 * 60 * 1000;

const getSessionExpiry = (session) => session.expiresAt?.getTime?.() ?? session.createdAt.getTime() + SESSION_DURATION_MS;

const findActiveSession = (userId) =>
  Session.findOne({
    userId,
    $or: [
      { expiresAt: { $gt: new Date() } },
      {
        expiresAt: { $exists: false },
        createdAt: { $gt: new Date(Date.now() - SESSION_LOOKUP_WINDOW_MS) },
      },
    ],
  });

const generateToken = (user, sessionId) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role, sessionId, flag: 'CTF{m1_b0mba_y0u_f0und_me}' },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
  );

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } = req.body;

    if (!username || !email || !password || !securityQuestion || !securityAnswer) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Username or email already taken' });
    }

    const user = await User.create({ username, email, password, securityQuestion, securityAnswer });

    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    const session = await Session.create({ userId: user._id, sessionId, expiresAt });
    await seedSession(sessionId);

    const token = generateToken(user, sessionId);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      sessionId,
      expiresAt: getSessionExpiry(session),
    });
  } catch (err) {
    next(err);
  }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email/username and password are required' });
    }

    const user = await User.findOne({ $or: [{ email }, { username: email }] }).select('+password');
    if (!user || !user.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Reuse existing session if still active, otherwise create a fresh one
    let session = await findActiveSession(user._id);
    if (!session) {
      const sessionId = crypto.randomUUID();
      session = await Session.create({
        userId: user._id,
        sessionId,
        expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
      });
      await seedSession(session.sessionId);
    }

    const token = generateToken(user, session.sessionId);

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role },
      sessionId: session.sessionId,
      expiresAt: getSessionExpiry(session),
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('solvedChallenges', 'title category points');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
