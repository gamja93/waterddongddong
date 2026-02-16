export type MarketErrorType =
  | "network"
  | "quota_exceeded"
  | "symbol_not_found"
  | "provider_config"
  | "unknown";

export class MarketDataError extends Error {
  readonly type: MarketErrorType;
  readonly retryable: boolean;
  readonly cause?: unknown;

  constructor(type: MarketErrorType, message: string, retryable = false, cause?: unknown) {
    super(message);
    this.name = "MarketDataError";
    this.type = type;
    this.retryable = retryable;
    this.cause = cause;
  }
}

export class NetworkError extends MarketDataError {
  constructor(message = "네트워크 오류가 발생했습니다.", cause?: unknown) {
    super("network", message, true, cause);
  }
}

export class QuotaExceededError extends MarketDataError {
  constructor(message = "요청 한도를 초과했습니다.") {
    super("quota_exceeded", message, true);
  }
}

export class SymbolNotFoundError extends MarketDataError {
  constructor(symbol: string, message?: string) {
    super("symbol_not_found", message ?? `심볼(${symbol})을 찾을 수 없습니다.`, false);
  }
}

export class ProviderConfigError extends MarketDataError {
  constructor(message = "데이터 provider 설정이 올바르지 않습니다.") {
    super("provider_config", message, false);
  }
}

export function toMarketDataError(error: unknown): MarketDataError {
  if (error instanceof MarketDataError) {
    return error;
  }

  if (error instanceof Error) {
    return new MarketDataError("unknown", error.message, false, error);
  }

  return new MarketDataError("unknown", "알 수 없는 오류", false, error);
}

export function marketErrorToHttpStatus(error: MarketDataError) {
  switch (error.type) {
    case "network":
      return 503;
    case "quota_exceeded":
      return 429;
    case "symbol_not_found":
      return 404;
    case "provider_config":
      return 500;
    case "unknown":
    default:
      return 500;
  }
}

export function serializeMarketError(error: unknown) {
  const parsed = toMarketDataError(error);
  return {
    type: parsed.type,
    message: parsed.message,
    retryable: parsed.retryable
  };
}
