# Feedback Board Frontend

EJS-powered frontend for the Feedback Board API. Served by the NestJS backend with server-side rendering.

## Tech Stack

- **Templating:** EJS (server-side rendered by NestJS/Express)
- **UI Framework:** Bootstrap 5.3 (dark theme)
- **JavaScript:** Vanilla JS (no frameworks)
- **HTTP:** Native `fetch` API

## Pages

### `/feedback` — Submit Feedback

Form with title input, message textarea, and submit button.

- Client-side validation (Bootstrap's built-in validation)
- Loading spinner on submit
- Success alert auto-dismisses after 5 seconds
- Error alert on failure

**POST** `/api/feedbacks`

---

### `/admin` — Admin Dashboard

Summary cards and a data table for managing feedbacks.

**Summary cards show:**
- Total Feedbacks
- New (count)
- In Review (count)
- Resolved (count)

**Table columns:**

| Column | Content |
|--------|---------|
| Title | Bold text |
| Message | Truncated at 300px |
| Status | Colored badge |
| Created At | Formatted date |
| Actions | Status dropdown |

**GET** `/api/feedbacks` — loads table data

**PATCH** `/api/feedbacks/:id/status` — status dropdown change triggers update

---

## Status Badge Colors

| Status | Badge Class |
|--------|-------------|
| NEW | `bg-secondary` |
| IN_REVIEW | `bg-warning text-dark` |
| RESOLVED | `bg-success` |

## File Structure

```
views/
├── feedback.ejs     # Submit feedback page
└── admin.ejs        # Admin dashboard page

public/
├── css/
│   └── style.css    # Dark theme custom styles
└── js/
    ├── feedback.js  # Form submission logic
    └── admin.js     # Dashboard table & cards logic
```

## Running

The frontend is served by the NestJS backend on the same port.

```bash
npm run start:dev
```

Open `http://localhost:3000/feedback` or `http://localhost:3000/admin`.
