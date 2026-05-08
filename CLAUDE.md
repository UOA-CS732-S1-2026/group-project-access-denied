# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with
code in this repository.

## Project Overview

**APapparel** is a fictional trendy online fashion retailer selling clothing and
shoes. The storefront looks and feels like a real e-commerce site — but it is
intentionally riddled with security vulnerabilities for use as a CTF lab.

Players browse APapparel as if they were real shoppers. Flags are hidden inside
the vulnerabilities woven into the store's features — a SQL injection on the
search bar, XSS in product reviews, an exposed `.env` at a misconfigured route,
default admin credentials, and so on. The goal is a beginner-friendly
introduction to OWASP Top 10 through a believable, cohesive application rather
than isolated puzzles.

There are **7 team members, each implementing 2 flags = 14 flags total**. Each
flag is `CTF{...}` format and must feel like it naturally belongs to the
APapparel store, not bolted on.

### Store Pages

The following pages make up the APapparel storefront. Every page must feel like
part of the same coherent store:

| Page               | Route           | Auth   | Purpose                                     |
| ------------------ | --------------- | ------ | ------------------------------------------- |
| Landing / Homepage | `/`             | Public | Hero banner, featured products, brand intro |
| Product Listing    | `/products`     | Public | Browse with category/size/price filters     |
| Product Detail     | `/products/:id` | Public | Images, description, reviews, add to cart   |
| Shopping Cart      | `/cart`         | Public | Review items, quantities, subtotal          |
| Checkout           | `/checkout`     | JWT    | Shipping details, order confirmation        |
| Order History      | `/orders`       | JWT    | Past orders per user                        |
| Account / Profile  | `/account`      | JWT    | Edit profile, change password               |
| Admin Panel        | `/admin`        | Admin  | Manage products, orders, users              |

### Feature Priority

**Must-Have** (core, should always be preserved): user auth, store UI with all
pages above, flag discovery + submission, challenge validation API, scoreboard,
14 embedded vulnerabilities.

**Should-Have** (implemented or in progress): hint system, progress tracking,
admin panel for challenge management, challenge descriptions, interaction
logging.

**Could-Have** (if time allows): CSRF/insecure file upload vulnerabilities,
achievement/badge system, walkthrough explanations after solving.

**Nice-to-Have** (future): dynamic challenge generation, timed competitions,
team mode.

## Commands

### Backend (`/backend`)

```bash
npm run dev      # Start with nodemon (watches for changes), runs on :5001
npm start        # Production server
npm test         # Jest tests with coverage
```

To run a single test file: `npm test -- src/__tests__/auth.test.js`

### Frontend (`/frontend`)

```bash
npm run dev      # Vite dev server at http://localhost:5173
npm run build    # Production build → dist/
npm run lint     # ESLint (max-warnings: 0 — zero warnings allowed)
npm run preview  # Preview production build locally
```

### Full Stack with Docker

```bash
docker compose up --build   # MongoDB + backend (:5000) + frontend (:5173)
```

### MongoDB only (local dev)

```bash
docker run -d -p 27017:27017 --name ctf-mongo mongo:7
docker start ctf-mongo      # subsequent starts
```

## Environment Setup

**Backend** — copy `backend/.env.example` to `backend/.env` and set at minimum:

- `JWT_SECRET` — any random string
- `MONGO_URI` — defaults to `mongodb://localhost:27017/access-denied`
- `PORT` — defaults to 5001 (macOS reserves 5000 for AirPlay)
- `CLIENT_URL` — defaults to `http://localhost:5173` for CORS

**Frontend** — optionally create `frontend/.env`:

- `VITE_API_URL=http://localhost:5001/api` — if not set, code falls back to port
  5000

## Architecture

### Stack

- **Frontend**: React 18 + Vite, React Router v7, Axios, Tailwind CSS
- **Backend**: Node.js + Express 4, Mongoose 8, JWT auth, bcryptjs, Helmet,
  Winston
- **Database**: MongoDB 7

### Auth Flow

1. Register/login → backend hashes password (bcryptjs, 12 rounds) → returns JWT
2. Frontend stores JWT in `localStorage` → `AuthContext` updates global state
3. Axios interceptor auto-attaches `Authorization: Bearer <token>` to all
   requests
4. Backend `protect` middleware verifies JWT → attaches `req.user`
5. `adminOnly` middleware gates challenge CRUD to `req.user.role === 'admin'`

### Key Design Decisions

