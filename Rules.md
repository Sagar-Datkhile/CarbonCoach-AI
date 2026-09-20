# CarbonCoach AI — Core Engineering & Governance Rules

These rules are strict, non-negotiable architectural and engineering constraints. Any pull request or code change violating these principles is deemed invalid.

---

## 1. Data Integrity & Anti-Fabrication Principles

1. **Zero Synthetic / Fake Records in Real User State:**
   * Never insert hardcoded demo electricity consumption numbers (e.g., "320 kWh", "$145.00") into a user's database records.
   * If a user has no confirmed electricity bills, render an explicit, friendly **EmptyState** inviting them to upload their first bill.
2. **Deterministic Energy & Financial Calculations:**
   * **Never allow Gemini or any LLM to invent, estimate, or hallucinate dollar or kWh savings figures.**
   * All recommendation savings must be calculated deterministically in TypeScript using verified formulas and database-backed `recommendation_templates`.
   * What-If simulation outputs must strictly execute the approved mathematical formula:
     $$\Delta kWh = \frac{(W_{current} - W_{proposed}) \times Quantity \times HoursPerDay \times Days}{1000}$$
3. **Tri-Partite Progress Separation:**
   * UI components must visually demarcate:
     1. **Modeled/Estimated Potential:** Projections from planned actions.
     2. **User-Reported Completed Actions:** Behavioral tracking that a user marked complete.
     3. **Observed Changes:** Real variance calculated strictly between consecutive confirmed utility bills.
   * Completing an action does not automatically alter confirmed bill metrics.

---

## 2. Artificial Intelligence & Gemini 1.5 Flash Constraints

1. **Single Authorized Scope:**
   * Google Gemini is used **strictly and solely for electricity bill information extraction** from uploaded documents/images.
2. **Server-Side Exclusivity:**
   * Never call the Gemini API from browser client components.
   * `GEMINI_API_KEY` must never be prefixed with `NEXT_PUBLIC_` and must never appear in client bundles.
3. **Mandatory Zod Validation:**
   * Every raw JSON response returned by Gemini must pass strict Zod schema validation (`BillExtractionSchema`) on the server before anything is logged or surfaced to the user.
4. **Human-in-the-Loop Confirmation:**
   * AI-extracted bill values are treated as preliminary suggestions.
   * The user must review, edit if necessary, and explicitly press **Confirm** before a record is committed to `electricity_bills`.

---

## 3. Security, Authentication & Authorization

1. **PostgreSQL Row Level Security (RLS):**
   * RLS must be enabled on every table in the `public` schema.
   * Users may only read, insert, update, or delete records where `user_id = auth.uid()`.
2. **Server-Validated Administrator Access:**
   * Never rely on client-side state, localStorage, or query params to establish admin permissions.
   * Admin routes (`/admin/*`) and administrative mutations must be verified on the server via `public.is_admin()` or server-side Supabase claims checking `profiles.role = 'admin'`.
3. **Secret Isolation:**
   * `SUPABASE_SERVICE_ROLE_KEY` is reserved exclusively for server-side elevated background operations (e.g., initial migration checks, admin health audits) and never shipped to the client.
4. **Storage Security:**
   * Uploaded electricity bills contain sensitive personal addresses and account numbers. The `bills` storage bucket must remain **Private**. Access to raw bill files must require signed URLs or authenticated user sessions.

---

## 4. Architecture & Scope Governance

1. **No Invented Requirements / Silent Modules:**
   * Do not introduce extraneous features (e.g., social feed, cryptocurrency offsets, gamified leaderboards) outside the approved PRD.
   * The initial MVP is dedicated to **household electricity bills and direct efficiency**.
2. **Clean Phased Progression:**
   * Adhere strictly to `Phases.md`. Implement only the active phase.
   * Test the active phase thoroughly.
   * Update `Memory.md` upon phase completion before starting the next phase.

---

## 5. UI/UX & Responsive Engineering

1. **Mobile-First Responsive Standard:**
   * Every component and page must be fully responsive across mobile (320px, 360px, 375px, 390px, 414px), tablet (768px), and desktop (1024px, 1280px, 1440px+).
   * No horizontal scrolling on mobile viewports.
2. **Touch Accessibility:**
   * Interactive buttons, inputs, and toggles must adhere to a minimum touch target size of **44px $\times$ 44px**.
3. **Design System Adherence:**
   * Maintain the calm, clean, trustworthy visual direction:
     * Dark Green `#075E45`, Primary Green `#0B7252`, Light Green `#EAF5EE`, Canvas `#FAFBF8`, Card `#FFFFFF`, Text `#111827`.
     * Inter typography with tight headline tracking.
