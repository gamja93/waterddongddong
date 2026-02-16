import { NextResponse } from "next/server";

import { createWatchlistItem, getWatchlist } from "@/lib/watchlist";

export async function GET() {
  try {
    const items = await getWatchlist();
    return NextResponse.json({ items });
  } catch (error) {
    const message = error instanceof Error ? error.message : "watchlist 조회 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { symbol?: string; name?: string };

    if (!body.symbol?.trim()) {
      return NextResponse.json({ error: "symbol은 필수입니다." }, { status: 400 });
    }

    const item = await createWatchlistItem({
      symbol: body.symbol,
      name: body.name
    });

    return NextResponse.json({ item }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "watchlist 생성 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
