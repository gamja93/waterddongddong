"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

type WatchlistItem = {
  id: number;
  symbol: string;
  name: string | null;
  createdAt: string;
};

type Quote = {
  symbol: string;
  price: number;
  changePercent: number;
};

type QuoteErrorType = "network" | "quota_exceeded" | "symbol_not_found" | "provider_config" | "unknown";

type QuoteError = {
  type: QuoteErrorType;
  message: string;
};

function quoteErrorLabel(type: QuoteErrorType) {
  switch (type) {
    case "quota_exceeded":
      return "쿼터초과";
    case "network":
      return "네트워크";
    case "symbol_not_found":
      return "심볼없음";
    case "provider_config":
      return "설정오류";
    case "unknown":
    default:
      return "오류";
  }
}

export function WatchlistPanel() {
  const [symbol, setSymbol] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [quotes, setQuotes] = useState<Record<string, Quote>>({});
  const [quoteErrors, setQuoteErrors] = useState<Record<string, QuoteError>>({});
  const [error, setError] = useState<string | null>(null);

  async function loadWatchlist() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/watchlist", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "watchlist 조회 실패");
      setItems(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadWatchlist();
  }, []);

  useEffect(() => {
    async function loadQuotes() {
      const nextQuotes: Record<string, Quote> = {};
      const nextErrors: Record<string, QuoteError> = {};
      await Promise.all(
        items.map(async (item) => {
          const res = await fetch(`/api/market/quote/${item.symbol}`, { cache: "no-store" });
          const data = await res.json();
          if (!res.ok) {
            nextErrors[item.symbol] = {
              type: (data.error?.type ?? "unknown") as QuoteErrorType,
              message: data.error?.message ?? "시세 조회 실패"
            };
            return;
          }
          nextQuotes[item.symbol] = {
            symbol: data.quote.symbol,
            price: data.quote.price,
            changePercent: data.quote.changePercent
          };
        })
      );
      setQuotes(nextQuotes);
      setQuoteErrors(nextErrors);
    }

    if (items.length > 0) {
      void loadQuotes();
    } else {
      setQuotes({});
      setQuoteErrors({});
    }
  }, [items]);

  const sortedItems = useMemo(
    () => [...items].sort((a, b) => a.symbol.localeCompare(b.symbol)),
    [items]
  );

  async function onAdd(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch("/api/watchlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "추가 실패");
      setSymbol("");
      setName("");
      await loadWatchlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  }

  async function onDelete(id: number) {
    setError(null);
    try {
      const res = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "삭제 실패");
      }
      await loadWatchlist();
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다.");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={onAdd} className="grid gap-3 md:grid-cols-4">
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            placeholder="AAPL"
            required
            maxLength={10}
          />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Apple Inc. (optional)"
            maxLength={80}
          />
          <Button type="submit">추가</Button>
        </form>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {loading ? (
          <p className="text-sm text-muted-foreground">불러오는 중...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>심볼</TableHead>
                <TableHead>이름</TableHead>
                <TableHead>현재가</TableHead>
                <TableHead>등락률</TableHead>
                <TableHead className="text-right">액션</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedItems.map((item) => {
                const quote = quotes[item.symbol];
                const quoteError = quoteErrors[item.symbol];
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">
                      <Link href={`/ticker/${item.symbol}`} className="hover:underline">
                        {item.symbol}
                      </Link>
                    </TableCell>
                    <TableCell>{item.name ?? "-"}</TableCell>
                    <TableCell>
                      {quote ? `$${quote.price.toFixed(2)}` : quoteError ? quoteErrorLabel(quoteError.type) : "-"}
                    </TableCell>
                    <TableCell
                      className={
                        quote
                          ? quote.changePercent >= 0
                            ? "text-emerald-600"
                            : "text-rose-600"
                          : quoteError
                            ? "text-amber-600"
                            : "text-muted-foreground"
                      }
                      title={quoteError?.message}
                    >
                      {quote
                        ? `${quote.changePercent.toFixed(2)}%`
                        : quoteError
                          ? quoteErrorLabel(quoteError.type)
                          : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                      >
                        삭제
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