- **Intentional vulnerabilities**: When implementing CTF challenges, the app
  deliberately introduces insecure patterns (e.g. unsanitised inputs, weak auth)
  in controlled areas. Do not "fix" these — they are the challenges. Distinguish
  between intentional vulnerabilities (part of CTF design) and unintentional
  bugs.
- **Flag security**: The `flag` field on the Challenge model uses
  `select: false` — it is never returned in API responses unless explicitly
  requested with `.select('+flag')` in the controller.
- **Role-based access**: Users have `role: 'user'` or `'admin'`. Admin routes
  check this server-side.
- **Error handling**: All errors propagate to a global Express error handler
  middleware. Controllers use `next(error)` pattern.
- **CORS**: Restricted to `CLIENT_URL` env var — must be set correctly in
  production.

### API Routes

| Method | Path                  | Auth  | Description          |
| ------ | --------------------- | ----- | -------------------- |
| POST   | `/api/auth/register`  | None  | Register user        |
| POST   | `/api/auth/login`     | None  | Login, returns JWT   |
| GET    | `/api/auth/me`        | JWT   | Get current user     |
| GET    | `/api/challenges`     | JWT   | List all challenges  |
| GET    | `/api/challenges/:id` | JWT   | Get challenge detail |
| POST   | `/api/challenges`     | Admin | Create challenge     |
| PUT    | `/api/challenges/:id` | Admin | Update challenge     |
| DELETE | `/api/challenges/:id` | Admin | Delete challenge     |
| POST   | `/api/flags/submit`   | JWT   | Submit a flag        |
| GET    | `/api/scoreboard`     | JWT   | Get leaderboard      |
| GET    | `/api/health`         | None  | Health check         |

### Frontend Route Structure

```
App.jsx routes:
  /               → HomePage (public)
  /login          → LoginPage (public)
  /register       → RegisterPage (public)
  /challenges     → ChallengePage (ProtectedRoute)
  /scoreboard     → ScoreboardPage (ProtectedRoute)
  *               → NotFoundPage
```

`ProtectedRoute` redirects unauthenticated users to `/login`.

### Data Models

- **User**: email, username, password (hashed), role, solvedChallenges (array of
  Challenge refs)
- **Challenge**: title, description, category, difficulty, points, flag
  (select:false), hints (with cost), isActive
- **Submission**: user ref, challenge ref, submittedFlag, isCorrect, timestamp —
  tracks all attempts

### Challenge Categories

`sql-injection`, `xss`, `auth-bypass`, `exposed-files`, `insecure-api`,
`default-credentials`, `other`

## Data Schemas

- **Cart**: localStorage only — no database collection.
- **Reviews**: separate collection — not embedded on Product.

### User

| Field            | Type       | Constraints                                  |
| ---------------- | ---------- | -------------------------------------------- |
| username         | String     | required, unique, trim                       |
| email            | String     | required, unique, lowercase, trim            |
| password         | String     | required, select: false                      |
| role             | String     | enum: `['user', 'admin']`, default: `'user'` |
| securityQuestion | String     | required                                     |
| securityAnswer   | String     | required, lowercase, trim                    |
| solvedChallenges | [ObjectId] | ref: `Challenge`                             |
| createdAt        | Date       | default: now                                 |

### Product

| Field       | Type     | Constraints                             |
| ----------- | -------- | --------------------------------------- |
| name        | String   | required, trim                          |
| description | String   | required                                |
| price       | Number   | required, min: 0                        |
| category    | String   | required, enum: `['clothing', 'shoes']` |
| sizes       | [String] | no enum — validated in seed only        |
| images      | [String] | array of URLs                           |
| stock       | Number   | required, default: 0, min: 0            |
| isActive    | Boolean  | default: true                           |
| createdAt   | Date     | default: now                            |

### Order

| Field           | Type     | Constraints                                                                                                                            |
| --------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| user            | ObjectId | ref: `User`, required                                                                                                                  |
| items           | [Object] | `{ product: ObjectId ref Product required, size: String required, quantity: Number required min 1, priceAtPurchase: Number required }` |
| total           | Number   | required                                                                                                                               |
| status          | String   | enum: `['pending', 'processing', 'delivered', 'cancelled']`, default: `'pending'`                                                      |
| shippingAddress | Object   | `{ fullName, street, city, postcode, country }` — all String, required                                                                 |
| internalNote    | String   | default: `''` — CTF: never rendered in UI; seed populates this with the IDOR flag                                                      |
| discountApplied | Number   | default: 0 — CTF: tracks discount amount for the discount-stacking flag                                                                |
| createdAt       | Date     | default: now                                                                                                                           |

