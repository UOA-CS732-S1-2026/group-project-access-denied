# ThreadVault — Interactive Web CTF Lab

> A hands-on Capture the Flag platform where the entire website is the challenge.  
> Built with the MERN stack (MongoDB, Express, React, Node.js).

<<<<<<< HEAD
=======
> **Ports:** Backend runs on `5001`, frontend on `3000`. These are locked in code — do not change them.

>>>>>>> main
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

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3   |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB Atlas                     |
| Auth       | JWT (2 hour sessions)             |
| Hosting    | Fly.io                            |

---

## Project Structure

```
group-project-access-denied/
├── backend/          Node.js + Express API
│   └── src/
│       ├── config/       Database connection
│       ├── controllers/  Route logic
│       ├── middleware/   Auth + error handling
│       ├── models/       Mongoose schemas
│       ├── routes/       API route definitions
│       └── utils/        Logger
├── frontend/         React + Vite app
│   └── src/
│       ├── components/   Shared UI components
│       ├── context/      Auth + Cart context
│       ├── pages/        Page-level components
│       └── services/     API call functions
└── seed/             Database fixtures
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
git clone <repo-url>
cd group-project-access-denied
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev   # runs on http://localhost:5001
```

<<<<<<< HEAD
Open `backend/.env` and set:
- `JWT_SECRET` — any random string
- `MONGO_URI` — Atlas connection string from the team

### 3. Set up the frontend
=======
`JWT_SECRET` can be any random string — it does not need to match other teammates.

> The default `MONGO_URI` in `.env.example` already points to `localhost:27017` — no changes needed if you used the Docker command above.

### 4. Set up the frontend
>>>>>>> main

Open a **second terminal**:

```bash
cd frontend
npm install
<<<<<<< HEAD
npm run dev   # runs on http://localhost:3000
```

Create `frontend/.env`:
```
VITE_API_URL=http://localhost:5001/api
```

### 4. Open the app
=======
npm run dev
```

Create `frontend/.env`:

```
VITE_API_URL=http://localhost:5001/api
```

### 5. Open the app

Visit http://localhost:3000

---

## Full Docker Setup (for demos / final testing)

Runs everything (frontend, backend, MongoDB) in containers with one command.

```bash
# From the project root
cp backend/.env.example backend/.env   # fill in JWT_SECRET first
docker compose up --build
```

| Service   | URL                        |
|-----------|----------------------------|
| Frontend  | http://localhost:3000      |
| Backend   | http://localhost:5001      |
| MongoDB   | mongodb://localhost:27017  |
>>>>>>> main

Visit http://localhost:3000

---

## API Endpoints

Base URL: `http://localhost:5001/api`

| Method | Endpoint                  | Auth     | Description                  |
|--------|---------------------------|----------|------------------------------|
| POST   | `/api/auth/register`      | None     | Create a new account         |
| POST   | `/api/auth/login`         | None     | Login and receive JWT        |
| GET    | `/api/auth/me`            | JWT      | Get current user profile     |
| GET    | `/api/challenges`         | JWT      | List all active challenges   |
| GET    | `/api/challenges/:id`     | JWT      | Get a single challenge       |
| POST   | `/api/flags/submit`       | JWT      | Submit a flag                |
| GET    | `/api/scoreboard`         | JWT      | Get leaderboard              |
| GET    | `/api/health`             | None     | Health check                 |

---

## Git Workflow

We follow a **feature-branch workflow**:

```
main       ← stable releases only (PR required, 1 reviewer)
develop    ← integration branch (merge feature branches here)
feature/*  ← individual feature branches
```

**Branch naming:**
```
feature/auth-login
feature/challenge-page
bugfix/flag-submission-error
```
---

## Environment Variables

### Backend (`backend/.env`)

<<<<<<< HEAD
| Variable         | Description                   | Example                                      |
|------------------|-------------------------------|----------------------------------------------|
| `NODE_ENV`       | Environment mode              | `development`                                |
| `PORT`           | Backend port                  | `5001`                                       |
| `MONGO_URI`      | MongoDB Atlas connection string | `mongodb+srv://user:pass@cluster.mongodb.net` |
| `JWT_SECRET`     | Secret key for signing JWTs   | any long random string                       |
| `JWT_EXPIRES_IN` | Token expiry duration         | `2h`                                         |
| `CLIENT_URL`     | Frontend URL (for CORS)       | `http://localhost:3000`                      |
=======
| Variable            | Description                        | Example                          |
|---------------------|------------------------------------|----------------------------------|
| `NODE_ENV`          | Environment mode                   | `development`                    |
| `PORT`              | Backend port                       | `5001` (5000 is taken by AirPlay on macOS) |
| `MONGO_URI`         | MongoDB connection string          | `mongodb://localhost:27017/access-denied` |
| `JWT_SECRET`        | Secret key for signing JWTs        | any long random string (can differ per developer)           |
| `JWT_EXPIRES_IN`    | Token expiry duration              | `7d`                             |
| `CLIENT_URL`        | Frontend URL (for CORS)            | `http://localhost:3000`          |
>>>>>>> main

### Frontend (`frontend/.env`)

| Variable       | Description              | Example                        |
|----------------|--------------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL     | `http://localhost:5001/api`    |

> ⚠️ Never commit `.env` files. They are already in `.gitignore`.
