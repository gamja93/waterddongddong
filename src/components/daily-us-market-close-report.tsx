import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  dailyReport,
  marketBriefMarkdown,
  nextComponentExample,
  type MacroRow
} from "@/lib/reports/daily-us-market-close";
import { getMacroTrends3m } from "@/lib/reports/macro-trends";

type MacroItem = MacroRow["item"];

const FINANCE_LINKS: Partial<Record<MacroItem, string>> = {
  "S&P500": "https://finance.yahoo.com/quote/%5EGSPC/",
  NASDAQ: "https://finance.yahoo.com/quote/%5EIXIC/",
  "DOW JONES": "https://finance.yahoo.com/quote/%5EDJI/",
  "US10Y Treasury Yield": "https://finance.yahoo.com/quote/%5ETNX/",
  VIX: "https://finance.yahoo.com/quote/%5EVIX/",
  "Dollar Index (DXY)": "https://finance.yahoo.com/quote/DX-Y.NYB/",
  KOSPI: "https://finance.yahoo.com/quote/%5EKS11/",
  KOSDAQ: "https://finance.yahoo.com/quote/%5EKQ11/",
  "USD/KRW": "https://finance.yahoo.com/quote/KRW=X/"
};

const TICKER_EXCHANGE: Record<string, "NASDAQ" | "NYSE"> = {
  AMAT: "NASDAQ",
  MRK: "NYSE",
  WMT: "NYSE",
  RIVN: "NASDAQ",
  CROX: "NASDAQ",
  TRIP: "NASDAQ",
  TM: "NYSE"
};

const TICKER_NAME: Record<string, string> = {
  AMAT: "Applied Materials",
  MRK: "Merck & Co.",
  WMT: "Walmart Inc.",
  RIVN: "Rivian Automotive",
  CROX: "Crocs, Inc.",
  TRIP: "Tripadvisor, Inc.",
  TM: "Toyota Motor Corp."
};

const NAV_ITEMS = [
  { id: "us-macro", label: "미국 매크로" },
  { id: "kr-macro", label: "한국 매크로" },
  { id: "news-page", label: "뉴스 페이지 이동", href: "/news" },
  { id: "market-summary", label: "마켓 요약" },
  { id: "sector-leaders", label: "섹터 리더" },
  { id: "unusual-movers", label: "특이 종목" },
  { id: "kr-unusual-movers", label: "한국 특이 종목" },
  { id: "high-watch", label: "신고가 워치" },
  { id: "kr-high-watch", label: "한국 52주 신고가 워치" },
  { id: "briefing-markdown", label: "브리핑 마크다운" }
] as const;

function getGoogleFinanceUrl(ticker: string) {
  if (/^\d{6}$/.test(ticker)) {
    return `https://www.google.com/finance/quote/${ticker}:KRX`;
  }
  const exchange = TICKER_EXCHANGE[ticker] ?? "NASDAQ";
  return `https://www.google.com/finance/quote/${encodeURIComponent(ticker)}:${exchange}`;
}

