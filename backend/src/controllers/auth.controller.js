const jwt = require("jsonwebtoken");
const globalUserSchema = require("../models/global.user.model").schema;
const userSchema = require("../models/user.model").schema;
const { getDb } = require("../config/db");
const { seed } = require("../config/seed");

const SESSION_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

// Global registry db — persists user accounts across sessions
const registryDb = getDb("global_registry");
const GlobalUser = registryDb.model("GlobalUser", globalUserSchema);

const sanitiseDbName = (username) =>
  "database_" + username.toLowerCase().replace(/\s+/g, "_");

const generateToken = (user, dbName) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role, dbName },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "2h" },
  );

// ─── POST /api/auth/register ──────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { username, email, password, securityQuestion, securityAnswer } =
      req.body;

    if (
      !username ||
      !email ||
      !password ||
      !securityQuestion ||
      !securityAnswer
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await GlobalUser.findOne({
      $or: [{ email }, { username }],
    });
    if (existing) {
      return res
        .status(409)
        .json({ message: "Username or email already taken" });
    }

    const user = await GlobalUser.create({
      username,
      email,
      password,
      securityQuestion,
      securityAnswer,
      lastClearedAt: new Date(),
    });

    const dbName = sanitiseDbName(user.username);
    const db = getDb(dbName);
    await seed(db);

    const token = generateToken(user, dbName);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        dbName,
      },
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
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await GlobalUser.findOne({ email }).select("+password");
    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const dbName = sanitiseDbName(user.username);
    const db = getDb(dbName);


    // If Atlas trigger already dropped the game db, reseed it on login
    const userCount = await db.collection("users").countDocuments();
    if (userCount === 0) {
      await seed(db);
      user.lastClearedAt = new Date();
      await user.save();
    }

    const token = generateToken(user, dbName);

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        dbName,
        lastClearedAt: user.lastClearedAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
const getMe = async (req, res, next) => {
  try {
    // User lives in global_registry, not the game database
    const user = await GlobalUser.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getMe };
