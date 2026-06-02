import type {
  Expense,
  Goal,
  ChatMessage,
  Article,
  MonthlyData,
  CategoryData,
  ActivityItem,
  HealthMetric,
  Report,
  Notification,
  KPIData,
} from "@/types";

// ─── KPI Data ────────────────────────────────────────────
export const kpiData: KPIData[] = [
  {
    title: "Total Savings",
    value: 284500,
    prefix: "₹",
    trend: 12.5,
    trendLabel: "vs last month",
    icon: "PiggyBank",
  },
  {
    title: "Monthly Expenses",
    value: 42350,
    prefix: "₹",
    trend: -3.2,
    trendLabel: "vs last month",
    icon: "CreditCard",
  },
  {
    title: "Monthly Income",
    value: 85000,
    prefix: "₹",
    trend: 8.0,
    trendLabel: "vs last month",
    icon: "Wallet",
  },
  {
    title: "Savings Rate",
    value: 50.2,
    suffix: "%",
    trend: 5.1,
    trendLabel: "vs last month",
    icon: "TrendingUp",
  },
  {
    title: "Health Score",
    value: 78,
    suffix: "/100",
    trend: 3.0,
    trendLabel: "vs last month",
    icon: "HeartPulse",
  },
];

// ─── Monthly Data ────────────────────────────────────────
export const monthlyData: MonthlyData[] = [
  { month: "Jan", income: 75000, expenses: 38000, savings: 37000 },
  { month: "Feb", income: 78000, expenses: 42000, savings: 36000 },
  { month: "Mar", income: 80000, expenses: 35000, savings: 45000 },
  { month: "Apr", income: 82000, expenses: 40000, savings: 42000 },
  { month: "May", income: 79000, expenses: 44000, savings: 35000 },
  { month: "Jun", income: 85000, expenses: 41000, savings: 44000 },
  { month: "Jul", income: 83000, expenses: 39000, savings: 44000 },
  { month: "Aug", income: 86000, expenses: 43000, savings: 43000 },
  { month: "Sep", income: 84000, expenses: 37000, savings: 47000 },
  { month: "Oct", income: 88000, expenses: 42000, savings: 46000 },
  { month: "Nov", income: 85000, expenses: 40000, savings: 45000 },
  { month: "Dec", income: 85000, expenses: 42350, savings: 42650 },
];

// ─── Category Data ───────────────────────────────────────
export const categoryData: CategoryData[] = [
  { name: "Food & Dining", value: 12500, color: "#2563EB" },
  { name: "Transportation", value: 5200, color: "#10B981" },
  { name: "Shopping", value: 8300, color: "#F59E0B" },
  { name: "Entertainment", value: 3200, color: "#8B5CF6" },
  { name: "Bills & Utilities", value: 6800, color: "#EC4899" },
  { name: "Healthcare", value: 2100, color: "#EF4444" },
  { name: "Groceries", value: 4250, color: "#84CC16" },
];

