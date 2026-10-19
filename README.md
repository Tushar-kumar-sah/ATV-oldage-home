# 🕊️ OBOKASH - SENIOR LIVING
### A Haven of Trust, Security, and Unparalleled Peace.

A complete, production-ready, full-stack web application designed for **OBOKASH - SENIOR LIVING**. The system combines a warm, trustworthy public portal for prospective families with an enterprise-grade, role-based administrative system to securely store and manage elderly residents' personal, medical, room, and financial records.

---

## 🌟 Key Highlights & Architecture

- **Framework**: Next.js 14 (App Router) with React 18 and Tailwind CSS.
- **Database**: MongoDB with Mongoose connection pooling and cached singleton.
- **Authentication**: NextAuth.js (Auth.js) with dual providers:
  - **Credentials Provider**: Email + bcrypt password hashing.
  - **Google OAuth 2.0**: With strict security gating—new signups automatically receive a **pending** status and cannot access resident data until the Super Administrator approves them and assigns their role.
- **Field-Level Encryption at Rest**: Sensitive government identity numbers (e.g. Indian Aadhaar, Passport) are encrypted at rest using **AES-256-GCM** with random IVs and authentication tags. UI displays masked formats (`XXXX-XXXX-1234`), with audited on-demand reveals.
- **Role-Based Access Control (RBAC)**:
  - **Super Admin**: Full CRUD access, staff accounts & approvals, role assignments, user deactivation, soft deletion, and immutable activity audit logs.
  - **Staff**: Add/view/edit resident profiles, assign rooms, log visitors, add clinical notes and payment records. No deletion or user management privileges.
  - **Public Visitors**: Warm landing page, care programs, facility highlights, family testimonials, and rate-limited inquiry submissions.
- **API Security**: Dual protection via `middleware.ts` route gating and session role checks in every single API route. In-memory IP sliding-window rate limiting on login and public inquiries.

---

## 📁 Project Structure

