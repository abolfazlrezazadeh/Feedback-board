# Feedback Board API

A NestJS backend for a Feedback Board application with MongoDB.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** NestJS
- **Database:** MongoDB via Mongoose ODM
- **Language:** TypeScript
- **Validation:** class-validator with ValidationPipe

## Project Structure

```
src/
├── main.ts                          # Entry point with ValidationPipe setup
├── app.module.ts                    # Root module (Config, Mongoose, Feedback)
└── feedback/
    ├── dto/
    │   ├── create-feedback.dto.ts   # POST request validation
    │   └── update-status.dto.ts     # PATCH status validation
    ├── schemas/
    │   └── feedback.schema.ts       # Mongoose schema & document type
    ├── feedback.controller.ts       # Route handlers
    ├── feedback.service.ts          # Business logic
    └── feedback.module.ts           # Feature module wiring
```

## Getting Started

### Prerequisites

- Node.js >= 18
- MongoDB instance (local or remote)

### Installation

```bash
npm install
```

### Environment Variables

Copy `.env` and adjust:

| Variable      | Default                                    | Description     |
| ------------- | ------------------------------------------ | --------------- |
| `MONGODB_URI` | `mongodb://localhost:27017/feedback-board` | MongoDB connection string |
| `PORT`        | `3000`                                     | API server port |

### Running

```bash
# Development (watch mode)
npm run start:dev

# Production
npm run build && npm run start:prod
```

## API Endpoints

### `POST /api/feedbacks`

Create a new feedback.

**Request body:**

```json
{
  "title": "Login Bug",
  "message": "Cannot login"
}
```

**Validation rules:**
- `title`: string, 3-100 characters, required
- `message`: string, 10-1000 characters, required

**Response:** `201 Created`

```json
{
  "data": {
    "_id": "...",
    "title": "Login Bug",
    "message": "Cannot login",
    "status": "NEW",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

### `GET /api/feedbacks`

List all feedbacks sorted by newest first.

**Response:** `200 OK`

```json
{
  "data": [
    {
      "_id": "...",
      "title": "Login Bug",
      "message": "Cannot login",
      "status": "NEW",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### `PATCH /api/feedbacks/:id/status`

Update the status of a feedback.

**Request body:**

```json
{
  "status": "IN_REVIEW"
}
```

**Valid status values:** `NEW` | `IN_REVIEW` | `RESOLVED`

**Response:** `200 OK`

```json
{
  "data": {
    "_id": "...",
    "title": "Login Bug",
    "message": "Cannot login",
    "status": "IN_REVIEW",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Errors:**
- `400 Bad Request` — invalid status value or missing fields
- `404 Not Found` — feedback with the given ID does not exist
