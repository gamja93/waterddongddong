export type MacroRow = {
  item:
    | "S&P500"
    | "NASDAQ"
    | "DOW JONES"
    | "US10Y Treasury Yield"
    | "VIX"
    | "Dollar Index (DXY)"
    | "KOSPI"
    | "KOSDAQ"
    | "USD/KRW"
    | "K200 선물"
    | "예탁자금"
    | "거래대금"
    | "신용융자";
  close_value: number | null;
  change_percent: number | null;
  trend_3m: number[] | null;
  daily_comment: string;
};

export type SectorLeader = {
  sector_name:
    | "AI/Semiconductor"
    | "MegaCap Tech"
    | "Energy"
    | "Financials"
    | "Healthcare"
    | "Industrials"
    | "Consumer";
  leader_ticker: string | null;
  performance_reason: string;
  notable_flow: string | null;
};

export type UnusualMover = {
  ticker: string;
  move_percent: number;
  catalyst: string;
  category: "earnings" | "macro" | "rating" | "rumor";
};

export type HighWatch = {
  ticker: string;
  sector: string;
  breakout_reason: string;
  theme_tag: string;
};

export type NewsStripItem = {
  headline: string;
  summary_ko: string;
  source: string;
  published_at_et: string;
  importance_score: number;
  views: number;
  url: string | null;
};

export type NewsStripByRegion = {
  us: NewsStripItem[];
  korea: NewsStripItem[];
  china: NewsStripItem[];
  taiwan: NewsStripItem[];
};

export type NewsStripSnapshot = {
  id: string;
  label: string;
  captured_at_et: string;
  regions: NewsStripByRegion;
};

