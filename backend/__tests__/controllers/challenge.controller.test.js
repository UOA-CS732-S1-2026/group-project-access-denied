const {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  useHint,
} = require('../../src/controllers/challenge.controller');
const Challenge = require('../../src/models/challenge.model');
const User = require('../../src/models/user.model');

jest.mock('../../src/models/challenge.model');
jest.mock('../../src/models/user.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockChallenge = {
  _id: 'challenge-id-123',
  title: 'Test Challenge',
  isActive: true,
  hints: [
    { text: 'Free hint', cost: 0 },
    { text: 'Paid hint', cost: 50 },
  ],
};

const mockUser = {
  _id: 'user-id-123',
  totalScore: 200,
  usedHints: [],
  save: jest.fn().mockResolvedValue(undefined),
};

beforeEach(() => jest.clearAllMocks());

// ─── getChallenges ────────────────────────────────────────────────────────────

describe('getChallenges', () => {
  it('returns all active challenges without the flag field', async () => {
    const challenges = [mockChallenge];
    Challenge.find.mockReturnValue({ select: jest.fn().mockResolvedValue(challenges) });

    const req = {};
    const res = mockRes();

    await getChallenges(req, res, jest.fn());

    expect(Challenge.find).toHaveBeenCalledWith({ isActive: true });
    expect(res.json).toHaveBeenCalledWith(challenges);
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Challenge.find.mockReturnValue({ select: jest.fn().mockRejectedValue(err) });

    const next = jest.fn();
    await getChallenges({}, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── getChallenge ─────────────────────────────────────────────────────────────

describe('getChallenge', () => {
  it('returns a single challenge by id', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(mockChallenge) });

    const req = { params: { id: 'challenge-id-123' } };
    const res = mockRes();

    await getChallenge(req, res, jest.fn());

    expect(Challenge.findById).toHaveBeenCalledWith('challenge-id-123');
    expect(res.json).toHaveBeenCalledWith(mockChallenge);
  });

  it('returns 404 when challenge does not exist', async () => {
    Challenge.findById.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

    const req = { params: { id: 'bad-id' } };
    const res = mockRes();

    await getChallenge(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Challenge not found' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Challenge.findById.mockReturnValue({ select: jest.fn().mockRejectedValue(err) });

    const next = jest.fn();
    await getChallenge({ params: { id: 'x' } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── createChallenge ──────────────────────────────────────────────────────────

describe('createChallenge', () => {
  it('creates a challenge and returns 201', async () => {
    Challenge.create.mockResolvedValue(mockChallenge);

    const req = { body: { title: 'Test Challenge' } };
    const res = mockRes();

    await createChallenge(req, res, jest.fn());

    expect(Challenge.create).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockChallenge);
  });

  it('forwards errors to next()', async () => {
    const err = new Error('Validation error');
    Challenge.create.mockRejectedValue(err);

    const next = jest.fn();
    await createChallenge({ body: {} }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});

// ─── updateChallenge ──────────────────────────────────────────────────────────

describe('updateChallenge', () => {
  it('updates and returns the updated challenge', async () => {
    const updated = { ...mockChallenge, title: 'Updated' };
    Challenge.findByIdAndUpdate.mockResolvedValue(updated);

    const req = { params: { id: 'challenge-id-123' }, body: { title: 'Updated' } };
    const res = mockRes();

    await updateChallenge(req, res, jest.fn());

    expect(Challenge.findByIdAndUpdate).toHaveBeenCalledWith(
      'challenge-id-123',
      { title: 'Updated' },
      { new: true, runValidators: true }
    );
    expect(res.json).toHaveBeenCalledWith(updated);
  });

  it('returns 404 when challenge does not exist', async () => {
    Challenge.findByIdAndUpdate.mockResolvedValue(null);

    const req = { params: { id: 'bad-id' }, body: {} };
    const res = mockRes();

    await updateChallenge(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── deleteChallenge ──────────────────────────────────────────────────────────

describe('deleteChallenge', () => {
  it('deletes a challenge and returns a confirmation message', async () => {
    Challenge.findByIdAndDelete.mockResolvedValue(mockChallenge);

    const req = { params: { id: 'challenge-id-123' } };
    const res = mockRes();

    await deleteChallenge(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith({ message: 'Challenge deleted' });
  });

  it('returns 404 when challenge does not exist', async () => {
    Challenge.findByIdAndDelete.mockResolvedValue(null);

    const req = { params: { id: 'bad-id' } };
    const res = mockRes();

    await deleteChallenge(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ─── useHint ──────────────────────────────────────────────────────────────────

describe('useHint', () => {
  it('returns a free hint without deducting points', async () => {
    Challenge.findById.mockResolvedValue(mockChallenge);
    User.findById.mockResolvedValue({ ...mockUser, usedHints: [] });

    const req = { params: { id: 'challenge-id-123', hintIdx: '0' }, user: { id: 'user-id-123' } };
    const res = mockRes();

    await useHint(req, res, jest.fn());

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Free hint', cost: 0 })
    );
  });

  it('deducts points and records usage for a paid hint', async () => {
    const user = { ...mockUser, totalScore: 200, usedHints: [], save: jest.fn().mockResolvedValue(undefined) };
    Challenge.findById.mockResolvedValue(mockChallenge);
    User.findById.mockResolvedValue(user);

    const req = { params: { id: 'challenge-id-123', hintIdx: '1' }, user: { id: 'user-id-123' } };
    const res = mockRes();

    await useHint(req, res, jest.fn());

    expect(user.totalScore).toBe(150);
    expect(user.usedHints.length).toBe(1);
    expect(user.save).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ text: 'Paid hint', cost: 50 })
    );
  });

  it('does not deduct points if the paid hint was already used', async () => {
    const user = {
      ...mockUser,
      totalScore: 200,
      usedHints: [{ challenge: { toString: () => 'challenge-id-123' }, hintIdx: 1 }],
      save: jest.fn().mockResolvedValue(undefined),
    };
    Challenge.findById.mockResolvedValue(mockChallenge);
    User.findById.mockResolvedValue(user);

    const req = { params: { id: 'challenge-id-123', hintIdx: '1' }, user: { id: 'user-id-123' } };
    const res = mockRes();

    await useHint(req, res, jest.fn());

    expect(user.totalScore).toBe(200);
    expect(user.save).not.toHaveBeenCalled();
  });

  it('returns 404 when challenge does not exist', async () => {
    Challenge.findById.mockResolvedValue(null);

    const req = { params: { id: 'bad-id', hintIdx: '0' }, user: { id: 'user-id-123' } };
    const res = mockRes();

    await useHint(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Challenge not found' });
  });

  it('returns 404 for an out-of-range hint index', async () => {
    Challenge.findById.mockResolvedValue(mockChallenge);

    const req = { params: { id: 'challenge-id-123', hintIdx: '99' }, user: { id: 'user-id-123' } };
    const res = mockRes();

    await useHint(req, res, jest.fn());

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'Hint not found' });
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    Challenge.findById.mockRejectedValue(err);

    const next = jest.fn();
    await useHint({ params: { id: 'x', hintIdx: '0' }, user: { id: 'x' } }, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});