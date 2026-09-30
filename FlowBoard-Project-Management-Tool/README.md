# FlowBoard — Project Management Tool

A Trello-inspired collaborative project manager with authentication, project boards, task assignment, task comments, notifications, and Socket.IO live updates.

## Requirements
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup
1. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and `JWT_SECRET`.
2. Install dependencies from the root:
   ```bash
   npm run install-all
   ```
3. Start the app:
   ```bash
   npm run dev
   ```
4. Open http://localhost:5173 and register an account.

The API runs on http://localhost:5000. The Vite dev server proxies `/api` and `/socket.io` to it.

## Features
- Register/login with JWT authentication
- Create projects and invite collaborators by email
- Kanban columns: To do, In progress, Done
- Create, edit, delete, and assign tasks
- Task descriptions, due dates, priority, and comments
- In-app notifications
- Live board refresh via Socket.IO
- Responsive interface

## API overview
- `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- `GET/POST /api/projects`, `GET/PATCH/DELETE /api/projects/:id`
- `GET/POST /api/projects/:id/tasks`, `PATCH/DELETE /api/tasks/:id`
- `GET/POST /api/tasks/:id/comments`
- `GET /api/notifications`, `PATCH /api/notifications/:id/read`

For production, configure HTTPS, use a strong secret, add rate limiting, and set an explicit CORS origin.
