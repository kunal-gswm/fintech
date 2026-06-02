import type { NavItem } from "@/types";

export const APP_NAME = "AI Finance";

export const NAV_ITEMS: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { title: "Financial Health", href: "/financial-health", icon: "HeartPulse" },
  { title: "Expense Ledger", href: "/expenses", icon: "Receipt" },
  { title: "Analytics", href: "/analytics", icon: "BarChart3" },
  { title: "Goals", href: "/goals", icon: "Target" },
  { title: "Learning Hub", href: "/learning", icon: "GraduationCap" },
  { title: "AI Assistant", href: "/assistant", icon: "BotMessageSquare" },
  { title: "Reports", href: "/reports", icon: "FileText" },
  { title: "Settings", href: "/settings", icon: "Settings" },
];

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
