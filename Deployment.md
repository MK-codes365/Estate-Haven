# Deployment and Local Run Guide

## Project: The Serai Ridge Estate & Resort

**Location:** Chikkamagaluru, Karnataka  
**Problem statement:** Direct-booking website with AI enquiry routing and zero-overbooking allotment control (76 keys: 64 rooms and 12 villas).

## Live deployment links

- **GitHub repository:** https://github.com/MK-codes365/Estate-Haven
- **Frontend (Vercel):** https://estate-haven-pink.vercel.app

---

## 1. Run locally

### Prerequisites

- Node.js 18 or later (Node.js 20+ recommended)
- npm 9 or later
- Git

### Step 1 — Clone the repository

```bash
git clone https://github.com/MK-codes365/Estate-Haven.git
cd Estate-Haven
```

### Step 2 — Install dependencies

Run each command from the repository root:

```bash
npm install
cd server
npm install
cd ../client
npm install
cd ..
```

### Step 3 — Configure environment variables

Copy the root example environment file into the server directory.

**Linux / macOS / Git Bash**

```bash
cp .env.example server/.env
```

**Windows PowerShell**

```powershell
Copy-Item .env.example server/.env
```

Default settings are intended to run without mandatory third-party API keys. Add optional keys only when required by your local configuration.

### Step 4 — Seed the database

Run from the repository root:

```bash
npm run seed
```

The seed process is documented to populate:

- Four room/villa categories totaling 76 keys
- 90 days of inventory allotment
- Sample enquiries, including `ENQ-4410`, `ENQ-4411`, `ENQ-4412`, a GM complaint escalation, and an unsorted low-confidence case
- Demo users and EP, CP, and MAP rate plans

### Step 5 — Start the application

Run from the repository root:

```bash
npm run dev
```

The development command starts:

- React/Vite frontend: http://localhost:5173
- Express backend: http://localhost:5000

### Step 6 — Open the application

- **Guest booking portal:** http://localhost:5173
- **Backend health check:** http://localhost:5000/api/health

To run the unified production build instead:

```bash
npm run build
npm start
```

Then open http://localhost:5000.

---

## 2. Run automated tests

Run from the repository root:

```bash
npm test
```

The documented test coverage includes:

1. **Zero-overbooking concurrency defense:** concurrent requests beyond allotment are rejected with HTTP 409 without inventory corruption.
2. **GST calculations:** 12% for tariffs at or below ₹7,500/night; 18% above ₹7,500/night.
3. **AI enquiry routing:** wedding, villa-rate, corporate-offsite, GM complaint, and unsorted-lane scenarios.
4. **PMS CSV export:** headers, escaping, DPDP consent, and Form C physical-verification flags.

---

## 3. Demo login credentials

The application includes an evaluator role switcher in the top bar. For manual sign-in at `/login`, use:

| Role               | Name         | Email                          | Password   | Access                                               |
| ------------------ | ------------ | ------------------------------ | ---------- | ---------------------------------------------------- |
| General Manager    | Rajesh Nair  | `gm@coffeeridge.com`           | `admin123` | Allotment, stress test, escalations, exports, ROI    |
| Reservations Staff | Ananya Joshi | `reservations@coffeeridge.com` | `admin123` | Inbox, AI draft review, simulated replies, allotment |
| Guest Visitor      | Rohan Mehta  | `guest@example.com`            | `guest123` | Booking, test payment, wedding/offsite enquiries     |

**Security note:** These are demo credentials only. Do not reuse them in production.

---

## 4. Production deployment

The project supports a unified Node.js deployment or a separately hosted frontend and backend. Confirm persistent disk support before deploying SQLite data.

### Option A — Unified deployment (Render / Railway)

1. **Build command**
   ```bash
   npm install && npm run build
   ```
2. **Start command**
   ```bash
   npm start
   ```

The documented Express server serves `/api/*` and the compiled React application. Configure the host's `PORT` variable and attach persistent storage for the SQLite database.

### Option B — Separate frontend and backend

**Frontend (Vercel)**

- Root directory: `client`
- Build command: `npm run build`
- Output directory: `dist`
- Environment variable: `VITE_API_URL=https://your-backend.example.com/api`

**Backend (Render / Railway)**

- Root directory: `server` (or configure commands from the repository root)
- Install/build command: `npm install`
- Start command: `npm start`
- Configure `JWT_SECRET`, `NODE_ENV=production`, `DB_PATH`, and any optional AI key.

### Environment variable names

| Variable         | Purpose                                | Service  |
| ---------------- | -------------------------------------- | -------- |
| `PORT`           | HTTP listening port                    | Backend  |
| `NODE_ENV`       | Runtime mode                           | Backend  |
| `JWT_SECRET`     | JWT signing secret                     | Backend  |
| `DB_PATH`        | SQLite database file path              | Backend  |
| `GEMINI_API_KEY` | Optional Google Gemini key             | Backend  |
| `VITE_API_URL`   | Backend API base URL, including `/api` | Frontend |

Never commit real secret values. Use the hosting provider's secret/environment-variable settings.

---

## 5. Security and DPDP considerations

- **Secrets:** Keep API keys, credentials, and private keys out of source control; load them from environment variables.
- **Guest consent:** Capture affirmative consent before checkout, as described in the technical design.
- **Foreign guest Form C process:** The documented workflow calls for physical passport verification at check-in and does not upload passport images through the public website.

---

## Troubleshooting

- If a command is not found, confirm Node.js and npm are installed and available on `PATH`.
- If a port is already in use, stop the other process or configure a different `PORT`.
- If the frontend cannot reach the API, verify `VITE_API_URL` and backend CORS settings.
- If SQLite data disappears after redeployment, configure persistent disk storage and point `DB_PATH` to that mounted location.
- Run `npm run seed` from the repository root, not from `server` or `client`.
