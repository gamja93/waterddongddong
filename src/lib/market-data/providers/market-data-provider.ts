import { Candle, IndicatorSnapshot, NewsArticle, Quote } from "@/lib/market-data/types";

export interface MarketDataProvider {
  getQuote(symbol: string): Promise<Quote>;
  getHistory(symbol: string, days?: number): Promise<Candle[]>;
  getIndicators(symbol: string): Promise<IndicatorSnapshot>;
  getNews(symbol: string, limit?: number): Promise<NewsArticle[]>;
}
