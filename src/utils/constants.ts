export const API_BASE = {
  SINA: 'https://hq.sinajs.cn',
  YAHOO: 'https://query1.finance.yahoo.com/v8/finance/chart',
} as const;

export const POLLING = {
  MIN_INTERVAL: 30,
  DEFAULT_INTERVAL: 60,
  MAX_INTERVAL: 300,
  STEP: 30,
  TIMEOUT_MS: 3000,
  MAX_BACKOFF_MULTIPLIER: 4,
} as const;

export const STORAGE = {
  PREFIX: 'psd_',
  MAX_WATCHLIST: 50,
  MAX_SEARCH_HISTORY: 20,
  SCHEMA_VERSION: '1.0.0',
} as const;

export const INDICES = [
  { symbol: 'sh000001', name: '上证指数', displayName: '上证' },
  { symbol: 'sz399001', name: '深证成指', displayName: '深证' },
  { symbol: 'sz399006', name: '创业板指', displayName: '创业板' },
] as const;

export const MARKETS: Record<MarketType, { label: string; prefix: string }> = {
  'a-sh': { label: '沪A', prefix: 'sh' },
  'a-sz': { label: '深A', prefix: 'sz' },
  'hk': { label: '港股', prefix: 'hk' },
  'us': { label: '美股', prefix: '' },
};
