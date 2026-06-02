import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { profileSchema } from "@/lib/validations";

const PROFILE_FILE = "profile.json";

export async function GET() {
  try {
    const profile = await readData(PROFILE_FILE);
    return NextResponse.json(profile);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = profileSchema.parse(body);
    
    // Read existing profile to preserve id and email if not in update
    const existingProfile = await readData<any>(PROFILE_FILE);
    
    const updatedProfile = {
      ...existingProfile,
      ...validatedData,
    };
    
    await writeData(PROFILE_FILE, updatedProfile);
    
    return NextResponse.json(updatedProfile);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: "Validation failed", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
