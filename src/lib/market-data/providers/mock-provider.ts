import { SymbolNotFoundError } from "@/lib/market-data/errors";
import { MarketDataProvider } from "@/lib/market-data/providers/market-data-provider";
import { Candle, IndicatorSnapshot, NewsArticle, Quote } from "@/lib/market-data/types";

const knownSymbols: Record<string, string> = {
  AAPL: "Apple Inc.",
  MSFT: "Microsoft Corp.",
  NVDA: "NVIDIA Corp.",
  TSLA: "Tesla Inc.",
  AMZN: "Amazon.com Inc.",
  GOOGL: "Alphabet Inc."
};

function symbolSeed(symbol: string) {
  return symbol
    .toUpperCase()
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function normalizeSymbol(symbolRaw: string) {
  const symbol = symbolRaw.trim().toUpperCase();
  if (!symbol || !/^[A-Z.]{1,10}$/.test(symbol)) {
    throw new SymbolNotFoundError(symbolRaw);
  }
  return symbol;
}

export class MockProvider implements MarketDataProvider {
  async getQuote(symbolRaw: string): Promise<Quote> {
    const symbol = normalizeSymbol(symbolRaw);
    const seed = symbolSeed(symbol);
    const base = 80 + (seed % 350);
    const wave = Math.sin(seed) * 8;
    const price = round2(base + wave);
    const change = round2(Math.cos(seed) * 4);
    const prev = price - change;
    const changePercent = prev === 0 ? 0 : round2((change / prev) * 100);

    return {
      symbol,
      name: knownSymbols[symbol] ?? `${symbol} Holdings`,
      price,
      change,
      changePercent,
      updatedAt: new Date().toISOString()
    };
  }

  async getHistory(symbolRaw: string, days = 30): Promise<Candle[]> {
    const symbol = normalizeSymbol(symbolRaw);
    const seed = symbolSeed(symbol);
    const start = Date.now() - days * 24 * 60 * 60 * 1000;
    const base = 90 + (seed % 240);

    return Array.from({ length: days }, (_, index) => {
      const trend = index * 0.25;
      const swing = Math.sin((seed + index) / 3) * 5;
      const close = round2(base + trend + swing);

      return {
        timestamp: new Date(start + index * 24 * 60 * 60 * 1000).toISOString(),
        close
      };
    });
  }

  async getIndicators(symbolRaw: string): Promise<IndicatorSnapshot> {
    const symbol = normalizeSymbol(symbolRaw);
    const seed = symbolSeed(symbol);

    return {
      symbol,
      rsi14: round2(35 + (seed % 35)),
      sma20: round2(100 + (seed % 120)),
      sma50: round2(95 + (seed % 130)),
      updatedAt: new Date().toISOString()
    };
  }

  async getNews(symbolRaw: string, limit = 5): Promise<NewsArticle[]> {
    const symbol = normalizeSymbol(symbolRaw);
    const now = Date.now();

    return Array.from({ length: limit }, (_, index) => {
      const sentiment = index % 3 === 0 ? "positive" : index % 3 === 1 ? "neutral" : "negative";
      return {
        id: `${symbol}-mock-news-${index + 1}`,
        symbol,
        headline: `${symbol} 관련 모의 뉴스 헤드라인 #${index + 1}`,
        summary: `${symbol} 관련 시장 이슈를 보여주는 mock 뉴스 요약입니다.`,
        source: "MockWire",
        url: `https://example.com/mock-news/${symbol}/${index + 1}`,
        publishedAt: new Date(now - index * 6 * 60 * 60 * 1000).toISOString(),
        sentiment
      };
    });
  }
}
