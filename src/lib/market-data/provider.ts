import { prisma } from "@/lib/prisma";
import { CachedMarketDataProvider } from "@/lib/market-data/cache/cached-provider";
import { PrismaMarketDataCacheStore } from "@/lib/market-data/cache/db-cache";
import { InMemoryCacheStore } from "@/lib/market-data/cache/memory-cache";
import { AlphaVantageProvider } from "@/lib/market-data/providers/alpha-vantage-provider";
import { MarketDataProvider } from "@/lib/market-data/providers/market-data-provider";
import { MockProvider } from "@/lib/market-data/providers/mock-provider";

let provider: MarketDataProvider | null = null;

function toPositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.floor(parsed) : fallback;
}

function createRawProvider(): { name: string; instance: MarketDataProvider } {
  const providerName = (process.env.MARKET_DATA_PROVIDER ?? "mock").toLowerCase();

  switch (providerName) {
    case "alphavantage":
    case "alpha_vantage":
      return {
        name: "alphavantage",
        instance: new AlphaVantageProvider({ apiKey: process.env.ALPHA_VANTAGE_API_KEY })
      };
    case "mock":
    default:
      return {
        name: "mock",
        instance: new MockProvider()
      };
  }
}

export function getMarketDataProvider(): MarketDataProvider {
  if (provider) {
    return provider;
  }

  const raw = createRawProvider();
  const memoryCache = new InMemoryCacheStore();
  const dbCache = new PrismaMarketDataCacheStore(prisma, raw.name);

  provider = new CachedMarketDataProvider(raw.instance, {
    memoryCache,
    dbCache,
    ttl: {
      quoteSec: toPositiveInt(process.env.MARKET_CACHE_QUOTE_TTL_SEC, 30),
      historySec: toPositiveInt(process.env.MARKET_CACHE_HISTORY_TTL_SEC, 300),
      indicatorsSec: toPositiveInt(process.env.MARKET_CACHE_INDICATORS_TTL_SEC, 300),
      newsSec: toPositiveInt(process.env.MARKET_CACHE_NEWS_TTL_SEC, 600)
    }
  });

  return provider;
}
