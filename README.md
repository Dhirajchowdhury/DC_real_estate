# DC Real Estate - Enterprise Operating System

Welcome to the **DC Real Estate** repository. This platform is a production-ready, Enterprise-grade Real Estate Brokerage CRM and Property Listing Website. It is designed with a premium "Luxury Minimalism with Soft Claymorphism Accents" aesthetic.

## 🚀 Features & Modules Built (Phases 1-5)

The entire platform has been designed across 5 distinct phases to act as a complete operating system for your brokerage:

1. **Phase 1: Architecture & Foundation**
   - Setup Next.js 15 App Router (Frontend) and Express.js + Prisma (Backend).
   - Designed the base UI framework with Tailwind CSS, Shadcn UI, and Framer Motion.
   - Built a secure JWT Authentication system with HttpOnly Cookies and Refresh Tokens.

2. **Phase 2: CRM & Lead Management**
   - Built a comprehensive Client Relationship Management (CRM) dashboard.
   - Added robust lead tracking (Facebook, WhatsApp, Walk-ins, Custom Sources).
   - Implemented Lead Scoring (Cold, Warm, Hot), Stage Tracking, and Client Requirements matching.

3. **Phase 3: Business Operations & Calendar**
   - Created a complete scheduling module for Site Visits and Document Collections.
   - Built a team dashboard for assigning tasks and tracking daily brokerage workflow.
   - Integrated Business Analytics for evaluating lead conversions and property velocity.

4. **Phase 4: Public Website & Customer Experience**
   - Built an SEO-optimized, highly responsive public-facing property portal.
   - Features dynamic search filters, a beautiful hero section, and smooth Framer Motion animations to rival Airbnb and Zillow.

5. **Phase 5: Payments, AI, & Enterprise Features**
   - **Billing & Invoices**: Integrated a secure Payment dashboard modeled for Razorpay transactions and automated PDF invoicing.
   - **Owner Portal (`/owner`)**: Created a dedicated dashboard for landlords/owners to track site visits and property views.
   - **Document Vault**: A secure vault for legal documents and NOC clearances.
   - **AI Semantic Search**: An AI chat widget floating on the public frontend that parses natural language (e.g., *"Show me 3 BHK under 60 lakh"*) and automatically runs complex database queries.
   - **PWA Ready**: Configured the frontend to be installable on mobile and desktop devices.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (React 19), TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, Zustand, TanStack Query.
- **Backend:** Node.js, Express.js, TypeScript, Zod, Prisma ORM.
- **Database:** PostgreSQL (Supabase).

---

## 💻 How to Run the Application

Because this is a decoupled architecture, you have **two separate applications** running simultaneously: the Frontend (Next.js) and the Backend (Express). 

You do **NOT** install packages in the root directory. You must install dependencies in the respective folders.

### Step 1: Database Setup (Supabase)
1. Create a free PostgreSQL database on [Supabase](https://supabase.com/).
2. Get your **Connection String (URI)**.
3. In `backend/.env`, set your connection string:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.xxxx.supabase.co:5432/postgres"
   PORT=5000
   JWT_SECRET="your-super-secret-key"
   JWT_REFRESH_SECRET="your-super-refresh-secret-key"
   FRONTEND_URL="http://localhost:3000"
   ```

### Step 2: Initialize the Backend
Open a terminal and run the following commands:
```bash
# 1. Navigate to the backend folder
cd backend

# 2. Install backend dependencies
npm install

# 3. Sync your Prisma schema with the Supabase Database
npx prisma db push

# 4. Generate the Prisma Client
npx prisma generate

# 5. Start the backend development server
npm run dev
```
*The backend should now be running on `http://localhost:5000`.*

### Step 3: Initialize the Frontend
Open a **new, separate terminal** and run the following commands:
```bash
# 1. Navigate to the frontend folder
cd frontend

# 2. Install frontend dependencies
npm install

# 3. (Optional) Create a .env.local file in frontend if you need custom API URLs
# NEXT_PUBLIC_API_URL=http://localhost:5000/api

# 4. Start the frontend development server
npm run dev
```
*The frontend should now be running on `http://localhost:3000`.*

---

## 🔑 Required API Keys (For Production)

While you can test the UI locally right now, you will need the following API keys to fully activate the Phase 5 Enterprise features:

1. **Razorpay Keys**: Required in the backend `PaymentController` to activate live payment capturing for bookings and consultations.
2. **OpenAI / Gemini Keys**: Required in the backend `AIController` to replace the mock semantic search parser with real Natural Language Processing.
3. **Supabase Storage**: If you want to upload actual images and PDFs instead of using local paths, configure a Supabase Storage bucket.
