import { CacheStore } from "@/lib/market-data/cache/cache-store";
import { MarketDataProvider } from "@/lib/market-data/providers/market-data-provider";
import { Candle, IndicatorSnapshot, NewsArticle, Quote } from "@/lib/market-data/types";

type MarketCacheTtl = {
  quoteSec: number;
  historySec: number;
  indicatorsSec: number;
  newsSec: number;
};

type CachedProviderOptions = {
  memoryCache: CacheStore;
  dbCache: CacheStore;
  ttl: MarketCacheTtl;
};

export class CachedMarketDataProvider implements MarketDataProvider {
  private inner: MarketDataProvider;
  private memoryCache: CacheStore;
  private dbCache: CacheStore;
  private ttl: MarketCacheTtl;

  constructor(inner: MarketDataProvider, options: CachedProviderOptions) {
    this.inner = inner;
    this.memoryCache = options.memoryCache;
    this.dbCache = options.dbCache;
    this.ttl = options.ttl;
  }

  private async getOrSet<T>(key: string, ttlSec: number, loader: () => Promise<T>) {
    const memory = await this.memoryCache.get<T>(key);
    if (memory) {
      return memory.value;
    }

    const db = await this.dbCache.get<T>(key);
    if (db) {
      await this.memoryCache.set(key, db);
      return db.value;
    }

    const value = await loader();
    const expiresAt = Date.now() + ttlSec * 1000;
    const record = { value, expiresAt };

    await Promise.all([this.memoryCache.set<T>(key, record), this.dbCache.set<T>(key, record)]);

    return value;
  }

  async getQuote(symbol: string): Promise<Quote> {
    const key = `quote:${symbol.toUpperCase()}`;
    return this.getOrSet(key, this.ttl.quoteSec, () => this.inner.getQuote(symbol));
  }

  async getHistory(symbol: string, days = 30): Promise<Candle[]> {
    const key = `history:${symbol.toUpperCase()}:${days}`;
    return this.getOrSet(key, this.ttl.historySec, () => this.inner.getHistory(symbol, days));
  }

  async getIndicators(symbol: string): Promise<IndicatorSnapshot> {
    const key = `indicators:${symbol.toUpperCase()}`;
    return this.getOrSet(key, this.ttl.indicatorsSec, () => this.inner.getIndicators(symbol));
  }

  async getNews(symbol: string, limit = 5): Promise<NewsArticle[]> {
    const key = `news:${symbol.toUpperCase()}:${limit}`;
    return this.getOrSet(key, this.ttl.newsSec, () => this.inner.getNews(symbol, limit));
  }
}
