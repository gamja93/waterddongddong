import { NextResponse } from "next/server";

import { deleteWatchlistItem, updateWatchlistItem } from "@/lib/watchlist";

type Params = {
  params: Promise<{ id: string }>;
};

export async function PUT(req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const itemId = Number(id);
    if (!Number.isInteger(itemId)) {
      return NextResponse.json({ error: "유효하지 않은 id" }, { status: 400 });
    }

    const body = (await req.json()) as { symbol?: string; name?: string };
    const item = await updateWatchlistItem(itemId, body);

    return NextResponse.json({ item });
  } catch (error) {
    const message = error instanceof Error ? error.message : "watchlist 수정 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const itemId = Number(id);
    if (!Number.isInteger(itemId)) {
      return NextResponse.json({ error: "유효하지 않은 id" }, { status: 400 });
    }

    await deleteWatchlistItem(itemId);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "watchlist 삭제 실패";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
