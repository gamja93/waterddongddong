import { prisma } from "@/lib/prisma";

export type WatchlistInput = {
  symbol: string;
  name?: string;
};

export async function getWatchlist() {
  return prisma.watchlistItem.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createWatchlistItem(input: WatchlistInput) {
  const symbol = input.symbol.trim().toUpperCase();

  return prisma.watchlistItem.create({
    data: {
      symbol,
      name: input.name?.trim() || null
    }
  });
}

export async function updateWatchlistItem(
  id: number,
  input: Partial<WatchlistInput>
) {
  return prisma.watchlistItem.update({
    where: { id },
    data: {
      symbol: input.symbol?.trim().toUpperCase(),
      name: input.name?.trim() || null
    }
  });
}

export async function deleteWatchlistItem(id: number) {
  return prisma.watchlistItem.delete({ where: { id } });
}
