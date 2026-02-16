import { getMarketDataProvider } from "@/lib/market-data/provider";
import { getTickerNews } from "@/lib/news/service";

export async function getQuote(symbol: string) {
  return getMarketDataProvider().getQuote(symbol);
}

export async function getHistory(symbol: string, days?: number) {
  return getMarketDataProvider().getHistory(symbol, days);
}

export async function getIndicators(symbol: string) {
  return getMarketDataProvider().getIndicators(symbol);
}

export async function getNews(symbol: string, limit?: number) {
  return getTickerNews(symbol, limit);
}
