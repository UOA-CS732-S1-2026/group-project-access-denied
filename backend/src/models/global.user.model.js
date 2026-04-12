const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const globalUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 4,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    securityQuestion: {
      type: String,
      required: [true, 'Security question is required'],
      trim: true,
    },
    securityAnswer: {
      type: String,
      required: [true, 'Security answer is required'],
      lowercase: true,
      trim: true,
      select: false,
    },
    // Tracks when the game database was last wiped — used to determine if a reset is due
    lastClearedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

globalUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

globalUserSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model('GlobalUser', globalUserSchema);
