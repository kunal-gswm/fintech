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
  slug?: string;
  title: string;
  description: string;
  content?: string;
  category: ArticleCategory;
  readTime: number;
  progress: number;
  bookmarked: boolean;
  author: string;
  date: string;
  updatedAt?: string;
  difficulty?: "Beginner" | "Intermediate" | "Advanced";
  relatedSlugs?: string[];
  tags: string[];
  imageUrl?: string;
}

export type ArticleCategory =
  | "Personal Finance"
  | "Budgeting"
  | "Emergency Funds"
  | "Savings Accounts"
  | "Fixed Deposits (FD)"
  | "Recurring Deposits (RD)"
  | "Stocks"
  | "ETFs"
  | "Mutual Funds"
  | "SIPs"
  | "Index Funds"
  | "Gold Investments"
  | "Bonds"
  | "Credit Cards"
  | "Loans"
  | "Taxes"
  | "Financial Planning";

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
  displayValue?: string;
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
