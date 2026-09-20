# CarbonCoach AI — Design System & Visual Specification

## 1. Brand Identity & Design Direction

CarbonCoach AI's visual language is tailored to convey environmental responsibility, clinical accuracy, and personal empowerment. It intentionally avoids cluttered dashboards or generic green tropes, prioritizing calm clarity, structured whitespace, and confident data presentation.

* **Brand Personality:** Calm, Clean, Trustworthy, Environmental, Friendly, Minimal.
* **Core Metaphor:** A wise, unobtrusive household energy coach that demystifies utility data into immediate, attainable action.

---

## 2. Color Palette & Design Tokens

Every color token is engineered to satisfy WCAG 2.1 AA accessibility standards for high legibility across light canvases.

| Token Name | Hex Code | Usage Role |
| :--- | :--- | :--- |
| `--primary-dark-green` | `#075E45` | High-emphasis headers, active states, dark accents, sidebar highlights. |
| `--primary-green` | `#0B7252` | Primary interactive buttons, key progress rings, verified status icons. |
| `--primary-hover` | `#085B43` | Interactive hover state for primary buttons and links. |
| `--light-green` | `#EAF5EE` | Badges, card highlights, soft pill backgrounds, active tab pills. |
| `--pale-green` | `#F3F8F3` | Subtle hero callouts, table header fills, secondary surfaces. |
| `--bg-canvas` | `#FAFBF8` | Primary application canvas background (warm off-white / light slate). |
| `--card-surface` | `#FFFFFF` | Elevated card surfaces, modals, dialogs, drawers. |
| `--text-primary` | `#111827` | High-contrast body text, primary metrics, section headings. |
| `--text-secondary` | `#667085` | Subheadings, input labels, metadata, chart axis text. |
| `--border-subtle` | `#E3E7E3` | 1px card borders, dividing rules, input container strokes. |
| `--warning-bg` | `#FFF7E8` | Simulation disclaimers, pending verification banners. |
| `--warning-text` | `#9A5B00` | Warning copy, non-verified guidance flags. |
| `--error-red` | `#B42318` | Extraction errors, form validation failures, destructive actions. |

---

## 3. Typography System

* **Primary Font:** `Inter`, with fallbacks to `system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`.
* **Heading Styling:** Bold font weight (`700`), tight tracking (`letter-spacing: -0.02em` to `-0.03em`), high line-height control.
* **Body Styling:** Readable neutral sans-serif (`400` / `500`), optimal line-height `1.5` to `1.6`.
* **Tabular Lining Numbers (`font-variant-numeric: tabular-nums`):** Enforced on all numeric energy metrics ($kWh$, amounts, dates) to avoid layout shifts.

### Typography Scale
* **Display (Hero):** 36px (Mobile) / 48px to 56px (Desktop) — Font Weight 700 / Tracking -0.025em
* **Headline 1 (Page Title):** 28px (Mobile) / 32px (Desktop) — Font Weight 700 / Tracking -0.02em
* **Headline 2 (Section Title):** 20px (Mobile) / 24px (Desktop) — Font Weight 600 / Tracking -0.015em
* **Headline 3 (Card Title):** 16px to 18px — Font Weight 600
* **Body Large:** 16px — Font Weight 400 / 500
* **Body Medium:** 14px — Font Weight 400 / 500
* **Body Small / Caption:** 12px — Font Weight 500 / Tracking 0.01em

---

## 4. Component Standards

### 4.1 Surface Cards & Elevation
* **Border:** `1px solid var(--border-subtle)` (`#E3E7E3`).
* **Radius:** `12px` (`rounded-xl`) or `16px` (`rounded-2xl`).
* **Shadow:** Soft ambient light shadow: `0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)`.
* **Padding:** `1.25rem` (Mobile) / `1.75rem` (Desktop).

### 4.2 MetricCard
* Contains icon badge with soft colored circle (`#EAF5EE` background, `#0B7252` icon).
* High-impact metric number in tabular bold display font.
* Secondary comparison / cycle period label.
* Trend indicator chip (e.g., "-12% vs last cycle").

### 4.3 Buttons & Touch Targets
* **Touch Target Standard:** Minimum 44px $\times$ 44px clickable area on mobile devices.
* **Variants:**
  * *Primary:* Solid `#0B7252`, text `#FFFFFF`, hover `#085B43`, active scale `0.98`.
  * *Secondary / Outline:* Border `1.5px solid #0B7252`, text `#0B7252`, hover `#EAF5EE`.
  * *Ghost:* Transparent background, text `#075E45`, hover `#F3F8F3`.
  * *Destructive:* Solid `#B42318` or subtle red outline.

### 4.4 Form Controls (Input, Select, Checkbox, Slider)
* **Height:** Minimum 44px to 48px height.
* **Border:** `1px solid #E3E7E3`, transition on focus to `2px solid #0B7252` with subtle ring `rgba(11, 114, 82, 0.15)`.
* **Radius:** `8px` (`rounded-lg`).

### 4.5 EmptyState
* Dedicated empty state container for users with no confirmed bills or unpopulated action plans.
* Features friendly ecological illustration/icon, clear explanation, and a single prominent call-to-action button (e.g., "Upload Your First Bill").

---

## 5. Responsive Layout Architecture

### 5.1 Breakpoint Strategy
* **Mobile Small:** 320px - 374px (Single-column layout, compact typography, sticky bottom CTAs where needed).
* **Mobile Standard:** 375px - 639px (Clean card flow, edge margin `1rem`).
* **Tablet:** 640px - 1023px (2-column adaptive grid, drawer navigation).
* **Desktop:** 1024px - 1439px (Fixed 260px collapsible sidebar navigation, 2-3 column fluid grid, content constrained at max 1280px).
* **Wide Desktop:** 1440px+ (Balanced margins, maximum legibility).

### 5.2 Navigation Patterns
* **Mobile:** Compact header with brand logo, quick profile avatar, and a slide-over mobile drawer navigation.
* **Desktop:** Fixed clean left sidebar with active indicator pill in `--light-green` (`#EAF5EE`) and text in `--primary-dark-green` (`#075E45`).
