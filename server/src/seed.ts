import { db } from "./db.js";

// Start fresh. Deleting companies cascades to applications and interviews.
// sqlite_sequence stores the AUTOINCREMENT counters; clearing it restarts IDs at 1.
db.exec("DELETE FROM companies; DELETE FROM sqlite_sequence;");

// Prepared statements: write the SQL once, run it many times with different values.
const insertCompany = db.prepare("INSERT INTO companies (name, website) VALUES (?, ?)");
const insertApplication = db.prepare(
  "INSERT INTO applications (company_id, role, status, applied_date, notes) VALUES (?, ?, ?, ?, ?)"
);
const insertInterview = db.prepare(
  "INSERT INTO interviews (application_id, date, type, notes) VALUES (?, ?, ?, ?)"
);

// lastInsertRowid = the id SQLite just gave the new row. We keep it to link child rows.
const google = insertCompany.run("Google", "https://careers.google.com").lastInsertRowid;
const stripe = insertCompany.run("Stripe", "https://stripe.com/jobs").lastInsertRowid;
const spotify = insertCompany.run("Spotify", "https://lifeatspotify.com").lastInsertRowid;
const figma = insertCompany.run("Figma", "https://figma.com/careers").lastInsertRowid;

const googleIntern = insertApplication.run(
  google, "Software Engineer Intern", "interviewing", "2026-09-15", "Referred by a friend"
).lastInsertRowid;
insertApplication.run(stripe, "Frontend Engineer", "applied", "2026-09-28", null);
insertApplication.run(spotify, "Backend Engineer Intern", "rejected", "2026-09-02", "Rejected after OA");
insertApplication.run(figma, "Product Engineer", "offer", "2026-08-20", "Offer deadline Oct 15");

insertInterview.run(googleIntern, "2026-10-08", "phone", "Recruiter screen");
insertInterview.run(googleIntern, "2026-10-15", "technical", "Two coding rounds");

// Your first JOIN: combine each application with its company's name.
const rows = db.prepare(`
  SELECT a.id, c.name AS company, a.role, a.status, a.applied_date
  FROM applications a
  JOIN companies c ON c.id = a.company_id
  ORDER BY a.applied_date
`).all();
console.table(rows);
