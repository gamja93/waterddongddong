import { SymbolNotFoundError } from "@/lib/market-data/errors";
import { NewsArticle } from "@/lib/market-data/types";
import { NewsAdapter } from "@/lib/news/adapters/news-adapter";

const sources = [
  "Reuters",
  "Bloomberg",
  "CNBC",
  "MarketWatch",
  "AP News",
  "TechCrunch",
  "Seeking Alpha"
];

function normalizeSymbol(symbolRaw: string) {
  const symbol = symbolRaw.trim().toUpperCase();
  if (!symbol || !/^[A-Z.]{1,10}$/.test(symbol)) {
    throw new SymbolNotFoundError(symbolRaw);
  }
  return symbol;
}

export class MockNewsAdapter implements NewsAdapter {
  async fetchNews(symbolRaw: string, limit: number): Promise<NewsArticle[]> {
    const symbol = normalizeSymbol(symbolRaw);
    const now = Date.now();

    return Array.from({ length: Math.max(limit, 12) }, (_, index) => {
      const source = sources[index % sources.length];
      const publishedAt = new Date(now - index * 45 * 60 * 1000).toISOString();

      // 중복 제거 로직 검증을 위해 일부 의도적 near-duplicate를 생성.
      const duplicateSuffix = index % 5 === 0 ? "(Update)" : "";
      const headline = `${symbol} earnings outlook beats expectation ${duplicateSuffix}`.trim();

      return {
        id: `${symbol}-mock-${index + 1}`,
        symbol,
        headline,
        summary: `${symbol} 관련 시장 이벤트 요약 #${index + 1}.`,
        source,
        url: `https://example.com/${symbol.toLowerCase()}/story-${Math.floor(index / 2) + 1}`,
        publishedAt,
        sentiment: index % 3 === 0 ? "positive" : index % 3 === 1 ? "neutral" : "negative"
      };
    });
  }
}
