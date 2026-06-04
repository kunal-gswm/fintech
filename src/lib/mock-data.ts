import type { Expense } from "@/types";

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateStudentMockData(): Expense[] {
  const expenses: Expense[] = [];
  const now = new Date();
  
  for (let i = 5; i >= 0; i--) {
    const year = now.getFullYear();
    const month = now.getMonth() - i;
    
    // Rent
    expenses.push({
      id: `rent-${year}-${month}`,
      title: "Flat Rent",
      amount: 9000,
      category: "Housing",
      date: new Date(year, month, 2).toISOString(),
    });
    
    // Electricity
    expenses.push({
      id: `elec-${year}-${month}`,
      title: "Electricity Bill",
      amount: randomInt(1000, 2000),
      category: "Utilities",
      date: new Date(year, month, 5).toISOString(),
    });

    // Food (spread over a few transactions)
    const foodTotal = randomInt(2000, 3000);
    expenses.push({
      id: `food1-${year}-${month}`,
      title: "Groceries",
      amount: Math.floor(foodTotal * 0.6),
      category: "Food",
      date: new Date(year, month, 10).toISOString(),
    });
    expenses.push({
      id: `food2-${year}-${month}`,
      title: "Eating Out",
      amount: Math.floor(foodTotal * 0.4),
      category: "Food",
      date: new Date(year, month, 20).toISOString(),
    });

    // Travel
    expenses.push({
      id: `travel-${year}-${month}`,
      title: "Metro / Bus",
      amount: 1000,
      category: "Transportation",
      date: new Date(year, month, 4).toISOString(),
    });

    // Miscellaneous
    const miscTotal = randomInt(1500, 2500);
    expenses.push({
      id: `misc-${year}-${month}`,
      title: "Stationery & Misc",
      amount: miscTotal,
      category: "Shopping",
      date: new Date(year, month, 15).toISOString(),
    });
  }
  
  return expenses.reverse(); // newest first
}

export const STUDENT_PROFILE = {
  name: "College Student",
  email: "student@college.edu",
  monthlyIncome: 20000,
  currency: "INR"
};