### Review

| Field     | Type     | Constraints                                                                                               |
| --------- | -------- | --------------------------------------------------------------------------------------------------------- |
| user      | ObjectId | ref: `User`, required                                                                                     |
| product   | ObjectId | ref: `Product`, required                                                                                  |
| username  | String   | required — CTF: publicly rendered on product page; required for the SQL injection flag to be discoverable |
| rating    | Number   | required, min: 1, max: 5                                                                                  |
| body      | String   | required, maxLength: 1000                                                                                 |
| createdAt | Date     | default: now                                                                                              |

### Challenge

| Field       | Type     | Constraints                                                                                                                                                  |
| ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title       | String   | required                                                                                                                                                     |
| description | String   | required                                                                                                                                                     |
| category    | String   | required, enum: `['sql-injection', 'xss', 'auth-bypass', 'exposed-files', 'insecure-api', 'default-credentials', 'prompt-injection', 'logic-flaw', 'other']` |
| difficulty  | String   | required, enum: `['easy', 'medium', 'hard']`                                                                                                                 |
| points      | Number   | required, enum: `[100, 200, 300]`                                                                                                                            |
| flag        | String   | required, select: false                                                                                                                                      |
| hints       | [Object] | `{ text: String required, cost: Number default 0 }`                                                                                                          |
| isActive    | Boolean  | default: true                                                                                                                                                |

### Submission

| Field         | Type     | Constraints                |
| ------------- | -------- | -------------------------- |
| user          | ObjectId | ref: `User`, required      |
| challenge     | ObjectId | ref: `Challenge`, required |
| submittedFlag | String   | required                   |
| isCorrect     | Boolean  | required                   |
| createdAt     | Date     | default: now               |

## CI/CD

- **Backend CI** (`.github/workflows/backend-ci.yml`): Node 20, MongoDB 7
  service container, runs `npm ci && npm test -- --passWithNoTests`
- **Frontend CI** (`.github/workflows/frontend-ci.yml`): Node 20, runs
  `npm ci && npm run lint && npm run build`

Both workflows trigger on push/PR to any branch.

## Testing Status

- **Backend**: Jest 29 + Supertest configured; no test files written yet. CI
  uses `--passWithNoTests`. Add test files under `backend/src/__tests__/`.
- **Frontend**: No test framework configured yet.
- CI env vars for backend tests: `NODE_ENV=test`,
  `MONGODB_URI=mongodb://localhost:27017/access-denied-test`

## Design Consistency

APapparel must look like a single product built by one team, not a patchwork of
individually styled pages. Treat visual consistency as a hard requirement, not a
nice-to-have.

### Rules

- **Shared components first**: All reusable UI lives in
  `frontend/src/components/common/`. Before building a button, card, input,
  modal, badge, or layout wrapper from scratch, check if one already exists. If
  it doesn't exist yet, add it there so others can use it.

  **Components in `common/`:**
  - `Navbar.jsx` — Reusable navbar for all store pages (HomePage,
    ProductListing, OrderHistoryPage, ProfilePage, ShoppingCartPage)
  - `navbarStyles.js` — Extracted Tailwind utility class strings
    (navbarContainer, navLinkDefault, navLinkActive, cartBadge, logoText,
    iconButton)
  - `FlagFoundModal.jsx` - reusable frontend modal for displaying discovered
    flags.

```jsx
import { useState } from "react";
import FlagFoundModal from "../components/FlagFoundModal";

const ExamplePage = () => {
  const [showFlagModal, setShowFlagModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowFlagModal(true)}>
        Trigger Flag
      </button>

      {showFlagModal && (
        <FlagFoundModal
          flag="CTF{example_flag_here}"
          onClose={() => setShowFlagModal(false)}
        />
      )}
    </>
  );
};

export default ExamplePage;
```

- **Tailwind only**: No inline `style` props, no CSS modules, no separate `.css`
  files for component styling. All styling is Tailwind utility classes.
- **Colour palette**: Use a consistent set of Tailwind colour tokens across the
  app. Agree on a primary accent colour (e.g. `indigo-600`) and neutrals (e.g.
  `zinc-*`) before building pages — do not introduce new palette choices
  unilaterally.
- **Typography**: Stick to one font scale (`text-sm`, `text-base`, `text-lg`,
  `text-xl`, `text-2xl`, `text-3xl`). Headings follow the same weight and size
  hierarchy on every page.
- **Spacing & layout**: Pages use consistent max-width containers
  (`max-w-7xl mx-auto px-4`) and vertical rhythm. Don't invent new spacing
  patterns per page.
