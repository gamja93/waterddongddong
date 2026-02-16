import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toMarketDataError } from "@/lib/market-data/errors";
import { getQuote } from "@/lib/market-data";

const majorSymbols = ["AAPL", "MSFT", "NVDA", "TSLA"];

export async function DashboardOverview() {
  const quoteResults = await Promise.allSettled(majorSymbols.map((symbol) => getQuote(symbol)));

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {quoteResults.map((result, index) => {
        const symbol = majorSymbols[index];

        if (result.status === "rejected") {
          const error = toMarketDataError(result.reason);
          return (
            <Card key={symbol}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base">{symbol}</CardTitle>
                <Badge className="text-amber-600">{error.type}</Badge>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground">시세 로딩 실패</div>
                <p className="mt-1 text-xs text-muted-foreground">{error.message}</p>
              </CardContent>
            </Card>
          );
        }

        const quote = result.value;
        return (
          <Card key={quote.symbol}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base">{quote.symbol}</CardTitle>
              <Badge className={quote.changePercent >= 0 ? "text-emerald-600" : "text-rose-600"}>
                {quote.changePercent >= 0 ? "+" : ""}
                {quote.changePercent.toFixed(2)}%
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">${quote.price.toFixed(2)}</div>
              <p className="mt-1 text-xs text-muted-foreground">{quote.name}</p>
              <Link
                href={`/ticker/${quote.symbol}`}
                className="mt-3 inline-block text-xs text-primary underline-offset-4 hover:underline"
              >
                상세 보기
              </Link>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
