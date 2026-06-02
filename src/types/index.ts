export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  notes?: string;
}

export type ExpenseCategory =
  | "Food & Dining"
  | "Transportation"
  | "Shopping"
  | "Entertainment"
  | "Bills & Utilities"
  | "Healthcare"
  | "Education"
  | "Travel"
  | "Groceries"
  | "Investments"
  | "Other";

export interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  icon: string;
  color: string;
  monthlyTarget: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  readTime: number;
  progress: number;
  bookmarked: boolean;
  author: string;
  date: string;
  tags: string[];
  imageUrl?: string;
}

export type ArticleCategory =
  | "Stocks"
  | "ETFs"
  | "Mutual Funds"
  | "SIP"
  | "Banking"
  | "Taxes"
  | "Budgeting";

export interface KPIData {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  trendLabel: string;
  icon: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}

export interface CategoryData {
  name: string;
  value: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  type: "expense" | "goal" | "ai_recommendation";
  title: string;
  description: string;
  timestamp: string;
  amount?: number;
  icon: string;
}

export interface HealthMetric {
  title: string;
  score: number;
  maxScore: number;
  status: "excellent" | "good" | "fair" | "poor";
  description: string;
  icon: string;
}

export interface Report {
  id: string;
  month: string;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  totalSavings: number;
  savingsRate: number;
  topCategory: string;
  insights: string[];
}

export interface NavItem {
  title: string;
  href: string;
  icon: string;
  badge?: number;
}

export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: "info" | "warning" | "success";
}
