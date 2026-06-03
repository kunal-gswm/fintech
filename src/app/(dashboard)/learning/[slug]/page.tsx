"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PageTransition } from "@/components/shared/page-transition";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  ArrowLeft,
  BookOpen,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  AlertTriangle,
  Info,
  TrendingUp,
} from "lucide-react";
import { getArticle, updateArticle } from "@/services/articles.service";
import type { Article } from "@/types";
import { CATEGORY_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const difficultyColors = {
  Beginner: "text-emerald-600 bg-emerald-500/10",
  Intermediate: "text-amber-600 bg-amber-500/10",
  Advanced: "text-rose-600 bg-rose-500/10",
};

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);
  
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getArticle(slug)
      .then((data) => {
        setArticle(data.article);
        setRelated(data.related || []);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [slug]);

  if (isLoading) {
    return (
      <div className="space-y-8 p-4 max-w-5xl mx-auto">
        <div className="h-12 w-3/4 animate-pulse bg-muted rounded-md" />
        <div className="h-6 w-1/4 animate-pulse bg-muted rounded-md" />
        <div className="h-[400px] w-full animate-pulse bg-muted rounded-md" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Article not found</h2>
        <p className="text-muted-foreground mb-6">The article you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Button onClick={() => router.push("/learning")}>Back to Learning Hub</Button>
      </div>
    );
  }

  const handleToggleBookmark = async () => {
    const newStatus = !article.bookmarked;
    setArticle({ ...article, bookmarked: newStatus });
    await updateArticle(slug, { bookmarked: newStatus });
  };

  const handleMarkAsRead = async () => {
    setArticle({ ...article, progress: 100 });
    await updateArticle(slug, { progress: 100 });
  };

  // Simple Table of Contents extractor
  const headings = article.content?.match(/^## (.*$)/gim)?.map(h => h.replace("## ", "")) || [];

  return (
    <PageTransition>
      <div className="max-w-5xl mx-auto space-y-8 pb-12">
        {/* Navigation */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 -ml-3 text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/learning")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Learning Hub
        </Button>

        {/* Hero Section */}
        <div className="space-y-6 pb-8 border-b">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              variant="secondary"
              className={cn(
                "px-3 py-1 font-medium border-transparent",
                CATEGORY_COLORS[article.category] || "bg-slate-500/10 text-slate-700 dark:text-slate-300"
              )}
            >
              {article.category}
            </Badge>
            {article.difficulty && (
              <Badge variant="outline" className={cn("px-3 py-1 font-medium border-transparent", difficultyColors[article.difficulty] || "")}>
                <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                {article.difficulty}
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {article.title}
          </h1>
          
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            {article.description}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <div className="flex items-center gap-6 text-sm text-muted-foreground font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {article.author.charAt(0)}
                </div>
                <span>{article.author}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </div>
              <div className="hidden sm:block">
                Last updated: {new Date(article.updatedAt || article.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleToggleBookmark} className="gap-2">
                {article.bookmarked ? <BookmarkCheck className="w-4 h-4 text-primary" /> : <Bookmark className="w-4 h-4" />}
                {article.bookmarked ? "Saved" : "Save"}
              </Button>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar + Main Content */}
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Main Content */}
          <article className="flex-1 min-w-0">
            <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-h2:text-2xl prose-h2:mt-10 prose-h2:border-b prose-h2:pb-2 prose-a:text-primary hover:prose-a:text-primary/80 prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:font-normal prose-blockquote:not-italic">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  // Custom blockquote rendering to handle GitHub alerts (Risk Warning, Note, Tip)
                  blockquote({ children, ...props }) {
                    const text = String(children);
                    // Match GitHub style alerts
                    if (text.includes("[!WARNING]") || text.includes("[!CAUTION]")) {
                      return (
                        <div className="my-6 border-l-4 border-rose-500 bg-rose-50 dark:bg-rose-950/20 p-4 rounded-r-lg">
                          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold mb-2">
                            <AlertTriangle className="w-5 h-5" />
                            Warning
                          </div>
                          <div className="text-rose-900 dark:text-rose-200">
                            {children}
                          </div>
                        </div>
                      );
                    }
                    if (text.includes("[!TIP]") || text.includes("[!IMPORTANT]")) {
                      return (
                        <div className="my-6 border-l-4 border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-r-lg">
                          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold mb-2">
                            <CheckCircle2 className="w-5 h-5" />
                            Key Takeaway
                          </div>
                          <div className="text-emerald-900 dark:text-emerald-200">
                            {children}
                          </div>
                        </div>
                      );
                    }
                    if (text.includes("[!NOTE]")) {
                      return (
                        <div className="my-6 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-950/20 p-4 rounded-r-lg">
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 font-bold mb-2">
                            <Info className="w-5 h-5" />
                            Note
                          </div>
                          <div className="text-blue-900 dark:text-blue-200">
                            {children}
                          </div>
                        </div>
                      );
                    }
                    return <blockquote {...props}>{children}</blockquote>;
                  }
                }}
              >
                {article.content || ""}
              </ReactMarkdown>
            </div>

            {/* End of article actions */}
            <div className="mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 bg-muted/30 p-6 rounded-xl">
              <div>
                <h3 className="font-semibold text-lg">Finished reading?</h3>
                <p className="text-sm text-muted-foreground mt-1">Mark this article as completed to track your progress.</p>
              </div>
              <Button 
                onClick={handleMarkAsRead} 
                className="w-full sm:w-auto gap-2"
                disabled={article.progress === 100}
                variant={article.progress === 100 ? "secondary" : "default"}
              >
                <CheckCircle2 className="w-4 h-4" />
                {article.progress === 100 ? "Completed" : "Mark as Read"}
              </Button>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8 sticky top-6">
            
            {/* Table of Contents */}
            {headings.length > 0 && (
              <Card className="p-5 shadow-sm border-border/60">
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-4">
                  In this article
                </h3>
                <ul className="space-y-3 text-sm">
                  {headings.map((heading, i) => (
                    <li key={i}>
                      <a href="#" className="text-foreground/80 hover:text-primary transition-colors line-clamp-2 leading-tight">
                        {heading}
                      </a>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {/* Related Articles */}
            {related.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  Continue Learning
                </h3>
                <div className="space-y-3">
                  {related.map(rel => (
                    <Link key={rel.id} href={`/learning/${rel.slug}`} className="block">
                      <Card className="p-4 hover:border-primary/40 transition-colors group">
                        <div className="flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="text-sm font-semibold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                              {rel.title}
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {rel.readTime} min read
                            </p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
          </aside>
        </div>
      </div>
    </PageTransition>
  );
}
