const { submitFlag } = require('../../src/controllers/flag.controller');
const Challenge = require('../../src/models/challenge.model');
const User = require('../../src/models/user.model');
const Submission = require('../../src/models/submission.model');

jest.mock('../../src/models/challenge.model');
jest.mock('../../src/models/user.model');
jest.mock('../../src/models/submission.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockChallenge = {
  _id: 'challenge-id-123',
  title: 'Test Challenge',
  flag: 'CTF{test_flag_1234}',
  points: 100,
  isActive: true,
  solveCount: 0,
  save: jest.fn().mockResolvedValue(undefined),
};

const mockUser = {
  _id: 'user-id-123',
  solvedChallenges: [],
  totalScore: 0,
  save: jest.fn().mockResolvedValue(undefined),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUser.solvedChallenges = [];
  mockUser.totalScore = 0;
  mockChallenge.solveCount = 0;
});

// ─── submitFlag ───────────────────────────────────────────────────────────────

describe('submitFlag', () => {
  it('returns 400 when challengeId or flag is missing', async () => {
    const req = { body: { flag: 'CTF{no_id}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();
    const next = jest.fn();

    await submitFlag(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'challengeId and flag are required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 404 when the challenge does not exist', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    const req = { body: { challengeId: 'bad-id', flag: 'CTF{x}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();

    await submitFlag(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Challenge not found' });
  });

  it('returns 404 when the challenge is inactive', async () => {
    Challenge.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue({ ...mockChallenge, isActive: false }),
    });

    const req = { body: { challengeId: 'challenge-id-123', flag: 'CTF{test_flag_1234}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();

    await submitFlag(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns 400 when the challenge was already solved by this user', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockChallenge) });
    mockUser.solvedChallenges = ['challenge-id-123'];
    User.findById.mockResolvedValue(mockUser);

    const req = { body: { challengeId: 'challenge-id-123', flag: 'CTF{test_flag_1234}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();

    await submitFlag(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'You have already solved this challenge' });
  });

  it('records a wrong submission and returns correct: false without awarding points', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockChallenge) });
    User.findById.mockResolvedValue(mockUser);
    Submission.create.mockResolvedValue({});

    const req = { body: { challengeId: 'challenge-id-123', flag: 'CTF{wrong}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();

    await submitFlag(req, res, jest.fn());

    expect(Submission.create).toHaveBeenCalledWith(expect.objectContaining({
      isCorrect: false,
      pointsAwarded: 0,
      submittedFlag: 'CTF{wrong}',
    }));
    expect(mockUser.save).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ correct: false }));
  });

  it('awards points, updates user and challenge, returns correct: true on correct flag', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockChallenge) });
    User.findById.mockResolvedValue(mockUser);
    Submission.create.mockResolvedValue({});

    const req = { body: { challengeId: 'challenge-id-123', flag: 'CTF{test_flag_1234}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();

    await submitFlag(req, res, jest.fn());

    expect(Submission.create).toHaveBeenCalledWith(expect.objectContaining({
      isCorrect: true,
      pointsAwarded: 100,
    }));
    expect(mockUser.solvedChallenges).toContain(mockChallenge._id);
    expect(mockUser.totalScore).toBe(100);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockChallenge.solveCount).toBe(1);
    expect(mockChallenge.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      correct: true,
      pointsAwarded: 100,
      totalScore: 100,
    }));
  });

  it('trims whitespace before comparing the flag', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockChallenge) });
    User.findById.mockResolvedValue(mockUser);
    Submission.create.mockResolvedValue({});

    const req = { body: { challengeId: 'challenge-id-123', flag: '  CTF{test_flag_1234}  ' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();

    await submitFlag(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ correct: true }));
  });

  it('forwards unexpected errors to next()', async () => {
    const dbError = new Error('DB timeout');
    Challenge.findById.mockReturnValue({ select: jest.fn().mockRejectedValue(dbError) });

    const req = { body: { challengeId: 'challenge-id-123', flag: 'CTF{x}' }, user: { id: 'user-id-123' }, sessionId: 'sess-1' };
    const res = mockRes();
    const next = jest.fn();

    await submitFlag(req, res, next);

    expect(next).toHaveBeenCalledWith(dbError);
    expect(res.status).not.toHaveBeenCalled();
  });
});