```
├── app/
│   ├── (public)/
│   │   ├── layout.tsx                # Root layout with session provider and metadata
│   │   ├── page.tsx                  # Public landing page (Hero, Services, Facilities, Inquiry Form)
│   │   ├── globals.css               # Global styles, Tailwind layers & accessible focus states
│   │   ├── login/page.tsx            # Dual provider authentication (Google + Credentials)
│   │   └── pending-approval/page.tsx # Friendly waiting room for unapproved Google signups
│   ├── admin/
│   │   ├── layout.tsx                # Protected admin layout with sidebar & alert header
│   │   ├── dashboard/page.tsx        # KPI metrics, live occupancy bar, upcoming birthdays
│   │   ├── residents/
│   │   │   ├── page.tsx              # Full resident table with search, filters, pagination & CSV export
│   │   │   ├── new/page.tsx          # Multi-section admission form with Zod validation
│   │   │   └── [id]/
│   │   │       ├── page.tsx          # Comprehensive resident dossier with audited reveal ID
│   │   │       └── edit/page.tsx     # Full profile editor with room reassignment
│   │   ├── rooms/page.tsx            # Visual bed occupancy grid grouped by floor
│   │   ├── staff/page.tsx            # Staff directory, shift scheduling & emergency contacts
│   │   ├── visitors/page.tsx         # Guest and family gate log with instant checkout
│   │   ├── inquiries/page.tsx        # Admission inquiries queue with status tracking
│   │   ├── users/page.tsx            # (Super Admin Only) Google signup approvals & role grants
│   │   └── activity/page.tsx         # (Super Admin Only) Immutable chronological audit trail
│   └── api/
│       ├── auth/[...nextauth]/route.ts # NextAuth handler
│       ├── dashboard/stats/route.ts    # Dashboard aggregates, occupancy & birthday scanner
│       ├── residents/
│       │   ├── route.ts              # GET (list/filter/export) and POST (admit)
│       │   └── [id]/
│       │       ├── route.ts          # GET (view/reveal), PUT (edit), DELETE (soft delete)
│       │       ├── notes/route.ts    # POST dated medical observations
│       │       ├── payments/route.ts # POST fee payments and receipts
│       │       └── documents/route.ts# POST document attachments
│       ├── rooms/route.ts            # GET rooms & POST new room
│       ├── rooms/[id]/route.ts       # PUT room & DELETE empty room
│       ├── staff/route.ts            # GET staff & POST staff
│       ├── staff/[id]/route.ts       # PUT staff & DELETE staff
│       ├── visitors/route.ts         # GET visitors & POST check-in
│       ├── visitors/[id]/route.ts    # PATCH checkout & DELETE visitor
│       ├── inquiries/route.ts        # POST rate-limited inquiry & GET admin list
│       ├── inquiries/[id]/route.ts   # PATCH status/notes & DELETE inquiry
│       ├── users/route.ts            # (Super Admin) GET user list
│       ├── users/[id]/route.ts       # (Super Admin) PATCH permissions/approvals & DELETE user
│       ├── activity/route.ts         # (Super Admin) GET audit logs
│       └── upload/route.ts           # Upload with MIME & size restrictions + Cloudinary
├── components/
│   ├── Providers.tsx                 # NextAuth SessionProvider wrapper
│   └── admin/
│       ├── AdminSidebar.tsx          # Responsive navigation sidebar
│       └── AdminHeader.tsx           # Real-time alert pill & quick action bar
├── lib/
│   ├── db.ts                         # Cached Mongoose connection singleton
│   ├── auth.ts                       # NextAuth options, callbacks, and providers
│   ├── auth-helpers.ts               # Server session validators (requireAuth, requireSuperAdmin)
│   ├── crypto.ts                     # AES-256-GCM encryption at rest & masking helpers
│   ├── rateLimit.ts                  # In-memory sliding window rate limiter
│   ├── audit.ts                      # Immutable audit trail writer
│   └── validators.ts                 # Zod validation schemas for all inputs
├── models/
│   ├── User.ts                       # Admin/Staff user with approval status
│   ├── Resident.ts                   # Resident model with embedded medical notes, contacts, payments
│   ├── Room.ts                       # Room model with beds array & occupancy count
│   ├── Staff.ts                      # Staff directory & shifts
│   ├── Visitor.ts                    # Visitor gate check-in/out log
│   ├── Inquiry.ts                    # Public inquiries from website
│   └── ActivityLog.ts                # Immutable audit log
├── scripts/
│   └── seed.mjs                      # Seed script for Super Admin, sample rooms, and residents
├── middleware.ts                     # Edge-level route protection & role enforcement
└── .env.example                      # Configuration template
```

---

## 🚀 Step-by-Step Setup Guide

### 1. Prerequisites
- **Node.js** v18+ or v20+
- **MongoDB** instance (Local MongoDB server or a free MongoDB Atlas cloud cluster)
- **Google Cloud Console account** (for Google OAuth 2.0 login)

### 2. Environment Configuration
Copy the template into `.env.local`:
```bash
cp .env.example .env.local
```

Fill in the keys in `.env.local`:
```env
# 1. MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/old_age_home?retryWrites=true&w=majority

# 2. NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secure_32_byte_secret_here

# 3. Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# 4. Super Admin Setup
SUPER_ADMIN_EMAIL=admin@ananddham.org
SUPER_ADMIN_PASSWORD=AdminSecurePass123!
SUPER_ADMIN_NAME=Super Administrator

# 5. Encryption Key (32 bytes or 64 hex characters)
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef

# 6. Optional Cloudinary URL
CLOUDINARY_URL=
```

---

## 🔑 Setting Up Google OAuth 2.0 Credentials

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **Obokash Senior Living**.
3. Go to **APIs & Services** > **OAuth consent screen**:
   - Choose **External**.
   - Fill in App Name: `OBOKASH - SENIOR LIVING`.
   - Provide User Support Email and Developer Contact Email.
   - Click **Save and Continue** through the Scopes step (default `email`, `profile`, `openid` are sufficient).
