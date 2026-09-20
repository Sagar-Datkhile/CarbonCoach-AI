# CarbonCoach AI — Product Requirements Document (PRD)

## 1. Executive Summary & Vision
**CarbonCoach AI** is a production-structured, responsive web platform designed to empower households to understand their electricity consumption, translate complex utility bills into actionable insights, simulate energy-saving scenarios deterministically, and track real behavioral changes over time. 

### 1.1 Hackathon Scope & Extensibility
* **Initial MVP Scope:** Focused strictly on **household electricity and energy consumption**.
* **Extensible Architecture:** Designed with modularity to accommodate future carbon activity domains (e.g., transportation, food, waste, home heating fuels) without requiring structural rework of the database or frontend architecture.
* **Core Philosophy:** "Understand your energy. Make practical changes." No greenwashing, no fabricated AI figures, and total transparency between estimated and observed outcomes.

---

## 2. User Personas & Roles

### 2.1 Household User (Tenant / Homeowner)
* **Goal:** Demystify utility bills, identify realistic ways to reduce energy waste, calculate financial and carbon impacts before purchasing equipment, and monitor progress over billing cycles.
* **Permissions:**
  * Manage personal and household profile (homeownership type, budget, appliances).
  * Securely upload electricity bills (PDF, JPG, PNG).
  * Review and correct server-extracted bill information.
  * Explicitly confirm bill records to make them authoritative.
  * Access personalized dashboard and deterministic action plans.
  * Run what-if simulations (e.g., LED lighting conversions, appliance run-time reductions).
  * Track planned actions and mark items completed.

### 2.2 Administrator
* **Goal:** Govern platform data integrity, oversee bill extraction reliability, manage baseline recommendation templates, update regional emission factors, and monitor application health.
* **Permissions:**
  * Access the `/admin` portal (validated strictly via server-side database role).
  * Inspect platform-level metrics (total users, confirmed bills, extraction success/failure rates).
  * View registered user profiles and active households.
  * Create, edit, activate, or deactivate recommendation templates.
  * Configure and version regional grid emission factors ($kg\ CO_2e / kWh$).
  * Inspect extraction failure logs and debug Gemini parsing issues.
  * Monitor system uptime and database connectivity.

---

## 3. Product Modules & Functional Specifications

### 3.1 Public Portal
1. **Responsive Landing Page:**
   * **Header:** Logo, primary navigation anchors (Features, How it Works, Simulator, Security), and authentication action buttons (Sign In / Get Started).
   * **Hero Section:** Clear value proposition:
     * *Headline:* "Understand your energy. Make practical changes."
     * *Subhead:* "Turn electricity bills into understandable insights and achievable actions."
     * *Primary CTAs:* "Get Started" and "Sign In".
   * **How It Works:** 3-step intuitive pipeline:
     1. *Upload Bill:* Securely upload digital PDF or paper photo.
     2. *Review & Confirm:* Verify extracted metrics with total transparency.
     3. *Take Action:* Receive customized, budget-conscious household recommendations.
   * **Core Capabilities Grid:** Bill extraction intelligence, deterministic what-if simulator, verified progress tracking, and privacy-first data handling.
   * **Bill-to-Action Interactive Preview:** Visual demonstration showing how a raw bill translates into concrete kWh and dollar savings.
   * **Trust & Transparency Banner:** Explanation that savings are calculated deterministically (not fabricated by AI) and that bills remain strictly private to the user.
   * **Footer:** Quick links, disclaimer, and version metadata.
2. **Authentication Flow:**
   * Email and password sign up, login, forgot password, and reset password.
   * Google OAuth one-click authentication.
   * Protected route redirection:
     * Unauthenticated users attempting to access `/dashboard` or `/profile` redirect to `/login`.
     * Authenticated users accessing `/login` or `/signup` redirect to `/dashboard`.
     * Non-admin users attempting to access `/admin` redirect to `/dashboard` or show a 403 Forbidden state.

### 3.2 Add Bill Workflow (Upload $\rightarrow$ Review $\rightarrow$ Confirm)
* **Step 1 (Upload):** 
  * Accepted formats: JPG, JPEG, PNG, PDF (max 10MB).
  * Client-side mime-type and size validation.
  * File uploaded directly to a secure, private Supabase Storage bucket (`bills`).
