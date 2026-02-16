import { CacheRecord, CacheStore } from "@/lib/market-data/cache/cache-store";

export class InMemoryCacheStore implements CacheStore {
  private readonly store = new Map<string, CacheRecord<unknown>>();

  async get<T>(key: string): Promise<CacheRecord<T> | null> {
    const found = this.store.get(key);
    if (!found) {
      return null;
    }

    if (found.expiresAt <= Date.now()) {
      this.store.delete(key);
      return null;
    }

    return found as CacheRecord<T>;
  }

  async set<T>(key: string, record: CacheRecord<T>) {
    this.store.set(key, record as CacheRecord<unknown>);
  }
}
