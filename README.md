# Access Denied — Interactive Web CTF Lab

> A hands-on Capture the Flag platform where the entire website is the challenge.  
> Built with the MERN stack (MongoDB, Express, React, Node.js).

> **macOS note:** Port 5000 is reserved by AirPlay Receiver on macOS. The backend runs on **port 5001** by default.

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
| Database   | MongoDB (via Mongoose)            |
| Auth       | JWT + Google OAuth (planned)      |
| DevOps     | Docker, Docker Compose            |

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
│       ├── context/      Auth context (global state)
│       ├── pages/        Page-level components
│       └── services/     API call functions
└── docker-compose.yml
```

---

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) v18 or higher
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (includes Docker Compose)
- [Git](https://git-scm.com/)

---

## Local Development Setup (Recommended)

This is the fastest way to work during development. You run MongoDB in Docker but the frontend and backend directly on your machine.

### 1. Clone the repo

```bash
git clone <repo-url>
cd group-project-access-denied
```

### 2. Start MongoDB in Docker

You only need to do this once. After that, Docker will remember the container.

```bash
docker run -d -p 27017:27017 --name ctf-mongo mongo:7
```

If the container already exists, just start it:

```bash
docker start ctf-mongo
```

### 3. Set up the backend

```bash
cd backend
cp .env.example .env   # then open .env and fill in JWT_SECRET
npm install
npm run dev            # runs on http://localhost:5001
```

`JWT_SECRET` can be any random string, and it does not need to match other teammates as long as each person is running their own backend locally.

> The default `MONGO_URI` in `.env.example` already points to `localhost:27017` — no changes needed if you used the Docker command above.
> **macOS users:** Port 5000 is taken by AirPlay Receiver. The `.env.example` already defaults to `PORT=5001` to avoid this.

### 4. Set up the frontend

Open a **second terminal**:

```bash
cd frontend
cp .env.example .env
npm install
npm run dev            # runs on http://localhost:5173
```

Make sure your `frontend/.env` has:
`VITE_API_URL=http://localhost:5001/api`

If you don't set this, the frontend may try port `5000` and registration/login can fail.

### 5. Open the app

Visit [http://localhost:5173](http://localhost:5173) in your browser.

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
| Frontend  | http://localhost:5173      |
| Backend   | http://localhost:5001      |
| MongoDB   | mongodb://localhost:27017  |

To stop:
```bash
docker compose down
```

To stop and wipe the database volume:
```bash
docker compose down -v
```

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
| GET    | `/api/scoreboard`         | None     | Get leaderboard              |
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

**Before merging to `develop`:**
1. Create a pull request
2. Get at least one team member to review
3. Resolve any conflicts locally before requesting a review

---

## Environment Variables

### Backend (`backend/.env`)

| Variable            | Description                        | Example                          |
|---------------------|------------------------------------|----------------------------------|
| `NODE_ENV`          | Environment mode                   | `development`                    |
| `PORT`              | Backend port                       | `5001` (5000 is taken by AirPlay on macOS) |
| `MONGO_URI`         | MongoDB connection string          | `mongodb://localhost:27017/access-denied` |
| `JWT_SECRET`        | Secret key for signing JWTs        | any long random string (can differ per developer)           |
| `JWT_EXPIRES_IN`    | Token expiry duration              | `7d`                             |
| `CLIENT_URL`        | Frontend URL (for CORS)            | `http://localhost:5173`          |

### Frontend (`frontend/.env`)

| Variable       | Description              | Example                        |
|----------------|--------------------------|--------------------------------|
| `VITE_API_URL` | Backend API base URL     | `http://localhost:5001/api`    |

> ⚠️ Never commit `.env` files. They are already in `.gitignore`.

---

![](./Access%20Denied.png)