* **Step 2 (Extraction):** 
  * Triggered via a secure, server-side Next.js route handler / Server Action.
  * Google Gemini 1.5 Flash processes the document buffer using structured output schemas.
  * Target extraction fields:
    * `provider_name` (string)
    * `consumer_number` (optional string)
    * `bill_number` (optional string)
    * `billing_period_start` (ISO date string)
    * `billing_period_end` (ISO date string)
    * `billing_days` (integer)
    * `energy_consumed_kwh` (float)
    * `bill_amount` (float)
    * `tariff_rate` (optional float per kWh)
    * `currency` (string, e.g., USD, INR, EUR)
    * `due_date` (optional ISO date string)
  * Extraction results validated with Zod prior to database logging.
* **Step 3 (Review):**
  * Present extracted data in an editable verification form.
  * Visual badge alerting the user to review the fields.
* **Step 4 (Confirmation):**
  * Only upon explicit user confirmation is the authoritative `electricity_bills` row created.
  * **Rule:** Never silently trust raw AI extraction without human-in-the-loop verification.

### 3.3 User Dashboard
* **Metrics Cards:**
  * Latest electricity consumption (kWh) & billing cycle duration.
  * Daily average consumption ($kWh / day$).
  * Estimated carbon emissions ($kg\ CO_2e$) using the active regional factor.
  * Latest bill amount and currency.
* **Recommended Next Step:** Dynamic high-impact prompt based on current household state.
* **Action Center:** Quick toggle between planned and user-reported completed actions.
* **Empty State:** If zero confirmed bills exist, display a clean callout inviting the user to upload their first bill (no mock 320 kWh placeholder values).

### 3.4 My Plan (Deterministic Recommendation Engine)
* **Inputs:**
  * Homeownership type (Owned, Rented, Shared).
  * Available budget tier (Low/Zero cost, Moderate, High/Capital investment).
  * Existing equipment profile (HVAC, water heater, lighting, refrigeration).
* **Deterministic Matching:**
  * Recommendations sourced from database `recommendation_templates`.
  * Filtered by household eligibility (e.g., renters do not receive solar panel roof replacement recommendations).
  * Potential kWh, dollar savings, and carbon reduction calculated with transparent mathematical baselines.
  * **Rule:** Gemini does not hallucinate financial or energy numbers.

### 3.5 What-If Simulator
* **Purpose:** Explore the impact of behavioral or appliance upgrades before executing them.
* **Initial Scenario (Lighting Replacement):**
  * Inputs: Current bulb wattage, proposed LED bulb wattage, quantity of bulbs, daily usage hours, projection period (days).
  * Deterministic Formula:
    $$\Delta kWh = \frac{(W_{current} - W_{proposed}) \times Quantity \times HoursPerDay \times Days}{1000}$$
  * Monetary Savings: $\Delta kWh \times TariffRate$
  * Emissions Avoided: $\Delta kWh \times EmissionFactor$
* **Disclaimer:** Explicit badge stating simulations reflect modeled potential rather than verified real-world outcomes.

### 3.6 Progress Tracker
* **Three-Tier Metric Separation:**
  1. *Planned Actions:* Theoretical modeled savings.
  2. *User-Reported Completed Actions:* Behavioral completion tally.
  3. *Observed Change:* Historical delta between confirmed consecutive utility bills.
* **Rule:** Completing a task does not automatically claim verified savings until confirmed by utility bills.

### 3.7 Profile & Settings
* Household name, ownership type, location/region, occupants count, budget preference.
* Account management, session details, and sign out.

### 3.8 Admin Application
* Platform overview KPI counters (Users, Confirmed Bills, Extraction Success Rate).
* Recommendation template CRUD and activation toggles.
* Emission factor versioning and regional defaults.
* Bill extraction failure audit logs with error categorization.
* Real-time system health and database connectivity diagnostics.

---

## 4. Non-Functional & Quality Standards
* **Responsive Design:** Mobile-first architecture tested across 320px, 375px, 768px, 1024px, and 1440px+ viewports without horizontal clipping.
* **Touch Targets:** Minimum 44px $\times$ 44px clickable areas for mobile usability.
* **Accessibility:** Semantic HTML5, WCAG 2.1 AA compliant color contrast ratios.
* **Performance:** Server-side rendering for critical paths, client components isolated to interactive zones.
* **Security & RLS:** All tables enforce Row Level Security. Secrets (`GEMINI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) restricted to server execution.
