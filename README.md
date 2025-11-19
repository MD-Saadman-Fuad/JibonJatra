# JibonJatra

## Project Overview

JibonJatra is a local-market style web application that allows users to create and manage posts, market items, services, home rentals, reviews and advertisements. The project is built as a Node.js + Express REST API (backend) with a React frontend.

![Screenshot](frontend/public/screenshot.png)

> Place a screenshot at `frontend/public/screenshot.png` or update the path to where you store screenshots (for example `screenshots/`).

---

## Main Technologies

- Node.js
- Express
- MongoDB (Mongoose)
- React
- Tailwind CSS
- Axios
- Multer (file uploads)

---

## Key Features

- User registration and authentication (JWT)
- Create, edit and list posts
- Add/edit market items with image uploads
- Service and home rental postings
- Review and rating system
- Admin panel for announcements, user management, sponsored posts, etc.

---

## Major Dependencies (selected)

### Backend (directory: `backend`)

- `express`
- `mongoose`
- `dotenv`
- `cors`
- `jsonwebtoken`
- `bcrypt` / `bcryptjs`
- `multer`
- `nodemon` (dev dependency)

### Frontend (directory: `frontend`)

- `react`
- `react-dom`
- `react-router-dom`
- `axios`
- `tailwindcss`
- `react-scripts`
- `lottie-react` (for animations)

> Check each subproject's `package.json` for the full list of dependencies.

---

## Run Locally (PowerShell)

The repository contains two main subprojects: `backend` and `frontend`. Follow these steps:

1. Clone the repo (if you haven't already)

```powershell
git clone https://github.com/MD-Saadman-Fuad/JibonJatra.git
cd "JibonJatra"
```

2. Backend setup

```powershell
cd backend
npm install
# Create a .env file (example below) then
npm run dev
```

Backend `.env` example (replace values):

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

3. Frontend setup

```powershell
cd ../frontend
npm install
npm start
```

- Running `npm start` will open the React dev server (http://localhost:3000 by default).
- The backend defaults to port `5000` (configurable via `.env`).

---

## Live Links & Relevant URLs

- Repository: https://github.com/MD-Saadman-Fuad/JibonJatra
- Live Demo: <add your live site URL here>
- Add any deployment docs or hosting links (Render/Netlify/Heroku) here.

---

## Important Notes (default branch)

- Current branch: `main` — change the branch name in commands if you use a different branch.

---

## How to Discard Local Changes (DESTRUCTIVE — be careful)

The commands below will permanently remove local uncommitted changes and/or unpushed commits. Back up first if you want to keep anything.

Recommended: create a backup branch or stash before destructive actions:

```powershell
git stash push -m "backup before destructive reset"
# or
git checkout -b backup-local-changes
git add .
git commit -m "backup local work"
```

To discard all local uncommitted changes and untracked files:

```powershell
git reset --hard HEAD; git clean -fd
```

To reset your local `main` to match remote `origin/main` (this will remove unpushed commits):

```powershell
git fetch origin; git reset --hard origin/main
```

> Warning: These commands are destructive. If you want me to run them now, confirm which option below you want:

- `run-reset-now` — Run the destructive reset and sync to `origin/main` now.
- `backup-and-reset` — Create a backup branch commit first, then reset to `origin/main`.
- `dont-run` — I will not run any git commands; you can run them yourself.

---

## Contributing & License

Feel free to contribute — open an issue or send a pull request.

License: (add license here if needed)

---

If you'd like any section changed (screenshot, live link, `.env` examples, etc.), tell me what to update and I'll apply it.
