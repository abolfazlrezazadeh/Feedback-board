# Feedback Board

A full-stack feedback management application built with NestJS and MongoDB. Users can submit feedback through a public form, and administrators can review, triage, and resolve submissions through a protected dashboard.

## Features

- **Submit Feedback** — Public form with client-side validation to submit feedback (title + message)
- **Admin Dashboard** — Protected dashboard with summary cards and a data table to manage feedbacks
- **Status Management** — Triage feedbacks through three states: NEW → IN_REVIEW → RESOLVED
- **Session Authentication** — Simple username/password login to protect the admin area
- **Dark Theme UI** — Clean Bootstrap 5 dark mode interface

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | NestJS, TypeScript |
| Database | MongoDB, Mongoose ODM |
| Frontend | EJS templates, Bootstrap 5.3, Vanilla JS |
| Auth | Express session (memory store) |
| Validation | class-validator, ValidationPipe |

## Project Structure

```
├── src/
│   ├── auth/
│   │   ├── auth.controller.ts    # Login/logout routes
│   │   ├── auth.module.ts        # Auth module + middleware config
│   │   └── auth.middleware.ts    # Session check, redirects to /login
│   ├── feedback/
│   │   ├── dto/
│   │   │   ├── create-feedback.dto.ts
│   │   │   └── update-status.dto.ts
│   │   ├── schemas/
│   │   │   └── feedback.schema.ts
│   │   ├── feedback.controller.ts
│   │   ├── feedback.service.ts
│   │   └── feedback.module.ts
│   ├── types/
│   │   └── express.d.ts          # Session type augmentation
│   ├── view.controller.ts        # Page routes (/, /feedback, /admin)
│   ├── app.module.ts
│   └── main.ts                   # Bootstrap, session, validation, views
├── views/
│   ├── login.ejs                 # Login page
│   ├── feedback.ejs              # Submit feedback page
│   └── admin.ejs                 # Admin dashboard
├── public/
│   ├── css/style.css             # Custom dark theme styles
│   └── js/
│       ├── feedback.js           # Form submission logic
│       └── admin.js              # Dashboard table, cards, confirmation modal
├── .env.example
├── .gitignore
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

### Prerequisites

- Node.js >= 18
- MongoDB (local or remote, e.g. MongoDB Atlas)

### Setup

```bash
# 1. Clone the repository
git clone <repo-url>
cd feedback-board

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and desired admin credentials
```

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `MONGODB_URI` | `mongodb://localhost:27017/feedback-board` | MongoDB connection string |
| `PORT` | `3000` | Server port |
| `ADMIN_USERNAME` | `admin` | Admin login username |
| `ADMIN_PASSWORD` | `123456` | Admin login password |
| `SESSION_SECRET` | — | Secret used to sign session cookies |

## Running Locally

```bash
# Development (with watch mode)
npm run start:dev

# Production
npm run build
npm run start:prod
```

Open http://localhost:3000 in your browser.

## API Endpoints

All API routes are prefixed with `/api`.

### `POST /api/feedbacks`

Create a new feedback.

```json
{
  "title": "Login Bug",
  "message": "Cannot login with Google SSO"
}
```

**Validation:**
- `title`: string, 3–100 chars, required
- `message`: string, 10–1000 chars, required

**Response:** `201 Created`

```json
{
  "data": {
    "_id": "...",
    "title": "Login Bug",
    "message": "Cannot login with Google SSO",
    "status": "NEW",
    "createdAt": "2025-01-15T10:30:00.000Z",
    "updatedAt": "2025-01-15T10:30:00.000Z"
  }
}
```

---

### `GET /api/feedbacks`

List all feedbacks sorted by newest first.

**Response:** `200 OK`

```json
{
  "data": [ ... ]
}
```

---

### `PATCH /api/feedbacks/:id/status`

Update the status of a feedback.

```json
{
  "status": "IN_REVIEW"
}
```

**Valid values:** `NEW` | `IN_REVIEW` | `RESOLVED`

**Response:** `200 OK`

**Errors:**
- `400` — invalid status or missing fields
- `404` — feedback ID not found

## Pages

| Route | Description | Auth Required |
|---|---|---|
| `/` or `/feedback` | Submit feedback form | No |
| `/admin` | Admin dashboard with summary cards and table | Yes |
| `/login` | Admin login page | No |

## Screenshots

> *Screenshots would be added here for the take-home submission.*

| Page | Description |
|------|-------------|
| Submit Feedback | Form with title input, message textarea, validation feedback, success alert |
| Admin Dashboard | 4 summary cards (Total, New, In Review, Resolved) + data table |
| Login | Clean sign-in form with error handling |
| Status Confirmation | Modal dialog confirming status changes |

## Design Decisions

- **NestJS** — Provides a modular, opinionated structure that scales well and is familiar to many backend engineers
- **MongoDB + Mongoose** — Schema flexibility for feedback data; Mongoose provides TypeScript integration and validation at the database layer
- **EJS over SPA** — Server-rendered templates keep the stack simple and avoid the complexity of a separate frontend build pipeline
- **Session auth over JWT** — Simpler for a single-admin dashboard; no token management needed. Sessions are stored in memory (no Redis requirement)
- **Express session (memory store)** — Suitable for a take-home assignment scope. In production, swap to a database-backed store (connect-mongo)
- **Vanilla JS** — No frontend framework dependency; keeps the bundle small and the code approachable for reviewers
- **Bootstrap 5 dark theme** — Provides a polished, responsive UI with zero custom CSS for layout; `data-bs-theme="dark"` gives a professional look
- **Confirmation modal** — Prevents accidental status changes; better UX than an immediate PATCH on dropdown change
- **Loading skeleton** — Improves perceived performance compared to a blank table while data is fetched
- **No microservices / CQRS / Event Bus** — The application scope does not warrant distributed system patterns; keeping it simple makes the codebase easier to review in 4–8 hours