// ─── Expenses ────────────────────────────────────────────
export const mockExpenses: Expense[] = [
  { id: "1", title: "Swiggy Order", category: "Food & Dining", amount: 450, date: "2025-12-28", notes: "Dinner with family" },
  { id: "2", title: "Uber Ride", category: "Transportation", amount: 280, date: "2025-12-27", notes: "Office commute" },
  { id: "3", title: "Amazon Purchase", category: "Shopping", amount: 2999, date: "2025-12-26", notes: "Headphones" },
  { id: "4", title: "Netflix Subscription", category: "Entertainment", amount: 649, date: "2025-12-25" },
  { id: "5", title: "Electricity Bill", category: "Bills & Utilities", amount: 2400, date: "2025-12-24", notes: "December bill" },
  { id: "6", title: "Apollo Pharmacy", category: "Healthcare", amount: 850, date: "2025-12-23", notes: "Monthly medicines" },
  { id: "7", title: "Coursera Subscription", category: "Education", amount: 3200, date: "2025-12-22", notes: "ML course" },
  { id: "8", title: "BigBasket", category: "Groceries", amount: 3500, date: "2025-12-21", notes: "Weekly groceries" },
  { id: "9", title: "SIP - HDFC Equity", category: "Investments", amount: 5000, date: "2025-12-20", notes: "Monthly SIP" },
  { id: "10", title: "Zomato Order", category: "Food & Dining", amount: 620, date: "2025-12-19", notes: "Lunch" },
  { id: "11", title: "Petrol", category: "Transportation", amount: 1500, date: "2025-12-18", notes: "Full tank" },
  { id: "12", title: "Myntra", category: "Shopping", amount: 1899, date: "2025-12-17", notes: "Winter jacket" },
  { id: "13", title: "Movie Tickets", category: "Entertainment", amount: 700, date: "2025-12-16", notes: "Weekend movie" },
  { id: "14", title: "Internet Bill", category: "Bills & Utilities", amount: 999, date: "2025-12-15", notes: "Airtel fiber" },
  { id: "15", title: "Gym Membership", category: "Healthcare", amount: 1500, date: "2025-12-14", notes: "Quarterly payment" },
  { id: "16", title: "DMart", category: "Groceries", amount: 2800, date: "2025-12-13", notes: "Monthly stock up" },
  { id: "17", title: "Ola Ride", category: "Transportation", amount: 350, date: "2025-12-12" },
  { id: "18", title: "Restaurant Dinner", category: "Food & Dining", amount: 2200, date: "2025-12-11", notes: "Anniversary dinner" },
  { id: "19", title: "Flipkart", category: "Shopping", amount: 4500, date: "2025-12-10", notes: "Keyboard" },
  { id: "20", title: "PPF Contribution", category: "Investments", amount: 10000, date: "2025-12-09", notes: "Monthly PPF" },
];

// ─── Goals ───────────────────────────────────────────────
export const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Emergency Fund",
    targetAmount: 300000,
    currentAmount: 185000,
    deadline: "2026-06-30",
    category: "Safety Net",
    icon: "Shield",
    color: "#10B981",
    monthlyTarget: 19167,
  },
  {
    id: "2",
    title: "Vacation to Japan",
    targetAmount: 250000,
    currentAmount: 92000,
    deadline: "2026-12-31",
    category: "Travel",
    icon: "Plane",
    color: "#2563EB",
    monthlyTarget: 13167,
  },
  {
    id: "3",
    title: "New Laptop",
    targetAmount: 120000,
    currentAmount: 78000,
    deadline: "2026-03-31",
    category: "Electronics",
    icon: "Laptop",
    color: "#8B5CF6",
    monthlyTarget: 14000,
  },
  {
    id: "4",
    title: "Down Payment - Car",
    targetAmount: 500000,
    currentAmount: 210000,
    deadline: "2027-06-30",
    category: "Automobile",
    icon: "Car",
    color: "#F59E0B",
    monthlyTarget: 16111,
  },
  {
    id: "5",
    title: "Wedding Fund",
    targetAmount: 1000000,
    currentAmount: 340000,
    deadline: "2028-01-31",
    category: "Life Event",
    icon: "Heart",
    color: "#EC4899",
    monthlyTarget: 26400,
  },
];

// ─── Chat Messages ───────────────────────────────────────
export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI financial advisor. I can help you with budgeting, investment guidance, tax planning, and more. How can I assist you today?",
    timestamp: "2025-12-28T10:00:00Z",
  },
  {
    id: "2",
    role: "user",
    content: "Can you analyze my spending this month and suggest where I can cut back?",
    timestamp: "2025-12-28T10:01:00Z",
  },
  {
    id: "3",
    role: "assistant",
    content: "Based on your December spending patterns, here are my observations:\n\n**Top Spending Areas:**\n1. **Investments (₹15,000)** - This is actually great! Keep this going.\n2. **Food & Dining (₹3,270)** - This is 7.7% of your expenses. Consider meal prepping to reduce this by 20-30%.\n3. **Shopping (₹9,398)** - This is the highest discretionary spend. Consider implementing a 48-hour rule before purchases.\n\n**Recommendations:**\n- Set a monthly shopping budget of ₹5,000\n- Use cashback credit cards for recurring bills\n- Consider switching to annual plans for subscriptions to save 15-20%\n\nWould you like me to create a detailed budget plan for January?",
    timestamp: "2025-12-28T10:02:00Z",
  },
];

