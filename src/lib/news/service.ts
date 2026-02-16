import { ProviderConfigError } from "@/lib/market-data/errors";
import { NewsArticle } from "@/lib/market-data/types";
import { MockNewsAdapter } from "@/lib/news/adapters/mock-news-adapter";
import { NewsAdapter } from "@/lib/news/adapters/news-adapter";
import { RssNewsAdapter } from "@/lib/news/adapters/rss-news-adapter";
import { WebSearchNewsAdapter } from "@/lib/news/adapters/web-search-news-adapter";

const US_MAJOR_SOURCES = [
  "Reuters",
  "Bloomberg",
  "The Wall Street Journal",
  "WSJ",
  "CNBC",
  "The New York Times",
  "AP News",
  "MarketWatch",
  "Barron's",
  "Forbes",
  "한국경제",
  "서울 파이낸스",
  "서울파이낸스",
  "서울경제",
  "디일렉"
];

let adapterSingleton: NewsAdapter | null = null;

function getNewsAdapter(): NewsAdapter {
  if (adapterSingleton) {
    return adapterSingleton;
  }

  const mode = (process.env.NEWS_ADAPTER ?? "mock").toLowerCase();
  switch (mode) {
    case "rss":
      adapterSingleton = new RssNewsAdapter();
      break;
    case "websearch":
    case "web_search":
      adapterSingleton = new WebSearchNewsAdapter();
      break;
    case "mock":
      adapterSingleton = new MockNewsAdapter();
      break;
    default:
      throw new ProviderConfigError(`알 수 없는 NEWS_ADAPTER: ${mode}`);
  }

  return adapterSingleton;
}

function normalizeTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function canonicalizeUrl(rawUrl: string) {
  try {
    const parsed = new URL(rawUrl);
    parsed.hash = "";

    for (const key of Array.from(parsed.searchParams.keys())) {
      if (key.toLowerCase().startsWith("utm_")) {
        parsed.searchParams.delete(key);
      }
    }

    const normalizedPath = parsed.pathname.endsWith("/")
      ? parsed.pathname.slice(0, -1)
      : parsed.pathname;

    return `${parsed.origin}${normalizedPath}${parsed.search ? `?${parsed.searchParams.toString()}` : ""}`;
  } catch {
    return rawUrl.trim();
  }
}

function titleSimilarity(a: string, b: string) {
  const aTokens = new Set(normalizeTitle(a).split(" ").filter(Boolean));
  const bTokens = new Set(normalizeTitle(b).split(" ").filter(Boolean));

  if (aTokens.size === 0 || bTokens.size === 0) {
    return 0;
  }

  let intersection = 0;
  for (const token of aTokens) {
    if (bTokens.has(token)) {
      intersection += 1;
    }
  }

  const denominator = Math.min(aTokens.size, bTokens.size);
  return intersection / denominator;
}

function dedupeNews(items: NewsArticle[]) {
  const seenUrls = new Set<string>();
  const kept: NewsArticle[] = [];

  const sortedByRecency = [...items].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  for (const item of sortedByRecency) {
    const canonicalUrl = canonicalizeUrl(item.url);
    if (seenUrls.has(canonicalUrl)) {
      continue;
    }

    const isNearDuplicateTitle = kept.some(
      (existing) => titleSimilarity(existing.headline, item.headline) >= 0.85
    );
    if (isNearDuplicateTitle) {
      continue;
    }

    seenUrls.add(canonicalUrl);
    kept.push({ ...item, url: canonicalUrl });
  }

  return kept;
}

function sourcePriority(source: string) {
  const index = US_MAJOR_SOURCES.findIndex(
    (major) => major.toLowerCase() === source.toLowerCase()
  );
  return index === -1 ? 999 : index;
}

function sortNews(items: NewsArticle[]) {
  return [...items].sort((a, b) => {
    const sourceDelta = sourcePriority(a.source) - sourcePriority(b.source);
    if (sourceDelta !== 0) {
      return sourceDelta;
    }

    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}

export async function getTickerNews(symbol: string, limit = 10) {
  const normalizedLimit = Math.min(Math.max(limit, 1), 20);
  const raw = await getNewsAdapter().fetchNews(symbol, Math.max(normalizedLimit, 15));
  const deduped = dedupeNews(raw);
  const sorted = sortNews(deduped);
  return sorted.slice(0, normalizedLimit);
}
