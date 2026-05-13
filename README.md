# APapparel — Interactive Web CTF Lab

> A hands-on Capture the Flag platform where the entire website is the challenge.  
> Built with the MERN stack (MongoDB, Express, React, Node.js).

**Team members:**
- Ryan Gin _(rgin216@aucklanduni.ac.nz)_
- Soham Kulkarni _(skul970@aucklanduni.ac.nz)_
- Om Patel _(opat597@aucklanduni.ac.nz)_
- Rudra Patel _(rpat943@aucklanduni.ac.nz)_
- Ajith Penmatsa _(apen181@aucklanduni.ac.nz)_
- Nicky Tian _(ntia856@aucklanduni.ac.nz)_
- Nathan Turley _(ntur101@aucklanduni.ac.nz)_

---

## Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3                 |
| Backend    | Node.js, Express.js, Winston                    |
| Database   | MongoDB Atlas                                   |
| Auth       | JWT (7 day sessions), bcryptjs                  |
| AI         | Groq API (llama-3.1-8b-instant) — HelpBot       |
| Hosting    | Vercel (frontend) + Google Cloud (backend)      |
| Testing    | Jest + Supertest (backend), Vitest (frontend)   |

---

## Project Structure

```
group-project-access-denied/
├── backend/          Node.js + Express API
│   └── src/
│       ├── config/       Database connection + seeding
│       ├── controllers/  Route logic
│       ├── middleware/   Auth + error handling
│       ├── models/       Mongoose schemas
│       ├── routes/       API route definitions
│       └── utils/        Logger (Winston)
├── frontend/         React + Vite app
│   └── src/
│       ├── api/          API call functions
│       ├── components/   Shared UI components
│       ├── context/      Auth + Cart context
│       └── pages/        Page-level components
└── docker-compose.yml   Full local stack
```

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/)
- MongoDB Atlas connection string (get from team)

---

## Local Development Setup

### 1. Clone the repo

```bash
git clone https://github.com/UOA-CS732-S1-2026/group-project-access-denied.git
cd group-project-access-denied
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev   # runs on http://localhost:5001
```

Open `backend/.env` and fill in:
- `MONGO_URI` — Atlas connection string from the team
- `JWT_SECRET` — any long random string
- `GROQ_API_KEY` — Groq API key (for HelpBot)

### 3. Set up the frontend
Open a **second terminal**:

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:3000
```

The Vite dev server proxies `/api` requests to `localhost:5001` automatically — no `.env` needed for local development.

### 4. Open the app
Visit http://localhost:3000

---

## Full Docker Setup (for demos / final testing)

Runs everything (frontend, backend, MongoDB) in containers with one command.

```bash
# From the project root
cp backend/.env.example backend/.env   # fill in JWT_SECRET and GROQ_API_KEY first
docker compose up --build
```

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:5173      |
| Backend   | http://localhost:5000      |
| MongoDB   | mongodb://localhost:27017  |

---

## Running Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## API Endpoints

Base URL (local): `http://localhost:5001/api`  
Base URL (production): Google Cloud backend URL

### Auth
| Method | Endpoint                          | Auth | Description                        |
|--------|-----------------------------------|------|------------------------------------|
| POST   | `/api/auth/register`              | None | Create a new account               |
| POST   | `/api/auth/login`                 | None | Login and receive JWT              |
| GET    | `/api/auth/me`                    | JWT  | Get current user profile           |
| POST   | `/api/auth/forgot-password`       | None | Get security question for account  |
| POST   | `/api/auth/forgot-password/verify`| None | Verify answer and receive JWT      |

### Products
| Method | Endpoint              | Auth       | Description              |
|--------|-----------------------|------------|--------------------------|
| GET    | `/api/products`       | JWT        | List all products        |
| GET    | `/api/products/:id`   | JWT        | Get a single product     |
| POST   | `/api/products`       | JWT, Admin | Create a product         |
| PUT    | `/api/products/:id`   | JWT, Admin | Update a product         |
| DELETE | `/api/products/:id`   | JWT, Admin | Delete a product         |

### Orders
| Method | Endpoint                  | Auth       | Description              |
|--------|---------------------------|------------|--------------------------|
| GET    | `/api/orders`             | JWT        | Get current user's orders|
| GET    | `/api/orders/:orderNumber`| JWT        | Get a specific order     |
| POST   | `/api/orders`             | JWT        | Place a new order        |
| GET    | `/api/orders/admin/all`   | JWT, Admin | Get all orders           |

### Challenges & Flags
| Method | Endpoint                          | Auth       | Description              |
|--------|-----------------------------------|------------|--------------------------|
| GET    | `/api/challenges`                 | JWT        | List all challenges      |
| GET    | `/api/challenges/:id`             | JWT        | Get a single challenge   |
| POST   | `/api/challenges/:id/hint/:idx`   | JWT        | Unlock a hint            |
| POST   | `/api/flags/submit`               | JWT        | Submit a flag            |
| GET    | `/api/scoreboard`                 | JWT        | Get leaderboard          |

### Admin
| Method | Endpoint                              | Auth       | Description                    |
|--------|---------------------------------------|------------|--------------------------------|
| GET    | `/api/admin/products`                 | JWT, Admin | Admin product list             |
| POST   | `/api/admin/products/:id/import-image`| JWT, Admin | Import product image from URL  |

### Other
| Method | Endpoint                  | Auth  | Description                   |
|--------|---------------------------|-------|-------------------------------|
| POST   | `/api/chat`               | None  | Send a HelpBot message        |
| GET    | `/api/chat/:sessionId`    | None  | Get chat session history      |
| GET    | `/api/health`             | None  | Health check                  |
| GET    | `/robots.txt`             | None  | CTF breadcrumb                |

---

## Git Workflow

We follow a **feature-branch workflow**:

```
main       ← stable releases only (PR required, 1 reviewer)
feature/*  ← new features
fix/*      ← bug fixes
refactor/* ← refactoring / cleanup
```

**Branch naming examples:**
```
feature/auth-login
feature/challenge-page
fix/flag-submission-error
refactor/seed-cleanup
```

---

## Environment Variables

### Backend (`backend/.env`)
| Variable         | Description                        | Example                                        |
|------------------|------------------------------------|------------------------------------------------|
| `NODE_ENV`       | Environment mode                   | `development`                                  |
| `PORT`           | Backend port                       | `5001`                                         |
| `MONGO_URI`      | MongoDB Atlas connection string    | `mongodb+srv://user:pass@cluster.mongodb.net`  |
| `JWT_SECRET`     | Secret key for signing JWTs        | any long random string                         |
| `JWT_EXPIRES_IN` | Token expiry duration              | `7d`                                           |
| `CLIENT_URL`     | Frontend URL (for CORS)            | `http://localhost:3000`                        |
| `GROQ_API_KEY`   | Groq API key for HelpBot           | from groq.com                                  |

> ⚠️ Never commit `.env` files. They are already in `.gitignore`.
