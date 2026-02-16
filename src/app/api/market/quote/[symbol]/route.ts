import { NextResponse } from "next/server";

import {
  marketErrorToHttpStatus,
  serializeMarketError,
  toMarketDataError
} from "@/lib/market-data/errors";
import { getQuote } from "@/lib/market-data";

type Params = {
  params: Promise<{ symbol: string }>;
};

export async function GET(_req: Request, { params }: Params) {
  try {
    const { symbol } = await params;
    const quote = await getQuote(symbol);

    return NextResponse.json({ quote });
  } catch (error) {
    const marketError = toMarketDataError(error);
    return NextResponse.json(
      { error: serializeMarketError(marketError) },
      { status: marketErrorToHttpStatus(marketError) }
    );
  }
}
