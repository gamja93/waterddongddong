import {
  NetworkError,
  ProviderConfigError,
  QuotaExceededError,
  SymbolNotFoundError
} from "@/lib/market-data/errors";
import { MarketDataProvider } from "@/lib/market-data/providers/market-data-provider";
import { Candle, IndicatorSnapshot, NewsArticle, Quote } from "@/lib/market-data/types";

type AlphaVantageProviderOptions = {
  apiKey?: string;
  baseUrl?: string;
};

const DEFAULT_BASE_URL = "https://www.alphavantage.co/query";

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export class AlphaVantageProvider implements MarketDataProvider {
  private apiKey?: string;
  private baseUrl: string;

  constructor(options: AlphaVantageProviderOptions = {}) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
  }

  private ensureConfig() {
    if (!this.apiKey) {
      throw new ProviderConfigError("ALPHA_VANTAGE_API_KEY가 설정되지 않았습니다.");
    }
  }

  private async request(params: Record<string, string>) {
    this.ensureConfig();

    const query = new URLSearchParams({
      ...params,
      apikey: this.apiKey as string
    });

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}?${query.toString()}`, {
        method: "GET",
        cache: "no-store"
      });
    } catch (error) {
      throw new NetworkError("Alpha Vantage 네트워크 요청 실패", error);
    }

    if (!response.ok) {
      throw new NetworkError(`Alpha Vantage HTTP 오류 (${response.status})`);
    }

    const json = (await response.json()) as Record<string, unknown>;

    if (typeof json.Note === "string") {
      throw new QuotaExceededError(json.Note);
    }

    if (typeof json["Error Message"] === "string") {
      throw new SymbolNotFoundError(params.symbol ?? "", json["Error Message"]);
    }

    return json;
  }

  async getQuote(symbolRaw: string): Promise<Quote> {
    const symbol = symbolRaw.trim().toUpperCase();
    const payload = await this.request({ function: "GLOBAL_QUOTE", symbol });

    const raw = payload["Global Quote"] as Record<string, string> | undefined;
    if (!raw || Object.keys(raw).length === 0) {
      throw new SymbolNotFoundError(symbol);
    }

    const price = Number(raw["05. price"] ?? 0);
    const change = Number(raw["09. change"] ?? 0);
    const changePercentRaw = String(raw["10. change percent"] ?? "0").replace("%", "");
    const changePercent = Number(changePercentRaw);

    return {
      symbol: raw["01. symbol"] ?? symbol,
      name: raw["01. symbol"] ?? symbol,
      price: round2(Number.isFinite(price) ? price : 0),
      change: round2(Number.isFinite(change) ? change : 0),
      changePercent: round2(Number.isFinite(changePercent) ? changePercent : 0),
      updatedAt: new Date().toISOString()
    };
  }

  async getHistory(symbolRaw: string, days = 30): Promise<Candle[]> {
    const symbol = symbolRaw.trim().toUpperCase();
    const payload = await this.request({
      function: "TIME_SERIES_DAILY",
      outputsize: "compact",
      symbol
    });

    const series = payload["Time Series (Daily)"] as Record<string, Record<string, string>> | undefined;
    if (!series || Object.keys(series).length === 0) {
      throw new SymbolNotFoundError(symbol);
    }

    return Object.entries(series)
      .slice(0, days)
      .map(([date, values]) => ({
        timestamp: new Date(`${date}T00:00:00.000Z`).toISOString(),
        close: round2(Number(values["4. close"] ?? 0))
      }))
      .reverse();
  }

  async getIndicators(symbolRaw: string): Promise<IndicatorSnapshot> {
    const symbol = symbolRaw.trim().toUpperCase();

    // Skeleton: 실사용 시 각각의 TECHNICAL_INDICATORS endpoint 호출로 교체.
    return {
      symbol,
      rsi14: 0,
      sma20: 0,
      sma50: 0,
      updatedAt: new Date().toISOString()
    };
  }

  async getNews(symbolRaw: string, limit = 5): Promise<NewsArticle[]> {
    const symbol = symbolRaw.trim().toUpperCase();

    // Skeleton: NEWS_SENTIMENT endpoint를 연결해 실제 데이터로 교체.
    return Array.from({ length: limit }, (_, index) => ({
      id: `${symbol}-alpha-skeleton-${index + 1}`,
      symbol,
      headline: `AlphaVantageProvider skeleton news item ${index + 1}`,
      summary: "NEWS_SENTIMENT 연동 전 스켈레톤 데이터입니다.",
      source: "Alpha Vantage",
      url: "https://www.alphavantage.co/documentation/",
      publishedAt: new Date().toISOString(),
      sentiment: "neutral"
    }));
  }
}
