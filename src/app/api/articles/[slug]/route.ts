import { NextResponse } from "next/server";
import { readData } from "@/lib/db";
import type { Article } from "@/types";

const ARTICLES_FILE = "articles.json";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const articles = await readData<Article[]>(ARTICLES_FILE);
    const article = articles.find((a) => a.slug === slug);
    
    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }
    
    return NextResponse.json(article);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}
