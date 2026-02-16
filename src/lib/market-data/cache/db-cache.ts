import { Prisma, PrismaClient } from "@prisma/client";

import { CacheRecord, CacheStore } from "@/lib/market-data/cache/cache-store";

export class PrismaMarketDataCacheStore implements CacheStore {
  private prisma: PrismaClient;
  private providerName: string;

  constructor(prisma: PrismaClient, providerName: string) {
    this.prisma = prisma;
    this.providerName = providerName;
  }

  async get<T>(key: string): Promise<CacheRecord<T> | null> {
    try {
      const found = await this.prisma.marketDataCache.findUnique({
        where: {
          provider_cacheKey: {
            provider: this.providerName,
            cacheKey: key
          }
        }
      });

      if (!found) {
        return null;
      }

      const expiresAt = found.expiresAt.getTime();
      if (expiresAt <= Date.now()) {
        await this.prisma.marketDataCache
          .delete({ where: { id: found.id } })
          .catch(() => undefined);
        return null;
      }

      return {
        value: found.payload as T,
        expiresAt
      };
    } catch {
      // cache table 미구성 또는 DB 장애 시 캐시는 무시하고 원본 provider 호출로 폴백.
      return null;
    }
  }

  async set<T>(key: string, record: CacheRecord<T>) {
    try {
      await this.prisma.marketDataCache.upsert({
        where: {
          provider_cacheKey: {
            provider: this.providerName,
            cacheKey: key
          }
        },
        create: {
          provider: this.providerName,
          cacheKey: key,
          payload: record.value as Prisma.InputJsonValue,
          expiresAt: new Date(record.expiresAt)
        },
        update: {
          payload: record.value as Prisma.InputJsonValue,
          expiresAt: new Date(record.expiresAt)
        }
      });
    } catch {
      // DB 캐시 write 실패는 무시.
    }
  }
}
