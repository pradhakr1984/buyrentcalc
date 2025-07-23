Buy vs. Rent Calculator (Next.js + React + Tailwind)

A crisp, modern web app that helps users decide whether to buy or rent by comparing after‑tax cash flows and opportunity costs over a chosen horizon.

1. What This Project Does

Takes a small set of intuitive inputs (≤ ~7 core sliders/fields, with a few optional advanced ones).

Projects costs/benefits of buying vs. renting over N years.

Shows totals (NPV and nominal), break-even year, and sensitivity charts.

Clean UI using Next.js (App Router), React, Tailwind CSS, and Inter font.

2. Core Inputs ("The Seven")

These will be the primary controls surfaced on the UI. Everything else can default or live under an "Advanced" accordion.

#

Variable

Default

Notes

1

Purchase Price

750,000

Home purchase cost

2

Down Payment %

20%

% of purchase price

3

Mortgage Rate % (APR)

6.25%

Fixed 30-yr loan by default

4

Rent (monthly)

3,500

Cost of equivalent home

5

Alt. Investment Return %

6.0%

Opportunity cost for cash not tied up in the house (stocks/bonds mix)

6

Property Tax Rate %

1.25%

Annual % of purchase price (apply local rate)

7

Home Price Appreciation %

3.0%

Annual growth of home value

Recommended Advanced Inputs (Optional)

Mortgage Term (yrs): default 30

Maintenance % of Home Value: 1.0%/yr

Insurance + HOA (annual): 1,800

Rent Inflation %: 3.0%

General Inflation %: 2.5%

Selling Costs % (realtor, closing): 6.0%

Closing Costs (buy): 2.5% of purchase price (one-time)

Income Tax Rate / Marginal Rate: to model mortgage interest deduction (toggle on/off)

Time Horizon (yrs): 5–10 default

3. Calculation Outline

All dollar flows are converted to both nominal totals and NPV using the Alt. Investment Return % as the discount rate (or a separate discount rate if desired).

Buy Scenario Cash Flows

Initial Outlay: down payment + closing costs.

Annual Costs: mortgage payments (principal+interest), property taxes, insurance/HOA, maintenance.

Tax Shield (optional): mortgage interest & property tax deductions * tax rate (subject to deduction limits).

Equity Build: principal paid each year + appreciation of home value.

Exit (year N): sale price − selling costs − remaining mortgage balance.

Rent Scenario Cash Flows

Annual Rent: rent * 12 * (1 + rent_inflation)^t.

Invested Capital: down payment + closing costs invested at Alt. Investment Return % (compounded).

Ongoing Investment Return: any year-to-year savings vs. buying can be assumed invested.

Result Metrics

Total Nominal Cost/Benefit (Rent vs Buy)

NPV Difference

Break-even Year (if any)

Equity at Exit (Buy)

Liquid Portfolio Value (Rent)

Formula Pseudocode (TypeScript-ish):

const mortgagePayment = (r, n, P) => (r*P) / (1 - Math.pow(1+r, -n));
// r = monthly rate, n = total months, P = principal

// Discount factor
df = 1 / Math.pow(1 + altReturnRate, year);

// Loop years 1..N to build cash flows
for (year=1; year<=N; year++) {
  buyCosts = mortgageInterest + propertyTax + maintenance + insuranceHOA - taxShield;
  rentCosts = annualRent;
  // accumulate NPV, totals, etc.
}

4. Tech Stack & Key Libraries

Next.js 14+ (App Router, Server Components where helpful)

React 18

Tailwind CSS 3

TypeScript

Font: Inter via @next/font/google

Zod (or Yup) for schema validation of inputs

Lucide-react icons (minimal set)

React Hook Form (simple controlled forms & live updates)

Recharts / Chart.js for basic bar/line charts (optional)

5. Project Structure (Suggested)

.
├─ app/
│  ├─ layout.tsx
│  ├─ page.tsx               // main calculator UI
│  ├─ api/
│  │  └─ calc/route.ts       // optional server calc endpoint
├─ components/
│  ├─ InputField.tsx
│  ├─ Slider.tsx
│  ├─ Toggle.tsx
│  ├─ ResultCard.tsx
│  ├─ ChartBlock.tsx
│  └─ AdvancedSection.tsx
├─ lib/
│  ├─ calc.ts                // math/finance functions
│  └─ types.ts               // interfaces for inputs/outputs
├─ styles/
│  └─ globals.css
├─ public/
│  └─ favicon.ico
├─ package.json
└─ tailwind.config.js

6. UI/UX Guidelines

Layout: two-column on desktop (inputs left, results right), stacked on mobile.

Controls: sliders + number inputs for clarity.

Results: cards with headline numbers, expandable detail table.

Theme: light mode default, simple gray/neutral palette. Add dark mode toggle later.

Typography: Inter for all text; bold for section headers, normal for body.

Accessibility: proper labels, keyboard nav, aria attributes.

7. Getting Started (One-Shot Friendly)

# 1. Create project
npx create-next-app@latest buy-vs-rent --ts --eslint --src-dir false --app --tailwind --import-alias "@/*"
cd buy-vs-rent

# 2. Install extras
pnpm add zod react-hook-form recharts lucide-react

# 3. Add Inter font in app/layout.tsx
# 4. Implement calc logic in lib/calc.ts
# 5. Build UI components and wire form -> results

# 6. Dev
pnpm dev

Cursor "One-Shot" Prompt Tip

Paste the contents of this README into Cursor and then say:

"Generate the full Next.js project according to the README. Create all files, implement the calculator logic in lib/calc.ts, and build a responsive UI with Tailwind. Use functional React components, TypeScript, and the App Router."

8. Data Model

export interface CoreInputs {
  purchasePrice: number;
  downPaymentPct: number; // 0.2 = 20%
  mortgageRatePct: number; // annual
  mortgageTermYears: number;
  monthlyRent: number;
  altReturnPct: number;
  propertyTaxPct: number;
  homeAppreciationPct: number;
  maintenancePct?: number;
  insuranceHOAAnnual?: number;
  rentInflationPct?: number;
  generalInflationPct?: number;
  sellingCostPct?: number;
  closingCostBuyPct?: number;
  marginalTaxRatePct?: number;
  horizonYears: number;
  useTaxShield?: boolean;
}

9. Roadmap / Nice-to-Haves

Sensitivity analysis sliders (±1% on appreciation, rates, etc.)

CSV export of cash flows

Shareable URL query params for inputs

Dark mode

PWA/offline support

i18n (currency/locale formatting)

10. License

MIT (or your choice). Add LICENSE file accordingly.

11. Attribution & Disclaimer

This calculator provides estimates only and is not financial advice. Always consult a professional for tax/financial decisions.

