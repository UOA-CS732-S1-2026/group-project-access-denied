const request = require('supertest');
const app = require('../../src/app');
const User = require('../../src/models/user.model');
const Challenge = require('../../src/models/challenge.model');
const Submission = require('../../src/models/submission.model');
const { connect, runGlobalSeed, clearSessionData, disconnect } = require('../helpers/db');

const testUser = {
  username: 'flagtester',
  email: 'flagtester@example.com',
  password: 'password123',
  securityQuestion: 'Favourite colour?',
  securityAnswer: 'blue',
};

let token;
let challenge;

beforeAll(async () => {
  await connect();
  await runGlobalSeed();
});

afterEach(async () => { await clearSessionData(); });

afterAll(async () => { await disconnect(); });

beforeEach(async () => {
  const authRes = await request(app).post('/api/auth/register').send(testUser);
  token = authRes.body.token;

  challenge = await Challenge.create({
    title: 'Test Challenge',
    description: 'Find the flag.',
    category: 'other',
    difficulty: 'easy',
    points: 100,
    flag: 'CTF{test_flag_1234}',
    isActive: true,
  });
});

// ─── POST /api/flags/submit ───────────────────────────────────────────────────

describe('POST /api/flags/submit', () => {
  it('accepts a correct flag, awards points, and returns the new total', async () => {
    const res = await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{test_flag_1234}' });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
    expect(res.body.pointsAwarded).toBe(100);
    expect(res.body.totalScore).toBe(100);
  });

  it('marks the challenge as solved on the user document', async () => {
    await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{test_flag_1234}' });

    const user = await User.findOne({ email: testUser.email });
    expect(user.solvedChallenges.map(String)).toContain(String(challenge._id));
    expect(user.totalScore).toBe(100);
  });

  it('increments the challenge solveCount', async () => {
    await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{test_flag_1234}' });

    const updated = await Challenge.findById(challenge._id);
    expect(updated.solveCount).toBe(1);
  });

  it('returns correct: false for a wrong flag without awarding points', async () => {
    const res = await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{wrong_flag}' });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(false);

    const user = await User.findOne({ email: testUser.email });
    expect(user.totalScore).toBe(0);
  });

  it('records an incorrect submission in the database', async () => {
    await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{wrong_flag}' });

    const sub = await Submission.findOne({ challenge: challenge._id });
    expect(sub).not.toBeNull();
    expect(sub.isCorrect).toBe(false);
    expect(sub.pointsAwarded).toBe(0);
  });

  it('returns 400 when the challenge has already been solved', async () => {
    await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{test_flag_1234}' });

    const res = await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: challenge._id, flag: 'CTF{test_flag_1234}' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('You have already solved this challenge');
  });

  it('returns 404 for a non-existent challengeId', async () => {
    const res = await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: '000000000000000000000001', flag: 'CTF{anything}' });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Challenge not found');
  });

  it('returns 400 when challengeId is missing from the body', async () => {
    const res = await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ flag: 'CTF{no_id}' });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('challengeId and flag are required');
  });

  it('returns 401 when no token is provided', async () => {
    const res = await request(app)
      .post('/api/flags/submit')
      .send({ challengeId: challenge._id, flag: 'CTF{test_flag_1234}' });

    expect(res.status).toBe(401);
  });

  it('allows submitting a real seeded challenge flag', async () => {
    const realChallenge = await Challenge.findOne({ flag: 'CTF{m1_b0mba_y0u_f0und_me}' }).select('+flag');

    const res = await request(app)
      .post('/api/flags/submit')
      .set('Authorization', `Bearer ${token}`)
      .send({ challengeId: realChallenge._id, flag: 'CTF{m1_b0mba_y0u_f0und_me}' });

    expect(res.status).toBe(200);
    expect(res.body.correct).toBe(true);
  });
});
