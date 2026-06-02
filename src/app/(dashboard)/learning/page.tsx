"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
} from "lucide-react";
import { getArticles, updateArticle } from "@/services/articles.service";
import { ARTICLE_CATEGORIES, CATEGORY_COLORS } from "@/lib/constants";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";

const difficultyColors = {
  Beginner: "text-emerald-600 bg-emerald-500/10",
  Intermediate: "text-amber-600 bg-amber-500/10",
  Advanced: "text-rose-600 bg-rose-500/10",
};

export default function LearningPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getArticles().then((data) => {
      setArticles(data);
      setIsLoading(false);
    }).catch(console.error);
  }, []);

  if (isLoading) return <div className="flex h-64 items-center justify-center">Loading learning hub...</div>;

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = async (article: Article, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the article
    e.stopPropagation();
    
    const newStatus = !article.bookmarked;
    // Optimistic update
    setArticles((prev) =>
      prev.map((a) =>
        a.id === article.id ? { ...a, bookmarked: newStatus } : a
      )
    );
    
    if (article.slug) {
      await updateArticle(article.slug, { bookmarked: newStatus }).catch(console.error);
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Learning Hub"
          description="Build your financial knowledge with curated articles and guides."
        />

        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles (e.g. ETF, Stocks, SIP)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === "All" ? "default" : "outline"}
              className="h-8 rounded-full text-xs bg-background data-[active=true]:bg-primary"
              data-active={selectedCategory === "All"}
              onClick={() => setSelectedCategory("All")}
            >
              All
            </Button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                className="h-8 rounded-full text-xs bg-background data-[active=true]:bg-primary"
                data-active={selectedCategory === cat}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((article, i) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/learning/${article.slug || ""}`} className="block h-full">
                <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/30">
                  {/* Article header bar */}
                  <div className="flex items-center justify-between border-b px-5 py-3 bg-muted/30">
                    <Badge
                      variant="secondary"
                      className={cn(
                        "text-xs font-normal border-transparent",
                        CATEGORY_COLORS[article.category] || "bg-slate-500/10 text-slate-700 dark:bg-slate-500/20 dark:text-slate-300"
                      )}
                    >
                      {article.category}
                    </Badge>
                    <button
                      onClick={(e) => toggleBookmark(article, e)}
                      className="text-muted-foreground transition-colors hover:text-primary z-10 p-1"
                    >
                      {article.bookmarked ? (
                        <BookmarkCheck className="h-4 w-4 text-primary" />
                      ) : (
                        <Bookmark className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="flex flex-1 flex-col p-5 bg-card">
                    <h3 className="text-base font-semibold leading-snug group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                      {article.description}
                    </p>

                    {/* Reading progress */}
                    {article.progress > 0 && (
                      <div className="mt-5">
                        <div className="flex items-center justify-between text-xs font-medium mb-1.5">
                          <span className={article.progress === 100 ? "text-primary" : "text-muted-foreground"}>
                            {article.progress === 100
                              ? "Completed"
                              : `${article.progress}% read`}
                          </span>
                        </div>
                        <Progress
                          value={article.progress}
                          className="h-1.5"
                        />
                      </div>
                    )}

                    {/* Meta */}
                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                          <Clock className="h-3.5 w-3.5" />
                          {article.readTime} min
                        </div>
                        {article.difficulty && (
                          <div className={cn("flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-md", difficultyColors[article.difficulty] || "")}>
                            <TrendingUp className="h-3 w-3" />
                            {article.difficulty}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center bg-card">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-base font-medium">No articles found</h3>
            <p className="mt-1 text-sm text-muted-foreground max-w-sm">
              We couldn&apos;t find any articles matching your search or filter. Try a different term like &quot;ETF&quot; or &quot;Stocks&quot;.
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
