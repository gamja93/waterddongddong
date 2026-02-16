import { NetworkError } from "@/lib/market-data/errors";
import { NewsArticle } from "@/lib/market-data/types";
import { NewsAdapter } from "@/lib/news/adapters/news-adapter";

export class WebSearchNewsAdapter implements NewsAdapter {
  async fetchNews(_symbol: string, _limit: number): Promise<NewsArticle[]> {
    // Skeleton: 향후 웹 검색 도구 연동 시 이 메서드를 구현.
    // 예상 흐름: 검색 -> 결과 normalize -> NewsArticle[] 반환
    throw new NetworkError("WebSearchNewsAdapter는 아직 구현되지 않았습니다.");
  }
}
