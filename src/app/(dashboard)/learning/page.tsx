"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  User,
} from "lucide-react";
import { mockArticles } from "@/lib/mock-data";
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import type { Article } from "@/types";
import { cn } from "@/lib/utils";

const categoryColors: Record<string, string> = {
  Stocks: "bg-blue-500/10 text-blue-700",
  ETFs: "bg-emerald-500/10 text-emerald-700",
  "Mutual Funds": "bg-violet-500/10 text-violet-700",
  SIP: "bg-amber-500/10 text-amber-700",
  Banking: "bg-cyan-500/10 text-cyan-700",
  Taxes: "bg-pink-500/10 text-pink-700",
  Budgeting: "bg-orange-500/10 text-orange-700",
};

export default function LearningPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [articles, setArticles] = useState(mockArticles);

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || a.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (id: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, bookmarked: !a.bookmarked } : a
      )
    );
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
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedCategory === "All" ? "default" : "outline"}
              className="h-8 rounded-full text-xs"
              onClick={() => setSelectedCategory("All")}
            >
              All
            </Button>
            {ARTICLE_CATEGORIES.map((cat) => (
              <Button
                key={cat}
                size="sm"
                variant={selectedCategory === cat ? "default" : "outline"}
                className="h-8 rounded-full text-xs"
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
              <Card className="group flex h-full flex-col overflow-hidden transition-all duration-300 hover:shadow-md">
                {/* Article header bar */}
                <div className="flex items-center justify-between border-b px-5 py-3">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "text-xs font-normal",
                      categoryColors[article.category]
                    )}
                  >
                    {article.category}
                  </Badge>
                  <button
                    onClick={() => toggleBookmark(article.id)}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {article.bookmarked ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-sm font-semibold leading-snug group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground line-clamp-3">
                    {article.description}
                  </p>

                  {/* Reading progress */}
                  {article.progress > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {article.progress === 100
                            ? "Completed"
                            : `${article.progress}% read`}
                        </span>
                        <BookOpen className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <Progress
                        value={article.progress}
                        className="mt-1.5 h-1.5"
                      />
                    </div>
                  )}

                  {/* Meta */}
                  <div className="mt-4 flex items-center justify-between border-t pt-3">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      {article.author}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {article.readTime} min read
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
            <BookOpen className="h-8 w-8 text-muted-foreground" />
            <h3 className="mt-3 text-sm font-medium">No articles found</h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Try adjusting your search or filter
            </p>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
