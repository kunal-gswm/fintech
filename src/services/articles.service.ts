import { apiClient } from "@/lib/api-client";
import type { Article } from "@/types";

export const getArticles = () => {
  return apiClient<Article[]>("/api/articles");
};

export const getArticle = (slug: string) => {
  return apiClient<Article>(`/api/articles/${slug}`);
};
