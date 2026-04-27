/**
 * ThreadVault global seed
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
const mongoose  = require('mongoose');
const User      = require('../models/user.model');
const Product   = require('../models/product.model');
const Order     = require('../models/order.model');
const Challenge = require('../models/challenge.model');
const ChatSession = require('../models/ChatSession.model');

// ─── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS = [
  {
    name: 'Draped Silk Blouse',
    description: 'A luxuriously light silk blouse with elegant draping, perfect for effortless day-to-evening dressing.',
    price: 245, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDnV6wob3RAE4eWK5R51dcf-5Mx_0KLLIqlL4aZ6_VsJYg6Lj5Ytq-kIhGwzjMNd1D6b_gLNmjSo_4TxNhTEfh9eB3E8Yj43xh7vwiIKmVPkZOQ668O7A_MvAYjHURGp3pKjKoSOX-7YZxXz1-ppCy3sAp0GNkpBFD_XdGjUITH4MM83jhqfClthmBAUDsBIOLQGL65suT4JfyugsnihepNW-Ftnz3prcDGCzkQbjN8MDZbQYjXfJ0UttIa1AlxUpGji37dTA9HSDA'],
    stock: 34, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Aero-Luxe Runner',
    description: 'High-performance running shoe engineered with responsive cushioning and a breathable upper.',
    price: 180, category: 'shoes', sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCPYonEKVxQrpe7JyKoOBJxanMi6mw7fFT2rnpbGfnfLVMQZLVD0azn6nPn2I0nhL7CxD-VaQVLEYpCJmMkjSru0pd5dRuFqchVhEP3XdscWSuV7sYsrUBsCljFtLO6daUgmqX-LyK5Z4BwRShW6-qSC56r1zfEDNM2pr6WRL5t2xlNDbf2ONhWF_-XyfTB8v-SRTTmItCIE1LjyDiJsN6pQVpYmDhUgBshXlmv-NpjpoQFa9RQ37p33W-Rv3iRj8BQFjkcYxyZ61g'],
    stock: 18, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Sculpted Trench',
    description: 'A structured trench coat with tailored proportions, crafted from a premium water-resistant fabric.',
    price: 495, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuACZ67ThldhMay2zcJCf38Y5Tu03fComC9FvY2fJwKapvmH_ynMKbhDUIqB6P3CAAT6TnG13xnV_hwRc8aOxSXwvKezwfdMJPK1sokWQC7e-WNC1AtKOZEG6hBhCKHfCPmczQOJk-yHs9iSwDQpp7syDt2pzhmH3vtNzhey1gQJ-TG1tllpodtrmi2_MYlq9BH77nodOUTJkas9KettenC_Go4bQFU6Qz_zytLfVtmAaegZR26fcA1W_4VENap1G_pUYxFayyHhgMc'],
    stock: 12, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Heritage Chelsea Boot',
    description: 'Hand-crafted chelsea boot in deep walnut leather with an elastic gore for an effortless fit.',
    price: 320, category: 'shoes', sizes: ['38', '39', '40', '41', '42', '43'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCxkG_E-Y33RcglSMcwZm_hB3IbgsFZ9ntjtPTW4buRuUAJQQ5wR3aCfQ6h7MGZRERl42POeGi9JlxShV5BzdJwldPU0eMBUkcDptAWiiHVCdHFSpwQKXjX3cicAQre8WvShPjyKa0juPYCzdZn4WDpgdTlq_oiU4UQRgN7mm7SW7ssaCFJnXUADnxUPviOmMoXoSIGrN_XMCBzVIbAN_0kkd_NBzN5V4DV-thoPpJmoAV2ewQVEP72C0SrOuomdFTYwecuk2bi5Y8'],
    stock: 27, isActive: true, isNew: false, featured: true,
  },
  {
    name: 'Structured Wool Overcoat',
    description: 'A weighty, double-faced wool overcoat with a sharp silhouette and concealed button placket.',
    price: 890, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBwdZruDpswbrpa_mdweAcNv7bE2GMcoL99GkgdH45M94L9EsdKzZXLVwAszObexPQ2TvHPbT-4oEppEd84Kcp0pWRRZ99OisxBE4RzTFFgkrRYb1IixBnC0Egjl__DoPF6Pbh0VT2yx87i7k0hNKMiIKEqe3Jhw5mf-484UJiSl4ofuVd-fkLjmQtHVO6PLvfKB3M6n1Ci6ihgj_6S7cnm98nZcjZbkTTm2tCyHBJF4l6SgNYdSsgHxNAn-qxpl2fsJemrPZ6XkJM'],
    stock: 9, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Minimalist Chelsea Boot',
    description: 'A pared-back chelsea boot in smooth black leather, built on a lightweight rubber sole.',
    price: 550, category: 'shoes', sizes: ['38', '39', '40', '41', '42', '43', '44'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuAYECk5JbOjtJM9IL08MzpFybLXkyvAhgUUvJ5joQ8CS_P9yTWWjse4q7QuYWT6Tjhm4RyJe-9Q3HR9j_m_PwAHuRzQ7EI29vQE4E1iqk-niTxLpucW4FUstOlv-e2rqi27E2AvoVDVQCrgahAJ7nTyVwZRP9Qqkl4zoxYr1TNXwUwzjDygaBPIAHXKLjPxrfKUHwN7_mc_O4qiAyPldDjYWC_eWK3T98G6-3GZU2-rYBMngDJ5qltqbuuw6O9GPjgEuc3J-R_Gy4w'],
    stock: 6, isActive: true, isNew: true, featured: false,
  },
  {
    name: 'Heavyweight Cotton Tee',
    description: 'An oversized 280gsm cotton tee with a relaxed boxy fit and reinforced seams for longevity.',
    price: 120, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuDXS-mWLJBDJINpcBKHQlinY3aP_JPG_kx3TX5ggRFLi4A6kYceMwrQbUPSVvMMjcA-FYoK7gUFlwg51EdoJe0mGsXPO_i8uJvbDb7MAtCk9pS6S4keS_bbB9mPS9gaq32Oxtwbp--8Be-qq12fWKUniKE3ptMU1AG7rn7vUABaaiFFrjTYp9aR_bIffkuZTONZae111M50kZK1EZFyghh0QJovfAQASnNtQAwYrGtOPmH_LJY-_80tOj7qNbtvsNIEYcdw7nVs-qM'],
    stock: 85, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Tailored Linen Trouser',
    description: 'Crisp linen trousers with a high-rise waistband and wide-leg cut for an elevated casual look.',
    price: 340, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuBOBxQThs5RXnku0C_9qWRWws__PDFbuTSsLRGXzT7YPmWGORUuLy8w1jNoNpoA9TeFuvifggMLrQ0u1lTdZfX83MbXA-3gYx-eetTO5z0VVOPVpsdyhBc3wypDCsMxfghM1V0FJK8axOBPCRh3u1_0B6qQJcajdLVG6_3eEpmk0m7mQb7w-1wNhWEFqvU68cRGVB9g20pNWflAMCkWfQVFjdOvCRqyegZZ-wHNO6KSK7BApyDEJuDlcjdbv6o5Im0MFswbGyYPQqM'],
    stock: 31, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Silk-Cashmere Knit',
    description: 'An ultra-soft knit blending 70% silk and 30% cashmere for warmth without weight.',
    price: 420, category: 'clothing', sizes: ['XS', 'S', 'M', 'L', 'XL'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCHV28vMgj5LFwyVUDKkUCqSh0VsZwz0NBbEnz8dbTgALpAk36cdkcX7TFwKPy_CysvRIpugRzEREC35q4aCjQj_my5BTjRDmD2Ll3XE0S8ipOExHs3R-8shOvMn9W1hIw1BwhKkjARMCmGdRizfzw6vPU5P35peGIcyK83GzwPrSFEZyjM0J_3pJWTQxu4x-MFKYWCFymg2aYd68dmHKEQ4vn4PYNNs_45av_XoXJGMjlCvwH7HVvCsuSUrN0VbmDl3vBxXhZkq4M'],
    stock: 15, isActive: true, isNew: false, featured: false,
  },
  {
    name: 'Day-to-Night Tote',
    description: 'A structured tote in full-grain leather with a zip-top closure and suede lining.',
    price: 675, category: 'clothing', sizes: ['One Size'],
    images: ['https://lh3.googleusercontent.com/aida-public/AB6AXuCcTQZykfv5eOIRv6Nz6s9HxLn5LtxKG4-dJaz9mNuJ4BsZaP47qTHL1dbALpcTa7Ftiz3YwOcLekNS58z4KPk1Yb3X6Y_ubekFwZ2C4Sq60D_OXBfttsHQyD6bpRtiSv5dDLw4M_HuZvb3yqKqQkspgKFcgJ-O5q93DG8NJoZfZpZob3LHdj0Xz98ljAxyJQj-5PS0KhChNfsYkSduTsZBsJ5661ikQnvFOzweYZKUP1e4bp2WZjlN37gUWEqV5p8_t__thXi5gi4'],
    stock: 42, isActive: true, isNew: false, featured: false,
  },
];

// ─── Challenges ───────────────────────────────────────────────────────────────

const CHALLENGES = [
  {
    title: 'Hidden in Plain Sight',
    description: "Sometimes developers leave notes where they shouldn't. Take a closer look at the ThreadVault homepage — not the page, the source.",
    category: 'other', difficulty: 'easy', points: 100,
    flag: 'CTF{html_comments_are_not_secrets}',
    hints: [{ text: 'Your browser can show you what the server actually sent. Right-click → View Page Source.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'The Fine Print',
    description: "ThreadVault's legal team hid something in the Terms & Conditions. Most users never read it — maybe you should.",
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
    flag: 'CTF{jwt_payload_is_not_private}',
    hints: [{ text: 'jwt.io is a handy tool. Your token is in localStorage.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'The Helpful Assistant',
    description: "ThreadVault's AI shopping assistant is very helpful. Maybe too helpful. See if you can get it to reveal something it shouldn't.",
    category: 'prompt-injection', difficulty: 'medium', points: 200,
    flag: 'CTF{prompt_injection_unlocked}',
    hints: [{ text: 'Try asking the assistant to ignore its previous instructions.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Welcome, Administrator',
    description: "The ThreadVault admin panel is locked. Or is it? Try the obvious before you try the clever.",
    category: 'default-credentials', difficulty: 'easy', points: 100,
    flag: 'CTF{default_creds_never_change}',
    hints: [{ text: 'admin / admin is a classic for a reason.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'The Search Bar Speaks',
    description: "ThreadVault's product search passes your input somewhere it probably shouldn't. What happens when you ask it something unusual?",
    category: 'sql-injection', difficulty: 'medium', points: 200,
    flag: 'CTF{sql_i_found_the_vault}',
    hints: [
      { text: 'Look at the reviews on any product. Who left them?', cost: 0 },
      { text: "The search endpoint doesn't sanitise input. Try a single quote.", cost: 50 },
    ],
    isActive: true,
  },
  {
    title: 'Verbose Errors',
    description: "ThreadVault's login endpoint is a little too talkative when things go wrong. See what you can learn from a failed login.",
    category: 'other', difficulty: 'easy', points: 100,
    flag: 'CTF{error_messages_leak_info}',
    hints: [{ text: 'Try logging in with a real email address but the wrong password. Then try a fake email.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Social Engineering 101',
    description: "ThreadVault's forgot password flow asks a security question. The answer is out there — you just have to find it.",
    category: 'auth-bypass', difficulty: 'easy', points: 100,
    flag: 'CTF{social_profile_exposed_answer}',
    hints: [{ text: 'Check the About page. The founder likes to overshare.', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Stack the Savings',
    description: "ThreadVault's checkout applies discount codes at face value. What happens if you apply more than one?",
    category: 'logic-flaw', difficulty: 'easy', points: 100,
    flag: 'CTF{discount_stacking_exploit}',
    hints: [{ text: 'Try applying a discount code twice. Does the total keep going down?', cost: 0 }],
    isActive: true,
  },
  {
    title: 'Something Went Wrong',
    description: "StyleBot crashed — and ThreadVault's error handler had a lot to say about it. See what gets exposed when the bot can't cope.",
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
  { title: 'TBD', description: 'Coming soon.', category: 'other', difficulty: 'easy', points: 100, flag: 'CTF{tbd_flag_13}', isActive: false },
  { title: 'TBD', description: 'Coming soon.', category: 'other', difficulty: 'easy', points: 100, flag: 'CTF{tbd_flag_14}', isActive: false },
];

// ─── Run ──────────────────────────────────────────────────────────────────────

async function seedGlobal() {
  
  // ── Admin user ──────────────────────────────────────────────────────────────
  let admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    admin = await User.create({
      username: 'admin',
      email: 'admin@threadvault.com',
      password: 'admin',        // CTF: intentional vulnerability — default-credentials
      role: 'admin',
      securityQuestion: "What is your pet's name?",
      securityAnswer: 'biscuit', // CTF: discoverable via fictional social profile (Flag #9)
    });
    console.log('Created admin user');
  } else {
    console.log('Admin already exists — skipping');
  }

  // ── Victim user "alice" ─────────────────────────────────────────────────────
  let alice = await User.findOne({ username: 'alice' });
  if (!alice) {
    alice = await User.create({
      username: 'alice',
      email: 'alice@threadvault.com',
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
  const productCount = await Product.countDocuments();
  if (productCount === 0) {
    await Product.insertMany(PRODUCTS);
    console.log(`Inserted ${PRODUCTS.length} products`);
  } else {
    console.log(`Products already exist (${productCount}) — skipping`);
  }

  // ── Alice's flagged order (IDOR flag) ───────────────────────────────────────
  // CTF: intentional vulnerability — insecure-api (IDOR, Flag #3)
  // sessionId: null so the cron never cleans it up — always discoverable by any player.
  const aliceOrderExists = await Order.findOne({ user: alice._id, sessionId: null });
  if (!aliceOrderExists) {
    const products = await Product.find({ isActive: true });
    await Order.create({
      orderNumber: 1,
      user: alice._id,
      sessionId: null,
      items: [{ product: products[0]._id, size: 'M', quantity: 1, priceAtPurchase: products[0].price }],
      total: products[0].price,
      status: 'delivered',
      shippingAddress: {
        fullName: 'Alice Smith',
        street: '12 Harbour View',
        city: 'Auckland',
        postcode: '1010',
        country: 'New Zealand',
      },
      internalNote: 'CTF{idor_order_exposed}',
    });
    console.log("Created alice's flagged order");
  } else {
    console.log("Alice's flagged order already exists — skipping");
  }

  // ── Challenges ──────────────────────────────────────────────────────────────
  // Upsert by title so re-running the seed updates existing records (e.g. TBD
  // slots that have been filled in) without wiping solve counts on other fields.
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