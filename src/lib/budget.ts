export type BudgetTier = "Zero-Cost" | "Low" | "Moderate" | "High";

export interface BudgetTierOption {
  value: BudgetTier;
  label: string;
}

/**
 * Returns formatted budget tier options with localized amounts and symbols
 * matching the selected currency.
 */
export function getBudgetTierOptions(currency: string = "USD"): BudgetTierOption[] {
  const code = (currency || "USD").toUpperCase().trim();

  switch (code) {
    case "INR":
      return [
        { value: "Zero-Cost", label: "Zero-Cost Habits (₹0)" },
        { value: "Low", label: "Low Cost (< ₹4,000)" },
        { value: "Moderate", label: "Moderate (< ₹25,000)" },
        { value: "High", label: "Capital Investment (₹25,000+)" },
      ];
    case "EUR":
      return [
        { value: "Zero-Cost", label: "Zero-Cost Habits (€0)" },
        { value: "Low", label: "Low Cost (< €50)" },
        { value: "Moderate", label: "Moderate (< €300)" },
        { value: "High", label: "Capital Investment (€300+)" },
      ];
    case "GBP":
      return [
        { value: "Zero-Cost", label: "Zero-Cost Habits (£0)" },
        { value: "Low", label: "Low Cost (< £40)" },
        { value: "Moderate", label: "Moderate (< £250)" },
        { value: "High", label: "Capital Investment (£250+)" },
      ];
    case "USD":
    default:
      return [
        { value: "Zero-Cost", label: "Zero-Cost Habits ($0)" },
        { value: "Low", label: "Low Cost (< $50)" },
        { value: "Moderate", label: "Moderate (< $300)" },
        { value: "High", label: "Capital Investment ($300+)" },
      ];
  }
}

/**
 * Converts budget tier and currency into a representative numeric upfront budget amount.
 */
export function getUpfrontBudgetAmount(
  budgetTier: BudgetTier,
  currency: string = "USD"
): number {
  if (budgetTier === "Zero-Cost") return 0;
  const code = (currency || "USD").toUpperCase().trim();

  if (code === "INR") {
    if (budgetTier === "Low") return 4000;
    if (budgetTier === "Moderate") return 25000;
    return 100000;
  }
  if (code === "GBP") {
    if (budgetTier === "Low") return 40;
    if (budgetTier === "Moderate") return 250;
    return 1000;
  }
  if (code === "EUR") {
    if (budgetTier === "Low") return 50;
    if (budgetTier === "Moderate") return 300;
    return 1000;
  }
  // USD default
  if (budgetTier === "Low") return 50;
  if (budgetTier === "Moderate") return 250;
  return 1000;
}

/**
 * Derives a BudgetTier from a numeric upfront budget amount and currency.
 */
export function deriveBudgetTier(
  amount: number | null | undefined,
  currency: string = "USD"
): BudgetTier {
  if (amount === null || amount === undefined) return "Moderate";
  const num = Number(amount);
  if (num === 0) return "Zero-Cost";

  const code = (currency || "USD").toUpperCase().trim();
  if (code === "INR") {
    if (num <= 5000) return "Low";
    if (num <= 30000) return "Moderate";
    return "High";
  }
  if (num <= 60) return "Low";
  if (num <= 350) return "Moderate";
  return "High";
}
