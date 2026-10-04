import { Router } from "express";
import { db } from "../db.js";

// A Router is a mini-app: a group of related routes we attach to the main app in index.ts.
export const applicationsRouter = Router();

const STATUSES = ["applied", "interviewing", "offer", "rejected"];

// Shared SELECT: each application + its company name + how many interviews it has.
const SELECT_APPLICATIONS = `
  SELECT a.id, a.role, a.status, a.applied_date AS appliedDate, a.notes,
         c.id AS companyId, c.name AS company,
         (SELECT COUNT(*) FROM interviews i WHERE i.application_id = a.id) AS interviewCount
  FROM applications a
  JOIN companies c ON c.id = a.company_id
`;

// GET /api/applications -> list all applications, newest first
applicationsRouter.get("/", (req, res) => {
  const rows = db.prepare(`${SELECT_APPLICATIONS} ORDER BY a.applied_date DESC, a.id DESC`).all();
  res.json(rows);
});

// POST /api/applications -> create one. Body: { company, role, status?, appliedDate?, notes? }
applicationsRouter.post("/", (req, res) => {
  const { company, role, status = "applied", appliedDate = null, notes = null } = req.body ?? {};

  // Validate before touching the database; 400 = "bad request" (client's fault).
  if (typeof company !== "string" || !company.trim() || typeof role !== "string" || !role.trim()) {
    return res.status(400).json({ error: "company and role are required" });
  }
  if (!STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
  }

  // Find the company by name, or create it if it's new.
  // ON CONFLICT ... DO UPDATE is an "upsert": insert, or reuse the existing row (name is UNIQUE).
  const { id: companyId } = db
    .prepare(
      `INSERT INTO companies (name) VALUES (?)
       ON CONFLICT(name) DO UPDATE SET name = excluded.name
       RETURNING id`
    )
    .get(company.trim()) as { id: number };

  const { lastInsertRowid } = db
    .prepare(
      "INSERT INTO applications (company_id, role, status, applied_date, notes) VALUES (?, ?, ?, ?, ?)"
    )
    .run(companyId, role.trim(), status, appliedDate || null, notes || null);

  const created = db.prepare(`${SELECT_APPLICATIONS} WHERE a.id = ?`).get(lastInsertRowid);
  res.status(201).json(created); // 201 = "created"
});

// PATCH /api/applications/:id -> update some fields. Body: { status?, role?, appliedDate?, notes? }
applicationsRouter.patch("/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status, role, appliedDate, notes } = req.body ?? {};

  if (status !== undefined && !STATUSES.includes(status)) {
    return res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
  }

  // COALESCE(?, column) = "use the new value if one was sent, otherwise keep the old one".
  const result = db
    .prepare(
      `UPDATE applications SET
         status       = COALESCE(?, status),
         role         = COALESCE(?, role),
         applied_date = COALESCE(?, applied_date),
         notes        = COALESCE(?, notes)
       WHERE id = ?`
    )
    .run(status ?? null, role ?? null, appliedDate ?? null, notes ?? null, id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "application not found" }); // 404 = "not found"
  }
  res.json(db.prepare(`${SELECT_APPLICATIONS} WHERE a.id = ?`).get(id));
});

// DELETE /api/applications/:id -> delete one (its interviews cascade away too)
applicationsRouter.delete("/:id", (req, res) => {
  const result = db.prepare("DELETE FROM applications WHERE id = ?").run(Number(req.params.id));
  if (result.changes === 0) {
    return res.status(404).json({ error: "application not found" });
  }
  res.status(204).end(); // 204 = "success, nothing to send back"
});
