export type CacheRecord<T> = {
  value: T;
  expiresAt: number;
};

export interface CacheStore {
  get<T>(key: string): Promise<CacheRecord<T> | null>;
  set<T>(key: string, record: CacheRecord<T>): Promise<void>;
}
