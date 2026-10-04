# Job Application Tracker

A web app for keeping track of job applications. Add an application, then move it between **Applied**, **Interviewing**, **Offer**, and **Rejected** as things change.

## Built with

- **Frontend:** React + TypeScript (Vite)
- **Backend:** Node.js + Express + TypeScript
- **Database:** SQLite (tables for companies, applications, and interviews, linked with foreign keys)

## How to run it

You need Node.js 24 or newer.

Start the backend:
```bash
cd server
npm install
npm run seed
npm run dev
```

In a second terminal, start the frontend:
```bash
cd client
npm install
npm run dev
```

Then open http://localhost:5173.

## How I built this

I built this with Claude (an AI assistant) as a tutor and pair programmer. Claude explained the concepts and edited my code at times. This was my first fullstack project therefore I used Claude to help me understand parts of it. 
