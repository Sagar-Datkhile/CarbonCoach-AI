# CarbonCoach AI — System Architecture Specification

## 1. System Architecture Overview

CarbonCoach AI utilizes a modern, production-grade cloud architecture pairing Next.js 15 (App Router) on the front-end/server layer with Supabase (PostgreSQL, Auth, Storage) and Google Gemini 1.5 Flash on the AI/data extraction layer.

```mermaid
graph TD
    Client["Next.js Responsive Client (React 19 / Tailwind / Lucide)"]
    ServerActions["Next.js Server Actions & Route Handlers"]
    SupabaseAuth["Supabase Auth (JWT / OAuth)"]
    SupabaseDB[("Supabase PostgreSQL (RLS Enforced)")]
    SupabaseStorage["Supabase Storage (Private 'bills' Bucket)"]
    GeminiAI["Google Gemini 1.5 Flash (Server-Side Only)"]

    Client -->|HTTPS / Next Router| ServerActions
    Client -->|Session Handshake| SupabaseAuth
    ServerActions -->|Secure Service Role / User JWT| SupabaseDB
    ServerActions -->|Private File Upload / Signed URL| SupabaseStorage
    ServerActions -->|Document Extraction & Structured Output| GeminiAI
    GeminiAI -->|Validated JSON (Zod)| ServerActions
    ServerActions -->|Write Confirmed Data| SupabaseDB
```

---

## 2. Technology Stack Selection

| Domain | Technology | Rationale & Configuration |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 15 (App Router) | Server Components for high performance, React 19, nested layouts. |
| **Language** | TypeScript (Strict Mode) | Full end-to-end type safety across API routes and UI components. |
| **Styling** | Tailwind CSS & Vanilla CSS Variables | Rapid responsive development, design token fidelity, micro-interactions. |
| **Icons** | Lucide React | Clean, scalable, lightweight iconography. |
| **Forms & Validation** | React Hook Form + Zod | Strict client & server validation schemas for forms and AI responses. |
| **Backend & DB** | Supabase PostgreSQL | Fully relational, ACID-compliant, Row Level Security (RLS) enforcement. |
| **Authentication** | Supabase Auth (SSR) | Email/password, Google OAuth, `@supabase/ssr` cookie-based session handler. |
| **Storage** | Supabase Storage | Encrypted private bucket with signed URLs for utility bills. |
| **AI Extraction** | Google Gemini 1.5 Flash | Server-side document reasoning, high token efficiency, zero client leakage. |

---

## 3. PostgreSQL Database Schema Design

All tables utilize UUID primary keys, default timestamps (`created_at`, `updated_at`), foreign keys with safe cascading, and explicit check constraints.

### 3.1 Schema Definition Table Overview

```sql
-- 1. Profiles Table (Extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Household Profiles Table
CREATE TABLE public.household_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    household_name TEXT NOT NULL DEFAULT 'My Household',
    home_type TEXT NOT NULL DEFAULT 'Owned' CHECK (home_type IN ('Owned', 'Rented', 'Shared', 'Other')),
    occupants_count INTEGER NOT NULL DEFAULT 2 CHECK (occupants_count > 0),
    region TEXT DEFAULT 'Global',
    budget_tier TEXT NOT NULL DEFAULT 'Moderate' CHECK (budget_tier IN ('Zero-Cost', 'Low', 'Moderate', 'High')),
    heating_type TEXT DEFAULT 'Electric',
    cooling_type TEXT DEFAULT 'Air Conditioning',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Emission Factors Table
CREATE TABLE public.emission_factors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code TEXT NOT NULL,
    region_name TEXT NOT NULL,
    factor_kg_co2e_per_kwh NUMERIC(8, 4) NOT NULL CHECK (factor_kg_co2e_per_kwh > 0),
    currency_code TEXT NOT NULL DEFAULT 'USD',
    default_tariff_per_kwh NUMERIC(8, 4) NOT NULL DEFAULT 0.16 CHECK (default_tariff_per_kwh >= 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Electricity Bills Table (Authoritative confirmed bills)
CREATE TABLE public.electricity_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,
    consumer_number TEXT,
    bill_number TEXT,
    billing_period_start DATE NOT NULL,
    billing_period_end DATE NOT NULL,
    billing_days INTEGER GENERATED ALWAYS AS ((billing_period_end - billing_period_start) + 1) STORED,
    energy_consumed_kwh NUMERIC(10, 2) NOT NULL CHECK (energy_consumed_kwh >= 0),
    bill_amount NUMERIC(10, 2) NOT NULL CHECK (bill_amount >= 0),
    tariff_rate NUMERIC(8, 4),
    currency TEXT NOT NULL DEFAULT 'USD',
    due_date DATE,
    file_path TEXT,
    status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('draft', 'confirmed', 'archived')),
    estimated_emissions_kg NUMERIC(10, 2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT check_dates CHECK (billing_period_end >= billing_period_start)
);

-- 5. Bill Extraction Logs Table (Audit of raw AI output & corrections)
CREATE TABLE public.bill_extraction_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    raw_ai_response JSONB,
    validated_payload JSONB,
    status TEXT NOT NULL CHECK (status IN ('processing', 'success', 'failed', 'corrected')),
    error_message TEXT,
    processing_time_ms INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Recommendation Templates Table
CREATE TABLE public.recommendation_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'electricity' CHECK (category IN ('electricity', 'heating', 'appliances', 'habits')),
    applicable_home_types TEXT[] NOT NULL DEFAULT '{"Owned", "Rented", "Shared"}',
    applicable_budget_tiers TEXT[] NOT NULL DEFAULT '{"Zero-Cost", "Low", "Moderate", "High"}',
    difficulty TEXT NOT NULL DEFAULT 'Easy' CHECK (difficulty IN ('Easy', 'Moderate', 'Advanced')),
    estimated_kwh_reduction_annual NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_percent_reduction NUMERIC(5, 2) NOT NULL DEFAULT 0,
    upfront_cost_estimate NUMERIC(10, 2) NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. User Actions Table (My Plan & Progress)
CREATE TABLE public.user_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    template_id UUID REFERENCES public.recommendation_templates(id) ON DELETE SET NULL,
    custom_title TEXT,
    status TEXT NOT NULL DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'completed', 'dismissed')),
    estimated_kwh_saving NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_cost_saving NUMERIC(10, 2) NOT NULL DEFAULT 0,
    estimated_co2_saving NUMERIC(10, 2) NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Simulation Runs Table (What-If audit history)
CREATE TABLE public.simulation_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    simulation_type TEXT NOT NULL DEFAULT 'lighting_replacement',
    input_parameters JSONB NOT NULL,
    calculated_kwh_saving NUMERIC(10, 2) NOT NULL,
    calculated_cost_saving NUMERIC(10, 2) NOT NULL,
    calculated_co2_saving NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

---

## 4. Row Level Security (RLS) Policy Architecture

Every public table has Row Level Security enabled.
* **Profiles:** Users can `SELECT` and `UPDATE` their own profile (`auth.uid() = id`). Admins can `SELECT` all profiles.
* **Household Profiles:** Users can `SELECT`, `INSERT`, `UPDATE` their own record (`auth.uid() = user_id`).
* **Electricity Bills:** Users have full CRUD access strictly bounded by `auth.uid() = user_id`.
* **Bill Extraction Logs:** Users can read and insert their own logs; Admins can read all logs.
* **Recommendation Templates & Emission Factors:** Publicly readable by all authenticated users; mutating (`INSERT`, `UPDATE`, `DELETE`) is strictly restricted to verified `admin` profiles.
* **User Actions & Simulations:** Scoped strictly to `auth.uid() = user_id`.

```sql
-- Security Helper Function: Check if caller is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 5. Server Architecture & API Routes