export const dailyReport = {
  report_name: "Daily US Market Close Report",
  role: "Global BB Research Head",
  generated_at_et: "2026-02-13T16:00:00-05:00",
  data_cut_et: "2026-02-13 close",
  compliance_note:
    "FACT 중심 브리핑이며 투자 추천/자동매매 목적이 아니다. 확인 불가 수치는 null 처리.",

  section_1_macro_dashboard: [
    {
      item: "S&P500",
      close_value: 6836.17,
      change_percent: 0.05,
      trend_3m: null,
      daily_comment: "인플레이션 둔화 신호 이후 낙폭을 대부분 만회하며 보합권 마감."
    },
    {
      item: "NASDAQ",
      close_value: 22546.67,
      change_percent: -0.22,
      trend_3m: null,
      daily_comment: "AI 민감 성장주 변동성이 이어지며 대형 기술주 중심으로 약세."
    },
    {
      item: "DOW JONES",
      close_value: 49500.93,
      change_percent: 0.1,
      trend_3m: null,
      daily_comment: "경기방어/가치주 일부 강세로 소폭 상승 마감."
    },
    {
      item: "US10Y Treasury Yield",
      close_value: 4.09,
      change_percent: null,
      trend_3m: null,
      daily_comment: "H.15 기준 10년물 4.09%; 인플레이션 완화 데이터 이후 금리 하락 압력 확인."
    },
    {
      item: "VIX",
      close_value: 20.6,
      change_percent: -1.06,
      trend_3m: null,
      daily_comment: "전일 급등 이후 일부 되돌림이 나왔지만 20선으로 이벤트 리스크는 잔존."
    },
    {
      item: "Dollar Index (DXY)",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "동일 기준 시점의 공신력 있는 종가 수치 확인이 제한되어 null 처리."
    }
  ] as MacroRow[],

  section_1_korea_macro_dashboard: [
    {
      item: "KOSPI",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "한국 대표 주가지수. 수치는 실시간 소스 연동값을 우선 사용."
    },
    {
      item: "KOSDAQ",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "성장/기술주 중심 지수. 변동성 확대 여부를 함께 점검."
    },
    {
      item: "USD/KRW",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "원/달러 환율. 외국인 수급 및 위험선호를 해석하는 보조 지표."
    },
    {
      item: "K200 선물",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "코스피200 선물 가격/베이시스 변화로 단기 위험선호를 점검."
    },
    {
      item: "예탁자금",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "투자 대기자금 유입/이탈 추이로 개인 수급 온도를 확인."
    },
    {
      item: "거래대금",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "시장 에너지(회전율) 확인용 지표. 급증/급감 구간을 체크."
    },
    {
      item: "신용융자",
      close_value: null,
      change_percent: null,
      trend_3m: null,
      daily_comment: "레버리지 참여 강도 확인. 과열/디레버리징 리스크 점검용."
    }
  ] as MacroRow[],

  section_2_market_summary: [
    "미국 증시는 2026년 2월 13일(금) 장 마감 기준, 물가 둔화 신호를 소화하며 지수별 혼조로 마감했다.",
    "S&P500은 +0.05%, Dow는 +0.10%로 소폭 상승했지만, Nasdaq은 -0.22%로 기술주 변동성이 이어졌다.",
    "장중 핵심 드라이버는 인플레이션 둔화와 이에 따른 금리 하락 압력이었고, 이는 리스크 오프를 일부 완화했다.",
    "다만 AI 관련 밸류체인 재평가 이슈는 해소되지 않아 성장주와 전통 대형주의 상대 강도 차이가 지속됐다.",
    "유가와 달러는 당일 동일 기준 종가 정합성이 제한적이어서 본 리포트에서는 방향성 코멘트만 최소화했다.",
    "결론적으로 당일 톤은 극단적 리스크 오프에서 완화된 중립 구간으로 해석되며, 팩트상 주간 성과는 여전히 약세다."
  ],

  section_news_archive: [
    {
      id: "4",
      label: "4",
      captured_at_et: "2026-02-14T07:30:00-05:00",
      regions: {
        us: [
          {
            headline: "US equities end mixed after cooler inflation signal",
            summary_ko:
              "장 마감 직전까지 금리 민감 업종 중심으로 매수와 차익실현이 교차하면서 지수 간 방향이 엇갈렸다. 인플레이션 둔화 신호가 확인되자 장기 금리 부담은 완화됐지만, 성장주 밸류에이션 재평가 이슈가 남아 나스닥 탄력은 제한됐다.",
            source: "AP",
            published_at_et: "2026-02-13T16:20:00-05:00",
            importance_score: 9,
            views: 42100,
            url: "https://apnews.com/article/stocks-markets-wall-street-rate-cuts-a20e321be9f7f5c6d57a9e35dec0d9c9"
          },
          {
            headline: "Volatility eases from prior spike while growth stocks remain choppy",
            summary_ko:
              "전일 이벤트로 치솟았던 변동성 지표는 일부 되돌림이 나타났지만, 성장주 내부에서는 실적 가시성 차이에 따른 종목 장세가 이어졌다. 동일 섹터 내에서도 멀티플 부담이 높은 종목은 약세를 보이고, 실적 추정치가 상향되는 종목은 상대 강세를 유지했다.",
            source: "MarketWatch",
            published_at_et: "2026-02-13T16:35:00-05:00",
            importance_score: 8,
            views: 28700,
            url: "https://www.marketwatch.com/search?q=volatility%20growth%20stocks"
          },
          {
            headline: "Large-cap defensive names continue to show relative strength",
            summary_ko:
              "헬스케어·필수소비재 등 대형 방어주는 장중 조정 구간에서도 낙폭이 제한되며 자금의 피난처 역할을 지속했다. 이는 시장의 절대 리스크 온 전환보다는, 변동성 관리 중심의 선택적 리스크 노출이 유지되고 있음을 시사한다.",
            source: "Reuters",
            published_at_et: "2026-02-13T16:45:00-05:00",
            importance_score: 7,
            views: 24100,
            url: "https://www.reuters.com/site-search/?query=defensive%20stocks%20relative%20strength"
          }
        ],
        korea: [
          {
            headline: "반도체 업황 개선 기대에 대형주 수급 집중",
            summary_ko:
              "메모리 가격 반등 기대와 AI 서버 투자 확대 전망이 겹치며 반도체 대형주 중심으로 수급이 몰렸다. 장중 조정 구간에서도 저가 매수세가 빠르게 유입돼 지수 하방을 완충하는 역할을 했다.",
            source: "한국경제",
            published_at_et: "2026-02-14T06:50:00-05:00",
            importance_score: 9,
            views: 19800,
            url: "https://www.hankyung.com/search/news?query=%EB%B0%98%EB%8F%84%EC%B2%B4%20%EC%97%85%ED%99%A9%20%EA%B0%9C%EC%84%A0"
          },
          {
            headline: "코스닥 변동성 확대 속 종목 장세 심화",
            summary_ko:
              "코스닥은 업종별 실적 모멘텀 차이가 크게 반영되며 개별 종목 중심의 회전 매매가 강화됐다. 거래대금이 일부 테마로 쏠리면서 지수 레벨보다 종목 선택의 성과 편차가 더 크게 나타났다.",
            source: "서울경제",
            published_at_et: "2026-02-14T07:10:00-05:00",
            importance_score: 8,
            views: 15200,
            url: "https://www.sedaily.com/Search/?scText=%EC%BD%94%EC%8A%A4%EB%8B%A5%20%EB%B3%80%EB%8F%99%EC%84%B1"
          },
          {
            headline: "AI 밸류체인 점검 리포트 공개, 장비주 관심 확대",
            summary_ko:
              "국내 증권가의 AI 공급망 점검 리포트가 공개되며 장비·소재주로 매수세가 확산됐다. 실적 추정 상향이 동반된 종목군은 변동성 장세에서도 상대 수익률 우위가 확인됐다.",
            source: "디일렉",
            published_at_et: "2026-02-14T07:20:00-05:00",
            importance_score: 7,
            views: 12100,
            url: "https://www.thelec.kr/"
          }
        ],
        china: [
          {
            headline: "중국 당국의 경기 부양 신호에 본토 지수 혼조",
            summary_ko:
              "당국의 정책 메시지 이후 경기민감 업종은 반등했지만, 부채·수요 둔화 우려가 남은 업종은 매도 압력이 이어졌다. 정책 기대와 펀더멘털 확인 필요성이 동시에 작동하면서 본토 지수는 방향성 없이 혼조 흐름을 보였다.",
            source: "신화통신(Xinhua)",
            published_at_et: "2026-02-14T02:20:00-05:00",
            importance_score: 9,
            views: 16800,
            url: "https://english.news.cn/"
          },
          {
            headline: "대형 인터넷주 중심으로 외국인 자금 유입 관찰",
            summary_ko:
              "플랫폼 규제 리스크 완화 기대가 커진 구간에서 대형 인터넷주로 외국인 매수세가 유입됐다. 다만 소비 회복 속도에 대한 불확실성이 남아 있어, 수급 개선이 중기 추세로 이어질지는 추가 확인이 필요하다.",
            source: "차이신(Caixin)",
            published_at_et: "2026-02-14T03:05:00-05:00",
            importance_score: 8,
            views: 14300,
            url: "https://www.caixinglobal.com/"
          },
          {
            headline: "정책 기대에도 부동산 관련주는 약세 지속",
            summary_ko:
              "정책 지원 기대가 유지되는 가운데서도 부동산 관련주는 실수요 둔화 우려로 약세가 이어졌다. 정책 발표와 실물 지표 간 시차가 재차 확인되며 업종별 디커플링이 확대됐다.",
            source: "Securities Times",
            published_at_et: "2026-02-14T03:25:00-05:00",
            importance_score: 7,
            views: 9700,
            url: "https://www.stcn.com/"
          }
        ],
        taiwan: [
          {
            headline: "AI 공급망 기대감으로 대만 반도체 밸류체인 강세",
            summary_ko:
              "AI 가속기·서버 증설 사이클 기대가 이어지며 파운드리, 패키징, 장비 밸류체인 전반으로 매수세가 확산됐다. 특히 실적 가시성이 높은 핵심 공급망 종목에 거래가 집중되며 시장 주도력이 강화됐다.",
            source: "Focus Taiwan (CNA)",
            published_at_et: "2026-02-14T01:40:00-05:00",
            importance_score: 9,
            views: 13100,
            url: "https://focustaiwan.tw/"
          },
          {
            headline: "파운드리 관련주 거래대금 확대",
            summary_ko:
              "파운드리 관련주군에서 거래대금이 유의미하게 증가하며 단기 모멘텀이 강화됐다. 거래량 증가가 동반된 상승 패턴이 나타나면서, 단순 테마성 반등보다 수급 기반 추세 전환 가능성이 함께 논의됐다.",
            source: "Taipei Times",
            published_at_et: "2026-02-14T01:55:00-05:00",
            importance_score: 8,
            views: 10200,
            url: "https://www.taipeitimes.com/"
          },
          {
            headline: "TSMC 공급망 일부 종목, 기관 순매수 전환",
            summary_ko:
              "대만 기관투자가의 매매 동향에서 핵심 공급망 종목군이 순매수로 전환되며 수급 신호가 개선됐다. 단기 급등 종목 대비 실적 가시성이 높은 중대형주의 선호가 두드러졌다.",
            source: "工商時報",
            published_at_et: "2026-02-14T02:05:00-05:00",
            importance_score: 7,
            views: 8600,
            url: "https://ctee.com.tw/"
          }
        ]
      }
    },
    {
      id: "3",
      label: "3",
      captured_at_et: "2026-02-13T07:30:00-05:00",
      regions: { us: [], korea: [], china: [], taiwan: [] }
    },
    {
      id: "2",
      label: "2",
      captured_at_et: "2026-02-12T07:30:00-05:00",
      regions: { us: [], korea: [], china: [], taiwan: [] }
    },
    {
      id: "1",
      label: "1",
      captured_at_et: "2026-02-11T07:30:00-05:00",
      regions: { us: [], korea: [], china: [], taiwan: [] }
    }
  ] as NewsStripSnapshot[],

  section_3_sector_leaders: [
    {
      sector_name: "AI/Semiconductor",
      leader_ticker: "AMAT",
      performance_reason: "실적/가이던스 기대와 AI 설비투자 모멘텀이 결합되며 강세가 확인됨.",
      notable_flow: "반도체 장비주 동반 강세 흐름"
    },
    {
      sector_name: "MegaCap Tech",
      leader_ticker: null,
      performance_reason: "Nasdaq 약세 마감 속에서 메가캡 내 뚜렷한 단일 리더 확인은 제한적.",
      notable_flow: "AI 수익성/투자회수 논쟁 지속"
    },
    {
      sector_name: "Energy",
      leader_ticker: null,
      performance_reason: "검증 가능한 당일 단일 대장주 팩트가 제한적이라 null 처리.",
      notable_flow: "WTI는 62달러대에서 제한적 변동"
    },
    {
      sector_name: "Financials",
      leader_ticker: null,
      performance_reason: "금리 하락 구간에서 업종 내 종목별 차별화가 커 단일 리더 식별 제한.",
      notable_flow: null
    },
    {
      sector_name: "Healthcare",
      leader_ticker: "MRK",
      performance_reason: "52주 신고가 스크리너(2/13 업데이트)에서 상위 대형주로 포착.",
      notable_flow: "방어주 선호의 일부 반영"
    },
    {
      sector_name: "Industrials",
      leader_ticker: null,
      performance_reason: "당일 팩트 기반 단일 대장주 확인 제한으로 null 유지.",
      notable_flow: null
    },
    {
      sector_name: "Consumer",
      leader_ticker: "WMT",
      performance_reason: "52주 신고가 리스트에서 최대 시총 종목으로 식별.",
      notable_flow: "디펜시브 소비재 상대강도 유지"
    }
  ] as SectorLeader[],

  section_4_unusual_movers: [
    {
      ticker: "RIVN",
      move_percent: 26.64,
      catalyst: "4Q 실적 상회 및 2026 인도 가이던스 기대",
      category: "earnings"
    },
    {
      ticker: "CROX",
      move_percent: 19.1,
      catalyst: "4Q EPS가 컨센서스를 상회",
      category: "earnings"
    },
    {
      ticker: "TRIP",
      move_percent: -15.1,
      catalyst: "4Q EPS가 컨센서스를 하회",
      category: "earnings"
    },
    {
      ticker: "AMAT",
      move_percent: 8.03,
      catalyst: "실적 모멘텀 및 AI 수요 기대",
      category: "earnings"
    }
  ] as UnusualMover[],

  section_4_korea_unusual_movers: [
    {
      ticker: "005930",
      move_percent: 7.3,
      catalyst: "AI 메모리 수요 기대 및 업황 개선 기대",
      category: "macro"
    },
    {
      ticker: "000660",
      move_percent: 8.1,
      catalyst: "HBM 수요 모멘텀과 외국인 수급 유입",
      category: "macro"
    },
    {
      ticker: "035420",
      move_percent: -7.4,
      catalyst: "플랫폼 광고 성장 둔화 우려",
      category: "rating"
    }
  ] as UnusualMover[],

  section_5_52w_high_watch: [
    {
      ticker: "WMT",
      sector: "Consumer Staples",
      breakout_reason: "52주 신고가 스크리너에서 최대 시총 신고가 종목으로 확인",
      theme_tag: "Defensive"
    },
    {
      ticker: "TM",
      sector: "Consumer Discretionary",
      breakout_reason: "2/13 기준 신고가 스크리너 상위권으로 식별",
      theme_tag: "Global Cyclical"
    },
    {
      ticker: "MRK",
      sector: "Healthcare",
      breakout_reason: "2/13 기준 신고가 스크리너 상위권으로 식별",
      theme_tag: "Defensive"
    }
  ] as HighWatch[]
  ,
  section_5_korea_52w_high_watch: [
    {
      ticker: "005930",
      sector: "Information Technology",
      breakout_reason: "반도체 업황 개선 기대와 수급 유입",
      theme_tag: "AI"
    },
    {
      ticker: "000660",
      sector: "Information Technology",
      breakout_reason: "HBM 관련 실적 개선 기대가 주가에 반영",
      theme_tag: "AI"
    },
    {
      ticker: "012450",
      sector: "Financials",
      breakout_reason: "금리 안정과 함께 배당 매력 부각",
      theme_tag: "Rate Sensitive"
    }
  ] as HighWatch[]
};

