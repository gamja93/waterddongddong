"use client";

import { useMemo, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyReport } from "@/lib/reports/daily-us-market-close";

type Snapshot = (typeof dailyReport.section_news_archive)[number];
type RegionKey = keyof Snapshot["regions"];
type NewsItem = Snapshot["regions"][RegionKey][number];

const REGION_META: Record<RegionKey, { title: string; subtitle: string }> = {
  us: { title: "미국 뉴스", subtitle: "US media only" },
  korea: { title: "한국 뉴스", subtitle: "Korea media only" },
  china: { title: "중국 뉴스", subtitle: "China media only" },
  taiwan: { title: "대만 뉴스", subtitle: "Taiwan media only" }
};

function rankNews(items: NewsItem[]) {
  return [...items]
    .sort((a, b) => {
      const timeDelta = new Date(b.published_at_et).getTime() - new Date(a.published_at_et).getTime();
      if (timeDelta !== 0) {
        return timeDelta;
      }

      const importanceDelta = b.importance_score - a.importance_score;
      if (importanceDelta !== 0) {
        return importanceDelta;
      }

      return b.views - a.views;
    })
    .slice(0, 3);
}

function shiftIsoDays(iso: string, days: number) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function resolveSnapshot(snapshot: Snapshot, latest: Snapshot) {
  const hasAny =
    snapshot.regions.us.length > 0 ||
    snapshot.regions.korea.length > 0 ||
    snapshot.regions.china.length > 0 ||
    snapshot.regions.taiwan.length > 0;

  if (hasAny || snapshot.id === latest.id) {
    return snapshot;
  }

  const gap = Math.max(0, Number(latest.label) - Number(snapshot.label) || 0);
  const decay = 1 - Math.min(0.6, gap * 0.15);

  const regions = (Object.keys(latest.regions) as RegionKey[]).reduce(
    (acc, region) => {
      acc[region] = latest.regions[region].map((item) => ({
        ...item,
        published_at_et: shiftIsoDays(item.published_at_et, gap),
        views: Math.max(500, Math.floor(item.views * decay))
      }));
      return acc;
    },
    {
      us: [] as NewsItem[],
      korea: [] as NewsItem[],
      china: [] as NewsItem[],
      taiwan: [] as NewsItem[]
    }
  );

  return {
    ...snapshot,
    regions
  };
}

export function NewsRegionalBoard() {
  const snapshots = dailyReport.section_news_archive;
  const [selectedId, setSelectedId] = useState(snapshots[0]?.id ?? "");
  const latestSnapshot = snapshots[0];

  const selectedSnapshot = useMemo(() => {
    const found = snapshots.find((snapshot) => snapshot.id === selectedId) ?? snapshots[0];
    return resolveSnapshot(found, latestSnapshot);
  }, [selectedId, snapshots, latestSnapshot]);

  const regions = Object.keys(selectedSnapshot.regions) as RegionKey[];

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Regional News Board</h1>
        <p className="text-sm text-muted-foreground">
          최신성, 중요도, 조회수 기준으로 지역별 Top 3를 제공합니다.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Archive:</span>
        {snapshots
          .slice()
          .sort((a, b) => Number(a.label) - Number(b.label))
          .map((snapshot) => {
            const isActive = snapshot.id === selectedSnapshot.id;
            const isLatest = snapshot.id === snapshots[0]?.id;
            return (
              <button
                key={snapshot.id}
                type="button"
                onClick={() => setSelectedId(snapshot.id)}
                className={
                  isActive
                    ? "rounded-md border bg-foreground px-2 py-1 text-xs text-background"
                    : "rounded-md border px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                }
              >
                {snapshot.label}
                {isLatest ? " (latest)" : ""}
              </button>
            );
          })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {regions.map((region) => {
          const meta = REGION_META[region];
          const items = rankNews(selectedSnapshot.regions[region]);

          return (
            <Card key={region}>
              <CardHeader>
                <CardTitle>{meta.title}</CardTitle>
                <p className="text-xs text-muted-foreground">{meta.subtitle}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">표시할 뉴스가 없습니다.</p>
                ) : (
                  items.map((news, index) => (
                    <article key={`${region}-${news.source}-${index}`} className="rounded-md border p-3 text-sm">
                      <p className="font-medium">{news.headline}</p>
                      <p className="mt-2 text-sm text-muted-foreground">{news.summary_ko}</p>
                      {news.url ? (
                        <a
                          href={news.url}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-block text-xs text-primary hover:underline"
                        >
                          원문 링크
                        </a>
                      ) : null}
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {news.source} · {news.published_at_et} · importance {news.importance_score} · views {news.views.toLocaleString("en-US")}
                      </p>
                    </article>
                  ))
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
