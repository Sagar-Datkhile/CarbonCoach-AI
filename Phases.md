# CarbonCoach AI — Development Phases & Milestone Plan

Implementation must proceed strictly in accordance with the phases detailed below. Each phase has concrete deliverables and exit criteria. A phase cannot be marked complete until all exit criteria are verified and documented in `Memory.md`.

---

## Phase 1: Project Foundation, Design Tokens & System Health Check
* **Objective:** Establish the clean Next.js 15 project structure, configure styling tokens and core UI primitives, and implement the verified `/api/health` route.
* **Deliverables:**
  * Next.js 15 App Router setup with TypeScript and Tailwind CSS.
  * Essential libraries installed: `lucide-react`, `zod`, `react-hook-form`, `@supabase/supabase-js`, `@supabase/ssr`, `clsx`, `tailwind-merge`.
  * Design tokens in `globals.css` and `tailwind.config.ts` matching exact brand colors and typography.
  * Base atomic UI components (`Button`, `Card`, `MetricCard`, `Input`, `Badge`, `Alert`, `EmptyState`, `Skeleton`).
  * `/api/health` GET endpoint verifying server status, Supabase env config, and DB connectivity.
* **Exit Criteria:**
  * `npm run build` passes with zero TypeScript or ESLint errors.
  * `GET /api/health` returns valid JSON matching the specified shape.

---

## Phase 2: Supabase Schema & Database Migrations
* **Objective:** Author and apply production-grade PostgreSQL migrations establishing all 8 core tables with RLS and admin security functions.
* **Deliverables:**
  * `supabase/migrations/00001_initial_schema.sql` defining:
    * `profiles`, `household_profiles`, `emission_factors`, `electricity_bills`, `bill_extraction_logs`, `recommendation_templates`, `user_actions`, `simulation_runs`.
    * Automatic trigger synchronizing `auth.users` with `public.profiles`.
    * Row Level Security (RLS) policies for user data isolation.
    * `is_admin()` security definer function.
    * Seed data for baseline `recommendation_templates` and default `emission_factors`.
  * TypeScript database definition types in `src/types/database.ts`.
  * Supabase client and server helpers (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`).
* **Exit Criteria:**
  * Migration script executes cleanly without SQL syntax errors.
  * TypeScript database types accurately reflect the database schema.

---

## Phase 3: Supabase Authentication, Middleware & User Profile
* **Objective:** Implement secure user authentication (Email/Password + Google OAuth), session persistence, route protection middleware, and household profile onboarding.
* **Deliverables:**
  * Auth screens: `/login`, `/signup`, `/forgot-password`, `/auth/callback`.
  * Edge middleware protecting `/(dashboard)/*` and restricting `/(admin)/*` to validated admins.
  * Household profile management screen (`/profile`) allowing users to configure home type, occupancy, and budget tier.
* **Exit Criteria:**
  * Unauthenticated requests to `/dashboard` redirect to `/login`.
  * User profile updates persist to `household_profiles` with Zod validation.

---

## Phase 4: Public Landing Page & Responsive Shell
* **Objective:** Construct the high-conversion, responsive public landing page communicating CarbonCoach AI's value proposition and guiding users into the application.
* **Deliverables:**
  * Responsive header with mobile drawer navigation and authentication buttons.
  * Hero section with specified copy: *"Understand your energy. Make practical changes."*
  * 3-Step "How It Works" workflow (Upload $\rightarrow$ Review $\rightarrow$ Act).
  * Core capabilities showcase & bill-to-action preview.
  * Trust & transparency callout highlighting deterministic math and strict privacy.
  * Responsive footer.
* **Exit Criteria:**
  * Responsive layout verified across 320px, 375px, 768px, 1024px, 1440px+.
  * Zero horizontal scrollbar on mobile viewports. Touch targets $\ge 44px$.

---

## Phase 5: Bill Upload & Gemini 1.5 Flash Extraction Pipeline
* **Objective:** Build the secure 3-step bill intake pipeline: Upload to private Supabase Storage, server-side Gemini 1.5 Flash extraction with Zod schema validation, and human-in-the-loop confirmation.
* **Deliverables:**
  * `/bills/add` interface with multi-format dropzone (JPG, PNG, PDF).
  * Secure server action uploading file to private `bills` bucket.
  * Server-side Gemini 1.5 Flash integration with structured JSON extraction prompt.
  * Strict Zod parsing of extraction payload and logging to `bill_extraction_logs`.
  * Interactive review modal/form allowing users to correct fields before confirming.
  * Authoritative commit to `electricity_bills`.
* **Exit Criteria:**
  * Gemini API key strictly confined to server side.
  * Invalid extraction payloads fail gracefully without crashing.
  * Unconfirmed bills never show as authoritative records.

---

## Phase 6: User Dashboard & Progress Visualization
* **Objective:** Build the primary user dashboard matching the visual direction of CarbonCoach AI with true empty states and clear separation of estimated vs observed metrics.
* **Deliverables:**
  * KPI metric cards (Latest electricity consumption, daily average usage, estimated CO2 emissions, latest bill total).
  * Empty state with call-to-action when user has zero confirmed bills (no fake 320 kWh values).
  * Recent bills history table with bill detail viewer.
  * Progress dashboard separating planned actions, user-completed tasks, and verified bill deltas.
* **Exit Criteria:**
  * Zero hardcoded mock numbers in real user states.
  * All metrics compute dynamically from confirmed `electricity_bills`.

---

## Phase 7: Deterministic "My Plan" & Interactive What-If Simulator
* **Objective:** Provide personalized, budget-aligned energy efficiency recommendations and an interactive what-if simulator.
* **Deliverables:**
  * "My Plan" recommendation engine filtering templates by home ownership (`Owned` vs `Rented`) and budget tier.
  * Action planner allowing users to save actions to their plan and mark them complete.
  * Lighting & appliance what-if simulator implementing exact deterministic formula:
    $$\Delta kWh = \frac{(W_{current} - W_{proposed}) \times Quantity \times HoursPerDay \times Days}{1000}$$
  * Monetary savings and carbon reductions computed using active emission factor and tariff rates.
  * Mandatory disclaimer clarifying simulated potential vs verified historical savings.
* **Exit Criteria:**
  * Recommendation engine executes deterministically with zero LLM hallucinations.
  * Simulator results match manual calculations exactly.

---

## Phase 8: Admin Management Portal & Platform Governance
* **Objective:** Build the secure `/admin` management interface for platform metrics, template curation, emission factor updates, and system diagnostics.
* **Deliverables:**
  * Admin dashboard with KPI overview (total users, confirmed bills, extraction success/failure counts).
  * Registered users list with household summary.
  * Recommendation template manager (create, edit, toggle active status).
  * Emission factors manager (configure regional rates and carbon intensities).
  * Bill extraction failure log inspector.
  * System health check monitor interfacing with `/api/health`.
* **Exit Criteria:**
  * Non-admin users are strictly blocked at the server level.
  * Template mutations reflect immediately in user recommendations.

---

## Phase 9: End-to-End Verification, Responsive Audit & Documentation Handover
* **Objective:** Perform full application regression testing, complete responsive layout audit, verify code quality, and finalize all documentation.
* **Deliverables:**
  * Complete responsive testing audit report across all specified viewports.
  * Production build validation (`npm run build`).
  * Up-to-date `Memory.md` recording system architecture state and next steps.
  * Final Walkthrough summary artifact.
* **Exit Criteria:**
  * Clean production build with 0 TypeScript/ESLint errors.
  * All functional requirements from the PRD verified.
