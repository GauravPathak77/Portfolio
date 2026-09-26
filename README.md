# Portfolio — Next.js · SQLite / MongoDB Atlas

Gaurav Pathak's portfolio: Software Developer (Next.js/Node.js) | AI, RAG, Voice AI & Computer Vision.
Built with Next.js (App Router) and a password-protected admin dashboard, so content can be
updated without touching code or redeploying.

## Features

- **Public site**: Hero, About (with skills), Projects, Certificates, Client Reviews, Journey
  timeline and Contact — all data-driven. Empty sections (and their nav links) hide automatically.
- **Projects**: project type, role, key points, tech badges and links. Screenshots open full size
  on click; projects without one get a generated architecture-flow thumbnail. Unticking "main
  list" moves a project to the compact "Earlier Projects" row.
- **Certificates & Reviews**: swipeable carousels (arrows, dots, keyboard). Certificates open in
  a lightbox; reviews show client name, role, company, location, project and rating.
- **Dark mode**: system-aware, toggleable, persisted.
- **Admin dashboard** (`/admin`): CRUD for projects, certificates, timeline and reviews; site
  settings (hero headline, highlights, bio, skills, links, images); inbox for contact messages.
- **Two database backends** behind one repository layer (`lib/repo`): SQLite for local use,
  MongoDB Atlas for production.

## Tech Stack

Next.js 15 (App Router, TypeScript) · Tailwind CSS · SQLite (`node:sqlite`) / Mongoose + MongoDB
Atlas · NextAuth.js (Credentials) · Cloudinary · framer-motion · react-parallax-tilt

Requires **Node.js 22.13+** (for the built-in `node:sqlite` module).

## Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure `.env.local`** (see `.env.example` for every variable):

   - `DB_PROVIDER` — `sqlite` (default, stores data in `data/portfolio.db`) or `mongodb`.
   - `MONGODB_URI` — only needed for `mongodb`; replace `<db_password>` with your Atlas password.
   - `NEXTAUTH_SECRET` — any random 32+ char string (`openssl rand -base64 32`).
   - `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` — your `/admin` login. Generate the hash with the
     command below, then **escape every `$` as `\$`** when pasting it (Next.js expands `$VAR`
     inside `.env` files, which corrupts bcrypt hashes):
     ```bash
     node -e "console.log(require('bcryptjs').hashSync('yourpassword', 10))"
     ```
   - `CLOUDINARY_*` / `NEXT_PUBLIC_CLOUDINARY_*` — optional. Needed for image uploads from the
     dashboard (create an **unsigned** upload preset). Without them, the seed script serves
     images from `public/images`.

3. **Seed content** — loads the profile, projects and timeline from `scripts/seed.ts` into
   whichever database `DB_PROVIDER` points at. Safe to re-run: entries are matched by title
   and updated in place.

   ```bash
   npm run seed
   ```

4. **Run the dev server**

   ```bash
   npm run dev
   ```

   Site: `http://localhost:3000` · Dashboard: `http://localhost:3000/admin/login`

### Moving local data to MongoDB

`npm run migrate:mongo` copies everything from the local SQLite database (profile, projects,
certificates, timeline, reviews, messages) into MongoDB. Collections that already contain data in
MongoDB are skipped, so it is safe to re-run.

### Troubleshooting: `querySrv ECONNREFUSED`

`mongodb+srv://` strings need a DNS SRV lookup. If Node on your machine uses a DNS server that
refuses it (check with `node -e "console.log(require('dns').getServers())"` — `127.0.0.1` is a
common culprit, often from a VPN or DNS tool), use Atlas's standard connection string instead
(Atlas → Connect → Drivers → choose an older driver version to see the `mongodb://host1,host2,host3/…`
form). It connects without SRV and works everywhere, including Vercel.

## Deployment (Vercel)

Use **MongoDB** in production. Vercel's filesystem is read-only and ephemeral, so SQLite writes
(admin edits, contact messages) would not persist there.

1. Set `DB_PROVIDER=mongodb` and a real `MONGODB_URI` locally, then run `npm run seed` to load
   the content into Atlas. In Atlas → Network Access, allow `0.0.0.0/0` so Vercel can connect.
2. Push the repo to GitHub and import it into [Vercel](https://vercel.com/new).
3. Add the variables from `.env.local` to the Vercel project, with `DB_PROVIDER=mongodb` and
   `NEXTAUTH_URL` set to your production URL.
4. Deploy.

## Project Structure

- `app/` — pages (public site + `/admin`) and API routes (`app/api/`).
- `components/site/` — public sections; `components/admin/` — dashboard UI; `components/ui/` —
  shared primitives.
- `lib/repo/` — repository layer: `sqlite.ts` and `mongo.ts` backends selected by `DB_PROVIDER`.
- `lib/crudRoutes.ts` — shared, auth-guarded CRUD route handlers.
- `models/` — Mongoose schemas (used by the MongoDB backend).
- `scripts/seed.ts` — portfolio content and seed script.
