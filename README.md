# 🌿 The Serai Ridge Estate & Resort - Direct Booking & AI Enquiry Router
### Chikkamagaluru, Karnataka • 76 Keys (64 Rooms + 12 Villas)
**Client:** Company A  
**GitHub Repository:** `https://github.com/mukutkumar/resort-booking`  
**Submission Package:** `submission.zip` *(Contains `Technical_Design_Document.docx` and `deployment.md`)*  

---

## 📖 Overview & Business Problem

Company A operates a premier coffee-estate sanctuary with 64 rooms and 12 villas (76 keys) and sprawling lawns for weddings and corporate retreats in Chikkamagaluru, Karnataka. The property generates ₹24–28 crore in gross annual revenue with 140 staff. 

The resort suffered from two major leakages totaling **₹1.05 crore a year**:
1. **OTA Commission Drain:** 68% of room nights booked through online agencies at 20% commission; only 12% booked direct. Shifting 15% of OTA nights to direct booking **saves ₹33.3 lakh/year**.
2. **Event & Wedding Lead Leakage:** Out of 90 event enquiries/month, 30% waited over a day for quotation, losing ~3 events/month at ₹2 lakh contribution = **₹72 lakh/year**.

This solution delivers a high-speed direct-booking web application with **unbreakable zero-overbooking allotment control**, a **multi-channel AI enquiry router**, and an **executive property management system (PMS) export**.

---

## 🚀 Key Features Built

### 1. Direct Guest Booking Portal
- **Experience Landing Page:** Quiet, elegant coffee-estate aesthetic optimized for slow hill-station networks (bundle size < 98 kB gzip).
- **76-Key Inventory Catalog:** 4 categories (Plantation Classic Room, Estate Valley Suite, Planter's Cottage, and Private Plunge Pool Villa).
- **Dynamic Rate Plans:** EP (Room Only), CP (Bed & Breakfast), MAP (Breakfast + Dinner).
- **Statutory Indian GST Slabs:** Transparent tax calculations based on per-night tariff (12% for $\le$ ₹7,500; 18% for > ₹7,500).
- **3-Step Checkout:** Date & Room Selection $\rightarrow$ Guest Info (DPDP Act 2023 consent & Form C physical passport verification notice) $\rightarrow$ Test Payment Gateway & Instant Voucher.

### 2. "The Hard Part": Concurrency & Zero-Overbooking Defense
- **Atomic Serialized Transactions:** Allotment is validated across every night of the stay inside SQLite WAL transactions (`db.transaction`).
- **Overbooking Block:** If requested rooms exceed available allotment on ANY date, the server strictly throws an error and returns HTTP 409 Conflict. Agency inventory is never compromised.
- **Interactive Stress Tester:** Admin panel widget allows evaluators to simulate 6 concurrent bookings against the last room to watch the system halt overbooking in real time.

### 3. AI Enquiry Router & CRM
- **Unified Multi-Channel Inbox:** Ingestion for Web forms, Forwarded Emails, and WhatsApp Business.
- **Pre-Seeded Sample Data from Brief:**
  - `ENQ-4410`: Wedding, Feb 2027, 250 guests, 2 nights $\rightarrow$ Routed to Priya Sharma (Events Lead).
  - `ENQ-4411`: Villa booking, 14–16 Nov, 2 adults + 1 child $\rightarrow$ Routed to Ananya Joshi (Reservations) with **strictly grounded rate table quotes** (₹22,000 + 18% GST).
  - `ENQ-4412`: Corporate offsite, team of 45, January, conference hall $\rightarrow$ Routed to Vikram Rao (Corporate Lead).
- **Fail-Safes & Edge Cases:**
  - **In-House Guest Complaints (`ENQ-4413`):** Immediately triggers flashing red alert banner and escalates directly to GM Rajesh Nair.
  - **Unsorted Lane (`ENQ-4414`):** Low confidence (< 70%) or ambiguous queries land in the Unsorted Lane for GM review.
  - **Zero Autonomous Dispatch:** AI drafts are never sent automatically; staff review, edit, and approve before sending.
  - **One-Click Re-Routing:** Staff can re-route categories and owners with a single dropdown.

### 4. Admin Management & PMS Integration
- **14-Day Allotment & Rate Grid:** Real-time visibility into physical keys, website allotment, direct booked count, and remaining availability.
- **Blackout Dates & Rate Overrides:** Single-click blackout toggle and rate adjustments.
- **Daily PMS Export (CSV):** Generates standardized CSV batch files conforming to hotel Property Management Systems (Opera, IDS Next, Protel).

---

## 🛠️ Tech Stack
- **Frontend:** React.js 19, JavaScript (ES6+), HTML5, CSS3, Lucide React, Vite.
- **Backend:** Node.js, Express.js.
- **Database:** SQLite with WAL mode via `better-sqlite3`.
- **AI & NLP:** Grounded Deterministic NLP Classifier + Entity Extractor with optional Google Gemini API support.
- **Testing:** Node.js Native Test Runner (`node --test`).

---

## ⚡ Quick Start & Local Run

### Prerequisites
- Node.js v18+ and npm v9+

### 1. Install & Setup
```bash
# Install root, backend and frontend dependencies
npm install
cd server && npm install
cd ../client && npm install
cd ..

# Copy sample environment configuration
Copy-Item .env.example server/.env   # (Windows)
# cp .env.example server/.env        # (Linux/Mac)
```

### 2. Start Full Stack (Concurrently)
```bash
npm run dev
```
- Open browser at: **`http://localhost:5173`**
- API health check: **`http://localhost:5000/api/health`**

### 3. Run Automated Tests
```bash
npm test
```
*Executes 15 comprehensive unit & integration tests covering overbooking defense, GST calculations, AI routing, and PMS export.*

---

## 👤 Demo Login Credentials

The app features a top-bar **Interactive Evaluator Role Switcher** to switch roles with 1 click:
- **General Manager (Rajesh Nair):** `gm@coffeeridge.com` / `admin123`
- **Reservations Staff (Ananya Joshi):** `reservations@coffeeridge.com` / `admin123`
- **Guest Visitor (Rohan Mehta):** `guest@example.com` / `guest123`

---

## 📦 Submission Deliverables
The submission archive `submission.zip` contains:
1. `Technical_Design_Document.docx` (Executive Word Document)
2. `deployment.md` (Step-by-step local run, deployment environment variables & demo logins)

