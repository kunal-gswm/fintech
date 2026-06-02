import { z } from "zod";

export const expenseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  amount: z.number().positive("Amount must be positive"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

export const goalSchema = z.object({
  title: z.string().min(1, "Title is required"),
  targetAmount: z.number().positive("Target amount must be positive"),
  currentAmount: z.number().min(0, "Current amount cannot be negative"),
  deadline: z.string().min(1, "Deadline is required"),
  category: z.string().min(1, "Category is required"),
  icon: z.string().default("Target"),
  color: z.string().default("#2563EB"),
  monthlyTarget: z.number().nonnegative(),
});

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  monthlyIncome: z.number().positive("Monthly income must be positive"),
  currency: z.string().default("inr"),
});

export const chatRequestSchema = z.object({
  message: z.string().min(1, "Message is required"),
});
