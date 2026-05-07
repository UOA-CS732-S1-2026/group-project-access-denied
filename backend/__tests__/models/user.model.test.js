const mongoose = require('mongoose');
const User = require('../../src/models/user.model');

const validUser = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  securityQuestion: "What is your pet's name?",
  securityAnswer: 'Fluffy',
};

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

// ─── Schema defaults ──────────────────────────────────────────────────────────

describe('defaults', () => {
  it('sets role to "user" by default', async () => {
    const user = await User.create(validUser);
    expect(user.role).toBe('user');
  });

  it('sets totalScore to 0 by default', async () => {
    const user = await User.create(validUser);
    expect(user.totalScore).toBe(0);
  });

  it('initialises solvedChallenges as an empty array', async () => {
    const user = await User.create(validUser);
    expect(user.solvedChallenges).toEqual([]);
  });
});

// ─── Password hashing (pre-save hook) ────────────────────────────────────────

describe('password hashing', () => {
  it('hashes the password before saving', async () => {
    const user = await User.create(validUser);
    const withPassword = await User.findById(user._id).select('+password');
    expect(withPassword.password).not.toBe('password123');
    expect(withPassword.password).toMatch(/^\$2[ab]\$\d+\$/);
  });

  it('does not re-hash the password when other fields are updated', async () => {
    const user = await User.create(validUser);
    const withPassword = await User.findById(user._id).select('+password');
    const originalHash = withPassword.password;

    withPassword.totalScore = 100;
    await withPassword.save();

    const after = await User.findById(user._id).select('+password');
    expect(after.password).toBe(originalHash);
  });
});

// ─── comparePassword ──────────────────────────────────────────────────────────

describe('comparePassword', () => {
  it('returns true for the correct password', async () => {
    const user = await User.create(validUser);
    const withPassword = await User.findById(user._id).select('+password');
    const result = await withPassword.comparePassword('password123');
    expect(result).toBe(true);
  });

  it('returns false for an incorrect password', async () => {
    const user = await User.create(validUser);
    const withPassword = await User.findById(user._id).select('+password');
    const result = await withPassword.comparePassword('wrongpassword');
    expect(result).toBe(false);
  });
});

// ─── select: false fields ─────────────────────────────────────────────────────

describe('sensitive field visibility', () => {
  it('omits password from query results by default', async () => {
    const user = await User.create(validUser);
    const found = await User.findById(user._id);
    expect(found.password).toBeUndefined();
  });

  it('omits securityAnswer from query results by default', async () => {
    const user = await User.create(validUser);
    const found = await User.findById(user._id);
    expect(found.securityAnswer).toBeUndefined();
  });

  it('returns password when explicitly selected', async () => {
    const user = await User.create(validUser);
    const found = await User.findById(user._id).select('+password');
    expect(found.password).toBeDefined();
  });
});

// ─── Field normalisation ──────────────────────────────────────────────────────

describe('field normalisation', () => {
  it('stores email in lowercase', async () => {
    const user = await User.create({ ...validUser, email: 'TEST@EXAMPLE.COM' });
    expect(user.email).toBe('test@example.com');
  });

  it('stores securityAnswer in lowercase', async () => {
    const user = await User.create({ ...validUser, securityAnswer: 'FLUFFY' });
    const found = await User.findById(user._id).select('+securityAnswer');
    expect(found.securityAnswer).toBe('fluffy');
  });
});

// ─── Required field validation ────────────────────────────────────────────────

describe('required field validation', () => {
  it.each([
    ['username'],
    ['email'],
    ['securityQuestion'],
    ['securityAnswer'],
  ])('throws a validation error when %s is missing', async (field) => {
    const data = { ...validUser };
    delete data[field];
    await expect(User.create(data)).rejects.toThrow(mongoose.Error.ValidationError);
  });
});

// ─── Unique constraints ───────────────────────────────────────────────────────

describe('unique constraints', () => {
  it('rejects a duplicate username', async () => {
    await User.create(validUser);
    await expect(
      User.create({ ...validUser, email: 'other@example.com' })
    ).rejects.toThrow();
  });

  it('rejects a duplicate email', async () => {
    await User.create(validUser);
    await expect(
      User.create({ ...validUser, username: 'otheruser' })
    ).rejects.toThrow();
  });
});

// ─── Username length constraints ──────────────────────────────────────────────

describe('username length', () => {
  it('rejects a username shorter than 3 characters', async () => {
    await expect(
      User.create({ ...validUser, username: 'ab' })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });

  it('rejects a username longer than 30 characters', async () => {
    await expect(
      User.create({ ...validUser, username: 'a'.repeat(31) })
    ).rejects.toThrow(mongoose.Error.ValidationError);
  });
});
