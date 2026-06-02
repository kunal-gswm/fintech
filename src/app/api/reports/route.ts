import { NextResponse } from "next/server";
import { readData } from "@/lib/db";

const REPORTS_FILE = "reports.json";

export async function GET() {
  try {
    const reports = await readData(REPORTS_FILE);
    return NextResponse.json(reports);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  }
}