// ─── Articles ────────────────────────────────────────────
export const mockArticles: Article[] = [
  {
    id: "1",
    title: "Understanding Index Funds: A Beginner's Guide",
    description: "Learn how index funds work, their benefits over actively managed funds, and how to start investing in them with as little as ₹500.",
    category: "Mutual Funds",
    readTime: 8,
    progress: 65,
    bookmarked: true,
    author: "Priya Sharma",
    date: "2025-12-20",
    tags: ["Index Funds", "Passive Investing", "Beginner"],
  },
  {
    id: "2",
    title: "SIP vs Lump Sum: Which Strategy Wins?",
    description: "A data-driven comparison of SIP and lump sum investing strategies over different market cycles in India.",
    category: "SIP",
    readTime: 12,
    progress: 0,
    bookmarked: false,
    author: "Rahul Mehta",
    date: "2025-12-18",
    tags: ["SIP", "Investment Strategy", "Comparison"],
  },
  {
    id: "3",
    title: "Tax Saving Under Section 80C: Complete Guide",
    description: "Everything you need to know about saving taxes under Section 80C — from ELSS to PPF, NPS, and more.",
    category: "Taxes",
    readTime: 15,
    progress: 30,
    bookmarked: true,
    author: "Anika Gupta",
    date: "2025-12-15",
    tags: ["Tax Saving", "80C", "ELSS", "PPF"],
  },
  {
    id: "4",
    title: "The 50/30/20 Budget Rule Explained",
    description: "A practical guide to implementing the popular 50/30/20 budgeting framework for Indian salaries.",
    category: "Budgeting",
    readTime: 6,
    progress: 100,
    bookmarked: false,
    author: "Vikram Singh",
    date: "2025-12-12",
    tags: ["Budgeting", "Personal Finance", "Beginner"],
  },
  {
    id: "5",
    title: "How to Read Stock Market Charts",
    description: "Master candlestick patterns, moving averages, and volume indicators to make informed trading decisions.",
    category: "Stocks",
    readTime: 20,
    progress: 0,
    bookmarked: false,
    author: "Deepak Joshi",
    date: "2025-12-10",
    tags: ["Stocks", "Technical Analysis", "Charts"],
  },
  {
    id: "6",
    title: "ETFs in India: Everything You Need to Know",
    description: "A comprehensive guide to Exchange Traded Funds available in India — from Nifty ETFs to Gold ETFs.",
    category: "ETFs",
    readTime: 10,
    progress: 45,
    bookmarked: true,
    author: "Sneha Patel",
    date: "2025-12-08",
    tags: ["ETFs", "Nifty", "Gold ETF"],
  },
  {
    id: "7",
    title: "Fixed Deposits vs Debt Funds: A Comparison",
    description: "Compare the risk, returns, and tax implications of FDs and debt mutual funds to make the right choice.",
    category: "Banking",
    readTime: 9,
    progress: 0,
    bookmarked: false,
    author: "Karthik Rajan",
    date: "2025-12-05",
    tags: ["Fixed Deposits", "Debt Funds", "Banking"],
  },
  {
    id: "8",
    title: "Building a Stock Portfolio: Sector Allocation",
    description: "Learn how to diversify across sectors and build a resilient equity portfolio for long-term wealth creation.",
    category: "Stocks",
    readTime: 14,
    progress: 0,
    bookmarked: false,
    author: "Arjun Nair",
    date: "2025-12-03",
    tags: ["Portfolio", "Diversification", "Stocks"],
  },
];

