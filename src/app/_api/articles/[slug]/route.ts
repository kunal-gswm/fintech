import { NextResponse } from "next/server";
import { readData, writeData } from "@/lib/db";
import { ZodError } from "zod";
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
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }
    
    // Also fetch related articles
    const related = articles.filter(a => article.relatedSlugs?.includes(a.slug || ""));
    
    return NextResponse.json({
      article,
      related
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch article" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const articles = await readData<Article[]>(ARTICLES_FILE);
    
    const index = articles.findIndex((a) => a.slug === slug);
    if (index === -1) {
      return NextResponse.json(
        { error: "Article not found" },
        { status: 404 }
      );
    }

    // Safely update specific fields
    const current = articles[index];
    const updated = {
      ...current,
      ...(typeof body.progress === "number" && { progress: body.progress }),
      ...(typeof body.bookmarked === "boolean" && { bookmarked: body.bookmarked }),
    };

    articles[index] = updated;
    await writeData(ARTICLES_FILE, articles);
    
    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation failed", issues: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update article" },
      { status: 500 }
    );
  }
}
