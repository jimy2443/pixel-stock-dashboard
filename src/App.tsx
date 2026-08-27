import { useState, useMemo, useCallback } from 'react';
import { WatchlistProvider } from './context/WatchlistContext';
import { SettingsProvider } from './context/SettingsContext';
import { useWatchlist } from './context/WatchlistContext';
import { useSettings } from './context/SettingsContext';
import { usePolling } from './hooks/usePolling';
import { IndexBar } from './components/IndexBar';
import { Watchlist } from './components/Watchlist';
import { SearchPanel } from './components/SearchPanel';
import { SettingsPanel } from './components/SettingsPanel';
import { LoadingDots } from './components/LoadingDots';
import { fetchStockQuotes, fetchIndexQuotes } from './api/sina';
import { fetchUsStockQuotes } from './api/yahoo';
import { INDICES } from './utils/constants';
import { formatRelativeTime } from './utils/formatters';
import type { StockQuote } from './types';

function Dashboard() {
  const { items } = useWatchlist();
  const { settings } = useSettings();
  const [searchOpen, setSearchOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const codesToFetch = useMemo(() => {
    const codes: string[] = [];
    for (const item of items) {
      if (item.market === 'a-sh' || item.market === 'a-sz') {
        codes.push(item.code);
      }
    }
    return codes;
  }, [items]);

  const usSymbols = useMemo(() => {
    return items.filter((i) => i.market === 'us').map((i) => i.code);
  }, [items]);

  const { data: indices, isLoading: indicesLoading } = usePolling({
    fetcher: useCallback(() => fetchIndexQuotes(INDICES.map((i) => i.symbol)), []),
    interval: settings.pollInterval,
    enabled: true,
  });

  const { data: aStockQuotes, isLoading: aStocksLoading, isError: aStocksError, lastUpdated: aLastUpdated } = usePolling({
    fetcher: useCallback(() => fetchStockQuotes(codesToFetch), [codesToFetch]),
    interval: settings.pollInterval,
    enabled: codesToFetch.length > 0,
  });

  const { data: usStockQuotes, isLoading: usStocksLoading, isError: usStocksError, lastUpdated: usLastUpdated } = usePolling({
    fetcher: useCallback(() => fetchUsStockQuotes(usSymbols), [usSymbols]),
    interval: settings.pollInterval,
    enabled: settings.showUsStocks && usSymbols.length > 0,
  });

  const allQuotes: StockQuote[] = useMemo(() => {
    const combined: StockQuote[] = [];
    if (aStockQuotes) combined.push(...aStockQuotes);
    if (usStockQuotes) combined.push(...usStockQuotes);
    return combined;
  }, [aStockQuotes, usStockQuotes]);

  const isLoading = aStocksLoading || usStocksLoading || indicesLoading;
  const isError = aStocksError || usStocksError;
  const lastUpdated = aLastUpdated || usLastUpdated;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <header className="border-b-2 border-neutral-700 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-3 py-2 md:py-3 flex items-center justify-between">
          <h1 className="text-xs md:text-sm text-pixel-green" style={{ fontFamily: "'Press Start 2P', monospace" }}>
            PIXEL STOCK
          </h1>
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="px-3 py-1.5 border-2 border-neutral-600 text-xs hover:border-pixel-green hover:text-pixel-green transition-colors">
              🔍 搜索
            </button>
            <button onClick={() => setSettingsOpen(true)} className="px-3 py-1.5 border-2 border-neutral-600 text-xs hover:border-pixel-cyan hover:text-pixel-cyan transition-colors">
              ⚙️ 设置
            </button>
          </div>
        </div>
      </header>

      <IndexBar indices={indices || []} isLoading={indicesLoading} />

      <main className="flex-1">
        <Watchlist quotes={allQuotes} isLoading={isLoading} isError={isError} />
      </main>

      <footer className="border-t-2 border-neutral-700 bg-neutral-900">
        <div className="max-w-7xl mx-auto px-3 py-2 flex items-center justify-between text-[10px] md:text-xs text-neutral-500">
          <div className="flex items-center gap-2">
            {isLoading && <LoadingDots className="text-neutral-500" />}
            <span>{lastUpdated ? `更新于 ${formatRelativeTime(lastUpdated)}` : '等待数据...'}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>自选股: {items.length}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">轮询: {settings.pollInterval}s</span>
          </div>
        </div>
      </footer>

      <SearchPanel isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}

function App() {
  return (
    <SettingsProvider>
      <WatchlistProvider>
        <Dashboard />
      </WatchlistProvider>
    </SettingsProvider>
  );
}

export default App;
