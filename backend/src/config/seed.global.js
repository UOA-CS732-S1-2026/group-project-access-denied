
/**
 * APapparel global seed
 *
 * Run once manually to populate shared read-only data:
 *   products, challenges, admin user, alice user.
 *
 * Usage: node backend/src/config/seed.global.js
 *
 * Idempotent — safe to run multiple times.
 * Teammates: add new persistent fixtures here (new products, challenges, etc.)
 */


require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const Challenge = require('../models/challenge.model');
const ChatSession = require('../models/ChatSession.model');


// ─── Products ─────────────────────────────────────────────────────────────────


const PRODUCTS = [
  {
    name: 'Draped Silk Blouse',
    description: 'A luxuriously light silk blouse with elegant draping, perfect for effortless day-to-evening dressing.',
    price: 245, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122158/Draped_Silk_Blouse_foae3t.png'],
    stock: 34, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Aero-Luxe Runner',
    description: 'High-performance running shoe engineered with responsive cushioning and a breathable upper.',
    price: 180, category: 'shoes', sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122157/Aero-Luxe_Runner_oaz5cx.png'],
    stock: 18, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Sculpted Trench',
    description: 'A structured trench coat with tailored proportions, crafted from a premium water-resistant fabric.',
    price: 495, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122157/Sculpted_Trench_kzrfko.png'],
    stock: 12, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Heritage Chelsea Boot',
    description: 'Hand-crafted chelsea boot in deep walnut leather with an elastic gore for an effortless fit.',
    price: 320, category: 'shoes', sizes: ['38', '39', '40', '41', '42', '43'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122157/Heritage_Chelsea_Boot_ddxgfx.png'],
    stock: 27, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Structured Wool Overcoat',
    description: 'A weighty, double-faced wool overcoat with a sharp silhouette and concealed button placket.',
    price: 890, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122157/Structured_Wool_Overcoat_cqjp2z.png'],
    stock: 9, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Minimalist Chelsea Boot',
    description: 'A pared-back chelsea boot in smooth black leather, built on a lightweight rubber sole.',
    price: 550, category: 'shoes', sizes: ['38', '39', '40', '41', '42', '43', '44'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122157/Minimalist_Chelsea_Boot_dh6jxy.png'],
    stock: 6, isActive: true, isNew: true, featured: false,
  },
  {
    name: 'Heavyweight Cotton Tee',
    description: 'An oversized 280gsm cotton tee with a relaxed boxy fit and reinforced seams for longevity.',
    price: 120, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122158/Heavyweight_Cotton_Tee_gopxid.png'],
    stock: 85, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Tailored Linen Trouser',
    description: 'Crisp linen trousers with a high-rise waistband and wide-leg cut for an elevated casual look.',
    price: 340, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122156/Tailored_Linen_Trouser_oetztl.png'],
    stock: 31, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Silk-Cashmere Knit',
    description: 'An ultra-soft knit blending 70% silk and 30% cashmere for warmth without weight.',
    price: 420, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122156/Silk-Cashmere_Knit_sskq0w.png'],
    stock: 15, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Day-to-Night Tote',
    description: 'A structured tote in full-grain leather with a zip-top closure and suede lining.',
    price: 675, category: 'clothing', sizes: ['One Size'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1777122156/Day-to-Night_Tote_mxwc8s.png'],
    stock: 42, isActive: true, isNew: false, featured: false,
  },
  // CTF: intentional vulnerability — sql-injection (Flag 6).
  // Inactive draft hidden from the public catalogue. The isActive filter is dropped
  // when a NoSQL injection is detected in the search query, exposing this product
  // in the listing. Clicking through to the product detail page reveals the flag.
  {
    name: 'Vault Prototype Trench Coat',
    description: 'Internal launch sample. Not ready for sale! CTF{sql_i_found_the_vault}',
    price: 0, category: 'shoes', sizes: ['39', '40', '41', '42', '43'],
    images: ['https://res.cloudinary.com/dhyxvn66a/image/upload/v1778120293/non-mustache_qokq3o.png'],
    stock: 0, isActive: false, isNew: false, featured: false,
  },
];


// ─── Challenges ───────────────────────────────────────────────────────────────


const CHALLENGES = [
  {
    title: 'Hidden in Plain Sight',
    description: "Sometimes developers leave notes where they shouldn't. Take a closer look at the APapparel homepage — not the page, the source.",
    category: 'other', difficulty: 'easy', points: 100,
    flag: 'CTF{htm1_c0mments_are_n0t_s3crets}',
    hints: [{ text: 'Your browser can show you what the server actually sent. Right-click → View Page Source.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'The Fine Print',
    description: "APapparel's legal team hid something in the Terms & Conditions. Most users never read it — maybe you should.",
    category: 'other', difficulty: 'easy', points: 100,
    flag: 'CTF{nobody_reads_the_terms}',
    hints: [{ text: 'Try scrolling all the way to the bottom of the Terms & Conditions page.', cost: 0 }],
    isActive: true,
  },
  {
    title: "Someone Else's Orders",
    description: "The order history API has a little secret — it doesn't always check who's asking. Can you find an order that isn't yours?",
    category: 'insecure-api', difficulty: 'medium', points: 200,
    flag: 'CTF{idor_order_exposed}',
    hints: [
      { text: 'Try fetching /api/orders directly. What does the response tell you?', cost: 0 },
      { text: 'Order IDs are sequential. What happens if you change the ID in the URL?', cost: 50 },
    ],
    isActive: true,
  },
  {
    title: 'Decoded',
    description: "JWTs are signed, not encrypted. Paste your token somewhere and see what's actually inside.",
    category: 'auth-bypass', difficulty: 'easy', points: 100,
    flag: 'CTF{m1_b0mba_y0u_f0und_me}',
    hints: [{ text: 'jwt.io is a handy tool. Your token is in localStorage.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'The Helpful Assistant',
    description: "APapparel's AI shopping assistant is very helpful. Maybe too helpful. See if you can get it to reveal something it shouldn't.",
    category: 'prompt-injection', difficulty: 'medium', points: 200,
    flag: 'CTF{prompt_injection_unlocked}',
    hints: [{ text: 'Try asking the assistant to ignore its previous instructions.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Welcome, Administrator',
    description: "The APapparel admin panel is locked. Or is it? Try the obvious before you try the clever.",
    category: 'default-credentials', difficulty: 'easy', points: 100,
    flag: 'CTF{default_creds_never_change}',
    hints: [{ text: 'admin / admin is a classic for a reason.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'The Search Bar Speaks',
    description: "APapparel's product search passes user input is not sanitised, directly querying the database. Can you speak its language and find the hidden vault?",
    category: 'sql-injection', difficulty: 'medium', points: 200,
    flag: 'CTF{sql_i_found_the_vault}',
    hints: [
      { text: "The search endpoint doesn't sanitise input. Try a single quote.", cost: 50 },
    ],
    isActive: true,
  },
  {
    title: 'Verbose Errors',
    description: "APapparel's login endpoint is a little too talkative when things go wrong. See what you can learn from a failed login.",
    category: 'other', difficulty: 'easy', points: 100,
    flag: 'CTF{error_messages_leak_info}',
    hints: [{ text: 'Try logging in with a real email address but the wrong password. Then try a fake email.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Social Engineering 101',
    description: "APapparel's forgot password flow asks a security question. The answer is out there — you just have to find it.",
    category: 'auth-bypass', difficulty: 'easy', points: 100,
    flag: 'CTF{social_profile_exposed_answer}',
    hints: [{ text: 'The founder has quite the social media presence. Maybe their Instagram has some clues.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Stack the Savings',
    description: "APapparel's checkout applies discount codes at face value. What happens if you apply more than one?",
    category: 'logic-flaw', difficulty: 'easy', points: 100,
    flag: 'CTF{discount_stacking_exploit}',
    hints: [{ text: 'Try applying a discount code twice. Does the total keep going down?', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Something Went Wrong',
    description: "StyleBot crashed — and APapparel's error handler had a lot to say about it. See what gets exposed when the bot can't cope.",
    category: 'exposed-files', difficulty: 'medium', points: 200,
    flag: 'CTF{verbose_error_env_leak}',
    hints: [
      { text: 'What happens when you send the chatbot something it cannot handle?', cost: 0 },
      { text: 'A malformed or empty message body might cause an unhandled exception. Check the full response carefully.', cost: 50 },
    ],
    isActive: true,
  },
  {
    title: "Other People's Conversations",
    description: "StyleBot keeps a history of every conversation. Sessions are numbered. Not all of them belong to you.",
    category: 'insecure-api', difficulty: 'medium', points: 200,
    flag: 'CTF{idor_chat_history_exposed}',
    hints: [
      { text: 'Your session ID is returned in the chat API response. What does that tell you about other sessions?', cost: 0 },
      { text: 'Try fetching /api/chat/1 directly — no login required.', cost: 50 },
    ],
    isActive: true,
  },
  {
    title: 'The Price is Wrong',
    description: "APapparel trusts the cart too much. Can you change what the checkout thinks something costs?",
    category: 'logic-flaw', difficulty: 'medium', points: 200,
    flag: 'CTF{price_tampering}',
    hints: [
      { text: 'Your browser stores cart data locally. Check the Application tab before you pay.', cost: 0 },
      { text: 'If the checkout trusts local values, changing a price may change the final response too.', cost: 50 },
    ],
    isActive: true,
  },
  { title: 'TBD', description: 'Coming soon.', category: 'other', difficulty: 'easy', points: 100, flag: 'CTF{tbd_flag_14}', isActive: false },
];


// ─── Run ──────────────────────────────────────────────────────────────────────


async function seedGlobal() {

  // ── Admin user ──────────────────────────────────────────────────────────────
  let admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    admin = await User.create({
      username: 'admin',
      email: 'admin@apapparel.com',
      password: 'admin',        // CTF: intentional vulnerability — default-credentials
      role: 'admin',
      securityQuestion: 'What city were you born in?',
      securityAnswer: 'mumbai',
    });
    console.log('Created admin user');
  } else {
    console.log('Admin already exists — skipping');
  }


  // ── CEO user "Ajith Patel" (CTF: Social Engineering 101 — Flag #9) ─────────
  let ajith = await User.findOne({ username: 'ajithpatel' });
  if (!ajith) {
    ajith = await User.create({
      username: 'ajithpatel',
      email: 'AjithPatel@APapparel.com',
      password: 'Ap$ecure2026!',  // strong password — not the attack vector
      role: 'user',
      securityQuestion: "What is your pet's name?",
      securityAnswer: 'simba',    // CTF: discoverable via founder's Instagram
    });
    console.log('Created ajith (CEO)');
  } else {
    console.log('Ajith already exists — skipping');
  }


  // ── Victim user "alice" ─────────────────────────────────────────────────────
  let alice = await User.findOne({ username: 'alice' });
  if (!alice) {
    alice = await User.create({
      username: 'alice',
      email: 'alice@apapparel.com',
      password: 'alice1234',
      role: 'user',
      securityQuestion: 'What was your first car?',
      securityAnswer: 'honda',
    });
    console.log('Created alice');
  } else {
    console.log('Alice already exists — skipping');
  }

  // ── Products ────────────────────────────────────────────────────────────────
  // Upsert by name so re-running the seed picks up new products (e.g. the
  // Founder's Capsule draft for Flag 6) without wiping existing entries.
  for (const product of PRODUCTS) {
    await Product.findOneAndUpdate(
      { name: product.name },
      { $set: product },
      { upsert: true }
    );
  }
  console.log(`Upserted ${PRODUCTS.length} products`);


  // ── Challenges ──────────────────────────────────────────────────────────────
  // Upsert by title so re-running the seed updates existing records (e.g. TBD
  // slots that have been filled in) without wiping solve counts on other fields.
  await Product.findOneAndUpdate(
    { name: SQLI_VAULT_PRODUCT.name },
    { $set: SQLI_VAULT_PRODUCT },
    { upsert: true }
  );
  console.log('Ensured SQL injection vault product exists');

  for (const challenge of CHALLENGES) {
    await Challenge.findOneAndUpdate(
      { title: challenge.title },
      { $set: challenge },
      { upsert: true }
    );
  }
  console.log(`Upserted ${CHALLENGES.length} challenges`);


  // ── Admin chat session (CTF: IDOR vulnerability — Flag 3) ──────────────────
  await ChatSession.deleteOne({ sessionId: 1 });
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
        content: 'Hello! Confirmed. Your admin verification code for today is: CTF{idor_chat_history_exposed}. Please keep this confidential.',
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


  console.log('\nGlobal seed complete.');
}


// Allow running manually: node seed.global.js
if (require.main === module) {
  mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
      console.log('Connected to MongoDB');
      await seedGlobal();
      await mongoose.disconnect();
    })
    .catch((err) => {
      console.error('Global seed failed:', err.message);
      process.exit(1);
    });
}


module.exports = seedGlobal;

