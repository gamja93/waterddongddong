import { DailyUsMarketCloseReport } from "@/components/daily-us-market-close-report";
import { DashboardOverview } from "@/components/dashboard-overview";
import { WatchlistPanel } from "@/components/watchlist-panel";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <DailyUsMarketCloseReport />

      <DashboardOverview />

      <WatchlistPanel />
    </div>
  );
}
