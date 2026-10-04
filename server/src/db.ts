import { DatabaseSync } from "node:sqlite";
export const db = new DatabaseSync("dev.db");


db.exec("PRAGMA foreign_keys = ON;");


db.exec(`
  CREATE TABLE IF NOT EXISTS companies (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL UNIQUE,
    website    TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Each application belongs to one company (company_id -> companies.id).
  CREATE TABLE IF NOT EXISTS applications (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id   INTEGER NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    role         TEXT NOT NULL,
    status       TEXT NOT NULL DEFAULT 'applied'
                 CHECK (status IN ('applied', 'interviewing', 'offer', 'rejected')),
    applied_date TEXT,
    notes        TEXT,
    created_at   TEXT NOT NULL DEFAULT (datetime('now'))
  );

  -- Each interview belongs to one application (application_id -> applications.id).
  CREATE TABLE IF NOT EXISTS interviews (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    application_id INTEGER NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    date           TEXT NOT NULL,
    type           TEXT CHECK (type IN ('phone', 'technical', 'onsite')),
    notes          TEXT
  );
`);
