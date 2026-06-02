import { apiClient } from "@/lib/api-client";
import type { Article } from "@/types";

export const getArticles = () => {
  return apiClient<Article[]>("/api/articles");
};

export const getArticle = (slug: string) => {
  return apiClient<{ article: Article; related: Article[] }>(`/api/articles/${slug}`);
};

export const updateArticle = (slug: string, data: Partial<Article>) => {
  return apiClient<Article>(`/api/articles/${slug}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
};
