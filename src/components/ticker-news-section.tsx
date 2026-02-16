"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type NewsArticle = {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publishedAt: string;
  url: string;
};

type ApiError = {
  type: "network" | "quota_exceeded" | "symbol_not_found" | "provider_config" | "unknown";
  message: string;
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

export function TickerNewsSection({ symbol }: { symbol: string }) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NewsArticle[]>([]);
  const [error, setError] = useState<ApiError | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadNews() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/market/news/${symbol}?limit=10`, {
          cache: "no-store"
        });
        const data = await response.json();

        if (!response.ok) {
          if (!mounted) return;
          setError({
            type: (data.error?.type ?? "unknown") as ApiError["type"],
            message: data.error?.message ?? "뉴스를 불러오지 못했습니다."
          });
          setItems([]);
          return;
        }

        if (!mounted) return;
        setItems(Array.isArray(data.items) ? data.items : []);
      } catch {
        if (!mounted) return;
        setError({
          type: "network",
          message: "네트워크 오류로 뉴스를 불러오지 못했습니다."
        });
        setItems([]);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadNews();

    return () => {
      mounted = false;
    };
  }, [symbol]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest News</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="animate-pulse rounded-md border p-4">
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="mt-2 h-3 w-full rounded bg-muted" />
                <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <p className="font-medium">뉴스를 불러오지 못했습니다 ({error.type})</p>
            <p className="mt-1">{error.message}</p>
          </div>
        ) : null}

        {!loading && !error && items.length === 0 ? (
          <div className="rounded-md border p-4 text-sm text-muted-foreground">
            표시할 뉴스가 없습니다.
          </div>
        ) : null}

        {!loading && !error && items.length > 0 ? (
          <div className="space-y-3">
            {items.map((article) => (
              <article key={article.id} className="rounded-md border p-4">
                <h3 className="text-base font-semibold leading-snug">{article.headline}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{article.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatDate(article.publishedAt)}</span>
                  <span>{article.source}</span>
                  <Link
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    원문 보기
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