- **Component tone**: Buttons, form fields, product cards, and alerts should
  look identical across pages — same border radius, same shadow, same hover
  states.

If you are unsure whether your UI matches the rest of the store, compare it
against an existing page before opening a PR.

## Flag Design Principles

Flags are the core mechanic of the CTF. They must feel like genuine security
flaws in APapparel, not artificial puzzles.

### Format

All flags follow: `CTF{descriptive_snake_case_phrase}` — e.g.
`CTF{sql_i_found_the_vault}`, `CTF{xss_in_the_reviews}`.

### Embedding rules

- **Natural placement**: The vulnerability must make sense in the store context.
  A search bar can have SQL injection. A review form can have XSS. An order API
  can be insecure. A `.env` file can be exposed at a guessable URL. Don't invent
  pretextless endpoints just to hide a flag.
- **No overlap**: Each team member owns a distinct vulnerability area.
  Coordinate before implementation — two SQL injections or two XSS flags on the
  same surface is not allowed.
- **Proportional difficulty**: Flags should range across easy (obvious
  misconfiguration, default credentials), medium (chained requests, parameter
  tampering), and hard (multi-step exploit, requires reading response
  behaviour). Spread difficulty across the 14 flags.
- **Hints match the tone**: Hints are written as if APapparel's fictional IT
  team left breadcrumbs — internal comments, vague error messages, suspiciously
  named routes. They should not say "try SQL injection here". Write hints a real
  attacker would find plausible.
- **Mark intentional vulnerabilities in code**: Add a comment
  `// CTF: intentional vulnerability — [category]` next to deliberately insecure
  code so reviewers know not to patch it.

### Vulnerability area ownership

No two flags should target the same page + vulnerability type combination.
Update the Status column as work progresses.

| #  | Page / Feature          | Vuln Type                                           | Difficulty | Status         |
| -- | ----------------------- | --------------------------------------------------- | ---------- | -------------- |
| 1  | Homepage HTML source    | Hidden comment in source                            | 🟢 Easy    | 🔴 Not started |
| 2  | Terms & Conditions page | Hidden in plain text                                | 🟢 Easy    | 🔴 Not started |
| 3  | `/orders` endpoint      | Broken auth / IDOR                                  | 🟡 Medium  | 🔴 Not started |
| 4  | JWT token payload       | Exposed sensitive data in token                     | 🟢 Easy    | 🔴 Not started |
| 5  | Chatbot                 | Prompt injection                                    | 🟡 Medium  | 🔴 Not started |
| 6  | Admin login             | Default credentials                                 | 🟢 Easy    | 🔴 Not started |
| 7  | Product search / login  | SQL injection                                       | 🟡 Medium  | 🔴 Not started |
| 8  | Login / API responses   | Error message over-disclosure                       | 🟢 Easy    | 🔴 Not started |
| 9  | Forgot password flow    | Security question answer exposed via social profile | 🟢 Easy    | 🔴 Not started |
| 10 | Checkout                | Discount code stacking / logic flaw                 | 🟢 Easy    | 🔴 Not started |
| 11 | TBD                     | TBD                                                 | TBD        | 🔴 Not started |
| 12 | TBD                     | TBD                                                 | TBD        | 🔴 Not started |
| 13 | TBD                     | TBD                                                 | TBD        | 🔴 Not started |
| 14 | TBD                     | TBD                                                 | TBD        | 🔴 Not started |

### Cross-flag dependencies

Some flags require specific store features to exist for the exploit to be
believable. These are shared implementation requirements:

- **Flag 7 (SQL injection)**: The admin account's username must be discoverable
  before the injection is meaningful. Whoever builds the product reviews feature
  must render the reviewer's username publicly — not just a display name.
- **Flag 9 (security question)**: The forgot-password flow asks a security
  question (pet's name, mother's maiden name, etc.). The answer must be
  discoverable via a fictional social media profile for the admin user. The
  store needs a visible link or "About the founder" section somewhere (homepage,
  footer, or a `/team` page) that connects to this profile and leaks the answer.

## Git Workflow

- PRs required to merge into `main`; `develop` branch used for integration
  before `main`
- Branch naming: `feature/*`, `bugfix/*`, `chore/*`
- Use the PR template at
  [.github/PULL_REQUEST_TEMPLATE.md](.github/PULL_REQUEST_TEMPLATE.md)
- Team communication via Discord; tasks tracked on GitHub Projects (Kanban: To
  Do → In Progress → Completed)
