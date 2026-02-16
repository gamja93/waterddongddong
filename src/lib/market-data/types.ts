export type Quote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  updatedAt: string;
};

export type Candle = {
  timestamp: string;
  close: number;
};

export type IndicatorSnapshot = {
  symbol: string;
  rsi14: number;
  sma20: number;
  sma50: number;
  updatedAt: string;
};

export type NewsArticle = {
  id: string;
  symbol: string;
  headline: string;
  summary: string;
  source: string;
  url: string;
  publishedAt: string;
  sentiment?: "positive" | "neutral" | "negative";
};
