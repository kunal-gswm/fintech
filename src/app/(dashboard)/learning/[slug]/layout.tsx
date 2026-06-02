import articlesData from "../../../../../data/articles.json";

export async function generateStaticParams() {
  return articlesData.map((article) => ({
    slug: article.slug,
  }));
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
