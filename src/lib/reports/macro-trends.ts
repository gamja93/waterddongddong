import { MacroRow } from "@/lib/reports/daily-us-market-close";

type MacroItem = MacroRow["item"];

const YAHOO_SYMBOL_MAP: Partial<Record<MacroItem, string>> = {
  "S&P500": "^GSPC",
  NASDAQ: "^IXIC",
  "DOW JONES": "^DJI",
  "US10Y Treasury Yield": "^TNX",
  VIX: "^VIX",
  "Dollar Index (DXY)": "DX-Y.NYB",
  KOSPI: "^KS11",
  KOSDAQ: "^KQ11",
  "USD/KRW": "KRW=X"
};

function downsample(values: number[], target = 26) {
  if (values.length <= target) {
    return values;
  }

  const step = (values.length - 1) / (target - 1);
  return Array.from({ length: target }, (_, i) => {
    const index = Math.round(i * step);
    return values[index];
  });
}

async function fetchThreeMonthsSeries(symbol: string): Promise<number[] | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=3mo&interval=1d`;
    const response = await fetch(url, {
      next: { revalidate: 60 * 60 * 6 }
    });

    if (!response.ok) {
      return null;
    }

    const json = (await response.json()) as {
      chart?: {
        result?: Array<{
          indicators?: {
            quote?: Array<{ close?: Array<number | null> }>;
          };
        }>;
      };
    };

    const closes = json.chart?.result?.[0]?.indicators?.quote?.[0]?.close;
    if (!closes || closes.length < 2) {
      return null;
    }

    const numeric = closes.filter((value): value is number => Number.isFinite(value));
    if (numeric.length < 2) {
      return null;
    }

    return downsample(numeric, 26);
  } catch {
    return null;
  }
}

export async function getMacroTrends3m() {
  const itemKeys: MacroItem[] = [
    "S&P500",
    "NASDAQ",
    "DOW JONES",
    "US10Y Treasury Yield",
    "VIX",
    "Dollar Index (DXY)",
    "KOSPI",
    "KOSDAQ",
    "USD/KRW",
    "K200 선물",
    "예탁자금",
    "거래대금",
    "신용융자"
  ];

  const entries = await Promise.all(
    itemKeys.map(async (item) => {
      const symbol = YAHOO_SYMBOL_MAP[item];
      if (!symbol) {
        return [item, null] as const;
      }
      const trend = await fetchThreeMonthsSeries(symbol);
      return [item, trend] as const;
    })
  );

  return Object.fromEntries(entries) as Record<MacroItem, number[] | null>;
}
