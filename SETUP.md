# Adding a real database to Capacity Connect

Stack: **MongoDB Atlas** (free tier) + **Mongoose**. This replaces the
in-memory mock store in `backend/src/db.js` with real, persistent storage —
without changing any API route paths or response shapes, so your frontend
needs zero changes.

Every route's `findAll` / `findById` / `findOne` / `insertOne` / `updateById`
/ `deleteById` calls now just need `await` in front of them — which is
already done in the files below.

## What's in this folder

Drop these into your repo, overwriting the matching paths under `backend/`:

```
backend/
├── package.json              (updated — adds mongoose, bcryptjs, dotenv)
├── .env.example               (new — copy to backend/.env and fill in)
└── src/
    ├── db.js                  (rewritten — MongoDB-backed, same function names)
    ├── server.js               (updated — connects to MongoDB before listening)
    ├── models/                 (new — one Mongoose schema per collection)
    │   ├── User.js
    │   ├── Course.js
    │   ├── Enrollment.js
    │   ├── Assessment.js
    │   ├── AssessmentSubmission.js
    │   ├── LibraryItem.js
    │   ├── Announcement.js
    │   └── Feedback.js
    ├── seed/
    │   └── seedData.js         (new — your original demo data, passwords now bcrypt-hashed)
    └── routes/                 (all updated — async/await added, logic unchanged)
        ├── auth.js              (also now uses bcrypt to hash/verify passwords)
        ├── users.js
        ├── courses.js
        ├── assessments.js
        ├── feedback.js
        ├── library.js
        ├── announcements.js
        ├── competency.js
        ├── analytics.js
        ├── enrollments.js
        └── ai.js
```

**Not included / unchanged:** `app.js` and `middleware/auth.js` — nothing in
them touches the data layer, so they work as-is.

## 1. Create a free MongoDB Atlas cluster

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and create a free (M0) cluster.
2. Under **Database Access**, create a database user with a password.
3. Under **Network Access**, add your IP (or `0.0.0.0/0` while developing — tighten this before you deploy anywhere public).
4. Click **Connect → Drivers**, copy the connection string. It looks like:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/`

## 2. Add the files

Copy every file from this folder into your repo at the matching path
(same `backend/...` layout). This overwrites your current `db.js`,
`server.js`, `package.json`, and every route file — that's expected.

## 3. Set up your `.env`

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env` and paste in your real `MONGODB_URI` — add a database
name before the `?` in the string, e.g.:

```
MONGODB_URI="mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/capacity-connect?retryWrites=true&w=majority"
```

**Add `.env` to `.gitignore`** — your repo doesn't currently have a
`.gitignore` at all, so create `backend/.gitignore` with at least:

```
node_modules/
.env
```

## 4. Install the new dependencies

```bash
npm install
```

This pulls in `mongoose`, `bcryptjs`, and `dotenv` (added to `package.json`).

## 5. Run it

```bash
npm run dev
```

On first run, since the database is empty, it automatically seeds your
original demo data — same Admin/Trainer/Trainee accounts, same courses,
assessments, library items, and announcements as before. Passwords are now
bcrypt-hashed rather than stored in plaintext, but the login credentials in
your README (`admin@123`, `trainer@123`, `trainee@123`, etc.) still work
exactly the same from the frontend's point of view.

Restarting the server again won't re-seed or duplicate data — it only seeds
when the `users` collection is empty.

## What changed, and why

- **MongoDB over Postgres**: your data is naturally document-shaped —
  nested `profile` objects, per-role fields, embedded `qualifications` and
  assessment `questions` arrays — which is exactly what your original
  `db.js` comments anticipated migrating to (Mongoose). No relational
  remodeling needed.
- **Same `_id` scheme**: every model keeps your existing UUID-string `_id`
  convention (via a Mongoose default) instead of switching to Mongo's
  `ObjectId`, so nothing that reads `_id` as a plain string elsewhere in
  your code or frontend breaks.
- **`findAll`/`findOne` still take a JS predicate function**, not a Mongo
  query — they load the collection and filter in memory, exactly like the
  old mock store did. At this app's scale that's simpler and lower-risk
  than rewriting every route's query logic, and keeps route files nearly
  line-for-line identical to what you already had.
- **Passwords are now hashed** with bcrypt on register and seed, and
  checked with `bcrypt.compare` on login — plaintext passwords are fine for
  an in-memory demo store, not for a real database.

## Deploying

- Your frontend already deploys to Vercel; for the backend, Render, Railway,
  or Fly.io all work well with an Express app and are free to start.
- Set `MONGODB_URI`, `PORT`, and `AUTH_SECRET` as environment variables on
  whatever platform runs `backend/`.
- Update `VITE_API_URL` in the frontend to point at wherever you deploy the
  backend.
