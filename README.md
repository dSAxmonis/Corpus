# Corpus — secondary memory

A quiet place to keep links, notes, images, and ideas — organized by meaning, not folders.

This repo contains the landing page and project scaffold. Auth, the dashboard, and the save/search flow come next.

---

## Stack

- **Frontend:** React + Vite + Tailwind CSS + Framer Motion
- **Backend:** Node.js + Express + MongoDB (Mongoose)
- **Planned:** JWT auth, Cloudinary for media, OpenAI for tagging + semantic search

---

## Project structure

```
corpus/
  corpus-client/      React frontend
    src/
      components/
        landing/      Hero, Navbar, HowItWorks, ArchivePreview, etc.
        ui/            (shared buttons/inputs — to be added)
        layout/         (app shell once dashboard exists)
      pages/
        Landing.jsx
        auth/           (Login, Signup — next phase)
        dashboard/       (next phase)
      hooks/
      store/            (zustand stores — next phase)
      api/              (axios instance — next phase)

  corpus-server/      Express backend
    config/
      db.js            MongoDB connection
    models/
      User.js
      Item.js
    routes/             (to be added: auth, items)
    controllers/         (to be added)
    middleware/           (auth middleware — next phase)
    services/              (openai.js, cloudinary.js, scraper.js — next phase)
    index.js             App entry point
```

---

## Getting started

### 1. Frontend

```bash
cd corpus-client
npm install
npm run dev
```

Runs on `http://localhost:5173`

### 2. Backend

```bash
cd corpus-server
npm install
cp .env.example .env
# fill in MONGO_URI, ACCESS_SECRET, REFRESH_SECRET at minimum
npm run dev
```

Runs on `http://localhost:5000`

Visit `http://localhost:5000/api/health` to confirm the server is up.

---

## What's built so far

- Full landing page (hero, how-it-works, archive preview, closing CTA)
- Tailwind design system (paper/ink/accent color tokens, serif + mono type pairing)
- Express server skeleton with MongoDB connection
- `User` and `Item` Mongoose models, ready for the auth + save flow

## What's next

1. Auth routes (`/api/auth/signup`, `/login`, `/refresh`) + JWT middleware
2. Login/Signup pages + Zustand auth store
3. Protected dashboard route
4. Save-item flow (link scraping, image upload, notes)
5. Search (keyword + later, semantic)

---

## Design notes

The visual identity treats Corpus like an actual index-card archive rather than a generic SaaS product:

- **Colors:** warm paper background (`#FAFAF8`), near-black ink (`#171717`), a single blue accent (`#2E5BFF`)
- **Type:** Source Serif 4 for headlines (gives it a printed, archival feel), Inter for body copy, JetBrains Mono for labels/metadata (like a catalog number)
- **