### 5.1 `/api/health` (System Health Route)
* **Method:** `GET`
* **Response:**
  ```json
  {
    "status": "ok",
    "service": "carboncoach-api",
    "database": "connected",
    "timestamp": "2026-09-20T11:30:00.000Z"
  }
  ```
* **Security:** No internal SQL diagnostics or environment variables exposed in error states.

### 5.2 `/api/bills/extract` (AI Extraction Route)
* **Method:** `POST` (Server Action or Route Handler)
* **Execution:**
  1. Authenticate user session.
  2. Verify uploaded file existence in Supabase Storage.
  3. Load file buffer on server side.
  4. Invoke Gemini 1.5 Flash using strict JSON schema output format.
  5. Validate output payload against `BillExtractionSchema` (Zod).
  6. Return candidate fields to client for human review.

### 5.3 Deterministic Recommendation Engine
* Pure TypeScript deterministic module executing on the server/client without external AI API latency.
* Filters `recommendation_templates` matching `home_type` and `budget_tier`, multiplying baseline kWh savings by household occupancy multipliers.

---

## 6. Directory Structure

```
CarbonCoach-AI/
├── PRD.md
├── Architecture.md
├── Rules.md
├── Phases.md
├── Design.md
├── Memory.md
├── supabase/
│   └── migrations/
│       └── 00001_initial_schema.sql
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── signup/
│   │   │   └── forgot-password/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── bills/
│   │   │   │   ├── page.tsx
│   │   │   │   └── add/page.tsx
│   │   │   ├── plan/page.tsx
│   │   │   ├── simulator/page.tsx
│   │   │   ├── progress/page.tsx
│   │   │   └── profile/page.tsx
│   │   ├── (admin)/
│   │   │   └── admin/
│   │   │       ├── page.tsx
│   │   │       ├── users/page.tsx
│   │   │       ├── templates/page.tsx
│   │   │       └── emissions/page.tsx
│   │   ├── api/
│   │   │   ├── health/route.ts
│   │   │   ├── bills/extract/route.ts
│   │   │   └── auth/callback/route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx (Public Landing Page)
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (Button, Card, MetricCard, Input, Modal, etc.)
│   │   ├── landing/ (Hero, HowItWorks, Features, Preview, Footer)
│   │   ├── dashboard/ (OverviewMetrics, RecentBills, NextStepPrompt)
│   │   ├── bills/ (FileUploader, ExtractedDataForm, BillCard)
│   │   ├── simulator/ (LightingCalculator, ApplianceCalculator)
│   │   ├── plan/ (ActionCard, FilterBar)
│   │   └── layout/ (Header, Sidebar, MobileNav, Footer)
│   ├── lib/
│   │   ├── supabase/ (client.ts, server.ts, middleware.ts)
│   │   ├── gemini/ (extractor.ts, prompts.ts)
│   │   ├── calculations/ (simulator.ts, emissions.ts, savings.ts)
│   │   ├── validations/ (bill.ts, profile.ts, simulation.ts)
│   │   └── utils.ts
│   └── types/ (database.ts, index.ts)
└── tailwind.config.ts
```
