# DropEarn — File Sharing & Monetization Platform

> **Upload. Share. Earn.**
> A modern, production-grade file sharing and monetization web application engineered for creators, high-traffic distributors, and digital communities.

---

## 🌟 Key Highlights

* **100% Real Data Guarantee**: Zero fake analytics, zero hardcoded numbers, and zero artificial counters. All metrics reflect actual PostgreSQL records.
* **Immutable Double-Entry Financial Ledger**: Precision-safe accounting backed by `decimal.js` and Prisma database transactions with auditable running balances.
* **Multi-Layer Anti-Fraud Qualification Engine**: Protects ad networks from fraudulent clicks and self-downloads through dwell checks (5s minimum), IP cooldowns, and per-day caps.
* **Multi-Cloud S3 Storage Abstraction**: High-speed, presigned file transfers supporting AWS S3, Cloudflare R2, MinIO, or local disk fallback.
* **Firebase Authentication & RBAC**: Google OAuth + Email/Password sign-in with server-side Firebase Admin SDK token verification and role-based permissions (`USER` vs. `ADMIN`).
* **Executive Administration Suite**: Full visibility across 5 timeframes (today, yesterday, 7d, 30d, lifetime), DMCA reporting moderation, user suspension, and manual withdrawal approval.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Lucide Icons, Recharts |
| **Backend & APIs** | Next.js Route Handlers (`/api/v1/...`), Server Actions, Zod schema validation |
| **Database & ORM** | PostgreSQL 16, Prisma ORM, Decimal-safe arithmetic (`decimal.js`) |
| **Caching & Rate Limiting** | Redis 7, In-memory fallback LRU |
| **Object Storage** | S3-Compatible Storage (AWS S3, Cloudflare R2, MinIO) with streaming local fallback |
| **Authentication** | Firebase Client SDK + Firebase Admin SDK (Server ID Token Verification) |
| **DevOps & Containers** | Docker (Multi-stage build), Docker Compose, Nginx Reverse Proxy |

---

## 📂 Core Business Workflows

### 1. Upload & Monetization Lifecycle
```
Creator Uploads File ──▶ Stored in S3/R2 ──▶ Unique Slug Generated (/d/[slug])
                                                      │
                                                      ▼
Visitor Opens /d/[slug] ──▶ Ad Slot Loaded ──▶ Dwell Time (5s) ──▶ Download Triggered
                                                                          │
                                                                          ▼
                                                         Anti-Fraud Qualification
                                                                          │
                       ┌──────────────────────────────────────────────────┴───────────────┐
                       ▼                                                                  ▼
              [ Qualified Traffic ]                                            [ Non-Qualified ]
                       │                                                                  │
              Revenue Event Logged                                                Only Download Count
                       │                                                               Incremented
        ┌──────────────┴──────────────┐
        ▼                             ▼
Uploader Ledger (70%)        Platform Ledger (30%)
        │
Referral Bonus (10% to Referrer)
```

### 2. Withdrawal & Payout State Machine
```
Available Balance >= $10.00 ──▶ User Submits Payout Request
                                             │
                                             ▼
                              Ledger Entry: DEBIT_WITHDRAWAL (LOCKED)
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
              Admin Approves & Pays                        Admin Rejects
                       │                                           │
           Ledger Status -> PAID                         Ledger Status -> REJECTED
           Withdrawal -> PAID                            Refund ADJUSTMENT Credited
```

---

## 🚀 Quickstart Guide

### Prerequisites
* Node.js v20.x or later
* PostgreSQL 16
* Redis 7 (optional for local dev, in-memory fallback enabled)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/DropEarn.git
cd DropEarn

npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Edit `.env` and configure your database connection string and storage provider.

### 3. Initialize Database
```bash
npx prisma generate
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Docker Deployment

To launch the complete production stack (App, PostgreSQL, Redis, MinIO, Nginx) in one command:

```bash
docker compose up -d --build
```

Access:
* **Web App**: `http://localhost`
* **MinIO S3 Console**: `http://localhost:9001` (User: `minioadmin`, Pass: `minioadmin_secret`)

---

## 📡 API Reference Overview

### Public & File Endpoints
* `GET /api/v1/files` — Fetch user files with pagination and filters.
* `POST /api/v1/files` — Upload new file with multipart form-data.
* `GET /api/v1/files/:slug` — Get public file metadata.
* `POST /api/v1/files/:slug/download` — Process download & run anti-fraud qualification.
* `POST /api/v1/files/:slug/verify-password` — Verify file password.
* `POST /api/v1/events/visitor` — Record visitor page view.
* `POST /api/v1/reports` — Submit abuse or DMCA report.

### User Financial & Account Endpoints
* `GET /api/v1/earnings` — Get user balances and download summary.
* `GET /api/v1/earnings/ledger` — Get immutable user ledger history.
* `POST /api/v1/withdrawals` — Request payout.
* `GET /api/v1/referrals` — Get referral link and commission metrics.

### Admin Operations Endpoints (RBAC: `Role.ADMIN`)
* `GET /api/v1/admin/dashboard` — Platform aggregations across 5 timeframes.
* `GET /api/v1/admin/revenue` — Gross and net revenue financial breakdowns.
* `GET /api/v1/admin/visitors` — Visitor sessions and download conversion rates.
* `GET /api/v1/admin/files` — File catalog and moderation actions.
* `GET /api/v1/admin/users` — User account management and role toggles.
* `GET /api/v1/admin/withdrawals` — Withdrawal queue approval & payout execution.
* `GET /api/v1/admin/reports` — DMCA & abuse queue.
* `GET /api/v1/admin/settings` — Platform configuration.
* `GET /api/v1/admin/audit-logs` — Immutable administrative event feed.

---

## 🧪 Testing & Verification

Run the comprehensive end-to-end integration and business logic verification suite:

```bash
npm run test
```

---

## 🛡️ License

This project is licensed under the MIT License.