// ─── Activity Feed ───────────────────────────────────────
export const mockActivities: ActivityItem[] = [
  { id: "1", type: "expense", title: "Swiggy Order", description: "Food & Dining", timestamp: "2 hours ago", amount: 450, icon: "CreditCard" },
  { id: "2", type: "goal", title: "Emergency Fund Updated", description: "Added ₹5,000 to your emergency fund", timestamp: "5 hours ago", icon: "Target" },
  { id: "3", type: "ai_recommendation", title: "AI Insight", description: "Your food spending is 15% higher than last month. Consider meal planning.", timestamp: "1 day ago", icon: "Sparkles" },
  { id: "4", type: "expense", title: "Uber Ride", description: "Transportation", timestamp: "1 day ago", amount: 280, icon: "CreditCard" },
  { id: "5", type: "goal", title: "Vacation Fund", description: "You're 37% towards your Japan trip goal", timestamp: "2 days ago", icon: "Target" },
  { id: "6", type: "expense", title: "Amazon Purchase", description: "Shopping", timestamp: "2 days ago", amount: 2999, icon: "CreditCard" },
  { id: "7", type: "ai_recommendation", title: "Monthly Report Ready", description: "Your December financial report is ready for review", timestamp: "3 days ago", icon: "Sparkles" },
];

// ─── Health Metrics ──────────────────────────────────────
export const healthMetrics: HealthMetric[] = [
  { title: "Savings Rate", score: 82, maxScore: 100, status: "excellent", description: "You save 50.2% of your income — well above the recommended 20%.", icon: "PiggyBank" },
  { title: "Emergency Fund", score: 62, maxScore: 100, status: "good", description: "You have 4.4 months of expenses covered. Target is 6 months.", icon: "Shield" },
  { title: "Investment Readiness", score: 75, maxScore: 100, status: "good", description: "Good diversification across SIP, PPF, and equity. Consider adding debt funds.", icon: "TrendingUp" },
  { title: "Risk Level", score: 45, maxScore: 100, status: "fair", description: "Moderate risk profile. Insurance coverage needs review.", icon: "AlertTriangle" },
];

// ─── Reports ─────────────────────────────────────────────
export const mockReports: Report[] = [
  {
    id: "1",
    month: "December",
    year: 2025,
    totalIncome: 85000,
    totalExpenses: 42350,
    totalSavings: 42650,
    savingsRate: 50.2,
    topCategory: "Investments",
    insights: [
      "Your savings rate of 50.2% is excellent — top 5% among users.",
      "Food & dining expenses increased by 15% from November.",
      "Investment contributions are consistent — great discipline!",
      "Consider reviewing your entertainment subscriptions for unused services.",
    ],
  },
  {
    id: "2",
    month: "November",
    year: 2025,
    totalIncome: 85000,
    totalExpenses: 40000,
    totalSavings: 45000,
    savingsRate: 52.9,
    topCategory: "Investments",
    insights: [
      "Best savings month in Q4 — 52.9% savings rate.",
      "Shopping expenses dropped by 30% compared to October.",
      "Utility bills were lower due to mild weather.",
    ],
  },
  {
    id: "3",
    month: "October",
    year: 2025,
    totalIncome: 88000,
    totalExpenses: 42000,
    totalSavings: 46000,
    savingsRate: 52.3,
    topCategory: "Shopping",
    insights: [
      "Festive season spending increased shopping by 45%.",
      "Highest income month due to festival bonus.",
      "Investment SIPs continued without disruption.",
    ],
  },
];

// ─── Notifications ───────────────────────────────────────
export const mockNotifications: Notification[] = [
  { id: "1", title: "Monthly Report Ready", description: "Your December 2025 financial report is available.", time: "2 hours ago", read: false, type: "info" },
  { id: "2", title: "Goal Milestone", description: "Emergency fund has crossed ₹1.8L!", time: "5 hours ago", read: false, type: "success" },
  { id: "3", title: "Budget Alert", description: "Food & dining spending is 80% of monthly limit.", time: "1 day ago", read: true, type: "warning" },
  { id: "4", title: "SIP Executed", description: "₹5,000 SIP in HDFC Equity Fund processed.", time: "2 days ago", read: true, type: "success" },
  { id: "5", title: "New Article", description: "Tax saving strategies for FY 2025-26.", time: "3 days ago", read: true, type: "info" },
];

// ─── Suggested Prompts ───────────────────────────────────
export const suggestedPrompts = [
  "Analyze my spending patterns this month",
  "How can I improve my savings rate?",
  "Compare mutual funds vs fixed deposits",
  "Create a budget plan for next month",
  "What tax saving options do I have?",
  "Should I increase my SIP amount?",
];
