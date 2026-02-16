import { NetworkError } from "@/lib/market-data/errors";
import { NewsArticle } from "@/lib/market-data/types";
import { NewsAdapter } from "@/lib/news/adapters/news-adapter";

export class RssNewsAdapter implements NewsAdapter {
  async fetchNews(_symbol: string, _limit: number): Promise<NewsArticle[]> {
    // Skeleton: 향후 RSS feed 파서 연동 시 이 메서드를 구현.
    // 예상 흐름: 피드 수집 -> 심볼 관련 기사 필터 -> NewsArticle[] 반환
    throw new NetworkError("RssNewsAdapter는 아직 구현되지 않았습니다.");
  }
}
