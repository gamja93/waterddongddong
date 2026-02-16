import { NewsArticle } from "@/lib/market-data/types";

export interface NewsAdapter {
  fetchNews(symbol: string, limit: number): Promise<NewsArticle[]>;
}
