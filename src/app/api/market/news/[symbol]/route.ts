import { NextResponse } from "next/server";

import {
  marketErrorToHttpStatus,
  serializeMarketError,
  toMarketDataError
} from "@/lib/market-data/errors";
import { getTickerNews } from "@/lib/news/service";

type Params = {
  params: Promise<{ symbol: string }>;
};

export async function GET(req: Request, { params }: Params) {
  try {
    const { symbol } = await params;
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") ?? "10");

    const items = await getTickerNews(symbol, Number.isFinite(limit) ? limit : 10);
    return NextResponse.json({ items });
  } catch (error) {
    const marketError = toMarketDataError(error);
    return NextResponse.json(
      { error: serializeMarketError(marketError) },
      { status: marketErrorToHttpStatus(marketError) }
    );
  }
}
