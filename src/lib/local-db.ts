
import articlesData from "../../data/articles.json";
import chatHistoryData from "../../data/chat-history.json";
import expensesData from "../../data/expenses.json";
import goalsData from "../../data/goals.json";
import profileData from "../../data/profile.json";
import reportsData from "../../data/reports.json";

// The data structure might be inside a default export or just an array.
// I will create a simple wrapper.

const DEFAULT_DATA: Record<string, any> = {
  "articles": articlesData,
  "chat-history": chatHistoryData,
  "expenses": expensesData,
  "goals": goalsData,
  "profile": profileData,
  "reports": reportsData
};

export const getLocalData = <T>(key: string): T => {
  if (typeof window === "undefined") {
    return DEFAULT_DATA[key] as T;
  }
  const data = localStorage.getItem(`aifinance_${key}`);
  if (data) {
    try {
      return JSON.parse(data) as T;
    } catch {
      return DEFAULT_DATA[key] as T;
    }
  }
  
  // Initialize if not present
  localStorage.setItem(`aifinance_${key}`, JSON.stringify(DEFAULT_DATA[key]));
  return DEFAULT_DATA[key] as T;
};

export const setLocalData = <T>(key: string, data: T): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`aifinance_${key}`, JSON.stringify(data));
  }
};
