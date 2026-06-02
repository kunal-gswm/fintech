import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { expenseSchema } from "@/lib/validations";
import type { Expense } from "@/types";

const EXPENSES_FILE = "expenses.json";

export async function GET() {
  try {
    const expenses = await readData<Expense[]>(EXPENSES_FILE);
    return NextResponse.json(expenses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = expenseSchema.parse(body);
    
    const expenses = await readData<Expense[]>(EXPENSES_FILE);
    
    const newExpense = {
      id: Date.now().toString(),
      ...validatedData,
    } as Expense;
    
    expenses.push(newExpense);
    await writeData(EXPENSES_FILE, expenses);
    
    return NextResponse.json(newExpense, { status: 201 });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
