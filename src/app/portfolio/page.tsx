import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWatchlist } from "@/lib/watchlist";

export default async function PortfolioPage() {
  let items = [] as Awaited<ReturnType<typeof getWatchlist>>;

  try {
    items = await getWatchlist();
  } catch {
    items = [];
  }

  return (
    <div className="space-y-6">
      <section className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          현재는 워치리스트 기준의 포트폴리오 요약입니다. 향후 보유 수량/평단가 모델로 확장 가능합니다.
        </p>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>보유 종목 후보</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              아직 워치리스트가 없습니다. Dashboard에서 종목을 추가해보세요.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <li key={item.id} className="rounded-md border p-3">
                  <div className="font-medium">{item.symbol}</div>
                  <div className="text-xs text-muted-foreground">{item.name ?? "이름 없음"}</div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