function Sparkline3M({ points }: { points: number[] | null }) {
  if (!points || points.length < 2) {
    return <span className="text-xs text-muted-foreground">-</span>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const scale = max - min === 0 ? 1 : max - min;

  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / scale) * 100;
      return `${x},${y}`;
    })
    .join(" ");
  const areaPath = `M 0 100 L ${polyline} L 100 100 Z`;

  const start = points[0];
  const end = points[points.length - 1];
  const isUp = end >= start;
  const stroke = isUp ? "#059669" : "#dc2626";
  const gradientId = isUp ? "trendFillUp" : "trendFillDown";
  const softFill = isUp ? "rgba(5,150,105,0.16)" : "rgba(220,38,38,0.16)";
  const glowFill = isUp ? "rgba(5,150,105,0.28)" : "rgba(220,38,38,0.24)";
  const startY = 100 - ((start - min) / scale) * 100;
  const endY = 100 - ((end - min) / scale) * 100;
  const trendPct = ((end - start) / Math.abs(start || 1)) * 100;

  return (
    <div className="space-y-1">
      <div className="rounded-lg border bg-gradient-to-b from-background to-muted/20 p-2 shadow-sm">
        <svg viewBox="0 0 100 100" className="h-20 w-48">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={glowFill} />
              <stop offset="100%" stopColor={softFill} />
            </linearGradient>
          </defs>
          <line x1="0" y1="80" x2="100" y2="80" stroke="hsl(var(--border))" strokeWidth="0.8" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="hsl(var(--border))" strokeWidth="0.8" />
          <line x1="0" y1="20" x2="100" y2="20" stroke="hsl(var(--border))" strokeWidth="0.8" />
          <path d={areaPath} fill={`url(#${gradientId})`} />
          <polyline
            fill="none"
            stroke={stroke}
            strokeWidth="2.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            points={polyline}
          />
          <circle cx="0" cy={startY} r="2.2" fill={stroke} />
          <circle cx="100" cy={endY} r="2.8" fill={stroke} />
        </svg>
        <div className="mt-1 flex items-center justify-between text-[10px]">
          <span className="text-muted-foreground">low {min.toFixed(2)}</span>
          <span className={isUp ? "text-emerald-600" : "text-rose-600"}>
            {isUp ? "+" : ""}
            {trendPct.toFixed(2)}%
          </span>
          <span className="text-muted-foreground">high {max.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}

function fmtNumber(value: number | null) {
  if (value === null) {
    return "null";
  }

  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function fmtChange(value: number | null) {
  if (value === null) {
    return "null";
  }

  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

function MacroTable({ rows, trends3m }: { rows: MacroRow[]; trends3m: Record<MacroItem, number[] | null> }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-sm">
        <thead>
          <tr className="border-b text-muted-foreground">
            <th className="py-2 text-left">Item</th>
            <th className="py-2 text-left">Close</th>
            <th className="py-2 text-left">Change %</th>
            <th className="py-2 text-left">3M Trend</th>
            <th className="py-2 text-left">Daily Comment</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.item} className="border-b align-top">
              <td className="py-2 pr-4 font-medium">
                {FINANCE_LINKS[row.item] ? (
                  <a
                    href={FINANCE_LINKS[row.item]}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:underline"
                    title="Open in Yahoo Finance"
                  >
                    {row.item}
                  </a>
                ) : (
                  <span>{row.item}</span>
                )}
              </td>
              <td className="py-2 pr-4">{fmtNumber(row.close_value)}</td>
              <td className="py-2 pr-4">{fmtChange(row.change_percent)}</td>
              <td className="py-2 pr-4">
                <Sparkline3M points={trends3m[row.item] ?? row.trend_3m} />
              </td>
              <td className="min-w-[360px] py-2">{row.daily_comment}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export async function DailyUsMarketCloseReport() {
  const trends3m = await getMacroTrends3m();

  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Daily US Market Close Report</h1>
        <p className="text-sm text-muted-foreground">
          좌측 모듈 목록 기반으로 확장 가능한 구조입니다. (미국 매크로, 한국 매크로, 뉴스 스트립 등)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="h-max rounded-lg border bg-card p-3 lg:sticky lg:top-20">
          <p className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground">MODULES</p>
          <nav>
            <ul className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <a
                      href={`#${item.id}`}
                      className="block rounded-md px-2 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div className="space-y-6">
          <Card id="us-macro">
            <CardHeader>
              <CardTitle>미국 매크로</CardTitle>
            </CardHeader>
            <CardContent>
              <MacroTable rows={dailyReport.section_1_macro_dashboard} trends3m={trends3m} />
            </CardContent>
          </Card>

          <Card id="kr-macro">
            <CardHeader>
              <CardTitle>한국 매크로</CardTitle>
            </CardHeader>
            <CardContent>
              <MacroTable rows={dailyReport.section_1_korea_macro_dashboard} trends3m={trends3m} />
            </CardContent>
          </Card>

          <Card id="news-page">
            <CardHeader>
              <CardTitle>News</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <p className="text-muted-foreground">
                뉴스는 별도 페이지에서 조회하도록 분리되었습니다.
              </p>
              <Link href="/news" className="mt-3 inline-block text-primary hover:underline">
                뉴스 페이지로 이동 →
              </Link>
            </CardContent>
          </Card>

          <Card id="market-summary">
            <CardHeader>
              <CardTitle>마켓 요약</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {dailyReport.section_2_market_summary.map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </CardContent>
          </Card>

          <Card id="sector-leaders">
            <CardHeader>
              <CardTitle>섹터 리더</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {dailyReport.section_3_sector_leaders.map((item) => (
                <article key={item.sector_name} className="rounded-md border p-4 text-sm">
                  <p className="font-semibold">{item.sector_name}</p>
                  <p className="mt-1">
                    종목명 (티커):{" "}
                    {item.leader_ticker ? (
                      <a
                        href={getGoogleFinanceUrl(item.leader_ticker)}
                        target="_blank"
                        rel="noreferrer"
                        className="underline underline-offset-2"
                      >
                        {TICKER_NAME[item.leader_ticker] ?? item.leader_ticker} ({item.leader_ticker})
                      </a>
                    ) : (
                      "null"
                    )}
                  </p>
                  <p className="mt-1 text-muted-foreground">{item.performance_reason}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    notable_flow: {item.notable_flow ?? "null"}
                  </p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card id="unusual-movers">
            <CardHeader>
              <CardTitle>특이 종목</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {dailyReport.section_4_unusual_movers.map((item) => (
                <article key={item.ticker} className="rounded-md border p-4 text-sm">
                  <p className="font-semibold">
                    회사명 (티커):{" "}
                    <a
                      href={getGoogleFinanceUrl(item.ticker)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {TICKER_NAME[item.ticker] ?? item.ticker} ({item.ticker})
                    </a>
                  </p>
                  <p className="mt-1">move_percent: {fmtChange(item.move_percent)}</p>
                  <p className="mt-1 text-muted-foreground">{item.catalyst}</p>
                  <p className="mt-1 text-xs text-muted-foreground">category: {item.category}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card id="kr-unusual-movers">
            <CardHeader>
              <CardTitle>한국 특이 종목</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {dailyReport.section_4_korea_unusual_movers.map((item) => (
                <article key={item.ticker} className="rounded-md border p-4 text-sm">
                  <p className="font-semibold">
                    종목명(티커):{" "}
                    <a
                      href={getGoogleFinanceUrl(item.ticker)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {TICKER_NAME[item.ticker] ?? item.ticker} ({item.ticker})
                    </a>
                  </p>
                  <p className="mt-1">move_percent: {fmtChange(item.move_percent)}</p>
                  <p className="mt-1 text-muted-foreground">{item.catalyst}</p>
                  <p className="mt-1 text-xs text-muted-foreground">category: {item.category}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card id="high-watch">
            <CardHeader>
              <CardTitle>신고가 워치</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {dailyReport.section_5_52w_high_watch.map((item) => (
                <article key={item.ticker} className="rounded-md border p-4 text-sm">
                  <p className="font-semibold">
                    종목명(티커):{" "}
                    <a
                      href={getGoogleFinanceUrl(item.ticker)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {TICKER_NAME[item.ticker] ?? item.ticker} ({item.ticker})
                    </a>
                  </p>
                  <p className="mt-1">sector: {item.sector}</p>
                  <p className="mt-1 text-muted-foreground">{item.breakout_reason}</p>
                  <p className="mt-1 text-xs text-muted-foreground">theme_tag: {item.theme_tag}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card id="kr-high-watch">
            <CardHeader>
              <CardTitle>한국 52주 신고가 워치</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 md:grid-cols-2">
              {dailyReport.section_5_korea_52w_high_watch.map((item) => (
                <article key={item.ticker} className="rounded-md border p-4 text-sm">
                  <p className="font-semibold">
                    종목명(티커):{" "}
                    <a
                      href={getGoogleFinanceUrl(item.ticker)}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2"
                    >
                      {TICKER_NAME[item.ticker] ?? item.ticker} ({item.ticker})
                    </a>
                  </p>
                  <p className="mt-1">sector: {item.sector}</p>
                  <p className="mt-1 text-muted-foreground">{item.breakout_reason}</p>
                  <p className="mt-1 text-xs text-muted-foreground">theme_tag: {item.theme_tag}</p>
                </article>
              ))}
            </CardContent>
          </Card>

          <Card id="briefing-markdown">
            <CardHeader>
              <CardTitle>브리핑 마크다운</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="overflow-auto rounded-md border bg-muted/30 p-4 text-xs">
                {marketBriefMarkdown}
              </pre>
              <pre className="overflow-auto rounded-md border bg-muted/30 p-4 text-xs">
                {nextComponentExample}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
