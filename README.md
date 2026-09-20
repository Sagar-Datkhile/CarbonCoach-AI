# CarbonCoach AI — Household Energy & Carbon Intelligence

> **Understand your energy. Make practical changes.**  
> Turn electricity bills into understandable insights and achievable actions.

CarbonCoach AI is a production-structured, responsive sustainability platform that empowers households to demystify electricity statements, securely upload utility bills, extract consumption data using server-side Gemini 1.5 Flash with strict human-in-the-loop review, simulate energy-saving interventions deterministically, and track real behavioral changes over time.

---

## Architecture & Technology Stack

* **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Lucide React, React Hook Form, Zod.
* **Backend:** Supabase (PostgreSQL with Row Level Security, Supabase Auth SSR, Supabase Storage).
* **AI & Extraction:** Google Gemini 1.5 Flash (server-side only, zero client key leakage, mandatory Zod validation).
* **Calculations:** 100% deterministic mathematical formulas in application logic (zero LLM hallucinations for savings).

---

## Core Application Modules

### 1. Public Portal
* **Landing Page (`/`):** Responsive hero, 3-step workflow, core capabilities, interactive bill-to-action preview, trust & data ethics transparency.
* **Authentication (`/login`, `/signup`, `/forgot-password`, `/auth/callback`):** Email/password and Google OAuth one-click authentication.

### 2. User Application
* **Dashboard (`/dashboard`):** Latest electricity usage (kWh), daily average consumption (kWh/d), estimated grid carbon footprint (kg CO₂e), latest bill total, dynamic recommended next step, and true empty states (no fake placeholder numbers).
* **Add Bill (`/bills/add`):** 3-step wizard (Upload PDF/image $\rightarrow$ Server-side Gemini 1.5 Flash extraction $\rightarrow$ Human review and authoritative confirmation).
* **Bills History (`/bills`):** Comprehensive statement log with deletion and cycle tracking.
* **My Plan (`/plan`):** Action catalog dynamically filtered by home ownership (`Owned` vs `Rented`) and budget tier, with active task management.
* **What-If Simulator (`/simulator`):** Interactive lighting and appliance upgrade simulator with real-time sliders, transparent mathematical formulas, and disclaimers.
* **Progress (`/progress`):** Tri-partite separation between modeled projections (Tier 1), user-reported completed habits (Tier 2), and verified bill deltas (Tier 3).
* **Profile & Settings (`/profile`):** Personal information, household ownership type, occupancy, budget tier, and preferred currency.

### 3. Administrator Portal (`/admin`)
* **Admin Overview (`/admin`):** Platform metrics (registered users, confirmed bills, extraction success/failure counts, completed actions).
* **User Management (`/admin/users`):** Registered profiles and role assignments.
* **Template Governance (`/admin/templates`):** Create and toggle active status for recommendation templates.
* **Emission Factors (`/admin/emissions`):** Manage and version regional carbon intensities ($kg\ CO_2e / kWh$) and default tariffs.
* **Extraction Audit Logs (`/admin/logs`):** Inspect Gemini extraction latency, payloads, and failure diagnostics.
* **System Health (`/admin/health`):** Diagnostic audit interfacing with `/api/health`.

---

## Project Documentation Suite

* [`PRD.md`](PRD.md): Product Requirements Document detailing user personas, functional specifications, and quality standards.
* [`Architecture.md`](Architecture.md): System architecture, PostgreSQL schema, RLS policies, and directory structure.
* [`Rules.md`](Rules.md): Strict engineering rules prohibiting synthetic data, enforcing deterministic math, and isolating API keys.
* [`Phases.md`](Phases.md): 9-phase milestone roadmap and exit criteria.
* [`Design.md`](Design.md): Design system tokens, color palettes, typography scales, and responsive guidelines.
* [`Memory.md`](Memory.md): Living project ledger recording verified milestones and architectural decisions.

---

## Getting Started

### 1. Prerequisites
* Node.js 18+ (tested on Node v22.18.0)
* npm 9+

### 2. Installation
```bash
git clone https://github.com/Sagar-Datkhile/CarbonCoach-AI.git
cd CarbonCoach-AI
npm install
```

### 3. Environment Configuration
Copy `.env.example` to `.env.local` and configure your credentials:
```bash
cp .env.example .env.local
```

Configure:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup
Run the idempotent SQL migration in your Supabase SQL Editor:
```
supabase/migrations/00001_initial_schema.sql
```

### 5. Running the Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view CarbonCoach AI.

### 6. Production Build & Verification
```bash
npm run build
npm run start
```
Verify system health at [http://localhost:3000/api/health](http://localhost:3000/api/health).
