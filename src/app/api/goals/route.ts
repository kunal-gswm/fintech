import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { goalSchema } from "@/lib/validations";
import type { Goal } from "@/types";

const GOALS_FILE = "goals.json";

export async function GET() {
  try {
    const goals = await readData<Goal[]>(GOALS_FILE);
    return NextResponse.json(goals);
  } catch (error) {
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
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}
