import { NextResponse } from "next/server";
import { readData } from "@/lib/db";
import type { Article } from "@/types";

const ARTICLES_FILE = "articles.json";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    
    let articles = await readData<Article[]>(ARTICLES_FILE);
    
    if (category && category !== "All") {
      articles = articles.filter((a) => a.category === category);
    }
    
    return NextResponse.json(articles);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}