export const marketBriefMarkdown = `## US Market Close Briefing

- **Date (ET):** 2026-02-13 close
- **Tape:** S&P500 +0.05%, Dow +0.10%, Nasdaq -0.22%로 혼조 마감.
- **Rates:** US10Y는 H.15 기준 4.09%로 확인되며 물가 둔화 데이터 이후 금리 하락 압력이 관찰됨.
- **Volatility:** VIX는 20.60(-1.06%)로 전일 급등분 일부 반납.
- **Drivers:** 인플레이션 둔화가 리스크 오프를 완화했지만, AI 관련 업종 재평가로 성장주 변동성은 유지.
- **Notable Movers:** RIVN(+26.64%), CROX(+19.1%), TRIP(-15.1%), AMAT(+8.03%).
- **52W Watch:** WMT/TM/MRK가 신고가 스크리너에서 상위권에 포착.

> 본 문서는 사실 요약용이며 투자 권유가 아니다.
`;

export const nextComponentExample = `import { dailyReport, marketBriefMarkdown } from "@/lib/reports/daily-us-market-close";

export function DailyReportWidget() {
  return (
    <section>
      <pre>{JSON.stringify(dailyReport, null, 2)}</pre>
      <article>{marketBriefMarkdown}</article>
    </section>
  );
}
`;
