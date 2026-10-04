// 1. Import Express, the library that handles HTTP requests and responses.
import express from "express";
import { db } from "./db.js";

// 2. Create the app. Everything (middleware, routes) gets attached to this object.
const app = express();

// 3. The port the server listens on. The React app will use 5173, so 3001 avoids a clash.
const PORT = 3001;

// 4. Middleware: runs on every request before the routes.
//    express.json() turns a JSON request body into a JS object on req.body.
app.use(express.json());

// 5. A route = method + path + handler.
//    "When a GET request arrives at /api/health, run this function."
//    req = what the client sent, res = how we reply.
app.get("/api/health", (req, res) => {
  const row = db.prepare("SELECT COUNT(*) AS companies FROM companies").get();
  res.json({ status: "ok", database: row });
});

// 6. Start listening for requests. The callback runs once the server is ready.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