4. Go to **APIs & Services** > **Credentials**:
   - Click **+ CREATE CREDENTIALS** > **OAuth client ID**.
   - Application type: **Web application**.
   - Name: `Obokash Web Client`.
   - **Authorized JavaScript origins**:
     - Local: `http://localhost:3000`
     - Production: `https://your-production-app.vercel.app`
   - **Authorized redirect URIs**:
     - Local: `http://localhost:3000/api/auth/callback/google`
     - Production: `https://your-production-app.vercel.app/api/auth/callback/google`
5. Click **Create**. Copy the **Client ID** and **Client Secret** into your `.env.local` (`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`).

---

## 🍃 Setting Up MongoDB Atlas

1. Create a free account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a free **M0 Shared Cluster** in your preferred region.
3. In **Database Access**:
   - Add a new database user with **Read and write to any database** privilege (e.g. username `anand_admin` and a strong password).
4. In **Network Access**:
   - Click **Add IP Address** > Choose **Allow Access from Anywhere (`0.0.0.0/0`)** so Vercel serverless functions can connect.
5. In **Database** > **Connect**:
   - Select **Drivers** (Node.js).
   - Copy the connection string into `MONGODB_URI`:
     ```
     mongodb+srv://anand_admin:<password>@cluster0.xxxxx.mongodb.net/old_age_home?retryWrites=true&w=majority
     ```

---

## ⚡ Running the Seed Script

Run the automated seed script to populate the Super Admin user, sample rooms across 3 floors, staff members, residents with encrypted IDs, and inquiries:
```bash
npm run seed
```

Default credentials generated:
- **Super Administrator**:
  - Email: `admin@ananddham.org` (or the value set in `SUPER_ADMIN_EMAIL`)
  - Password: `AdminSecurePass123!`
- **Staff Nurse**:
  - Email: `staff@ananddham.org`
  - Password: `StaffPass123!`

---

## 💻 Local Development

```bash
# Start Next.js development server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser:
- Public Landing Page: `http://localhost:3000/`
- Staff Login: `http://localhost:3000/login`
- Admin Dashboard: `http://localhost:3000/admin/dashboard`

---

## ☁️ Deployment on Vercel

1. Push your repository to **GitHub**, **GitLab**, or **Bitbucket**.
2. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your repository.
4. Set Framework Preset: **Next.js**.
5. In the **Environment Variables** section, add:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (set to your Vercel URL, e.g. `https://anand-dham.vercel.app`)
   - `NEXTAUTH_SECRET` (generate using `openssl rand -base64 32`)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `SUPER_ADMIN_EMAIL`
   - `SUPER_ADMIN_PASSWORD`
   - `SUPER_ADMIN_NAME`
   - `ENCRYPTION_KEY`
6. Click **Deploy**.
7. Once deployed, add your Vercel production domain redirect URI (`https://anand-dham.vercel.app/api/auth/callback/google`) into your Google Cloud Console credentials.

---

## 🛡️ Security Audit & Verification

| Security Requirement | Implementation Detail | Status |
| :--- | :--- | :--- |
| **Passwords** | Hashed with bcrypt (cost factor 10) on creation/seed. Password field excluded from queries (`select: false`). | Verified |
| **Google Signup Gating** | New Google signups receive `status: 'pending'`. Access to `/admin/*` is blocked until Super Admin manual approval. | Verified |
| **Sensitive Data at Rest** | Government IDs (Aadhaar/Passport) encrypted with AES-256-GCM. Decrypt operations are audited in `ActivityLog`. | Verified |
| **Role Enforcement** | Route matching in `middleware.ts` plus programmatic role checks (`requireAuth()`, `requireSuperAdmin()`) in every API route. | Verified |
| **Soft Delete** | Residents are soft-deleted (`isDeleted: true`), freeing room beds safely while keeping audit records intact. | Verified |
| **Rate Limiting** | Sliding window rate-limiting protects `/login` and public `/api/inquiries` endpoints against abuse. | Verified |
| **File Upload Safety** | Restricted MIME types (JPEG, PNG, WebP, PDF) and 5MB size limit enforced on `/api/upload`. | Verified |
| **Input Validation** | Strict Zod validation on both client inputs and server API payloads. | Verified |
