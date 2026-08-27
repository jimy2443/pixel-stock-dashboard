export interface StockQuote {
  code: string;
  name: string;
  market: MarketType;
  price: number;
  change: number;
  changePercent: number;
  updateTime: string;
}

export interface IndexQuote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

export type MarketType = 'a-sh' | 'a-sz' | 'hk' | 'us';

export interface WatchlistItem {
  code: string;
  name: string;
  market: MarketType;
  addedAt: string;
  sortOrder: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  pollInterval: number;
  showSearchHistory: boolean;
  showHkStocks: boolean;
  showUsStocks: boolean;
  compactMode: boolean;
  locale: 'zh-CN' | 'zh-TW' | 'en';
}

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'system',
  pollInterval: 60,
  showSearchHistory: true,
  showHkStocks: true,
  showUsStocks: true,
  compactMode: false,
  locale: 'zh-CN',
};

export interface SearchHistoryItem {
  query: string;
  type: 'code' | 'name';
  timestamp: string;
}

export interface SearchResult {
  code: string;
  name: string;
  market: MarketType;
  matchType: 'exact' | 'prefix' | 'fuzzy';
}

export interface UsePollingResult<T> {
  data: T | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export interface UsePollingOptions<T> {
  fetcher: () => Promise<T>;
  interval: number;
  enabled?: boolean;
  onError?: (error: Error, consecutiveFailures: number) => void;
}
