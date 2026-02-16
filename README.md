# My Investment Dashboard

Next.js(App Router) + TypeScript + Tailwind(shadcn/ui 스타일) + Prisma 기반 개인 투자 대시보드입니다.

## Features

- App Router 기반 라우팅
- 페이지
  - `/` : Dashboard (대표 종목 요약 + watchlist CRUD)
  - `/ticker/[symbol]` : 종목 상세 + 30일 Mock 차트
  - `/portfolio` : watchlist 기반 포트폴리오 요약
- Prisma 데이터 모델
  - `WatchlistItem` CRUD
  - `MarketDataCache` (provider별 캐시 저장)
- 데이터소스 추상화
  - `src/lib/market-data/providers/market-data-provider.ts` 인터페이스
  - `MockProvider` + `AlphaVantageProvider(스켈레톤)`
  - 가격/차트/지표/뉴스 메서드 공통화
- 뉴스 어댑터 패턴
  - `src/lib/news/adapters/news-adapter.ts` 인터페이스
  - `MockNewsAdapter` + `WebSearchNewsAdapter(스켈레톤)` + `RssNewsAdapter(스켈레톤)`
  - 종목별 최신 뉴스 10건, 중복 제거(URL/유사 제목), 미국 주요 매체 우선 정렬
- rate limit 대비 캐시
  - in-memory 캐시 (`InMemoryCacheStore`)
  - DB 캐시 (`PrismaMarketDataCacheStore`)
  - 캐시 래퍼 (`CachedMarketDataProvider`)
- 에러 타입 표준화
  - `network`, `quota_exceeded`, `symbol_not_found`, `provider_config`, `unknown`
  - API에서 타입 포함 응답으로 UI 분기 처리 가능
- DB 환경
  - PostgreSQL 기본
  - SQLite 로컬 개발 모드 지원

## Quick Start

1. 의존성 설치

```bash
npm install
```

2. 환경 변수 설정

PostgreSQL을 사용할 경우:

```bash
cp .env.example .env
```

SQLite를 사용할 경우:

```bash
cp .env.sqlite.example .env
```

3. Prisma Client 생성 및 스키마 반영

```bash
npm run db:generate
npm run db:push
```

4. 개발 서버 실행

```bash
npm run dev
```

5. 브라우저 접속

- http://localhost:3000

## Prisma Schema

`prisma/schema.prisma`의 datasource는 아래 환경 변수로 결정됩니다.

- `DATABASE_PROVIDER`: `postgresql` 또는 `sqlite`
- `DATABASE_URL`: DB 연결 문자열
- `ALPHA_VANTAGE_API_KEY`: Alpha Vantage provider 사용 시 필요
- `NEWS_ADAPTER`: `mock` | `websearch` | `rss`
- `MARKET_CACHE_*_TTL_SEC`: 데이터 종류별 캐시 TTL

## API 교체 가이드 (Mock -> Real)

1. `src/lib/market-data/providers/market-data-provider.ts`의 인터페이스를 구현한 새 provider 생성
2. `src/lib/market-data/provider.ts`의 switch에 provider 등록
3. `.env`에서 `MARKET_DATA_PROVIDER` 값을 변경

## DoD (Definition of Done)

- [x] Next.js + TypeScript + App Router 구조 생성
- [x] Tailwind + shadcn/ui 스타일 컴포넌트 구성
- [x] Prisma + Postgres/SQLite 전환 가능한 datasource 구성
- [x] 페이지 `/`, `/ticker/[symbol]`, `/portfolio` 구현
- [x] watchlist CRUD API 및 UI 연동
- [x] 시세/차트 mock 데이터 연결 + Provider 추상화
- [x] 로컬 실행 절차 문서화
