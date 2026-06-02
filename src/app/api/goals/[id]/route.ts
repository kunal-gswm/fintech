import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { goalSchema } from "@/lib/validations";
import type { Goal } from "@/types";

const GOALS_FILE = "goals.json";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = goalSchema.parse(body);
    
    const goals = await readData<Goal[]>(GOALS_FILE);
    const index = goals.findIndex((g) => g.id === id);
    
    if (index === -1) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    const updatedGoal: Goal = {
      ...goals[index],
      ...validatedData,
    };
    
    goals[index] = updatedGoal;
    await writeData(GOALS_FILE, goals);
    
    return NextResponse.json(updatedGoal);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update goal" },
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
    const goals = await readData<Goal[]>(GOALS_FILE);
    const filteredGoals = goals.filter((g) => g.id !== id);
    
    if (goals.length === filteredGoals.length) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }
    
    await writeData(GOALS_FILE, filteredGoals);
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete goal" },
      { status: 500 }
    );
  }
}
