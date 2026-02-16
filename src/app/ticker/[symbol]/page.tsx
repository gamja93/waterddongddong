import Link from "next/link";
import { notFound } from "next/navigation";

import { PriceChart } from "@/components/price-chart";
import { TickerNewsSection } from "@/components/ticker-news-section";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toMarketDataError } from "@/lib/market-data/errors";
import { getHistory, getIndicators, getQuote } from "@/lib/market-data";

type TickerPageProps = {
  params: Promise<{ symbol: string }>;
};

export default async function TickerPage({ params }: TickerPageProps) {
  const { symbol: rawSymbol } = await params;
  const symbol = rawSymbol?.trim().toUpperCase();

  if (!symbol) {
    notFound();
  }

  let quote: Awaited<ReturnType<typeof getQuote>>;
  let history: Awaited<ReturnType<typeof getHistory>>;
  let indicators: Awaited<ReturnType<typeof getIndicators>>;

  try {
    [quote, history, indicators] = await Promise.all([
      getQuote(symbol),
      getHistory(symbol, 30),
      getIndicators(symbol)
    ]);
  } catch (error) {
    const marketError = toMarketDataError(error);
    return (
      <div className="space-y-6">
        <Link href="/" className="text-sm text-primary hover:underline">
          ← Dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>데이터를 불러오지 못했습니다.</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">type: {marketError.type}</p>
            <p className="text-sm text-muted-foreground">{marketError.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-primary hover:underline">
        ← Dashboard
      </Link>

      <section className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold tracking-tight">{quote.symbol}</h1>
          <Badge className={quote.changePercent >= 0 ? "text-emerald-600" : "text-rose-600"}>
            {quote.changePercent >= 0 ? "+" : ""}
            {quote.changePercent.toFixed(2)}%
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{quote.name}</p>
        <p className="text-4xl font-semibold">${quote.price.toFixed(2)}</p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>최근 30일 추이 (Mock)</CardTitle>
        </CardHeader>
        <CardContent>
          <PriceChart points={history} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>지표</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm md:grid-cols-3">
          <div className="rounded-md border p-3">RSI(14): {indicators.rsi14.toFixed(2)}</div>
          <div className="rounded-md border p-3">SMA(20): {indicators.sma20.toFixed(2)}</div>
          <div className="rounded-md border p-3">SMA(50): {indicators.sma50.toFixed(2)}</div>
        </CardContent>
      </Card>

      <TickerNewsSection symbol={symbol} />
    </div>
  );
}
