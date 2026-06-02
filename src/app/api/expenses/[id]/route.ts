import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { expenseSchema } from "@/lib/validations";
import type { Expense } from "@/types";

const EXPENSES_FILE = "expenses.json";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = expenseSchema.parse(body);
    
    const expenses = await readData<Expense[]>(EXPENSES_FILE);
    const index = expenses.findIndex((e) => e.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    
    const updatedExpense = {
      ...expenses[index],
      ...validatedData,
    } as Expense;
    
    expenses[index] = updatedExpense;
    await writeData(EXPENSES_FILE, expenses);
    
    return NextResponse.json(updatedExpense);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const expenses = await readData<Expense[]>(EXPENSES_FILE);
    const filteredExpenses = expenses.filter((e) => e.id !== id);
    
    if (expenses.length === filteredExpenses.length) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }
    
    await writeData(EXPENSES_FILE, filteredExpenses);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
