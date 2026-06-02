import type { Expense } from "@/types";

export function generateExpenseAnalytics(expenses: Expense[]) {
  let totalSpending = 0;
  const categorySpending: Record<string, number> = {};

  expenses.forEach((expense) => {
    totalSpending += expense.amount;
    if (categorySpending[expense.category]) {
      categorySpending[expense.category] += expense.amount;
    } else {
      categorySpending[expense.category] = expense.amount;
    }
  });

  const categories = Object.keys(categorySpending).map((name) => ({
    name,
    value: categorySpending[name],
  }));

  categories.sort((a, b) => b.value - a.value);

  const largestCategory = categories.length > 0 ? categories[0] : null;

  return {
    totalSpending,
    categories,
    largestCategory,
  };
}
