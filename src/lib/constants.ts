
export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Education",
  "Travel",
  "Groceries",
  "Investments",
  "Other",
] as const;

export const ARTICLE_CATEGORIES = [
  "Stocks",
  "ETFs",
  "Mutual Funds",
  "SIP",
  "Banking",
  "Taxes",
  "Budgeting",
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  "Food & Dining": "#2563EB",
  Transportation: "#10B981",
  Shopping: "#F59E0B",
  Entertainment: "#8B5CF6",
  "Bills & Utilities": "#EC4899",
  Healthcare: "#EF4444",
  Education: "#06B6D4",
  Travel: "#F97316",
  Groceries: "#84CC16",
  Investments: "#6366F1",
  Other: "#64748B",
};
