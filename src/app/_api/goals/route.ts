import { ZodError } from "zod";
import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { goalSchema } from "@/lib/validations";
import { calculateGoal } from "@/lib/engines/goals";
import type { Goal } from "@/types";

const GOALS_FILE = "goals.json";

export async function GET() {
  try {
    const goals = await readData<Goal[]>(GOALS_FILE);
    
    const enrichedGoals = goals.map(goal => {
      // Basic assumption: calculate months between now and deadline
      const deadline = new Date(goal.deadline);
      const now = new Date();
      const targetMonths = Math.max(1, (deadline.getFullYear() - now.getFullYear()) * 12 + (deadline.getMonth() - now.getMonth()));
      
      const calc = calculateGoal(goal.targetAmount, goal.currentAmount, targetMonths);
      return {
        ...goal,
        monthlyRequired: calc.monthlyRequired,
        remainingAmount: calc.remainingAmount,
      };
    });

    return NextResponse.json(enrichedGoals);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch goals" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = goalSchema.parse(body);
    
    const goals = await readData<Goal[]>(GOALS_FILE);
    
    const newGoal: Goal = {
      id: Date.now().toString(),
      ...validatedData,
    };
    
    goals.push(newGoal);
    await writeData(GOALS_FILE, goals);
    
    return NextResponse.json(newGoal, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}



