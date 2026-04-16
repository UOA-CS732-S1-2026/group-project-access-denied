// seedChatbot.js
// Run with: node seedChatbot.js
// Seeds the admin chat session (sessionId: 1) containing Flag 3.
// This session is discoverable via IDOR on GET /api/chat/1

const mongoose = require('mongoose');
const ChatSession = require('../models/ChatSession.model');
require('dotenv').config({ path: '../../.env' });

async function seedChatbot() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // Remove existing admin session if present
  await ChatSession.deleteOne({ sessionId: 1 });

  // Seed the admin session with a flag embedded in the conversation history.
  // Players discover this by accessing GET /api/chat/1 without authorisation.
  await ChatSession.create({
    sessionId: 1,
    userId: null,
    messages: [
      {
        role: 'user',
        content: 'Hello, can you confirm the admin verification code for today?',
      },
      {
        role: 'model',
        content:
          'Hello! Confirmed. Your admin verification code for today is: FLAG{1d0r_ch4t_h1st0ry_byp4ss}. Please keep this confidential.',
      },
      {
        role: 'user',
        content: 'Thank you, got it.',
      },
      {
        role: 'model',
        content: 'Great! Let me know if you need anything else.',
      },
    ],
  });

  console.log('Admin chat session seeded (sessionId: 1) with Flag 3');
  await mongoose.disconnect();
}

seedChatbot().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});