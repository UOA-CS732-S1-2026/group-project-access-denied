const { getScoreboard } = require('../../src/controllers/scoreboard.controller');
const User = require('../../src/models/user.model');

jest.mock('../../src/models/user.model');

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockUsers = [
  { _id: 'user-1', username: 'alice', totalScore: 500, solvedChallenges: [] },
  { _id: 'user-2', username: 'bob', totalScore: 300, solvedChallenges: [] },
];

beforeEach(() => jest.clearAllMocks());

// ─── getScoreboard ────────────────────────────────────────────────────────────

describe('getScoreboard', () => {
  it('returns users sorted by totalScore descending, limited to 100', async () => {
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockUsers),
        }),
      }),
    });

    const req = {};
    const res = mockRes();

    await getScoreboard(req, res, jest.fn());

    expect(User.find).toHaveBeenCalledWith({ role: 'user' });
    expect(res.json).toHaveBeenCalledWith(mockUsers);
  });

  it('applies the correct select, sort, and limit chain', async () => {
    const selectMock = jest.fn();
    const sortMock = jest.fn();
    const limitMock = jest.fn().mockResolvedValue([]);
    sortMock.mockReturnValue({ limit: limitMock });
    selectMock.mockReturnValue({ sort: sortMock });
    User.find.mockReturnValue({ select: selectMock });

    await getScoreboard({}, mockRes(), jest.fn());

    expect(selectMock).toHaveBeenCalledWith('username totalScore solvedChallenges');
    expect(sortMock).toHaveBeenCalledWith({ totalScore: -1 });
    expect(limitMock).toHaveBeenCalledWith(100);
  });

  it('forwards errors to next()', async () => {
    const err = new Error('DB error');
    User.find.mockReturnValue({
      select: jest.fn().mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockRejectedValue(err),
        }),
      }),
    });

    const next = jest.fn();
    await getScoreboard({}, mockRes(), next);

    expect(next).toHaveBeenCalledWith(err);
  });
});
