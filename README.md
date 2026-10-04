# Job Application Tracker

A full-stack web app for tracking job applications on a status board: **Applied → Interviewing → Offer / Rejected**. Add an application, move it between columns as it progresses, and delete it when it's no longer relevant. Everything is saved in a relational database.

## Features

- **Status board** with four columns (Applied, Interviewing, Offer, Rejected) and a count per column
- **Add applications** with company, role, status, date applied and notes. New companies are created automatically, and existing ones are reused.
- **Change status** from a dropdown on each card; the card moves to its new column instantly
- **Delete applications**, with a confirmation prompt
- **Interview count** shown on each card
- Validation in **both** the API and the database, so bad data can't get in
- Responsive layout (4 → 2 → 1 columns) and automatic dark mode

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Backend | Node.js, Express 5, TypeScript |
| Database | SQLite via Node's built-in `node:sqlite`, with hand-written SQL |

## Architecture

```
 React (browser, :5173)  ──fetch /api/...──▶  Vite dev proxy  ──▶  Express API (:3001)  ──SQL──▶  SQLite (server/dev.db)
```

- The React app only talks to the API; it never touches the database directly.
- In development, Vite forwards every `/api` request to Express (see `client/vite.config.ts`), so there are no CORS issues.
- All `fetch` calls live in one file (`client/src/api.ts`), so components never deal with HTTP details.

## Database design

Three tables linked by foreign keys: **company → applications → interviews**.

```
companies                 applications                       interviews
─────────                 ────────────                       ──────────
id          (PK)  ◀──┐    id            (PK)          ◀──┐   id              (PK)
name        UNIQUE   └──  company_id    (FK)             └── application_id  (FK)
website                   role                               date
created_at                status  CHECK IN (applied,         type  CHECK IN (phone,
                                  interviewing, offer,             technical, onsite)
                                  rejected)                  notes
                          applied_date
                          notes
                          created_at
```

- **Foreign keys** with `ON DELETE CASCADE`: deleting a company removes its applications, and deleting an application removes its interviews. No row is ever left pointing at a parent that no longer exists.
- **Constraints** (`NOT NULL`, `UNIQUE`, `CHECK`) enforce data rules at the database level, as a backup to the API's validation.
- **Parameterized queries** (`?` placeholders) are used everywhere to prevent SQL injection.
- Creating an application uses an **upsert** (`INSERT ... ON CONFLICT(name) DO UPDATE ... RETURNING id`) to find or create the company in a single query.
- The schema lives in `server/src/db.ts` and is created automatically when the server starts.

## API

| Method | Endpoint | Description | Success |
|---|---|---|---|
| `GET` | `/api/health` | Server + database check | `200` |
| `GET` | `/api/applications` | List all applications (with company name and interview count) | `200` |
| `POST` | `/api/applications` | Create one. Body: `{ company, role, status?, appliedDate?, notes? }` | `201` |
| `PATCH` | `/api/applications/:id` | Update any of `status`, `role`, `appliedDate`, `notes` | `200` |
| `DELETE` | `/api/applications/:id` | Delete one | `204` |

Invalid input returns `400` with an error message; an unknown ID returns `404`.

## Running locally

**Requirements:** Node.js 24 or newer (for the built-in `node:sqlite` module).

```bash
git clone https://github.com/RomitM12/job-application-tracker.git
cd job-application-tracker
```

**1. Backend** (terminal 1):
```bash
cd server
npm install
npm run seed   # optional: creates the database and fills it with sample data
npm run dev    # http://localhost:3001
```

**2. Frontend** (terminal 2):
```bash
cd client
npm install
npm run dev    # http://localhost:5173
```

Open **http://localhost:5173**.

## Project structure

```
server/
  src/
    index.ts                  Express app setup and middleware
    db.ts                     Database connection and table schema
    seed.ts                   Sample data (npm run seed)
    routes/applications.ts    REST API for applications
client/
  src/
    App.tsx                   Board layout, state, and event handlers
    api.ts                    All requests to the backend
    types.ts                  Shared TypeScript types
    components/
      ApplicationForm.tsx     "Add application" form
      ApplicationCard.tsx     A card with status dropdown and delete button
```

## Possible next steps

- UI for adding and viewing interviews (the table and data already exist)
- Editing a card's role, date and notes
- Search and filtering
- User accounts, so each person sees only their own applications
- Drag-and-drop between columns
