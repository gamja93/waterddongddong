import { Candle } from "@/lib/market-data/types";

function minMax(values: number[]) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (min === max) {
    return { min: min - 1, max: max + 1 };
  }
  return { min, max };
}

export function PriceChart({ points }: { points: Candle[] }) {
  if (points.length === 0) {
    return <div className="text-sm text-muted-foreground">차트 데이터가 없습니다.</div>;
  }

  const prices = points.map((p) => p.close);
  const { min, max } = minMax(prices);

  const polyline = points
    .map((point, index) => {
      const x = (index / (points.length - 1 || 1)) * 100;
      const y = 100 - ((point.close - min) / (max - min)) * 100;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 100" className="h-44 w-full rounded-md bg-muted/40 p-3">
      <polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.8"
        points={polyline}
      />
    </svg>
  );
}
