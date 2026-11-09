# Deployment and Local Run Guide

## Project: The Serai Ridge Estate & Resort (Chikkamagaluru, Karnataka)
**Problem Statement:** Hill resort's direct-booking website with AI enquiry routing & zero-overbooking allotment control (76 Keys: 64 Suites & 12 Villas).

### Live Deployment Links
- **GitHub Repository:** [https://github.com/MK-codes365/Estate-Haven](https://github.com/MK-codes365/Estate-Haven)
- **Live Frontend (Vercel):** [https://estate-haven-pink.vercel.app](https://estate-haven-pink.vercel.app)
- **Live Backend API (Render):** [https://estate-haven.onrender.com](https://estate-haven.onrender.com)
  - **API Health Check:** [https://estate-haven.onrender.com/api/health](https://estate-haven.onrender.com/api/health)
  - **Live Rooms Catalog:** [https://estate-haven.onrender.com/api/rooms](https://estate-haven.onrender.com/api/rooms)

---

## 1. Quick Start / How to Run Locally (Step-by-Step)

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ or v22 recommended)
- **npm**: v9.0.0 or higher
- **Git**

### Step 1: Clone and Enter the Repository
```bash
git clone https://github.com/MK-codes365/Estate-Haven.git
cd Estate-Haven
```

### Step 2: Install Dependencies
Install all root, backend, and frontend dependencies in one go:
```bash
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### Step 3: Configure Environment Variables
Copy the sample environment file for the backend server:
```bash
# On Linux / macOS / Git Bash:
cp .env.example server/.env

# On Windows PowerShell:
Copy-Item .env.example server/.env
```
*(Default settings work out-of-the-box with zero mandatory external API keys.)*

### Step 4: Run Database Seed (Automated)
The database auto-seeds on first startup, but you can explicitly re-seed anytime with:
```bash
npm run seed
```
This populates:
- 4 luxury room/villa categories totaling **76 keys**
- 90 days of inventory allotment
- Seeded enquiries from the brief (`ENQ-4410`, `ENQ-4411`, `ENQ-4412`, plus GM complaint escalation & unsorted low-confidence edge case)
- Demo users and rate plans (EP, CP, MAP)

### Step 5: Start the Full-Stack Application
Start both the Express backend API (Port 5000) and the React Vite client (Port 5173) concurrently:
```bash
npm run dev
```

### Step 6: Access the Application
Open your web browser and navigate to:
- **Guest Direct Booking Portal:** `http://localhost:5173`
- **Backend API Health Check:** `http://localhost:5000/api/health`

*(Alternatively, to run the unified production build on a single port):*
```bash
npm run build
npm start
# Visit http://localhost:5000
```

---

## 2. Running Automated Logic Tests
The application includes a comprehensive test suite covering the core business logic, overbooking protection, GST tariff slabs, and AI entity extraction:
```bash
npm test
```
**Test Coverage Includes:**
1. **Zero-Overbooking Concurrency Defense:** Proves concurrent booking requests exceeding allotment fail with HTTP 409 Conflict without inventory corruption.
2. **Indian GST Slab Calculations:** 12% for tariff $\le$ ₹7,500/night; 18% for tariff > ₹7,500/night.
3. **AI Enquiry Router Intent & Entity Extraction:** Tests `ENQ-4410` (Weddings), `ENQ-4411` (Grounded Villa Rates), `ENQ-4412` (Corporate Offsite), GM Complaint Escalation, and Unsorted Lane.
4. **PMS CSV Daily Export:** Verifies CSV headers, escaping, DPDP consent, and Form C physical verification flags.

---

## 3. Demo Login Credentials for Reviewer

The application features an **Interactive Evaluator Role Switcher** at the top bar of every page, allowing instant switching between personas without typing passwords. 

For manual sign-in via `/login`, use the credentials below:

| Role | Name | Email | Password | Access Level |
| :--- | :--- | :--- | :--- | :--- |
| **General Manager (GM)** | Rajesh Nair | `gm@coffeeridge.com` | `admin123` | Full access: Allotment grid, overbooking stress test, GM complaint alert lane, unsorted lane, PMS daily export, ROI metrics |
| **Reservations Staff** | Ananya Joshi | `reservations@coffeeridge.com` | `admin123` | Staff inbox, review & edit AI drafts, send simulated WhatsApp/Email replies, view allotment |
| **Guest Visitor** | Rohan Mehta | `guest@example.com` | `guest123` | Public direct booking, 3-step checkout, test payment, wedding & offsite enquiry submission |

---

## 4. Production Deployment Guide

The application is architected for single-instance or containerized cloud deployment (Render, Railway, Fly.io, AWS EC2, or DigitalOcean App Platform), or as a decoupled Frontend (Vercel) + Backend (Render / Railway).

### Option A: Unified Full-Stack Node.js Deployment (Render / Railway - Recommended)
Since this project uses an Express backend with an atomic SQLite database (`better-sqlite3` in WAL mode for zero-overbooking transactional row locking), deploying the unified server on a stateful Node.js host (like Render or Railway) runs both the API and client from one place:
1. **Build Command:**
   ```bash
   npm install && npm run build
   ```
2. **Start Command:**
   ```bash
   npm start
   ```
   *(The Express server in `server/src/server.js` serves both `/api/*` endpoints and the compiled React SPA on `PORT`.)*

### Option B: Decoupled Deployment (Vercel Frontend + Render/Railway Backend)
If you host the React frontend on **Vercel**:
1. **Frontend (Vercel):**
   - **Root Directory:** `client` (or root with Build command: `npm run build --prefix client` and Output directory: `client/dist`).
   - **Environment Variable:** Set `VITE_API_URL` to your deployed backend URL (e.g., `https://your-backend.onrender.com/api`).
2. **Backend (Render / Railway):**
   - Connect your GitHub repo to **Render** (as a Web Service) or **Railway**.
   - **Root Directory:** `server` (or root with Start command: `node server/src/server.js`).
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - Add environment variables (`JWT_SECRET`, `NODE_ENV=production`).

### Environment Variables Required (Names Only)
As per the assignment security rules, variable names only are listed below (never values):

| Variable Name | Purpose | Target Service |
| :--- | :--- | :--- |
| `PORT` | HTTP port on which the server listens | Backend (Render/Railway) |
| `NODE_ENV` | Environment mode (`development` or `production`) | Backend |
| `JWT_SECRET` | Secret key for signing role-based session JWT tokens | Backend |
| `DB_PATH` | File path for SQLite persistent database storage | Backend |
| `GEMINI_API_KEY` | Optional Google Gemini LLM API key | Backend |
| `VITE_API_URL` | Full URL to the deployed backend API (e.g. `https://your-api.onrender.com/api`) | Frontend (Vercel) |

---

## 5. Security & DPDP Act 2023 Compliance
- **Zero Secrets in Repository:** No API keys, credentials, or private keys are committed. All secrets are loaded through `.env`.
- **DPDP Act 2023 Compliance:** Personal guest data is collected only with affirmative opt-in consent.
- **Foreign National Form C Protocol:** In compliance with Indian Bureau of Immigration regulations, no passport copies are uploaded over the public internet. Foreign guest passports are verified physically at check-in.

